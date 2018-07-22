const http = require('http');
const app = require('./app.js');

const port = 3001;

const server = http.createServer(app);
server.listen(port, '127.0.0.1');
