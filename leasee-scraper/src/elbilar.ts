import { Car } from "leasee-db-shared/schemas";
import fs from "fs/promises"

import { db } from "./lib/firebase-admin"

console.log(new Car());


async function readJson(path: string){
  let res = await fs.readFile(path);
  let text = res.toString();
  return JSON.parse(text);
}


async function main(){
  let cars = await readJson("alltomelbilar.json");
  for (let car of cars) {
    await db.collection("cars").add(car);
    console.log("Added:", car);
  }
}


main();


