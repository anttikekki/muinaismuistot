const webpack = require("webpack")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin

const SHOW_BUNDLE_ANALYZER = process.env.SHOW_BUNDLE_ANALYZER !== undefined

module.exports = {
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
    filename: "[name]-[contenthash].js"
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
