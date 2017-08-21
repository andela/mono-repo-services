const producer = require('./producer');
const background = require('./background');
const VError = require('verror');
const logger = require('epic_logger');

const podName = process.env.POD_NAME || 'no-pod-name'

function subscribe(options, handlers) {
  // Subscribe to Cloud Pub/Sub and receive messages to process.
  // The subscription will continue to listen for messages until the process
  // is killed.
  // [START subscribe]
  const unsubscribeFn = background.subscribe(options, (err, message) => {
    // Any errors received are considered fatal.
    if (err) {
      logger.error(new VError(err), 'failed to subscribe to topic');
      throw err;
    }

    const payload = message.data;
    const handler = handlers[message.attributes.eventType];
    const metadata = { eventType: message.attributes.eventType, userId: message.attributes.authorId, correlationId: message.attributes.correlationId };
    payload.updatedAt = message.timestamp;
    if (handler && process.env.NODE_ENV !== 'test') {
      handler(payload, (_err) => {
        if (_err) {
          logger.error(new VError(_err, 'failed to process event'), message.attributes);
        } else {
          logger.info('finished processing event', message.attributes);
          message.ack();
        }
      }, message.attributes);
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