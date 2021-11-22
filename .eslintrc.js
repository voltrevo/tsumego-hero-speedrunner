// eslint-disable-next-line
module.exports = {
  extends: [
    "airbnb-as-warnings",
  ],
  env: {
    browser: true,
    es6: true,
  },
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
    "import/no-named-export": "off",
    "import/no-default-export": "off",
    "func-style": "off",
    "no-undefined": "off",
    "no-magic-numbers": "off",
    "no-param-reassign": "off",
    "no-constant-condition": "off",
    "no-await-in-loop": "off",
    "no-loop-func": "off",
    "no-plusplus": "off",
    "max-len": ["warn", { code: 80 }],
  },
};
