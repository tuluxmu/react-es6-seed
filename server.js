/**
 * @Author: dmyang
 * @Date:   2015-06-29 18:42:30
 * @Last Modified by:   dmyang
 * @Last Modified time: 2015-11-27 14:54:07
 */

'use strict';

// load native modules
var http = require('http');
var path = require('path');
var util = require('util');

// load 3rd modules
var opn = require('opn');
var koa = require('koa');
var router = require('koa-router')();
var serve = require('koa-static');
var colors = require('colors');

// load local modules
var pkg = require('./package.json');
var port = pkg.config.devPort;
var host = pkg.config.devHost;
var env = process.argv[2] || process.env.NODE_ENV;
var debug = 'production' !== env;

// load routes
var routes = require('./routes');

// init framework
var app = koa();

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});

/*var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConf = require('./webpack.dev.config');
var server = new WebpackDevServer(webpack(webpackConf), webpackConf.devServer);

server.listen(port, host, function (err) {
    if (err) { console.log(err); }
    var url = util.format('http://%s:%d', host, port);
    console.log('Listening at %s', url);
    opn(url);
});*/

// basic settings
app.keys = [pkg.name, pkg.description];
app.proxy = true;

// global events listen
app.on('error', function(err, ctx) {
    err.url = err.url || ctx.request.url;
    console.error(err, ctx);
});

// handle favicon.ico
app.use(function*(next) {
    if (this.url.match(/favicon\.ico$/)) this.body = '';
    yield next;
});

// logger
app.use(function*(next) {
    console.log(this.method.info, this.url);
    yield next;
});

// use routes
routes(router, app);
app.use(router.routes());

if (debug) {
    var webpackDevMiddleware = require('koa-webpack-dev-middleware');
    var webpack = require('webpack');
    var webpackConf = require('./webpack.dev.config');

    app.use(webpackDevMiddleware(webpack(webpackConf), webpackConf.devServer));
} else {
    app.use(serve(path.resolve(__dirname, 'assets'), {
        maxage: 0
    }));
}

app = http.createServer(app.callback());

app.listen(port, host, function() {
    var url = util.format('http://%s:%d', host, port);

    console.log('Listening at %s', url);

    opn(url + '/a.html');
});
