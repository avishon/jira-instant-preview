const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  // generate source maps
  devtool: 'source-map',

  // bundling mode
  mode: 'production',

  // entry files
  entry: './src/index.ts',

  // output bundles (location)
  output: {
    path: path.resolve(__dirname, 'chrome-extension/dist'),
    filename: 'main.js',
  },

  // file resolutions
  resolve: {
    extensions: ['.ts', '.js'],
  },

  // loaders
  module: {
    rules: [
      {
        test: /\.tsx?/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        exclude: /\.lazy\.css$/i,
        use: [
          {
            loader: 'style-loader',
            options: {
              injectType: 'lazyStyleTag',
              insert: function insertIntoTarget(element, options) {
                var parent = options.target || document.body;
                parent.appendChild(element);
              },
            },
          },
          { loader: 'css-loader', options: { sourceMap: false } },
        ],
      },
    ],
  },

  // plugins
  plugins: [
    new ForkTsCheckerWebpackPlugin(), // run TSC on a separate thread
  ],

  // set watch mode to `true`
  watch: true,
};
