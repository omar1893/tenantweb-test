module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2021
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/no-deprecated-slot-attribute': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/max-attributes-per-line': 0,
    'quotes': [2, 'single', { 'avoidEscape': true }],
    'prefer-template': 2,
    'semi': [2, 'never'],
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    'vue/singleline-html-element-content-newline': 0
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'public/'
  ]
}
