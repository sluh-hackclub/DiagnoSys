const http = require('http');
const app = require('./app.js');

const port = 3001;
const host = '127.0.0.1';

const server = http.createServer(app);
server.listen(port, host);

console.log('Server started on ' + host + ':' + port);
