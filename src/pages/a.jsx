import React from 'react';
import ReactDOM from 'react-dom';

import Foo from '../components/foo.jsx';

import '../scss/base.scss';
import '../scss/a.scss';

window.onload = function() {
    ReactDOM.render(<Foo page="a" />, document.getElementById('app'));
}
