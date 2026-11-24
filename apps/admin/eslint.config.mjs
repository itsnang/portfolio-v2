import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // `_name` marks a deliberately unused value; rest siblings drop fields from an object.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true },
      ],
    },
  },
  // Vendored from the Tiptap and shadcn/ui templates; kept as upstream ships them.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/components/tiptap-*/**",
    "src/components/ui/**",
    "src/hooks/**",
    "src/lib/tiptap-utils.ts",
  ]),
]);
