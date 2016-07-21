'use strict';
var server = require('./server');
var config = require('../config/config');

server.start();
console.log('server running on:', config.{service_name});
