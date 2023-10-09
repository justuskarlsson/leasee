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


export async function fetch<T>(collectionName: string, store: (Writable<T[]> | null) = null): Promise<T[]> {
  // const q = query(this.collection, where("user", "==", user!.uid))
  let coll = collection(db, collectionName);
  let snapshot = await getDocs(coll);
  let items = mapSnapshot<T>(snapshot);
  if (store) {
    store.set(items);
  }
  return items;
}

export async function fetchAndListen<T>(collectionName: string, store: Writable<T[]>): Promise<void> {
  return new Promise((resolve, reject) => {
    let coll = collection(db, collectionName);
    const unsubscribe = onSnapshot(coll, (snapshot) => {
      let items = mapSnapshot<T>(snapshot);
      store.set(items);
      resolve();
    });
  })
}

function mapSnapshot<T>(snapshot: QuerySnapshot<DocumentData>) {
  let items: T[] = snapshot.docs.map((doc) => {
    let obj = {
      ...doc.data(),
      id: doc.id,
    };
    return obj as T;
  });
  return items;
}