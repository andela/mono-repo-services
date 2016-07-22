/**
 * Producer function that broadcasts events to the message broker
 * Instructions:
 * assign topic_name to topicName variable
 * assign producer_id to producerId variable
 */
const env = process.env.NODE_ENV || 'development';
const config = require('./config/config')[env];
const kafka = require('no-kafka');
const moment = require('moment');
const logger = require('winston');
let producer;


module.exports = {
  start() {
    producer = new kafka.Producer({
      clientId: config.kafka.clientId,
      connectionString: config.kafka.connectionString,
      partitioner(topicName, topicPartitions, message) {
        const numOfPartitions = topicPartitions.length;
        const key = message.key;
        return key % numOfPartitions;
      },
    });
    producer.init().then(() => logger.info('Producer is ready'));
  },
  emit(message, timestamp, cb) {
    let key;
    let createdAt;
    let currentDate;
    const value = message;
    if (timestamp) {
      key = moment(timestamp).unix();
    } else {
      currentDate = moment();
      createdAt = currentDate.toString();
      key = currentDate.unix();
      value.payload.created_at = createdAt;
      value.payload.updated_at = createdAt;
    }

    return producer.send({
      topic: 'topic name',
      message: {
        key,
        value: JSON.stringify(value),
      },
    }).then(() => {
      logger.info(`Event Emitted: ${message.event_type}`, message.payload);
      cb(null, {});
    }).catch((err) => {
      logger.error(`Kafka Error Occurred on ${message.event_typ} Emitted`, err);
      cb(err);
    });
  },
};
