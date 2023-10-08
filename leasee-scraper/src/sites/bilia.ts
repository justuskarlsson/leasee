import puppeteer, {Browser, Page} from "puppeteer";



export default async function(page: Page){
  await page.goto("https://www.bilia.se/bilar/privatleasing/");
  // Click Volvo, BMW, etc..

  const cars = await page.$$eval('ul.list > li', nodes => {
    return nodes.map(node => {
      const imageElement = node.querySelector('img.image.is-loaded');
      const makerElement = node.querySelector('h4.title.h5');
      const modelElement = node.querySelector('h3.title.h2');
      const priceElement = node.querySelector('span.price.monthly.output > span.value');

      return {
        imageUrl: imageElement?.getAttribute("src") || null,
        maker: makerElement?.textContent?.trim() || null,
        model: modelElement?.textContent?.trim() || null,
        price: priceElement?.textContent?.trim() || null,
      };
    });
  });

  console.log(cars);
  return cars;
} 