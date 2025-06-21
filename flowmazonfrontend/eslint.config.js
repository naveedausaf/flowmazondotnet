const {
    defineConfig,
    globalIgnores,
} = require("eslint/config");

const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const storybook = require("eslint-plugin-storybook");
const jsxA11Y = require("eslint-plugin-jsx-a11y");
const tsParser = require("@typescript-eslint/parser");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([{
    extends: compat.extends("next/core-web-vitals", "prettier"),

    plugins: {
        "@typescript-eslint": typescriptEslint,
        storybook,
        "jsx-a11y": jsxA11Y,
    },

    rules: {
        "tailwindcss/classnames-order": "off",
    },

    languageOptions: {
        parser: tsParser,
    },
}, {
    files: ["**/*.ts", "**/*.tsx"],

    languageOptions: {
        parserOptions: {
            project: ["./tsconfig.json"],
            projectService: true,
            tsconfigRootDir: __dirname,
        },
    },

    extends: compat.extends(
        "next/core-web-vitals",
        "plugin:@typescript-eslint/recommended",
        "plugin:storybook/recommended",
        "plugin:jsx-a11y/recommended",
        "prettier",
        "plugin:@typescript-eslint/recommended-type-checked",
        "plugin:@typescript-eslint/strict-type-checked",
    ),
}, globalIgnores(["!**/.storybook"])]);
