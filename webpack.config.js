const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const JSONMinifyPlugin = require("node-json-minify");

const SHOW_BUNDLE_ANALYZER = process.env.SHOW_BUNDLE_ANALYZER !== undefined;

module.exports = {
  entry: {
    app: "./src/index.ts",
    models: "./src/3d/index.tsx",
    maisemanmuisti: "./src/maisemanmuisti/index.tsx",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: __dirname + "/dist",
    filename: "[name]-[hash].js",
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }],
      },
      {
        test: [/\.svg$/, /\.woff2?$/, /\.ttf$/, /\.eot$/],
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          outputPath: "fonts",
        },
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      chunks: [
        "app",
        "app~maisemanmuisti~models",
        "vendors~app~maisemanmuisti~models",
        "vendors~app",
      ],
      template: "src/index.ejs",
      filename: "index.html",
    }),
    new HtmlWebpackPlugin({
      chunks: [
        "models",
        "app~maisemanmuisti~models",
        "vendors~app~maisemanmuisti~models",
      ],
      template: "src/3d/index.ejs",
      filename: "3d/index.html",
    }),
    new HtmlWebpackPlugin({
      chunks: [
        "maisemanmuisti",
        "app~maisemanmuisti~models",
        "vendors~app~maisemanmuisti~models",
      ],
      template: "src/maisemanmuisti/index.ejs",
      filename: "maisemanmuisti/index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/images", to: "images" },
        {
          from: "src/3d/3d.json",
          to: "3d",
          transform: function (content) {
            return JSONMinifyPlugin(content.toString());
          },
        },
        {
          from: "src/maisemanmuisti/maisemanmuisti.json",
          to: "maisemanmuisti",
          transform: function (content) {
            return JSONMinifyPlugin(content.toString());
          },
        },
        { from: "src/maisemanmuisti/images", to: "maisemanmuisti/images" },
      ],
    }),
    ...(SHOW_BUNDLE_ANALYZER ? [new BundleAnalyzerPlugin()] : []),
  ],
};
