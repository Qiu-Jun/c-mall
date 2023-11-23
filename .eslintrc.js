module.exports = {
  root: true,
  parser: 'vue-eslint-parser',

  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      tsx: true,
    },
  },

  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
    './editor/.eslintrc-auto-import.json',
  ],

  rules: {
    // override/add rules settings here, such as:
    'vue/multi-word-component-names': 'off',
    'vue/prefer-import-from-vue': 'off',
    'vue/require-default-prop': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
  },
};
