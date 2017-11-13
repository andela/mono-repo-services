
const fancyID = require('pushid')
const getTopic = require('./background').getTopic;
const VError = require('verror');
const logger = require('epic_logger');


module.exports = {
  emitModel(model, message, topicName, cb) {
    message.data.id = message.data.id || fancyID();
    model
    .build(message.data)
    .validate().then(() => {
      this.emit(message, topicName, cb);
    })
    .catch((err) => {
      const metadata = Object.assign({ method: 'emitModel' }, message.attributes);
      logger.error(new VError(err, 'Validation error occured'), metadata);
      // code 3 is grpc.status.INVALID_ARGUMENT
      cb({ message: validateErr.message, code: 3 });
    })
  },
  emit(message, topicName, cb) {
    message.data.id = message.data.id || fancyID();
    message.attributes.timestamp = (new Date()).toISOString();
    delete message.attributes.permissions;

    getTopic(topicName)
    .then((topic) => {
      topic.publish(message, { raw: true }, (err) => {
        if (err) {
          logger.error(new VError(err, `failed to publish event`), message.attributes);
          cb(err);
        } else {
          logger.info(`successfully emitted event`, message.attributes);
          cb(null, {});
        }
      });
    })
    .catch((err) => {
      logger.error(new VError(err, 'error occurred while getting pubsub topic'), message.attributes);
      cb(err);
    })
  },
};
