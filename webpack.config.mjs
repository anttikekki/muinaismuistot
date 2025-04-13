import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import { CleanWebpackPlugin } from "clean-webpack-plugin"
import CopyWebpackPlugin from "copy-webpack-plugin"
import HtmlWebpackPlugin from "html-webpack-plugin"
import "webpack"
import BundleAnalyzerPlugin from "webpack-bundle-analyzer"

const SHOW_BUNDLE_ANALYZER = process.env.SHOW_BUNDLE_ANALYZER !== undefined

export default {
  entry: {
    app: "./src/index.ts",
    models: "./src/3d/index.tsx",
    maisemanmuisti: "./src/maisemanmuisti/index.tsx"
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  output: {
    path: __dirname + "/dist", // Required by CleanWebpackPlugin, default for Webpack 5
    filename: "[name]-[contenthash].js",
    assetModuleFilename: "fonts/[name][ext]"
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        loader: "ts-loader"
      },
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }]
      },
      {
        test: [/\.svg$/, /\.woff(2?)$/, /\.ttf$/, /\.eot$/],
        type: "asset/resource"
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "src/index.ejs",
      filename: "index.html",
      excludeChunks: ["models", "maisemanmuisti"]
    }),
    new HtmlWebpackPlugin({
      template: "src/3d/index.ejs",
      filename: "3d/index.html",
      excludeChunks: ["app", "maisemanmuisti"]
    }),
    new HtmlWebpackPlugin({
      template: "src/maisemanmuisti/index.ejs",
      filename: "maisemanmuisti/index.html",
      excludeChunks: ["app", "models"]
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/images", to: "images" },
        {
          from: "src/3d/3d.json",
          to: "3d",
          transform: function (content) {
            return JSON.stringify(JSON.parse(content.toString()))
          }
        },
        {
          from: "src/maisemanmuisti/maisemanmuisti.json",
          to: "maisemanmuisti",
          transform: function (content) {
            return JSON.stringify(JSON.parse(content.toString()))
          }
        },
        { from: "src/maisemanmuisti/images", to: "maisemanmuisti/images" }
      ]
    }),
    ...(SHOW_BUNDLE_ANALYZER ? [new BundleAnalyzerPlugin()] : [])
  ]
}
