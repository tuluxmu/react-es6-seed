# react-es6-seed

A boilerplate for building webapp with React, ES6 and pack with webpack.

## Features

- React.js and ES6 ECMAScript 6 support

- SASS & LESS & native css support

- [Local CSS](https://github.com/webpack/css-loader#local-scope) support

- Support SPA & multi-pages apps

- Build apps with webpack and HRM support

- Support data mock and 3rd domain api proxy

## Getting start

### Installation

``` bash
$ git clone https://github.com/chemdemo/react-es6-seed.git
```

### Global modules

``` bash
$ npm install -g webpack gulp
```

### Tasks

- `$ npm run install` - install 3rd modules

- `$ npm start` - start the app in development mode at http://localhost:8088

- `$ npm build` - build with webpack

- `$ npm release` - start the app in production mode to check the assets resource

### Mock & Proxy

It lanuch a local HTTP server to serve static files, so it's easy supporting mock data and proxy 3rd ajax api, see `routes.js`.

The webpack-dev-server launched as middleware of the local server.

### License

Copyright (c) 2015 chemdemo

MIT ([http://opensource.org/licenses/MIT](http://opensource.org/licenses/MIT))
