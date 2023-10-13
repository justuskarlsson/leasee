import puppeteer, {Browser, Page} from "puppeteer";

import bilia from "./sites/bilia"
import holmgrens from "./sites/homlgrensbil"
import { db } from "./lib/firebase-admin";

const testOffersCollection = "test_offers"

async function main(){
  let collection = db.collection(testOffersCollection);
  await db.recursiveDelete(collection);
  const browser = await puppeteer.launch({
    headless: false,
  })
  const page = await browser.newPage();
  let offers = await bilia(page);
  for (let offer of offers) {
    await collection.add(offer);
    console.log("Added:", offer);
  }
  browser.close();
}

main();
