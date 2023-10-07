
import { get, writable, type Writable } from 'svelte/store';
import type { DataItem } from "./collection"
import { initIdb,  userStore } from './firebase';

import { page } from '$app/stores';
import { Car } from './models/car';

export const loaded = writable(false);

export const allCars = Car.all;


export async function loadAll() {
  const promises: Promise<any>[] = [
    Car.collection.fetchAndListen(allCars),
    initIdb()
  ];
  await Promise.all(promises);
  loaded.set(true);
}

// userStore.subscribe((user) => {
//   if (user) {
//   }
// })

loadAll();


interface PageNav {
}



export function getUrlSearchQuery(){
  let searchParams = get(page).url.searchParams;
  return searchParams.get("q");
}

function subscribeCurToAll<T extends DataItem>(
  all: Writable<T[]>,
  cur: Writable<T | null>) 
{
  all.subscribe((els) => {
    let curEl = get(cur);
    if (!curEl) return;
    findAndSet(els, curEl.id, cur);
  })
}


function findAndSet<T extends DataItem>(
  list: T[],
  id: string | undefined,
  store: Writable<T | null>) 
{
  let el = list.find((val) => val.id === id);
  if (el) {
    store.set(el);
  } else {
    store.set(null);
  }
}

export async function updateFromURL(params: PageNav) {
  // if (params.groupId && get(curMessageGroup)?.id !== params.groupId) {
  //   findAndSet(get(allMessageGroups), params.groupId, curMessageGroup);
  // } else if (!params.groupId){
  //   curMessageGroup.set(null);
  // }
}
