import React from 'react';
import ReactDOM from 'react-dom';

import Foo from '../components/foo.jsx';

import '../scss/base.scss';
import '../scss/b.scss';

window.onload = function() {
    ReactDOM.render(<Foo page="b" />, document.getElementById('app'));
}
