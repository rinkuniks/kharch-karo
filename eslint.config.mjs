import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Kharch Karo serves every photo from the Unsplash CDN (w=800&q=80&auto=format)
    // and ships as a pure static export (`output: "export"`) on Firebase Hosting's
    // free Spark plan — there is no Next image optimizer to route through, and
    // Unsplash already handles resize + modern formats in the URL. Plain <img> with
    // lazy loading is therefore the correct choice here.
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
