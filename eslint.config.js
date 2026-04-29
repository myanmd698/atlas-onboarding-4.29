// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    files: [".rnstorybook/**/*.ts", ".rnstorybook/**/*.tsx"],
    rules: {
      // Stripped from args in Storybook `render` functions; name must stay for Controls wiring.
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_|^storybookControls$",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    files: ["jest.setup.js"],
    languageOptions: {
      globals: {
        jest: "readonly",
        require: "readonly",
      },
    },
  },
]);
