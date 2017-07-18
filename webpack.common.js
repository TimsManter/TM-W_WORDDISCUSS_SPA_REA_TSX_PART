const path = require("path");
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/tsx/App.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "assets/bundle.js"
  },

  module: {
    rules: [
      // // Look into docs directory to use Babel
      // { test: /\.jsx?$/, exclude: /node_modules/, loader: "babel-loader" },
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        loader: 'tslint-loader',
        exclude: /(node_modules)/,
        options: {
          configFile: 'tslint.json'
        }
      },
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader"
      },
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, "src/scss"),
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "sass-loader" }
        ]
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      }
    ]
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    modules: ['node_modules', path.resolve(__dirname, 'src')]

  },
  devServer: {
    historyApiFallback: true,
    noInfo: false,
    contentBase: path.resolve(__dirname, "dist")
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/ejs/index.ejs"
    })
  ]
};