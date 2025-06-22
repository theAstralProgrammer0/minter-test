module.exports = {
  env: { es6: true, node: true, jest: true },
  extends: ['airbnb-base', 'plugin:jest/all'],
  parserOptions: { ecmaVersion: 2018, sourceType: 'module' },
  plugins: ['jest'],
  rules: {
    'max-classes-per-file': 'off',
    'no-underscore-dangle': 'off',
    'no-console': 'off',
    'no-shadow': 'off',
    'no-restricted-syntax': ['error', 'LabeledStatement', 'WithStatement'],
  },
};

