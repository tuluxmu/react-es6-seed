/*
* @Author: dmyang
* @Date:   2015-11-26 11:33:58
* @Last Modified by:   dmyang
* @Last Modified time: 2015-11-26 11:35:44
*/

'use strict';

var proxy = require('koa-proxy');

var list = require('./mock/list');

module.exports = function(router, app) {
    // mock api
    router.get('/api/list', function*() {
        this.body = list;
    });

    // proxy api
    router.get('/api/proxy', proxy({url: 'http://foo.bar.com'}));
};
