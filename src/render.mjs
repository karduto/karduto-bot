// render.mjs — HTML → JPG con Chromium (Playwright). Corre igual en tu PC y en GitHub Actions.
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

let browser;

export async function renderPage(html, { width, height, out }) {
  fs.writeFileSync("page.html", html);
  browser ??= await chromium.launch();
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(path.resolve("page.html")).href, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() =>
    Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; }))))
  );
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await page.screenshot({ path: out, type: "jpeg", quality: 92 });
  await page.close();
}

export async function closeBrowser() {
  if (browser) await browser.close();
}
