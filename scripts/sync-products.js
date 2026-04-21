import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsDir = path.resolve(__dirname, '../src/content/products');

async function scrapeProductData(url) {
  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const html = await response.text();
    const $ = cheerio.load(html);

    let image = $('meta[property="og:image"]').attr('content') || $('meta[name="og:image"]').attr('content');
    if (!image) image = $('meta[property="og:image:secure_url"]').attr('content');
    if (image && image.startsWith('//')) image = 'https:' + image;
    if (image && image.includes('?')) image = image.split('?')[0];

    let price = null;
    let originalPrice = null;

    $('script[type="application/ld+json"]').each((i, el) => {
        try {
            const data = JSON.parse($(el).html());
            let productData = data;
            if (Array.isArray(data)) {
                productData = data.find(item => item['@type'] === 'Product' || (item['@graph'] && item['@graph'].find(g => g['@type'] === 'Product')));
            }
            if (productData && productData.offers) {
                const offers = Array.isArray(productData.offers) ? productData.offers[0] : productData.offers;
                if (offers && offers.price) price = parseFloat(offers.price);
            }
        } catch (e) {}
    });

    if (!price) {
        const metaPrice = $('meta[property="og:price:amount"]').attr('content');
        if (metaPrice) price = parseFloat(metaPrice);
    }

    return { image, price, originalPrice };
  } catch (error) {
    console.error(`Failed to fetch from ${url}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('Starting product synchronization...');
  const files = fs.readdirSync(productsDir).filter(file => file.endsWith('.md'));
  
  for (const file of files) {
    const filePath = path.join(productsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(content);
    const { affiliateUrl } = parsed.data;

    if (!affiliateUrl) continue;
    const cleanUrl = affiliateUrl.split('?')[0];
    const scrapedData = await scrapeProductData(cleanUrl);

    if (scrapedData) {
      let updated = false;
      if (scrapedData.image && parsed.data.image !== scrapedData.image) {
        parsed.data.image = scrapedData.image;
        updated = true;
      }
      if (scrapedData.price && parsed.data.price !== `€${scrapedData.price}`) {
        parsed.data.price = `€${scrapedData.price}`;
        updated = true;
      }
      if (updated) {
        const newFileContent = matter.stringify(parsed.content, parsed.data);
        fs.writeFileSync(filePath, newFileContent, 'utf-8');
        console.log(`Saved changes to ${file}.`);
      }
    }
  }
  console.log('Product synchronization complete!');
}

main();
