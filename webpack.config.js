const path = require('path');
const webpack = require('webpack');

const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    // These names MUST match the folder name within app so that the JS bundle doesn't end up in a
    // different directory from the files copied by file-loader
    main: path.join(__dirname, 'app/main'),
    404: path.join(__dirname, 'app/404'),
    '': path.join(__dirname, 'app'),
  },

  module: {
    loaders: [
      // SASS files
      {
        test: /\.sass$/,
        loader: ExtractTextWebpackPlugin.extract(['css-loader', 'postcss-loader', 'sass-loader']),
      },
      // CSS files
      {
        test: /\.css$/,
        loader: ExtractTextWebpackPlugin.extract(['css-loader', 'postcss-loader']),
      },
      // JavaScript files
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: { presets: ['es2015', 'es2016'] },
      },
      // HTML files
      {
        test: /\.html$/,
        loaders: [
          'file-loader?name=[path][name].html&context=app',
          'extract-loader',
          'html-loader',
        ],
      },
      // Files that require no compilation or processing
      {
        test: /\.(ttf|woff|woff2|eot|png|svg)/,
        loader: 'url-loader',
        query: { limit: 10000, name: '[path][name].[ext]', context: 'app' },
      },
    ],
  },

  output: {
    path: path.join(__dirname, 'build'),
    publicPath: '/',
    filename: '[name]/index.js',
  },

  plugins: [
    new ExtractTextWebpackPlugin('[name]/style.css'),
  ],


  // --------------------------------------------------------------------------


  devServer: {
    contentBase: path.join(__dirname, 'app/build'),
  },
};


// Custom settings for production
// detected when building in a path that begins with '/var/www'
if (__dirname.startsWith('/var/www')) {
  console.log('Production detected');
  module.exports.plugins = module.exports.plugins.concat([
    // Minify JS
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false,
      },
    }),
    // Let all loaders know they can minimize output
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
  ]);
}


// Host dev server differently if using cloud9
if (process.env.C9_HOSTNAME) {
  console.log('Detected Cloud9');
  console.log(`Preview at ${process.env.C9_HOSTNAME}/home`);
  module.exports.devServer.port = process.env.PORT;
  module.exports.devServer.host = process.env.IP;
}
