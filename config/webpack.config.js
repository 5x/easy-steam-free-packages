const path = require('path');

const config = require('./site.config');
const loaders = require('./webpack.loaders');
const plugins = require('./webpack.plugins');

const appConfig = {
  context: path.join(config.root, config.paths.src),
  entry: {
    app: [
      path.join(config.root, config.paths.src, 'app/index.js'),
      path.join(config.root, config.paths.src, 'stylesheets/styles.scss'),
    ],
  },
  output: {
    path: path.join(config.root, config.paths.dist),
    publicPath: config.site_url,
    filename: '[name].[hash].js',
  },
  mode: ['production', 'development'].includes(config.env)
    ? config.env
    : 'development',
  devtool: config.env === 'production'
    ? 'hidden-source-map'
    : 'cheap-eval-source-map',
  devServer: {
    contentBase: path.join(config.root, config.paths.src),
    watchContentBase: true,
    hot: true,
    open: true,
    port: config.port,
    host: config.dev_host,
  },
  module: {
    rules: loaders,
  },
  plugins,
};

const libraryConfig = {
  context: path.join(config.root, config.paths.src),
  entry: {
    easysfp: path.join(config.root, config.paths.src, 'script/index.js'),
  },
  output: {
    library: 'easysfp',
    libraryTarget: 'var',
    path: path.join(config.root, config.paths.dist),
    filename: '[name].js',
  },
  mode: ['production', 'development'].includes(config.env)
    ? config.env
    : 'development',
  devtool: config.env === 'production'
    ? 'hidden-source-map'
    : 'cheap-eval-source-map',
  module: {
    rules: loaders,
  },
};


module.exports = [appConfig, libraryConfig];
