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
const strategyName = 'LocationStrategy';
const groupId = 'location-service-group';
const subscriptions = ['location-topic'];
const Kafka = require('no-kafka');
const dns = require('dns');
const Promise = require('bluebird');
const logger = require('winston');
const models = require('../models');
const producer = require('../kafka_producer');
const handlers = require('./register');

let consumer;

function dataHandler(messageSet, topic, partition) {
  return Promise.each(messageSet, (m) => {
    const request = JSON.parse(m.message.value.toString('utf8'));
    const handler = handlers[request.eventType];
    const messageInfo = {
      topic,
      partition,
      offset: m.offset,
      metadata: 'optional',
    };
    if (handler) {
      request.payload.updatedAt = new Date(request.timestamp);
      console.log('payload is: ', request.payload);
      handler(request.payload, (err) => {
        if (err) {
          logger.error(err.message);
          console.log("error at handler!>>>>>>>>>>");
        } else {
          logger.info('finished processing ', request.eventType, ', ', request.payload.id);
          consumer.commitOffset(messageInfo);
        }
      });
    } else {
      consumer.commitOffset(messageInfo);
    }
  });
}

const strategies = [{
  strategy: strategyName,
  subscriptions,
  handler: dataHandler,
}];

module.exports.start = () => {
  dns.lookup(process.env.KAFKA_URL, { all: true, family: 4 }, (err, addresses) => {
    if (err) throw err;

    const peers = [];
    addresses.forEach((name) => {
      peers.push(`${name.address}:9092`);
    });
    process.env.KAFKA_PEERS = peers.join(',');
    logger.info(`kafka peers: ${process.env.KAFKA_PEERS}`);

    consumer = new Kafka.GroupConsumer({
      groupId,
      clientId: process.env.KAFKA_CLIENT_ID,
      connectionString: process.env.KAFKA_PEERS,
    });
    consumer.init(strategies);
    producer.start();
  });
};
