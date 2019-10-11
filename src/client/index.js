import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './app';

// cached tmpl
const read = filename =>
  fs.readFileSync(path.join(__dirname, filename)).toString();
const raw = read('index.html');

// renders params
// - path: req.path
// - state: {}
module.exports = function render({ outlines }) {
  const body = ReactDOMServer.renderToString(<App outlines={outlines} />);
  const initialState = `
<div id="root">${body}</div>
<script>window.initialState=${JSON.stringify(outlines)}</script>`;
  const html = raw.replace('<div id="root"></div>', initialState);
  return html;
};
