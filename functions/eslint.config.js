import js from '@eslint/js';
import google from 'eslint-config-google';
import globals from 'globals';

export default [
  js.configs.recommended,
  google,
  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      'no-restricted-globals': ['error', 'name', 'length'],
      'prefer-arrow-callback': 'error',
      'quotes': ['error', 'single', {allowTemplateLiterals: true}],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'never'],
      'indent': ['error', 2],
    },
  },
  {
    files: ['**/*.spec.*'],
    languageOptions: {
      globals: {
        ...globals.mocha,
      },
    },
  },
];
