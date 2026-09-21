/**
 * Kharch Karo — project verification suite (zero extra dependencies, Node 22+).
 *
 * Run:  npm run verify
 *
 * Checks the things that can silently break this static app:
 *   1. Catalogue integrity (ids, prices, categories, tags, real photo URLs)
 *   2. Wallet math + Indian currency formatting + budget parsing
 *   3. Damage Report personality engine
 *   4. Photo CDN reachability (every Unsplash URL must return HTTP 200)
 *   5. Deploy config sanity (firebase.json / firestore.rules / next.config.ts / env)
 */
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { CATEGORIES, POPULAR_THRESHOLD, PRODUCTS, trendingProducts } from "../src/lib/products.ts";
import { BUDGETS, formatINR, parseBudget } from "../src/lib/format.ts";
import { PERSONALITIES, computePersonality } from "../src/lib/personality.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

let passed = 0;
let failed = 0;
const failures: string[] = [];

function reason(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

function check(name: string, fn: () => void): void {
  try {
    fn();
    passed += 1;
    console.log(`  ok   ${name}`);
  } catch (err) {
    failed += 1;
    failures.push(`${name} -> ${reason(err)}`);
    console.log(`  FAIL ${name}\n       ${reason(err)}`);
  }
}

async function checkAsync(name: string, fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
    passed += 1;
    console.log(`  ok   ${name}`);
  } catch (err) {
    failed += 1;
    failures.push(`${name} -> ${reason(err)}`);
    console.log(`  FAIL ${name}\n       ${reason(err)}`);
  }
}

