const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const path = require('path');

const host = '0.0.0.0';
const port = 8080;
const phpPort = 8888;


module.exports = {
    devtool: 'inline-source-map',
    entry: {
        "ag-grid-enterprise/ag-grid-enterprise": './src/_assets/ts/ag-grid-enterprise.ts',
        "site": './src/_assets/ts/site'
    },
    stats: "minimal",
    externals: {
        'angular': 'angular'
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        library: ["agGrid"],
        libraryTarget: "umd",
        publicPath: `http://${host}:${port}/dist/`
    },
    resolve: {
        alias: {
            "./dist/lib/main": "./src/main.ts",
            "./dist/lib": "./src/ts",
        },
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [ 
            { test: /\.ts$/, use: [
                { loader: 'cache-loader' },
                {
                    loader: 'thread-loader',
                    options: {
                        workers: require('os').cpus().length - 1,
                    },
                },
                {
                    loader: 'ts-loader',
                    options: {
                        happyPackMode: true
                    }
                }
            ]},
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    { loader: 'css-loader', options: { sourceMap: true } },
                    { loader: 'sass-loader', options: { sourceMap: true } },
                    { loader: 'postcss-loader', options: { sourceMap: true, syntax: 'postcss-scss', plugins: [ autoprefixer() ] } },
                ]
            }, 
            {
                test: /\.(svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ]
            }
        ],
    },

    devServer: {
        hot: true,
        port: port,
        host: host,
        stats: "minimal",
        proxy: {
            "/": {
                target: `http://${host}:${phpPort}`
            }
        },
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        }
    },
    plugins: [
        // new ExtractTextPlugin('styles.css'),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new ForkTsCheckerWebpackPlugin({ tsconfig: './tsconfig.json' })
    ]
}
