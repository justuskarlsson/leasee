import puppeteer, {Browser, Page} from "puppeteer";
import { askGpt } from "../lib/openai";
import { OfferI, validateCar } from "leasee-db-shared/offer";
import parseOffers, { waitFor } from "../lib/scraping";



export default async function(page: Page){
  await page.goto("https://www.holmgrensbil.se/kampanjer/privatleasing?CampaignTag=Privatleasing&hits=12&offset=24&q=%2A");
  await waitFor(1000);
  return parseOffers(page, ".campaign-list");
} 