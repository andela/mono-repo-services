'use strict';

/*
Sample Controller for a sample Microservice

require the following:
lodash: for javascript object manipulation
models: database models
kafka_producer: to emit events that would be transmitted to the kafka message broker
 */

var _ = require('lodash');
var models = require('../models');
var producer = require('../kafka_producer');

module.exports = {
  create: function (call, callback) {
    /*
    receive and process payload from request,
    use _.pick to filter out unnecessary fields from call.request object
     */
    var payload = call.request;

    // package data to be sent to message broker
    var data = {
      event_type: '{event_name}',
      payload: payload
    };

    /**
     * Emits events that are sent to the Kafka message broker
     * @param   {obj} [data] packaged payload to be sent to message broker
     * @param   {string} [timestamp] time the resource was created, null if it has not being created
     * @param   {obj} [response] the response returned in the kafka_producer function callback
     * @param   {obj} [error] the error returned in the kafka_producer function callback
     */
    producer.emit(data, timestamp, function (err, response) {
      callback(err, response);
    });
  },

  update: function (call, callback) {
    var data, payload;

    // find record to be updated
    models.{model_name}.findById(call.request.id).then(function (resource) {

      // receive and process payload from request,
      payload = call.request;

      //package data to be sent to message broker
      data = {
        event_type: '{event_name}',
        payload: payload
      };

      producer.emit(data, timestamp function (err, response) {
        callback(err, response);
      });
    });
  },

  delete: function (call, callback) {
    var data, payload;

    // find record to be deleted
    models.{model_name}.findById(call.request.id).then(function (resource) {

      // receive and process payload from request
      payload = call.request;

      // package data to be sent to message broker
      data = {
        event_type: '{event_name}',
        payload: payload
      };

      producer.emit(data, timestamp, function (err, response) {
        callback(err, response);
      });
    });
  },

  find: function (call, callback) {
    models.{model_name}.findById(call.request.id).then(function (resource) {
      if (resource) {
        // process and return
        callback(null, resource);
      } else {
        callback({ message: 'permission not found' });
      }
    }).catch(function (err) {
      callback(err);
    });
  },

  list: function (call, callback) {
    models.{model_name}.findAll().then(function (resources) {
      callback(null, resources);
    }).then(function (err) {
      callback(err);
    });
  }
};
