const webpack = require('webpack')
const path = require('path')
const { merge } = require('webpack-merge')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');


const commonConfig = require('./utils/webpack.base')
const { REACT_APP_BASE_API, proxy_target } = require("./utils/index")
const paths = require("./utils/paths");

module.exports = merge(commonConfig, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  output: {
    filename: '[name].js',
    pathinfo: false,
    publicPath: '/'
  },
  cache: {
    type: 'filesystem', //缓存文件 memory:内存 | filesystem:文件系统
    version: '1.0'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                sourceMap: true,
                javascriptEnabled: true,
                paths: [paths.src, paths.node_modules]
              }
            }
          },
          {
            loader: 'style-resources-loader',
            options: {
                patterns: path.resolve(__dirname, '../src/styles/theme.less')
            }
          }
        ]
      }
    ]
  },
  optimization: {
    runtimeChunk: true,
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
    usedExports: true
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(), //自动刷新
    new ReactRefreshWebpackPlugin(),//react 热更新
  ],

  devServer: {
    //When using the HTML5 History API, the index.html page will likely have to be served in place of any
    // 404 responses. Enable devServer.historyApiFallback by setting it to true:
    historyApiFallback: true, //
    static: {
      directory: paths.templateSrc, //静态资源
    },
    open: true, //打开浏览器
    compress: true, //启用gzip
    port: "auto", //端口 自动使用一个可用端口
    //浏览器
    client: {
      logging: 'error',
      overlay: true,
      progress: true,
    },
    //代理
    proxy: {
      [REACT_APP_BASE_API]: {
        target: proxy_target,
        pathRewrite: { ['^' + REACT_APP_BASE_API]: '' },
        changeOrigin: true,
      }
    }
  },
})
