import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('reports', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];
try {
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 2 });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
    for (const route of process.argv.includes('--interactions-only') ? [] : ['/', '/collections/', '/collections/sets/', '/collections/dresses/', '/collections/tops/', '/collections/skirts/', '/collections/evening/', '/products/golden-sunset-set/', '/products/emerald-ruched-dress/', '/products/ivory-strap-top/', '/products/kente-pleat-skirt/', '/products/noir-evening-gown/', '/about/', '/lookbook/', '/contact/', '/cart/', '/checkout/', '/faq/', '/size-guide/', '/shipping-returns/', '/privacy-policy/', '/thank-you/']) {
      errors.length = 0;
      await page.goto(`http://127.0.0.1:3001${route}`);
      await page.waitForTimeout(1000);
      const state = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        broken: [...document.images].filter(i => i.complete && !i.naturalWidth).map(i => i.src),
        title: document.querySelector('h1')?.textContent,
      }));
      results.push({ viewport: viewport.width, route, ...state, errors: [...errors] });
      if (['/', '/collections/sets/', '/products/golden-sunset-set/'].includes(route)) {
        await page.screenshot({ path: `reports/${route.replaceAll('/', '_') || 'home'}-${viewport.width}.png` });
      }
    }
    await page.goto('http://127.0.0.1:3001/collections/sets/');
    await page.getByRole('combobox', { name: 'Sort products' }).selectOption('price-low');
    if (viewport.width < 640) await page.getByRole('button', { name: /^Filters/ }).click();
    await page.getByRole('button', { name: /^All\s*\d/ }).filter({ visible: true }).click();
    if (viewport.width < 640) await page.getByRole('button', { name: /^Show \d/ }).click();
    if (await page.locator('.col-card').count() < 2) throw new Error('Category filtering failed');
    await page.getByRole('button', { name: 'Search the site' }).click();
    await page.getByRole('combobox', { name: 'Search', exact: true }).fill('golden');
    await page.locator('.nav-search-row').first().click();
    await page.waitForURL('**/products/golden-sunset-set/');
    await page.getByRole('button', { name: 'S', exact: true }).click();
    await page.getByRole('button', { name: /^Add to bag/ }).click();
    await page.getByRole('button', { name: /Open cart, 1 item/ }).click();
    if (!await page.locator('.cart-drawer').isVisible()) throw new Error('Cart drawer did not open');
    await page.close();
  }
} finally {
  if (results.length) await writeFile('reports/site-check.json', JSON.stringify(results, null, 2));
  await browser.close();
}
console.log(JSON.stringify(results, null, 2));
if (results.some(r => r.overflow || r.broken.length || r.errors.length)) process.exitCode = 1;
