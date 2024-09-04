const js = require('@eslint/js');

const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const typescriptEslintEslintPlugin = require('@typescript-eslint/eslint-plugin');
const typescriptEslintParser = require('@typescript-eslint/parser');
const reactPlugin = require('eslint-plugin-react');
const globals = require('globals');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  {files: ['**/*.{js,jsx,ts,tsx}']},
  js.configs.recommended,
  ...compat.extends(
    'plugin:@typescript-eslint/recommended',
    'plugin:tailwindcss/recommended',
    'plugin:prettier/recommended',
    'plugin:jsx-a11y/recommended'
  ),
  { plugins: { '@typescript-eslint': typescriptEslintEslintPlugin, 'react': reactPlugin } },
  {
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        project: ['./tsconfig.eslint.json', './packages/*/tsconfig.json', './apps/*/tsconfig.json'],
        ecmaVersion: 'latest',
        ecmaFeatures: {
          jsx: true
        },
        sourceType: 'module',
        project: 'tsconfig.json',
        ecmaFeatures: { jsx: true },
        tsConfigRootDir: __dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.webextensions,
        ...globals.node,
      }
    },
  },
  {
    rules: {
      'tailwindcss/enforces-shorthand': 'off',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/no-unused-vars': 'warn',
      'tailwindcss/no-custom-classname': [
        'off',
        {
          whitelist: [
            '^(font)\\-(heading|semi\\-bold)',
            '^(bg)-(background-dark|background-light|border|background|primary|accent|muted)(\/\d{2})?',
            '^(text)-(muted\\-foreground)',
            'text-accent-foreground',
            '^(animate)-(fadeIn)',
            '^(border)-(border|primary\/50)',
            'focus-visible:ring-ring',
          ],
        },
      ],
      'prettier/prettier': ['warn', {}, { usePrettierrc: true }],
      ...js.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
    },
  },
  {settings: {
    react: {
      version: 'detect',
    },
  }},
  { ignores: ['eslint.config.js', 'tailwind.config.js', '**/postcss.config.js', '**/next.config.js', '**/node_modules', '**/.next', '**/dist', '**/build'] },
];
