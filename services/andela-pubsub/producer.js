
const logger = require('winston');
const fancyID = require('pushid')
const getTopic = require('./background').getTopic;


module.exports = {
  emitModel(model, message, topicName, metadata, cb) {
    message.data.id = message.data.id || fancyID();
    model
    .build(message.data)
    .validate().then(() => {
      this.emit(message, topicName, metadata, cb);
    })
    .catch((validateErr) => {
      logger.error(validateErr.message);
      // code 3 is grpc.status.INVALID_ARGUMENT
      cb({ message: validateErr.message, code: 3 });
    })
  },
  emit(message, topicName, metadata, cb) {
    message.data.id = message.data.id || fancyID();
    message.attributes.timestamp = (new Date()).toISOString();
    delete message.attributes.permissions;

    getTopic(topicName)
    .then((topic) => {
      topic.publish(message, { raw: true }, (err) => {
        if (err) {
          logger.error(`pubsub Error Occurred on ${message.attributes.eventType} Emitted`, err);
          cb(err);
        } else {
          logger.info(`Event Emitted: ${message.attributes.eventType}`, message.data);
          cb(null, {});
        }
      });
    })
    .catch((err) => {
      logger.error('Error occurred while getting pubsub topic', err);
      cb(err);
    })
  },
};
