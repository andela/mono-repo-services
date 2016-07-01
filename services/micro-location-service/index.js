'use strict';
var kafka = require('./event_handlers');
var server = require('./server');

kafka.consumer.init(kafka.strategies);
server.start();
