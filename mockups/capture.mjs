// Captures retina screenshots of the running site (npm run serve) for the presentation mockups.
// Usage: node mockups/capture.mjs [baseUrl]
import puppeteer from 'puppeteer-core';

const BASE = process.argv[2] || 'http://localhost:5173/';
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT = 'mockups/shots';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--hide-scrollbars'] });

async function session(viewport, shots) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await page.goto(BASE, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await wait(4200); // hero intro
  for (const s of shots) {
    if (s.y !== undefined) {
      await page.evaluate((expr) => {
        const y = new Function(`return (${expr})`)();
        window.scrollTo(0, y);
      }, s.y);
      await wait(s.wait ?? 2200);
    }
    if (s.hover) { await page.mouse.move(s.hover[0] - 30, s.hover[1]); await page.mouse.move(...s.hover, { steps: 8 }); await wait(900); }
    await page.screenshot({ path: `${OUT}/${s.name}.png` });
    if (s.hover) { await page.mouse.move(5, 5); await wait(400); }
    console.log('✓', s.name);
  }
  await page.close();
}

const top = (sel, extra = '0') => `document.querySelector('${sel}').getBoundingClientRect().top + window.scrollY + ${extra}`;

await session({ width: 1440, height: 900, deviceScaleFactor: 2 }, [
  { name: 'desktop-hero' },
  { name: 'desktop-heat-hot', y: top('#heat', '2') },
  { name: 'desktop-heat-cool', y: top('.pin-spacer:has(#heat)', 'innerHeight * 3 - 4'), wait: 2600 },
  { name: 'desktop-services', y: top('#services', '40'), hover: [560, 640] },
  { name: 'desktop-temple', y: top('[data-temple]', '-120'), wait: 2800 },
  { name: 'desktop-reviews', y: top('#reviews', '60') },
]);

await session({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true }, [
  { name: 'mobile-hero' },
  { name: 'mobile-art', y: top('[data-hero-art]', '-120') },
  { name: 'mobile-heat-hot', y: top('#heat', '2') },
  { name: 'mobile-heat-cool', y: top('.pin-spacer:has(#heat)', 'innerHeight * 2.2 - 4'), wait: 2600 },
  { name: 'mobile-services', y: top('[data-svc-list]', '-40') },
]);

await browser.close();
