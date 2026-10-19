// Renders each artboard in mockups/mockup.html to a 2× PNG.  Usage: node mockups/render.mjs
import puppeteer from 'puppeteer-core';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--allow-file-access-from-files'] });
const page = await browser.newPage();
await page.setViewport({ width: 1800, height: 1200, deviceScaleFactor: 2 });
await page.goto(pathToFileURL(resolve('mockups/mockup.html')).href, { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);

for (const [id, name] of [
  ['m-hero', '01-hero-devices'],
  ['m-heat', '02-temperature-story'],
  ['m-cascade', '03-section-cascade'],
  ['m-social', '04-instagram-4x5'],
]) {
  await (await page.$(`#${id}`)).screenshot({ path: `mockups/${name}.png` });
  console.log('✓', name);
}
await browser.close();
