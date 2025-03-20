import { defineConfig } from "eslint-define-config";

export default defineConfig({
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "no-console": "warn",
    "no-unused-vars": "warn",
    semi: ["error", "always"],
    "react/prop-types": "off",
  },
});
