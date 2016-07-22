const models = require('../models');
const logger = require('winston');

module.exports = {
  sampleEvent(payload, cb) {
    // extract data from payload if necessary
    models.Sample.create(payload).then((result) => {
      logger.info(result);
      cb(null, result);
    }).catch((err) => {
      logger.error(err);
      cb(err);
    });
  },
};
