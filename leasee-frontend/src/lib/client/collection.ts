import type { Writable } from 'svelte/store';
import { db } from './firebase';
import {
  getDocs, collection, CollectionReference,
  QuerySnapshot, onSnapshot
}
  from 'firebase/firestore';
import type {
  DocumentData

} from 'firebase/firestore';

export class DataItem {
  id: string = "";
};

export class ClassField {

};

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
    this.path = path;
    this.collection = collection(db, this.path);
    this.factory = factory;
    this.fromFirebase = fromFirebase;
  }

  async fetch(store: (Writable<T[]> | null) = null): Promise<T[]> {
    // const q = query(this.collection, where("user", "==", user!.uid))
    let snapshot = await getDocs(this.collection);
    let items = this.mapSnapshot(snapshot);
    if (store) {
      store.set(items);
    }
    return items;
  }

  async fetchAndListen(store: Writable<T[]>): Promise<void> {
    return new Promise((resolve, reject) => {
      const unsubscribe = onSnapshot(this.collection, (snapshot) => {
        let items = this.mapSnapshot(snapshot);
        store.set(items);
        resolve();
      });
    })
  }

  private mapSnapshot(snapshot: QuerySnapshot<DocumentData>) {
    let items: T[] = snapshot.docs.map((doc) => {
      let obj = {
        ...doc.data(),
        id: doc.id,
      };
      if (this.fromFirebase) {
        obj = this.fromFirebase(obj);
      }
      return this.factory(obj);
    });
    return items;
  }
};