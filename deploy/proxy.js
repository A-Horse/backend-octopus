const express = require('express');
const proxy = require('http-proxy-middleware');
const proxyPort = 6000;

const app = express();
const path = require('path');
const buildPath = path.join(__dirname, '..', 'dist');

const proxyOptions = require('./proxy-table');

app.use(express.static(buildPath));

Object.keys(proxyOptions).forEach(path => {
  app.use(path, proxy(proxyOptions[path]));
});

app.listen(proxyPort);
console.log(`Built app serve at http://127.0.0.1:${proxyPort}`);
