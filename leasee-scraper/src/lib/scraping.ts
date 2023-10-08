import { Page } from "puppeteer";
import { askGpt } from "./openai";
import { OfferI, validateCar } from "leasee-db-shared/offer";

export const instructions = `
Your task is to extract information on car leasing offers
from HTML into JSON. Return an array where each offer is an object.
A simple example:

## Input:
<h2> BMW car leasing offer </h2>

## Output:
[{"manufacturer": "BMW"}]

For setting the "price" field in the JSON, it is assumed
to be in the currency SEK (kr) and per month (/mån).
Therefor it should be a number, not a string. 
Sanity check the price per month, for example "3.995" probably
means "3995" kr. 
If there is a link to the offer, include it in a "link" field.
Extra information for each offer should be in a "extra" field.
Example:

## Input:
<a href="https://cars.com/x7fbnh27">
  MINI Cooper Cab från 3.995kr/mån inkl. service 
</a>

<a href="/information">
  Leasa begagnad bil - Releasing
</a>

<a href="https://cars.com/6jmjh27">
  Volvo leasing offer, not much more information.
</a>

## Output:  
[
  {
    "manufacturer": "Mini",
    "model": "Cab",
    "price": 3995,
    "link": "https://cars.com/x7fbnh27",
    "extra": [
      "inkl. service"
    ]
  },
  {
    "manufacturer": "Volvo",
    "link": "https://cars.com/6jmjh27"
  }
]

Notice how the second "a" tag was not actually a leasing offer, 
but just general information. Be sure to only include actual specific leasing offers 
in the JSON array. Now it is your turn:


`;

const CHAR_LIMIT = 30000 - instructions.length;
const PADDING = 1000;

export async function waitFor(ms: number = 1000){
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function parseOffers(page: Page, selectors: string = "body"){
  let html = await page.evaluate((selectors) => {
    const pathElements = Array.from(document.querySelectorAll('path'));
    pathElements.forEach(el => el.remove());
    return document.querySelector(selectors)?.innerHTML;
  }, selectors);
  if (!html) return [];
  let offersInp: any[] = [];

  for (let i = 0; i < html.length; i += CHAR_LIMIT - PADDING) {
    html = html.substring(i, i + CHAR_LIMIT)
    let res = await askGpt(
      instructions + 
      `\n## Input:\n${html}\n\n ## Output: \n`
    ); 
    offersInp = offersInp.concat(JSON.parse(res));
  }

  let offers: OfferI[] = [];
  for (let offerInp of offersInp) {
    let car = validateCar(offerInp);
    if (car !== null) {
      offers.push(car);
    }
  }
  return offers;
} 
