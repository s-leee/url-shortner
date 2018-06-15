const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const outputDirectory = 'dist';

module.exports = {
  entry: './src/client/index.js',
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: 'bundle.js',
  },
  resolve: {
    alias: {
      Components: path.resolve(__dirname, 'src/client/components'),
      Network: path.resolve(__dirname, 'src/client/network'),
      Utils: path.resolve(__dirname, 'src/client/utils'),
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
	  {
        test: /\.less$/,
        use: ['css-loader', {
          loader: 'less-loader',
          options: {
            paths: [
              path.resolve(__dirname, './src/client/patterns'),
            ]
          }
        }],
      },
    ],
  },
  devServer: {
    port: 3000,
    open: true,
    proxy: {
      '/': 'http://localhost:8080',
      '/api': 'http://localhost:8080',
    },
  },
  plugins: [
    new CleanWebpackPlugin([outputDirectory]),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          compress: {
            drop_console: true,
          }
        }
      })
    ]
  },
};
