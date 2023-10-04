import { writable } from 'svelte/store';

import  { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager, setLogLevel } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth'
import { openDB, type IDBPDatabase } from 'idb';

const firebaseConfig = {
  apiKey: "AIzaSyD-Vt_M0wCSKJn6v2wCsqt3UMdEPS8mKiA",
  authDomain: "gpt-demos.firebaseapp.com",
  projectId: "gpt-demos",
  storageBucket: "gpt-demos.appspot.com",
  messagingSenderId: "536060681275",
  appId: "1:536060681275:web:b8a8ed5ee2c64cd815101e",
  measurementId: "G-R2E78VFH8Q"
};

// setLogLevel("debug");
// Initialize Firebase
export const app = initializeApp(firebaseConfig);


// export const db = getFirestore(app);
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    cacheSizeBytes: 200_000_000,
    tabManager: persistentMultipleTabManager()
  })
})
export const auth = getAuth(app);
export const storage = getStorage(app);

export const userStore = writable<User | null>(null);
export let user: User | null = null;
export const loadingAuthState = writable(true);

onAuthStateChanged(auth, (firebaseUser)=> {
  user = firebaseUser;
  userStore.set(firebaseUser);
  loadingAuthState.set(false); 
});

export let idb: IDBPDatabase;
export async function initIdb(){
  idb = await openDB('resources', 1, {
    upgrade(db) {
      db.createObjectStore('files');
    },
  });
};

