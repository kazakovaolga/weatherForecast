module.exports = {
    env: {
      browser: true,
      es2021: true,
      "jest/globals": true,
    },
    extends: [ "prettier"],
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: ["jest"],
    rules: {
      "no-console": "off",
      "import/prefer-default-export": "off",
      "max-len": [
        "off",
        {
          ignoreComments: true,
        },
      ],
      "import/extensions": [0, { js: "always" }],
    },
  };