module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
    es2017: true,
  },
  extends: [
    'eslint:recommended',
  ],
  rules: {
    'quotes': ['error', 'single'],
    'indent': ['error', 2],
    'max-len': ['error', {'code': 120}],
    'no-console': 'off',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
};
