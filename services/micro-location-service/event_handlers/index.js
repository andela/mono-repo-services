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
const config = require('konfig')();
const Kafka = require('no-kafka');
const dns = require('dns');
const Promise = require('bluebird');
const logger = require('winston');
const strategyName = '{strategy_name}';
const producer = require('../kafka_producer');
const groupId = '{group_id}';
const subscriptions = ['{topic_name}'];
const handlers = require('./register_events');
let consumer;

function dataHandler(messageSet, topic, partition) {
  return Promise.each(messageSet, (m) => {
    const request = JSON.parse(m.message.value.toString('utf8'));
    const handler = handlers[request.event_type];
    if (handler) {
      handler(request.payload, (err, data) => {
        if (err) {
          logger.error(err.message);
        } else {
          logger.info('Emitted ', request.event_type, ' Data: ', data);
        }
      });
    }
    return consumer.commitOffset({
      topic,
      partition,
      offset: m.offset,
      metadata: 'optional',
    });
  });
}

const strategies = [{
  strategy: strategyName,
  subscriptions,
  handler: dataHandler,
}];

module.exports.start = () => {
  dns.lookup(config.app.kafkaCluster, { all: true, family: 4 }, (err, addresses) => {
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

