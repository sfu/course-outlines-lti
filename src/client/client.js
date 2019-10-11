import React from 'react';
import ReactDOM from 'react-dom';

import './App.css';
import App from './App';

ReactDOM.render(
  <App outlines={window.initialState} />,
  document.getElementById('root')
);
