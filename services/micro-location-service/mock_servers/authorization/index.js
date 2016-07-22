const server = require('./server');
const config = require('../config/config');

server.start();
console.log('server running on:', config.authorization);
