// eslint-disable-next-line
module.exports = {
  extends: [
    "airbnb-as-warnings",
  ],
  parserOptions: {
    ecmaVersion: 2021,
  },
  rules: {
    quotes: ["warn", "double"],
    "no-undef-init": "off",
    "sort-keys": "off",
    "max-statements": "off",
    "max-lines-per-function": "off",
    "require-jsdoc": "off",
  },
};
