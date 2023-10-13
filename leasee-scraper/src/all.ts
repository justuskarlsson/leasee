import puppeteer, {Browser, Page} from "puppeteer";

import sites from "./sites"
import { db } from "./lib/firebase-admin";

const collectionName = "offers"

async function main(){
  let collection = db.collection(collectionName);
  await db.recursiveDelete(collection);
  const browser = await puppeteer.launch({
    headless: false,
  })
  const page = await browser.newPage();
  for (let siteParser of sites) {
    let offers = await siteParser(page);
    for (let offer of offers) {
      await collection.add(offer);
      console.log("Added:", offer);
    }
  }
  browser.close();
}

main();
