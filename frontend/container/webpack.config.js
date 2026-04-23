const path = require('path');
const { ModuleFederationPlugin } = require('webpack').container;
const dependencies = require('./package.json').dependencies;

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    publicPath: 'auto',
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@shared': path.resolve(__dirname, '../shared'),
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            configFile: path.resolve(__dirname, '.babelrc'),
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'container',
      remotes: {
        mfDatos: 'mfDatos@http://localhost:3001/remoteEntry.js',
        mfIndicadores: 'mfIndicadores@http://localhost:3002/remoteEntry.js',
        mfReportes: 'mfReportes@http://localhost:3003/remoteEntry.js',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: false,
          eager: true,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: false,
          eager: true,
        },
      },
    }),
  ],
  devServer: {
    port: 3000,
    historyApiFallback: true,
    hot: true,
    static: {
      directory: path.resolve(__dirname, 'public'),
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};