/*
* @Author: dmyang
* @Date:   2015-11-25 20:16:01
* @Last Modified by:   dmyang
* @Last Modified time: 2015-11-25 20:16:01
*/

'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import '../scss/foo.scss';

let Foo = React.createClass({
    render() {
        return <div className="foo">{this.props.page}</div>;
    }
});

export default Foo;