async function main(): Promise<void> {
  console.log("\nKharch Karo — verification\n");

  /* ---------------------------------------------------------------- *
   * 1. Catalogue integrity
   * ---------------------------------------------------------------- */
  console.log("catalogue");

  check("at least 18 products are stocked", () => {
    assert.ok(PRODUCTS.length >= 18, `only ${PRODUCTS.length} products`);
  });

  check("every product id is unique", () => {
    const ids = PRODUCTS.map((p) => p.id);
    assert.equal(new Set(ids).size, ids.length, "duplicate product id found");
  });

  check("every product has a positive price", () => {
    for (const p of PRODUCTS) {
      assert.ok(Number.isFinite(p.price) && p.price > 0, `${p.id} has price ${p.price}`);
    }
  });

  check("every product category is a known category", () => {
    for (const p of PRODUCTS) {
      assert.ok(CATEGORIES.includes(p.category), `${p.id} -> ${p.category}`);
    }
  });

  check("every category has at least one product", () => {
    for (const c of CATEGORIES) {
      assert.ok(PRODUCTS.some((p) => p.category === c), `category ${c} is empty`);
    }
  });

  check("popularity scores sit in 0-100", () => {
    for (const p of PRODUCTS) {
      assert.ok(p.popularity >= 0 && p.popularity <= 100, `${p.id} -> ${p.popularity}`);
    }
  });

  check("every product is searchable (non-empty tags)", () => {
    for (const p of PRODUCTS) {
      assert.ok(Array.isArray(p.tags) && p.tags.length > 0, `${p.id} has no tags`);
      assert.ok(
        p.tags.every((t) => typeof t === "string" && t.trim().length > 0),
        `${p.id} has a blank tag`
      );
    }
  });

  check("every product ships a real CDN photo + credit", () => {
    for (const p of PRODUCTS) {
      assert.match(
        p.image,
        /^https:\/\/images\.unsplash\.com\/photo-[\w-]+\?/,
        `${p.id} image is not an Unsplash CDN URL: ${p.image}`
      );
      assert.ok(p.credit && p.credit.length > 0, `${p.id} is missing a photo credit`);
    }
  });

  check("every product keeps an emoji + gradient fallback for offline", () => {
    for (const p of PRODUCTS) {
      assert.equal(p.gradient.length, 2, `${p.id} gradient needs 2 stops`);
      assert.ok(p.emoji && p.emoji.length > 0, `${p.id} has no emoji fallback`);
    }
  });

  check("trending() sorts by popularity and respects the limit", () => {
    const top = trendingProducts(8);
    assert.equal(top.length, 8);
    for (let i = 1; i < top.length; i += 1) {
      assert.ok(top[i - 1].popularity >= top[i].popularity, "trending is not sorted");
    }
    assert.ok(POPULAR_THRESHOLD > 0 && POPULAR_THRESHOLD <= 100);
  });

  /* ---------------------------------------------------------------- *
   * 2. Wallet math + formatting
   * ---------------------------------------------------------------- */
  console.log("\nwallet engine");

  check("budgets are unique and ascending", () => {
    const amounts = BUDGETS.map((b) => b.amount);
    assert.equal(new Set(BUDGETS.map((b) => b.value)).size, BUDGETS.length, "duplicate budget");
    for (let i = 1; i < amounts.length; i += 1) {
      assert.ok(amounts[i] > amounts[i - 1], "budgets must ascend");
    }
  });

  check("parseBudget resolves every known budget", () => {
    for (const b of BUDGETS) {
      assert.equal(parseBudget(b.value), b.amount, `${b.value} mismatch`);
    }
  });

  check("parseBudget falls back to Rs 1Cr for unknown input", () => {
    assert.equal(parseBudget("does-not-exist"), 10_000_000);
  });

  check("formatINR uses Indian digit grouping", () => {
    assert.equal(formatINR(10_000_000), "\u20B91,00,00,000");
    assert.equal(formatINR(100_000), "\u20B91,00,000");
    assert.equal(formatINR(2_499), "\u20B92,499");
    assert.equal(formatINR(0), "\u20B90");
  });

  check("greedy burn of the catalogue never overshoots the wallet", () => {
    const total = parseBudget("1Cr");
    let remaining = total;
    let spent = 0;
    for (const p of [...PRODUCTS].sort((a, b) => b.price - a.price)) {
      while (remaining >= p.price) {
        remaining -= p.price;
        spent += p.price;
      }
    }
    assert.ok(remaining >= 0, "overspent the wallet");
    assert.equal(spent + remaining, total, "wallet must always balance");
  });

  check("an unaffordable product is correctly denied", () => {
    const total = parseBudget("10K");
    const supercar = PRODUCTS.find((p) => p.id === "supercar");
    assert.ok(supercar, "supercar missing from catalogue");
    assert.ok(supercar.price > total, "supercar should be unaffordable on Rs 10K");
  });

  /* ---------------------------------------------------------------- *
   * 3. Personality engine
   * ---------------------------------------------------------------- */
  console.log("\ndamage report");

  check("a full burn returns Financial Menace", () => {
    assert.equal(computePersonality({ Cars: 10_000_000 }, 1).id, "financial-menace");
  });

  check("top category drives the personality", () => {
    assert.equal(computePersonality({ Food: 5_000, Cars: 900_000 }, 0.5).id, "car-guy");
    assert.equal(computePersonality({ Tech: 90_000, Food: 500 }, 0.4).id, "tech-bro");
    assert.equal(computePersonality({ Travel: 10_000 }, 0.1).id, "jetsetter");
    assert.equal(computePersonality({ Flex: 10_000 }, 0.1).id, "main-character");
    assert.equal(computePersonality({ Fashion: 10_000 }, 0.1).id, "fit-check");
  });

  check("spending nothing returns the Reluctant Spender", () => {
    assert.equal(computePersonality({}, 0).id, "reluctant-spender");
  });

  check("every personality is renderable", () => {
    for (const p of PERSONALITIES) {
      assert.ok(p.name && p.emoji && p.blurb, `${p.id} incomplete`);
      assert.match(p.color, /^#[0-9A-Fa-f]{6}$/, `${p.id} bad colour ${p.color}`);
    }
  });

  /* ---------------------------------------------------------------- *
   * 4. Real photos actually resolve on the CDN
   * ---------------------------------------------------------------- */
  console.log("\nphoto CDN");

  const uniqueImages = [...new Set(PRODUCTS.map((p) => p.image))];

  await checkAsync(`all ${uniqueImages.length} product photos resolve (HTTP 200)`, async () => {
    const results = await Promise.all(
      uniqueImages.map(async (url) => {
        try {
          const res = await fetch(url, { method: "HEAD" });
          return { url, status: res.status };
        } catch (err) {
          return { url, status: 0, error: reason(err) };
        }
      })
    );
    const broken = results.filter((r) => r.status !== 200);
    assert.equal(broken.length, 0, broken.map((b) => `${b.url} -> ${b.status}`).join(", "));
  });

  /* ---------------------------------------------------------------- *
   * 5. Deploy config sanity
   * ---------------------------------------------------------------- */
  console.log("\nconfig");

  check("firebase.json serves the static export and caches assets", () => {
    const cfg = JSON.parse(readFileSync(join(root, "firebase.json"), "utf8"));
    assert.equal(cfg.hosting.public, "out");
    assert.ok(
      Array.isArray(cfg.hosting.headers) && cfg.hosting.headers.length > 0,
      "no cache headers configured"
    );
    assert.equal(cfg.firestore.rules, "firestore.rules");
  });

  check("firestore.rules keeps scores and visits append-only", () => {
    const rules = readFileSync(join(root, "firestore.rules"), "utf8");
    assert.match(rules, /match \/scores\/\{scoreId\}/, "scores match block missing");
    assert.match(rules, /match \/visits\/\{visitId\}/, "visits match block missing");
    assert.match(rules, /allow update, delete: if false/, "writes must be append-only");
  });

  check("next.config.ts enables static export (free Firebase Spark hosting)", () => {
    const cfg = readFileSync(join(root, "next.config.ts"), "utf8");
    assert.match(cfg, /output:\s*"export"/, "static export not enabled");
  });

  check(".env.example documents every env var the app reads", () => {
    const env = readFileSync(join(root, ".env.example"), "utf8");
    for (const key of [
      "NEXT_PUBLIC_FIREBASE_API_KEY",
      "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
      "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
      "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
      "NEXT_PUBLIC_FIREBASE_APP_ID",
      "NEXT_PUBLIC_GA_ID",
      "NEXT_PUBLIC_SITE_URL",
    ]) {
      assert.ok(env.includes(key), `${key} missing from .env.example`);
    }
  });

  check("demo videos are bundled for the footer link", () => {
    for (const file of [
      "public/demo/kharch-karo-demo.mp4",
      "public/demo/kharch-karo-demo-mobile.mp4",
    ]) {
      assert.ok(existsSync(join(root, file)), `${file} missing`);
    }
  });

  /* ---------------------------------------------------------------- *
   * Summary
   * ---------------------------------------------------------------- */
  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) {
    console.log("Failures:");
    for (const f of failures) console.log(` - ${f}`);
    process.exitCode = 1;
  }
}

void main();
