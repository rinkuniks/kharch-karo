/**
 * Records a real demo video of Kharch Karo running on the local web
 * (http://localhost:3000) by driving a headless browser end-to-end.
 *
 * Usage: node scripts/record-demo.mjs desktop|mobile
 * Output: demo/kharch-karo-demo-<mode>.webm
 */
import { mkdirSync } from "node:fs";
import { renameSync } from "node:fs";
import { chromium } from "playwright";

const mode = process.argv[2] ?? "desktop";
mkdirSync("demo", { recursive: true });

const browser = await chromium.launch({ headless: true });

const context =
  mode === "mobile"
    ? await browser.newContext({
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
        recordVideo: { dir: "demo", size: { width: 390, height: 844 } },
      })
    : await browser.newContext({
        viewport: { width: 1280, height: 800 },
        recordVideo: { dir: "demo", size: { width: 1280, height: 800 } },
      });

const page = await context.newPage();
const video = page.video();

const wait = (ms) => page.waitForTimeout(ms);
const scroll = (y) =>
  page.evaluate((top) => window.scrollTo({ top, behavior: "smooth" }), y);

console.log("Navigating to http://localhost:3000 ...");
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await wait(2800); // hero entrance sequence (design.md §9)

// --- Budget selection ---
await page.getByRole("button", { name: /Crorepati/ }).click();
console.log("Budget: ₹1Cr selected");
await wait(900);

// --- Scroll to the collection via the hero CTA ---
await page.getByRole("button", { name: /Start Spending/ }).click();
await wait(1800);

// --- Add a couple of products (toasts appear) ---
await page.locator("article button:has-text('+ Add')").nth(0).click();
await wait(900);
await page.locator("article button:has-text('+ Add')").nth(1).click();
console.log("Added 2 products");
await wait(700);

// --- Search demo: Ctrl+K -> 'biryani' -> add ---
await page.keyboard.press(mode === "mobile" ? "Control+k" : "Control+k");
await wait(900);
await page.keyboard.type("biryani");
await wait(900);
await page.locator("div[role='dialog'] button:has-text('Add')").first().click();
console.log("Search: biryani added");
await wait(900);
await page.keyboard.press("Escape");
await wait(700);

// --- Quick view demo with qty stepper ---
await page.locator("article button[aria-label^='Quick view']").first().click();
await wait(1000);
await page.locator("button[aria-label='Increase quantity']").click();
await wait(350);
await page.locator("button[aria-label='Increase quantity']").click();
await wait(350);
await page.locator("button:has-text('Add to wallet grave')").click();
console.log("Quick view: added with qty 3");
await wait(1000);

// --- Cars category -> superbike -> THAT HURT (plan §29) ---
await page.getByRole("button", { name: /Cars/ }).first().click();
await wait(1400);
await page.locator("article button:has-text('+ Add')").first().click();
console.log("Big purchase -> THAT HURT");
await wait(1800);

// --- Collection drawer -> finish session ---
await page.locator("header button[aria-label^='Your collection']").click();
await wait(1300);
await page.locator("button:has-text('Finish session')").click();
console.log("Damage report opening...");
await wait(2600); // overlay entrance + animated counter

// --- Restart for a clean ending ---
await page.locator("button:has-text('Spend again')").click();
await wait(1400);
await scroll(0);
await wait(1600);

await context.close(); // flushes the video to disk
const videoPath = await video.path();
const target = `demo/kharch-karo-demo-${mode}.webm`;
try {
  renameSync(videoPath, target);
  console.log("VIDEO SAVED:", target);
} catch {
  console.log("VIDEO SAVED:", videoPath);
}
await browser.close();
console.log("DONE");
