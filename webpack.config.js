/*
 * @Author: dmyang
 * @Date:   2015-08-02 14:16:41
 * @Last Modified by:   dmyang
 * @Last Modified time: 2015-11-30 11:39:40
 */

'use strict';

var path = require('path');
var fs = require('fs');
var util = require('util');

var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

var pkg = require('./package.json');
var debug = 'development' === process.env.NODE_ENV; // 默认不是debug模式咯
var srcDir = path.resolve(process.cwd(), 'src');
var build = '__build/';
var assets = 'assets/';

var entries = genEntries();
var chunks = Object.keys(entries);
var plugins = [
    new CommonsChunkPlugin({
        name: 'vendors',
        chunks: chunks,
        minChunks: chunks.length
    })
];
var cssLoader;
var sassLoader;
var lessLoader;
var jsxLoader = [];
var sassParams = [
    'outputStyle=expanded',
    'includePaths[]=' + path.resolve(__dirname, './src/scss'),
    'includePaths[]=' + path.resolve(__dirname, './node_modules')
];

if (debug) {
    var cssLoaderStr = 'css?sourceMap&modules&localIdentName=[name]-[local]-[hash:base64:5]';

    cssLoader = ['style', cssLoaderStr].join('!');

    sassParams.push('sourceMap', 'sourceMapContents=true')
    sassLoader = ['style', cssLoaderStr, 'sass?' + sassParams.join('&')].join('!');

    lessLoader = ['style', cssLoaderStr, 'less'].join('!');

    // jsxLoader.push('react-hot');

    plugins.push(new webpack.HotModuleReplacementPlugin());
} else {
    cssLoader = ['style', 'css'].join('!');

    // sassLoader = ExtractTextPlugin.extract('style', [
    //     'css',
    //     'sass?' + sassParams.join('&')
    // ].join('!'));
    sassLoader = ['style', 'css', 'sass?' + sassParams.join('&')].join('!');

    lessLoader = ['style', 'css', 'less'].join('!');

    plugins.push(
        new UglifyJsPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.NoErrorsPlugin()
    );
}

// jsxLoader.push('babel?optional[]=runtime&stage=0&plugins=rewire');
jsxLoader.push('babel?presets[]=react,presets[]=es2015');

genHtml();

function genEntries() {
    var jsDir = path.resolve(srcDir, 'containers/');
    var names = fs.readdirSync(jsDir);
    var map = {};

    names.forEach(function(name) {
        var m = name.match(/(.+)\.js(?:x)?$/);
        var entry = m ? m[1] : '';
        var entryPath = entry ? path.resolve(jsDir, name) : '';

        if (entry) {
            map[entry] = [entryPath];
            // if (debug) {
            //     map[entry].push(util.format('webpack-dev-server/client?http://%s:%d', pkg.config.devHost, pkg.config.devPort));
            //     map[entry].push('webpack/hot/dev-server');
            // }
        }
    });

    return map;
}

function genHtml() {
    var pages = fs.readdirSync(srcDir);

    pages.forEach(function(filename) {
        var m = filename.match(/(.+)\.html$/);

        if (m) {
            // @see https://github.com/kangax/html-minifier
            var conf = {
                template: path.resolve(srcDir, filename),
                // @see https://github.com/kangax/html-minifier
                // minify: {
                //     collapseWhitespace: true,
                //     removeComments: true
                // },
                filename: filename
            };

            if (m[1] in entries) {
                conf.inject = 'body';
                conf.chunks = ['vendors', m[1]];
            }

            plugins.push(new HtmlWebpackPlugin(conf));
        }
    });
}

module.exports = {
    cache: debug,
    debug: debug,
    target: 'web',
    devtool: debug ? 'inline-source-map' : false,

    entry: entries,

    output: {
        path: path.resolve(debug ? build : assets),
        filename: debug ? '[name].js' : 'js/[chunkhash:8].[name].min.js',
        chunkFilename: debug ? '[chunkhash:8].chunk.js' : 'js/[chunkhash:8].chunk.min.js',
        publicPath: ''
    },

    resolve: {
        extensions: ['', '.js', '.css', '.scss', '.png', '.jpg']
    },

    module: {
        noParse: ['react'],
        loaders: [
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                loaders: [
                    'image?{bypassOnDebug: true, progressive:true, \
                            optimizationLevel: 3, pngquant:{quality: "65-80", speed: 4}}',
                    'url?limit=10000&name=img/[hash:8].[name].[ext]',
                ]
            },
            {
                test: /\.(woff|eot|ttf)$/,
                loader: 'url?limit=10000&name=fonts/[hash:8].[name].[ext]'
            },
            {
                test: /\.scss$/,
                loader: sassLoader
            },
            {
                test: /\.less$/,
                loader: 'srtle!css!less'
            },
            {
                test: /\.css$/,
                loader: 'srtle!css'
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: jsxLoader
            }
        ]
    },

    plugins: plugins,

    devServer: {
        contentBase: path.resolve(process.cwd(), ''),
        hot: true,
        noInfo: false,
        inline: true,
        stats: {
            cached: false,
            colors: true
        }
    }
};
