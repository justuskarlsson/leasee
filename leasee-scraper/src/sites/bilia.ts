import puppeteer, {Browser, Page} from "puppeteer";
import parseOffers, { waitFor } from "../lib/scraping";
import { OfferI } from "leasee-db-shared/offer";



export default async function(page: Page){
  await page.goto("https://www.bilia.se/bilar/privatleasing/");
  // Click Volvo, BMW, etc..
  const labels = [
    "Volvo", "BMW", "Toyota",
    "Mercedes-Benz", "MINI", "Nissan"
  ];
  let offers: OfferI[] = [];
  for (let label of labels) {
    await page.click(`label[for=${label}]`)
    await waitFor(2000);
    let o = await parseOffers(page, "ul[data-v-26c00438]");
    offers = offers.concat(o);
  }
  offers = offers.map((offer) => ({
    ...offer,
    link: "https://www.bilia.se" + offer.link
  }))
  return offers;
} 