import { writable } from 'svelte/store';

import  { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager, setLogLevel } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth'
import { openDB, type IDBPDatabase } from 'idb';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8DhBsgALll-r2GR9TYYVQ6LaSK3W9du0",
  authDomain: "leasee-b5897.firebaseapp.com",
  projectId: "leasee-b5897",
  storageBucket: "leasee-b5897.appspot.com",
  messagingSenderId: "986654633296",
  appId: "1:986654633296:web:4e0789c59da58a6d919055",
  measurementId: "G-L4X5F4D505"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


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

