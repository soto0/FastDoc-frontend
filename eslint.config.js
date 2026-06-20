import antfu from "@antfu/eslint-config";
import { FlatCompat } from "@eslint/eslintrc";
import globals from "globals";

const compat = new FlatCompat({});

const antfuConfigs = await antfu(
  { typescript: { tsconfigPath: "./tsconfig.json" }, stylistic: false },
  { ignores: ["**/*.md", "src/components/ui/**"] },
  {
    files: ["**/*.test.ts", "**/*.test.tsx"],
    rules: {
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
    },
  },
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  ...compat.config({}),
);

export default [
  ...antfuConfigs,
  { files: ["**/*.js", "**/*.ts", "**/*.jsx", "**/*.tsx"] },
  ...compat.config(),
];
