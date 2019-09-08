const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

const SHOW_BUNDLE_ANALYZER = process.env.SHOW_BUNDLE_ANALYZER !== undefined;

module.exports = {
  entry: "./src/index.ts",
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  output: {
    path: __dirname + "/dist",
    filename: "[name]-[hash].js"
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader"
          }
        ]
      },
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }]
      },
      {
        test: [/\.svg$/, /\.woff2?$/, /\.ttf$/, /\.eot$/],
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          outputPath: "fonts"
        }
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: "all"
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "src/index.ejs",
      filename: "index.html"
    }),
    new CopyWebpackPlugin([{ from: "src/images", to: "images" }]),
    ...(SHOW_BUNDLE_ANALYZER ? [new BundleAnalyzerPlugin()] : [])
  ]
};
