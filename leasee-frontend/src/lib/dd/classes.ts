import { writable } from "svelte/store";

export class PayloadStack<T> {
  payloads: Record<number, T> = {};
  uidCount = 0;
  updateCount = 0;
  store = writable<number>(0);

  update(){
    this.store.set(++this.updateCount);
  }

  addItem(payload: T) {
    let uid = this.uidCount++;
    this.payloads[uid] = payload
    this.update();
    return () => {
      this.remove(uid);
    };
  }

  remove(uid: string | number) {
    delete this.payloads[uid];
    this.update();
  }

  addItemTimed(payload: T, durationMs: number = 2000) {
    const remove = this.addItem(payload)
    setTimeout(remove, durationMs)
  }



  getSortedKv(store: any){
    let kv = Object.entries(this.payloads);
    kv.sort();
    return kv;

  }

  getSorted(store: any) {
    let kv = this.getSortedKv(store);
    let values = kv.map(x => x[1]);
    return values
  }

  show(store: any) {
    return Object.entries(this.payloads).length > 0;
  }
};



export class ProgressStack {
  items: Record<number, {
    message: string,
    progress: number,
  }> = {};
  uidCount = 0;
  updateCount = 0;
  store = writable<number>(0);

  update(){
    this.store.set(++this.updateCount);
  }
  addItem(message: string) {
    let uid = this.uidCount++;
    this.items[uid] = {
      message,
      progress: 0.0
    }
    this.update();
    return (progress: number) => {
      if (!(uid in this.items)) {
        return false;
      }
      this.items[uid].progress = progress;
      if (this.items[uid].progress >= 1.0) {
        delete this.items[uid];
        this.update();
        return false;
      }
      return true;
    }
  }

  getSorted(store: any){
    let kv = Object.entries(this.items);
    kv.sort();
    let values = kv.map(x => x[1]);
    return values
  }
  show(store: any) {
    return Object.entries(this.items).length > 0;
  }

};


