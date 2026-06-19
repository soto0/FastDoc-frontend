import antfu from "@antfu/eslint-config";
import { FlatCompat } from "@eslint/eslintrc";
import globals from "globals";

const compat = new FlatCompat({});

const antfuConfigs = await antfu(
  { typescript: { tsconfigPath: "./tsconfig.json" }, stylistic: false },
  { ignores: ["**/*.md", "src/components/ui/**"] },
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
