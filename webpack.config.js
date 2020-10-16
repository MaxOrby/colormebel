const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')


module.exports = {
  entry: {
    script: './js/_script.js'
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build')
  },

  plugins: [
    // Generating HTML
    new HtmlWebpackPlugin({ template: 'pug/_index.pug', filename: 'index.html' }),
    new HtmlWebpackPlugin({ template: 'pug/kuhni.pug', filename: 'kuhni.html' }),
    new HtmlWebpackPugPlugin(),

    new MiniCssExtractPlugin({ filename: 'style.css' }), // Generating CSS
    new CopyWebpackPlugin([{ from: 'img', to: 'img' }]), // Copy images
    //new CopyWebpackPlugin([{ from: 'img/sprite.svg', to: 'img' }]), // Copy SVG images

    new SpriteLoaderPlugin({ plainSprite: true })


  ],

  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({})
    ],
  },

  module: {
    rules: [
      // HTML
      {
        test: /\.pug$/,
        loader: 'pug-loader'
      },

      // CSS
      {
        test: /\.css$/,
        use: [
          // Extract to external CSS file
          { loader: MiniCssExtractPlugin.loader },

          // Regular CSS
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
              sourceMap: true,
              url: false
            }
          },

          // PostCSS with plugins
          {
            loader: require.resolve('postcss-loader'),
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-nested'),
                require('postcss-flexbugs-fixes'),
                require('postcss-preset-env')({
                  autoprefixer: {
                    flexbox: 'no-2009',
                  },
                  stage: 3,
                })
              ],
              sourceMap: true
            }
          }
        ]
      },


      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        options: {
          extract: true,
          outputPath: 'icon',
          publicPath: 'img',
          spriteFilename: 'sprite-[hash:6].svg'
        }
      },


    
    ]
  },

  // Development server
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    port: 4080,
    writeToDisk: true
  },

  mode: process.env.NODE_ENV || 'development'
}
