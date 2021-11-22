/* eslint-disable import/unambiguous, import/no-unused-modules */
/* eslint-disable import/no-commonjs */

const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

const config = {
  common: {
    entry: {
      contentScript: "./dist/src/contentScript.js",
      pageContentScript: "./dist/src/pageContentScript.js",
    },
    module: {
      rules: [
        {
          test: /\.js$/u,
          enforce: "pre",
          use: ["source-map-loader"],
        },
        {
          test: /\.css$/u,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.ttf$/u,
          type: "asset/resource",
        },
      ],
    },
    output: {
      filename: "[name].bundle.js",
      path: path.join(__dirname, "build"),
      publicPath: "/",
    },
    devServer: {
      contentBase: path.join(__dirname, "build"),
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          "static",
        ],
      }),
    ],
  },
  dev: {
    mode: "development",
    devtool: "source-map",
  },
  prod: {
    mode: "production",
    // devtool: 'inline-source-map',
  },
};

module.exports = {
  ...config.common,
  ...(process.env.PRODUCTION ? config.prod : config.dev),
};
