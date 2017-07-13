const Pubsub = require('@google-cloud/pubsub');

// const topicName = process.env.TOPIC_NAME;
// const topicName = 'authorization';
// const subscriptionName = process.env.SUBSCRIPTION_NAME;
const subscriptionName = 'authorization';

const logger = require('winston');

const pubsub = Pubsub({
  projectId: process.env.GCLOUD_PROJECT,
  keyFilename: process.env.GOOGLE_CLOUD_PUBSUB_KEY
});

// This configuration will automatically create the topic if
// it doesn't yet exist. Usually, you'll want to make sure
// that a least one subscription exists on the topic before
// publishing anything to it as topics without subscribers
// will essentially drop any messages.
// [START topic]
function getTopic(topicName) {
  return new Promise((resolve, reject) => {
    pubsub.createTopic(topicName, (err, topic) => {
    // topic already exists.
      if (err && err.code === 409) {
        resolve(pubsub.topic(topicName));
      } else if (err) {
        reject(err);
      } else {
        resolve(topic);
      }
    });
  });
}
// [END topic]

// Used by the worker to listen to pubsub messages.
// When more than one worker is running they will all share the same
// subscription, which means that pub/sub will evenly distribute messages
// to each worker.
// [START subscribe]

/** options => [ 
      { topicName: 'authorization', subscriptionName: 'authorization'}
      { topicName: 'slack', subscriptionName: 'authorization'}
    ]
**/
function subscribe(options, cb) {
  let subscriptions = [];

  // Event handlers
  function handleMessage(message) {
    cb(null, message);
  }
  function handleError(err) {
    logger.error(err);
    cb(err);
  }
  const topicPromises = options.map(option => getTopic(option.topicName));

  Promise.all(topicPromises)
  .then((topics) => {
      topics.forEach((topic, index) => {
        const option = options[index]
        const params = { ackDeadlineSeconds: 300, interval: 60 };
        topic.subscribe(option.subscriptionName, params, (err, subscription) => {
        if (err) {
            cb(err);
            return;
        }

        // Listen to and handle message and error events
        subscription.on('message', handleMessage);
        subscription.on('error', handleError);
        subscriptions.push(subscription);
        logger.info(`Listening to ${option.topicName} with subscription ${option.subscriptionName}`);
        });
      });
  })
  .catch(cb);

  // Subscription cancellation function
  return () => {
    if (subscriptions.length > 0) {
      subscriptions.forEach((subscription) => {
        // Remove event listeners
        subscription.removeListener('message', handleMessage);
        subscription.removeListener('error', handleError);
        subscription = undefined;
      });
    }
  };
}
// [END subscribe]

module.exports = {
  subscribe,
  getTopic,
};
