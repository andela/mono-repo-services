/**
 * Producer function that broadcasts events to the message broker
 * Instructions:
 * assign topic_name to topicName variable
 * assign producer_id to producerId variable
 */
const kafka = require('no-kafka');
const logger = require('winston');
const topicName = 'location-topic';
const fancyID = require('./shared/fancyid');
const grpc = require('grpc');

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
      partitioner(topic, topicPartitions, message) {
        const numOfPartitions = topicPartitions.length;
        const key = hashKey(message.key);
        return key % numOfPartitions;
      },
    });
    producer.init().then(() => logger.info('producer is ready'));
  },
  emitModel(model, message, cb) {
    message.payload.id = message.payload.id || fancyID();
    model.build(message.payload).validate().then((validateErr) => {
      if (validateErr) {
        logger.error(validateErr.message);
        cb({ message: validateErr.message, code: grpc.status.INVALID_ARGUMENT });
      } else {
        this.emit(message, cb);
      }
    });
  },
  emit(message, cb) {
    // normally payload at this point should have an id. But if not, generate a fancy id
    message.payload.id = message.payload.id || fancyID();
    message.timestamp = (new Date()).toISOString();
    producer.send({
      topic: topicName,
      message: {
        key: message.payload.id,
        value: JSON.stringify(message),
      },
    }).then(() => {
      logger.info(`Event Emitted: ${message.eventType}`, message.payload);
      cb(null, {});
    }).catch((err) => {
      logger.error(`Kafka Error Occurred on ${message.eventType} Emitted`, err);
      cb(err);
    });
  },
};
