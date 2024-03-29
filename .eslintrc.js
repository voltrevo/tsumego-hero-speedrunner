// eslint-disable-next-line
module.exports = {
  extends: [
    "airbnb-as-warnings",
  ],
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
  ],
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
    "no-extra-parens": "off",
    "import/no-unresolved": "off",
    "import/extensions": "off",
    "no-redeclare": "off",
    "import/no-nodejs-modules": "off",
    "no-process-env": "off",
    "no-ternary": "off",

    // Doesn't work with typescript?
    "import/no-unused-modules": "off",

    "newline-after-var": "off",
    "newline-before-return": "off",
    "id-length": "off",
    "no-negated-condition": "off",
    "no-use-before-define": "off",
    "no-restricted-syntax": "off",
    "import/prefer-default-export": "off",
    "import/exports-last": "off",

    // Covered by typescript
    "no-undef": "off",

    "multiline-ternary": "off",
    "multiline-comment-style": "off",

    "array-element-newline": [
      "warn",
      {
        ArrayExpression: "consistent",
        ArrayPattern: "consistent",
      },
    ],

    "init-declarations": "off",
  },
};
