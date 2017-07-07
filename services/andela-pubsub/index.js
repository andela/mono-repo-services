const producer = require('./producer');
const logger = require('winston');
const background = require('./background');

function subscribe(options, handlers) {
  // Subscribe to Cloud Pub/Sub and receive messages to process.
  // The subscription will continue to listen for messages until the process
  // is killed.
  // [START subscribe]
  const unsubscribeFn = background.subscribe(options, (err, message) => {
    // Any errors received are considered fatal.
    if (err) {
      logger.error(err);
      throw err;
    }

    const payload = message.data;
    const handler = handlers[message.attributes.eventType];
    payload.updatedAt = message.timestamp;
    if (handler && process.env.NODE_ENV !== 'test') {
      handler(payload, (_err) => {
        if (_err) {
          logger.error(_err.message);
        } else {
          logger.info('finished processing ', 
            message.attributes.eventType, 
            ', key ', message.data.id
          );
          message.ack();
        }
      });
    } else {
      message.ack();
    }
  });
  // [END subscribe]
  return unsubscribeFn;
}

module.exports = {
  subscribe,
  producer,
  background,
}