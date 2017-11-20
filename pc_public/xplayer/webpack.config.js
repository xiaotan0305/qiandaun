var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var libraryName = 'XPlayer';
var env = process.env.WEBPACK_ENV;
var ROOT_PATH = path.resolve(__dirname);
var JS_PATH = path.resolve(ROOT_PATH, 'js');
var CSS_PATH = path.resolve(ROOT_PATH, 'css');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');

var dev = env === 'dev';
var plugins = [].concat(dev ? [] : [
    new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compressor: {
            warnings: false,
            conditionals: true,
            unused: true,
            comparisons: true,
            sequences: true,
            dead_code: true,
            evaluate: true,
            if_return: true,
            join_vars: true,
            negate_iife: false
        },
        output: {
            comments: false,
            ascii_only: true
        }
    }),
    new ExtractTextPlugin(`${libraryName}.css`)
]);

module.exports = {
    entry: './js/' + libraryName + '.js',

    output: {
        path: BUILD_PATH,
        filename: libraryName + '.js',
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },

    devtool: dev ? 'eval-source-map' : 'source-map',

    devServer: {
        publicPath: '/build/'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'template-string-optimize-loader',
                include: JS_PATH
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: JS_PATH,
                options: {
                    presets: ['env']
                }
            },
            {
                test: /\.scss$/,
                use: dev ? ['style-loader', 'css-loader', 'sass-loader'] : ExtractTextPlugin.extract({
                    use: ['css-loader?minimize&-autoprefixer', 'sass-loader']
                }),
                include: CSS_PATH
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=40000'
            }
        ]
    },

    plugins: plugins
};