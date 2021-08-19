import * as React from 'react';
import ReactDom from 'react-dom';
import * as testModule from './test'

ReactDom.render(<testModule.test></testModule.test>, document.getElementById('test-root'));