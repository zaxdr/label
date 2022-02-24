const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const TerserPlugin = require('terser-webpack-plugin') //使用 terser 来压缩 JavaScript
const CleanCSSPlugin = require('less-plugin-clean-css')
const { merge } = require('webpack-merge')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin"); //压缩 CSS 文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //将 CSS 提取到单独的文件中
const CopyPlugin = require('copy-webpack-plugin'); //复制静态文件

const commonConfig = require('./utils/webpack.base')
const paths = require("./utils/paths");


module.exports = merge(commonConfig, {
  mode: 'production',
  output: {
    filename: 'js/[name].[contenthash].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                paths: [paths.src, paths.node_modules],
                plugins: [new CleanCSSPlugin({ advanced: true })],
                javascriptEnabled: true
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
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: 4,
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
      }),
      new CssMinimizerPlugin({
        parallel: 4,
      }),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        },
        vendors: { // node_modules里的代码
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          priority: 10, // 优先级
          enforce: true
        }
      }
    }
  },

  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: paths.templateSrc,
          to: paths.buildDist,
          globOptions: {
            dot: true,
            gitignore: true,
            ignore: ["**/index.html", "index.html"],
          }
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[id].[contenthash].css',
      ignoreOrder: false
    })
  ]
})
