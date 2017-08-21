const producer = require('./producer');
const logger = require('winston');
const background = require('./background');

const podName = process.env.POD_NAME || 'no-pod-name'

function logErr(attributes, handlerName, err) {
  console.log(
    JSON.stringify({
      eventTime: (new Date()).toISOString(),
      message: err.stack,
      severity: 'ERROR',
      serviceContext: {
        service: podName.split('-')[0],
        version: podName.split('-')[1],
      },
      context: {
        httpRequest: {
          method: 'POST',
          url: handlerName,
          referrer: attributes.eventType,
        },
        user: attributes.authorEmail,
      }
    })
  )
}

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
    const metadata = { eventType: message.attributes.eventType, userId: message.attributes.authorId, correlationId: message.attributes.correlationId };
    payload.updatedAt = message.timestamp;
    if (handler && process.env.NODE_ENV !== 'test') {
      handler(payload, metadata, (_err) => {
        if (_err) {
          logErr(message.attributes, handler.name, _err);
        } else {
          logger.info('finished processing ',
            message.attributes.eventType,
            ', key ', message.data.id
          );
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