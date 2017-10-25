const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const ExtReactWebpackPlugin = require('@extjs/reactor-webpack-plugin');
const portfinder = require('portfinder');

const sourcePath = path.join(__dirname, './src');

module.exports = function (env) {

    portfinder.basePort = (env && env.port) || 10010; // the default port to use

    return portfinder.getPortPromise().then(port => {
        const nodeEnv = env && env.prod ? 'production' : 'development';
        const isProd = nodeEnv === 'production';

        const plugins = [
            new ExtReactWebpackPlugin({
                theme: 'custom-ext-react-theme',
                overrides: ['ext-react/overrides'],
                production: isProd
            }),
            new webpack.EnvironmentPlugin({
                NODE_ENV: nodeEnv
            }),
            new webpack.NamedModulesPlugin()
        ];

        if (isProd) {
            plugins.push(
                new webpack.LoaderOptionsPlugin({
                    minimize: true,
                    debug: false
                }),
                new webpack.optimize.UglifyJsPlugin({
                    compress: {
                        warnings: false,
                        screw_ie8: true
                    }
                })
            );
        } else {
            plugins.push(
                new webpack.HotModuleReplacementPlugin()
            );
        }

        plugins.push(
          new HtmlWebpackPlugin({
            template: 'index.html',
            hash: true
          }),
          new OpenBrowserPlugin({
              url: `http://localhost:${port}`
          }),
          new CopyWebpackPlugin([ //直接复制某单个文件或整个文件夹到编译后的目录下。
            {from: 'images', to: path.resolve(__dirname, './build/images')},
            {from: 'scss', to: path.resolve(__dirname, './build/scss')}
          ])
        );

        return {
            devtool: isProd ? 'source-map' : 'cheap-module-source-map',
            context: sourcePath,

            entry: {
                'app': [
                    'babel-polyfill',
                    'react-hot-loader/patch',
                    './index.js',
                ]
            },

            output: {
                path: path.resolve(__dirname, './build'),
                filename: '[name].js'
            },

            module: {
                rules: [
                    {
                        test: /\.(js|jsx)$/,
                        exclude: /node_modules/,
                        use: [
                            'babel-loader'
                        ],
                    },
                    {
                        test: /\.scss$/,
                        use: [{
                            loader: 'style-loader'
                        }, {
                            loader: 'css-loader'
                        }, {
                            loader: 'sass-loader'
                            // options: {
                            //     includePaths: ['node_modules/compass-mixins/lib']
                            // }
                        }]
                    },
                    {
                        test: /\.css$/,
                        use: [
                          {loader:'style-loader'},
                          {loader:'css-loader'},
                          {
                            loader:'postcss-loader',
                            options: {
                              plugins: (loader) => [
                                require('autoprefixer')({
                                  browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
                                })
                              ]
                            }
                          }
                        ]
                    },
                    {
                        test: /\.(png|eot|tiff|svg|woff2|woff|ttf|gif|mp3|jpg)$/,
                        loaders: [
                            'file-loader?hash=sha512&digest=hex&name=files/[hash].[ext]',
                            'image-webpack-loader'
                        ]
                    },
                ],
            },

            resolve: {
                // The following is only needed when running this boilerplate within the extjs-reactor repo.  You can remove this from your own projects.
                alias: {
                    "react-dom": path.resolve('./node_modules/react-dom'),
                    "react": path.resolve('./node_modules/react')
                }
            },

            plugins,

            stats: {
                colors: {
                    green: '\u001b[32m',
                }
            },

            devServer: {
                contentBase: './build',
                historyApiFallback: true,
                host: '0.0.0.0',
                port,
                disableHostCheck: true,
                compress: isProd,
                inline: !isProd,
                hot: !isProd,
                stats: {
                    assets: true,
                    children: false,
                    chunks: false,
                    hash: false,
                    modules: false,
                    publicPath: false,
                    timings: true,
                    version: false,
                    warnings: true,
                    colors: {
                        green: '\u001b[32m'
                    }
                },
            }
        }
    });
};
