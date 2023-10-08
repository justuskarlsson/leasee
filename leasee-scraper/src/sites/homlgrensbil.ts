import puppeteer, {Browser, Page} from "puppeteer";
import { askGpt } from "../lib/openai";
import { OfferI, validateCar } from "leasee-db-shared/offer";


const instructions = `
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

const charLimit = 30000 - instructions.length;

export default async function(page: Page){
  await page.goto("https://www.holmgrensbil.se/kampanjer/privatleasing?CampaignTag=Privatleasing&hits=12&offset=24&q=%2A");
  // Click Volvo, BMW, etc..
  await new Promise((resolve) => setTimeout(resolve, 1000));
  let html = await page.evaluate(() => {
    const pathElements = Array.from(document.querySelectorAll('path'));
    pathElements.forEach(el => el.remove());
    return document.querySelector(".campaign-list")?.innerHTML;
  });
  html = html?.substring(0, charLimit)
  let res = await askGpt(instructions + `
## Input: 
  ${html} 
## Output:
`)
  let offersInp: any[] = JSON.parse(res);

  let offers: OfferI[] = [];
  for (let offerInp of offersInp) {
    let car = validateCar(offerInp);
    if (car !== null) {
      offers.push(car);
    }

  }
  return offers;
} 