'use strict';

/**
 * Producer function that broadcasts events to the message broker
 * Instructions:
 * assign topic_name to topicName variable
 * assign producer_id to producerId variable
 */
var producerId = '{producer_id}';
var topicName = '{topic_name}';
var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];
var Kafka = require('no-kafka');
var moment = require('moment');
var logger = require('winston');
var producer = new Kafka.Producer({
  clientId: producerId,
  connectionString: config.kafkaConnection,
  partitioner: function (topicName, topicPartitions, message) {
    var numOfPartitions = topicPartitions.length;
    var key = message.key;
    return key % numOfPartitions;
  }
});

exports.emit = function (message, timestamp, cb) {
  var key, createdAt, currentDate, partition;
  if (timestamp) {
    key = moment(timestamp).unix();
  } else {
    currentDate = moment();
    createdAt = currentDate.toString();
    key = currentDate.unix();
    message.payload.created_at = createdAt;
    message.payload.updated_at = createdAt;
  }


  return producer.init().then(function () {
    return producer.send({
      topic: topicName,
      message: {
        key: key,
        value: JSON.stringify(message)
      }
    });
  }).then(function () {
    logger.info('Event Emitted: ' + message.event_type, message.payload);
    cb(null, {});
  }).catch(function (err) {
    logger.error('Kafka Error Occurred on ' + message.event_type + 'Emitted', err);
    cb(err);
  });
};
