/**
 * Producer function that broadcasts events to the message broker
 * Instructions:
 * assign topic_name to topicName variable
 * assign producer_id to producerId variable
 */
const kafka = require('no-kafka');
const _ = require('lodash');
const moment = require('moment');
const logger = require('winston');
let producer;

/* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
 * integers. Since we want the results to be always positive, convert the
 * signed int to an unsigned by doing an unsigned bitshift. */
function hashKey(str) {
  let hash = 5381;
  let i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }
  return hash >>> 0;
}


module.exports = {
  start() {
    producer = new kafka.Producer({
      clientId: process.env.KAFKA_CLIENT_ID,
      connectionString: process.env.KAFKA_PEERS,
      partitioner(topicName, topicPartitions, message) {
        const numOfPartitions = topicPartitions.length;
        const key = message.key;
        return key % numOfPartitions;
      },
    });
    producer.init().then(() => logger.info('Producer is ready'));
  },
  emit(message, timestamp, altkey, cb) {
    let key;
    let createdAt;
    const value = message;
    if (timestamp) {
      key = moment(timestamp).unix();
    } else if (altkey) {
      key = hashKey(altkey);
    } else {
      key = moment.now();
      createdAt = moment(key).format('YYYY-MM-DD HH:m:s');
      if (_.isPlainObject(message.payload)) {
        value.payload.created_at = createdAt;
        value.payload.updated_at = createdAt;
      }
    }

    return producer.send({
      topic: 'fellowship-role-topic',
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
