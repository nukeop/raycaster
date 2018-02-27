const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'game');
const APP_DIR = path.resolve(__dirname, 'game');
const RESOURCES_DIR = path.resolve(__dirname, 'game', 'resources');
const DATA_DIR = path.resolve(__dirname, 'game', 'data');

module.exports = {
  entry: path.resolve(APP_DIR, 'index.js'),
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        loader: 'babel-loader',
        include: APP_DIR
      },
      {
        test: /\.(png|jpg|gif|json)$/,
        loader: 'file-loader',
        include: RESOURCES_DIR
      },
      {
        test: /\.yaml$/,
        loader: 'json-loader!yaml-loader',
        include: DATA_DIR
      }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin()
  ]
}
