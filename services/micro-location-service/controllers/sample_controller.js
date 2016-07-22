/*
Sample Controller for a sample Microservice

require the following:
lodash: for javascript object manipulation
models: database models
kafka_producer: to emit events that would be transmitted to the kafka message broker
 */

// const _ = require('lodash');
const models = require('../models');
const producer = require('../kafka_producer');

module.exports = {
  create(call, callback) {
    /*
    receive and process payload from request,
    use _.pick to filter out unnecessary fields from call.request object
     */
    const payload = call.request;

    // package data to be sent to message broker
    const data = {
      event_type: '{event_name}',
      payload,
    };
    const timestamp = new Date();
    /**
     * Emits events that are sent to the Kafka message broker
     * @param   {obj} [data] packaged payload to be sent to message broker
     * @param   {string} [timestamp] time the resource was created, null if it has not being created
     * @param   {obj} [response] the response returned in the kafka_producer function callback
     * @param   {obj} [error] the error returned in the kafka_producer function callback
     */
    producer.emit(data, timestamp, (err, response) => {
      callback(err, response);
    });
  },

  update(call, callback) {
    let data;
    let payload;

    // find record to be updated
    models.Sample.findById(call.request.id).then((resource) => {
      // receive and process payload from request,
      payload = call.request;
      const timestamp = resource.CreatedAt;

      // package data to be sent to message broker
      data = {
        event_type: '{event_name}',
        payload,
      };

      producer.emit(data, timestamp, (err, response) => {
        callback(err, response);
      });
    });
  },

  delete(call, callback) {
    let data;
    let payload;

    // find record to be deleted
    models.Sample.findById(call.request.id).then((resource) => {
      // receive and process payload from request
      payload = call.request;
      const timestamp = resource.CreatedAt;

      // package data to be sent to message broker
      data = {
        event_type: '{event_name}',
        payload,
      };

      producer.emit(data, timestamp, (err, response) => {
        callback(err, response);
      });
    });
  },

  find(call, callback) {
    models.Sample.findById(call.request.id).then((resource) => {
      if (resource) {
        // process and return
        callback(null, resource);
      } else {
        callback({ message: 'permission not found' });
      }
    }).catch((err) => {
      callback(err);
    });
  },

  list(call, callback) {
    models.Sample.findAll().then((resources) => {
      callback(null, resources);
    }).then((err) => {
      callback(err);
    });
  },
};
