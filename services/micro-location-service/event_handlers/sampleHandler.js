'use strict';

var models = require('../models');
var logger = require('winston');
var data;

var extractData = function (payload) {
  // extract and parse data from payload object
};

var processData = function (data) {
  // process data and return result
};

module.exports = {
  sampleEvent: function (payload, cb) {
    // extract data from payload and process, then pass response back in callback
    data = extractData(payload);
    processData(data).then(function (result) {
      logger.info(result);
      cb(null, result);
    }).catch(function (err) {
      logger.error(err);
      cb(err);
    });
  },
};
