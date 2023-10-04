import type { Writable } from 'svelte/store';
import { db, user } from './firebase';
import {
  getDocs, collection, CollectionReference,
  serverTimestamp, query, where,
  QuerySnapshot, doc, updateDoc, DocumentReference,
  writeBatch, deleteDoc, Timestamp,
  FieldPath, setDoc, onSnapshot
}
  from 'firebase/firestore';
import type {
  DocumentData, UpdateData, WhereFilterOp,

} from 'firebase/firestore';

export class DataItem {
  id: string = "";
  timestamp: Date = new Date();
  user: string;
};

export class ClassField {

};

const COLLECTION_PREFIX = "leasee_";
const CHUNK_SIZE = 128;

export class Collection<T extends DataItem> {
  path: string;
  collection: CollectionReference<DocumentData>;
  factory: (data: any) => T;
  fromFirebase: Function | null;

  constructor(
    path: string,
    factory: (data: any) => T,
    fromFirebase: Function | null = null
  ) {
    this.path = COLLECTION_PREFIX + path;
    this.collection = collection(db, this.path);
    this.factory = factory;
    this.fromFirebase = fromFirebase;
  }

  async fetch(store: (Writable<T[]> | null) = null): Promise<T[]> {
    const q = query(this.collection, where("user", "==", user!.uid))
    let snapshot = await getDocs(q);
    let items = this.mapSnapshot(snapshot);
    if (store) {
      store.set(items);
    }
    return items;
  }

  async fetchAndListen(store: Writable<T[]>): Promise<void> {
    const q = query(
      this.collection,
      where("user", "==", user!.uid),
    );
    return new Promise((resolve, reject) => {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let items = this.mapSnapshot(snapshot);
        store.set(items);
        resolve();
      });
    })
  }

  private mapSnapshot(snapshot: QuerySnapshot<DocumentData>) {
    let items: T[] = snapshot.docs.map((doc) => {
      let timestamp = doc.data().timestamp;
      let obj = {
        ...doc.data(),
        id: doc.id,
        timestamp: (timestamp instanceof Timestamp ?
          timestamp.toDate() : new Date())
      };
      // if (!("user" in obj)) {
      //   this.update(doc.id, {user: user!.uid} as Partial<T>);
      // }
      if (this.fromFirebase) {
        obj = this.fromFirebase(obj);
      }
      return this.factory(obj);
    });
    items.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    return items;
  }


  private serializeClassField(data: any) {
    for (let [key, val] of Object.entries(data)) {
      if (val instanceof ClassField) {
        data[key] = { ...val };
      }
    }
  }


  getRef(data: T) {
    let docRef = doc(this.collection);
    data.id = docRef.id;
    return docRef;
  }

  private setHelper(
    input: T | Partial<T>
  ){
    let data = this.factory({ ...input });
    // To able to have class fields
    this.serializeClassField(data);
    data.user = user!.uid;
    return data as T;
  }

  private addHelper(input: T | Partial<T>) {
    let data = this.setHelper(input);
    let ref = this.getRef(data);
    return {ref, data};
  }

  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    let result: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  }

  async add(input: T | Partial<T>): Promise<T> {
    let { ref, data } = this.addHelper(input);
    await setDoc(ref, {
      ...data,
      timestamp: serverTimestamp(),
    })
    return data;
  }


  async set(data: T, ref: DocumentReference<DocumentData, DocumentData>) {
    data = this.setHelper(data);
    await setDoc(ref, {
      ...data,
      timestamp: serverTimestamp(),
    });
  }

  async addMany(inputs: (T | Partial<T>)[]) {
    const chunks = this.chunkArray(inputs, CHUNK_SIZE);
    const items: T[] = [];
    const promises: Promise<void>[] = [];
    for (let chunk of chunks) {
      const batch = writeBatch(db);
      for (let inp of chunk) {
        let { ref, data } = this.addHelper(inp);
        items.push(data);
        batch.set(ref, {
          ...data,
          timestamp: serverTimestamp(),
        });
      }
      promises.push(batch.commit());
    }
    await Promise.all(promises);
    return items;
  }


  async update(id: string, data: Partial<T>) {
    this.serializeClassField(data);
    let ref = doc(this.collection, id) as DocumentReference<T>;
    await updateDoc(ref, data as UpdateData<T>);
  }

  async delete(id: string) {
    let ref = doc(this.collection, id) as DocumentReference<T>;
    await deleteDoc(ref);
  }

  async deleteByUser() {
    let constraints = [
      where("user", "==", user!.uid),
    ]
    const q = query(this.collection, ...constraints);
    const snapshot = await getDocs(q);
    const chunks = this.chunkArray(snapshot.docs, CHUNK_SIZE);
    const promises: Promise<void>[] = [];
    for (let chunk of chunks) {
      const batch = writeBatch(db);
      chunk.forEach((doc) => {
        batch.delete(doc.ref);
      });
      promises.push(batch.commit());
    }
    await Promise.all(promises);
  }

  async deleteManyWhere<K extends keyof T>(fieldPath: K, opStr: WhereFilterOp, value: T[K]) {
    let constraints = [
      where("user", "==", user!.uid),
      where(fieldPath as string | FieldPath, opStr, value),
    ]
    const q = query(this.collection, ...constraints);
    const snapshot = await getDocs(q);
    const chunks = this.chunkArray(snapshot.docs, CHUNK_SIZE);
    const promises: Promise<void>[] = [];
    for (let chunk of chunks) {
      const batch = writeBatch(db);
      chunk.forEach((doc) => {
        batch.delete(doc.ref);
      });
      promises.push(batch.commit());
    }
    await Promise.all(promises);
  }
};