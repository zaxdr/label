const path = require('path')
const chalk = require('chalk')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack')
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const ProgressBarPlugin = require('progress-bar-webpack-plugin') //打包进度
const InterpolateHtmlPlugin = require("./InterpolateHtmlPlugin") //替换html中的变量


const { env,PUBLIC_URL } = require("./index")
const paths = require("./paths");


module.exports = {
  entry: {
    app: paths.appIndex
  },
  output: {
    path: paths.buildDist,
    clean: true
  },
  resolve: {
    enforceExtension: false,
    extensions: ['.tsx', '.ts', '.js', '.less'],
    symlinks: false,
    alias: {
      '@': paths.src
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          'thread-loader',
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              include: paths.src,
              presets: [
                [
                  "@babel/preset-env",
                  { "modules": false }
                ],
                "@babel/preset-typescript",
                ["@babel/preset-react", { "runtime": "automatic" }]
              ],
              "plugins": [
                "@babel/plugin-transform-runtime",
                ["@babel/plugin-proposal-decorators", { "legacy": true }],
                ["@babel/plugin-proposal-class-properties", { "loose": true }],
                ["@babel/plugin-proposal-private-methods", { "loose": true }],
                "@babel/plugin-proposal-object-rest-spread",
                "@babel/plugin-proposal-nullish-coalescing-operator",
                "@babel/plugin-proposal-optional-chaining",
                "@babel/plugin-syntax-dynamic-import",
                "react-hot-loader/babel",
             /*    ["import",
                  {
                    "libraryName": "antd",
                    // "libraryDirectory": "es",
                    "style": true
                  }
                ] */
              ]
            }
          }
        ]
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/[name][ext]',
        },
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
        include: [
          paths.appSrc,
        ],
        generator: {
          filename: 'static/[name][ext]',
        },

      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: paths.templateHtml
    }),
    new InterpolateHtmlPlugin(HtmlWebpackPlugin,{
      PUBLIC_URL: PUBLIC_URL
    }),

    //注入系统env 系统变量
    new webpack.DefinePlugin(env),
    //  analyz,
    // new BundleAnalyzerPlugin({ analyzerMode: 'dist', openAnalyzer: true}), // 打包分析 { analyzerMode: 'dist', openAnalyzer: false, }
    new ProgressBarPlugin({ //进度显示
      format: `  :msg [:bar] ${chalk.green.bold(':percent')} (:elapsed s)`
    }),
  ]
}
