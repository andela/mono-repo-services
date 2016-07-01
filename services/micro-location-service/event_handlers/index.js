'use strict';

/**
 * Initialization file for the Event Handlers
 *
 * require the following:
 * Kafka: node kafka client
 * bluebird: javascript promise
 * sampleHandler: sample handler that handles events that has been broadcasted
 * config: config file
 * winston: for logging events to the console
 *
 * Instructions:
 * assign unique strategy_name to the strategyName variable
 * assign an array of topics to the subscriptions variable
 */

var strategyName = '{strategy_name}';
var subscriptions = ['{topic_name}'];
var Kafka = require('no-kafka');
var Promise = require('bluebird');
var logger = require('winston');
var env = process.env.NODE_ENV || 'development';
var config = require('../config/config')[env];
var consumer = new Kafka.GroupConsumer(config.kafka);
var handlers = {};
require('./register_events')(handlers);

var dataHandler = function (messageSet, topic, partition) {
  return Promise.each(messageSet, function (m) {
    var request = JSON.parse(m.message.value.toString('utf8'));
    var handler = handlers[request.event_type];
    if (handler) {
      handler(request.payload, function (err, data) {
        if (err) {
          logger.error(err.message)
        }else {
          logger.info("Emitted ", request.event_type, " Data: ", data)
        }
      });
    }
    return consumer.commitOffset({
      topic: topic,
      partition: partition,
      offset: m.offset,
      metadata: 'optional'
    });
  });
};

var strategies = [{
  strategy: strategyName,
  subscriptions: subscriptions,
  handler: dataHandler
}];

module.exports = {
  consumer: consumer,
  strategies: strategies
};
