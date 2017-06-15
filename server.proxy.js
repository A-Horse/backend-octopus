import express from 'express';

import http from 'http';

var proxyServer = require('http-route-proxy');


const app = express();

app.use(proxyServer.connect({
  from: '127.0.0.1',
  to: '0.0.0.0:5500',
  route: ['/']
}));


function startServer() {
  const server = http.createServer(app);
  server.listen(6500, '127.0.0.1');
}

startServer();
