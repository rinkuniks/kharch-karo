/**
 * Kharch Karo — runtime smoke test against the real static export.
 *
 * Run:  npm run build && npm run smoke
 *
 * Serves ./out over a zero-dependency static server, then drives it with
 * Playwright to prove what unit checks cannot:
 *   1. The page hydrates without console errors
 *   2. The real Unsplash photos actually load and paint (naturalWidth > 0)
 *   3. Budget → spend → collection → Damage Report works end to end
 */
import { createServer } from "node:http";
import { existsSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "out");
const PORT = 4173;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

let passed = 0;
let failed = 0;

function check(name, ok, detail = "") {
  if (ok) {
    passed += 1;
    console.log(`  ok   ${name}`);
  } else {
    failed += 1;
    console.log(`  FAIL ${name}${detail ? `\n       ${detail}` : ""}`);
  }
}

/* ---------- zero-dependency static server for ./out ---------- */
const server = createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent((req.url ?? "/").split("?")[0]);
    let filePath = join(OUT, normalize(urlPath).replace(/^(\.\.[/\\])+/, ""));

    if (existsSync(filePath) && (await stat(filePath)).isDirectory()) {
      filePath = join(filePath, "index.html");
    }
    if (!existsSync(filePath) && existsSync(`${filePath}.html`)) {
      filePath = `${filePath}.html`;
    }
    if (!existsSync(filePath)) {
      res.writeHead(404, { "content-type": "text/plain" });
      res.end("not found");
      return;
    }

    const body = await readFile(filePath);
    res.writeHead(200, {
      "content-type": MIME[extname(filePath)] ?? "application/octet-stream",
      "cache-control": "no-store",
    });
    res.end(body);
  } catch (err) {
    res.writeHead(500, { "content-type": "text/plain" });
    res.end(String(err));
  }
});

async function main() {
  if (!existsSync(OUT)) {
    console.error("out/ is missing — run `npm run build` first.");
    process.exit(1);
  }

  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`\nKharch Karo — runtime smoke test (http://localhost:${PORT})\n`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push(err.message));

  await page.goto(`http://localhost:${PORT}`, { waitUntil: "networkidle" });

  /* ---------- 1. shell ---------- */
  check(
    "hero headline renders",
    await page.getByRole("heading", { name: /What would you do with/i }).isVisible()
  );
  check(
    "budget step renders",
    await page.getByRole("heading", { name: /Choose your wallet/i }).isVisible()
  );

  /* ---------- 2. real photos paint ---------- */
  await page.getByRole("button", { name: /Crorepati/ }).click();
  await page.locator("#spend").scrollIntoViewIfNeeded();
  await page.waitForTimeout(2500); // let lazy images settle

  const photoStats = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll("img")].filter((i) =>
      (i.currentSrc || i.src).includes("images.unsplash.com")
    );
    return {
      total: imgs.length,
      loaded: imgs.filter((i) => i.complete && i.naturalWidth > 0).length,
    };
  });
  check(
    `product photos render (${photoStats.loaded}/${photoStats.total} painted)`,
    photoStats.total >= 12 && photoStats.loaded === photoStats.total,
    `only ${photoStats.loaded} of ${photoStats.total} Unsplash images decoded`
  );

  /* ---------- 3. spend → collection ---------- */
  await page.locator("article button:has-text('+ Add')").nth(0).click();
  await page.waitForTimeout(500);
  const cartBefore = await page
    .locator("header button[aria-label^='Your collection']")
    .getAttribute("aria-label");
  check(
    "adding a product updates the collection count",
    /1 items?/.test(cartBefore ?? ""),
    `aria-label was "${cartBefore}"`
  );

  await page.locator("header button[aria-label^='Your collection']").click();
  await page.waitForTimeout(600);
  check(
    "collection drawer shows the total burned",
    await page.getByText("Total burned").isVisible()
  );

  /* ---------- 4. Damage Report ---------- */
  await page.locator("button:has-text('Finish session')").click();
  await page.waitForTimeout(1600);
  const report = page.locator('[role="dialog"][aria-label="Damage report"]');
  check(
    "Damage Report opens with a personality verdict",
    await report.getByText("Spender personality", { exact: true }).isVisible()
  );
  check(
    "stat sheet shows the starting amount",
    await report.getByText("You started with", { exact: true }).isVisible()
  );
  check(
    "share card is offered",
    await page.getByRole("button", { name: /Share my damage/i }).isVisible()
  );

  /* ---------- 5. restart ---------- */
  await page.locator("button:has-text('Restart with')").click();
  await page.waitForTimeout(1000);
  const cartAfter = await page
    .locator("header button[aria-label^='Your collection']")
    .getAttribute("aria-label");
  check("restart clears the collection", /0 items?/.test(cartAfter ?? ""), cartAfter ?? "");

  /* ---------- 6. hydration hygiene ---------- */
  check(
    "no console or page errors during the whole run",
    consoleErrors.length === 0,
    consoleErrors.slice(0, 4).join(" | ")
  );

  await browser.close();
  server.close();

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
}

void main();
