import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const nextConfig = Array.isArray(nextCoreWebVitals)
  ? nextCoreWebVitals
  : [nextCoreWebVitals];

const eslintConfig = defineConfig([
  ...nextConfig,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "dist/**",
    "node_modules/**",
    ".turbo/**",
    ".cache/**",
    "public/mockServiceWorker.js",
  ]),
]);

export default eslintConfig;
