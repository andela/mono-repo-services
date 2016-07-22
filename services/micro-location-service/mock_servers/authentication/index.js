const server = require('./server');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

server.start();
console.log('server running on:', config.authentication);
