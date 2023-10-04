import { Collection, DataItem } from "../collection";
import { writable } from "svelte/store";

export class Car extends DataItem {
  model: string;
  manufacturer: string;
  range: number;
  price: number;
  chassis: string;


  static cur = writable<Car[]>([]);
  static all = writable<Car[]>([]);
  static collection = new Collection<Car>("cars",
    (data: any) => new Car(data));

  constructor(data: Partial<Car>) {
    super();
    Object.assign(this, data);
  }

};
