const models = require('../models');
const logger = require('winston');

module.exports = {
  createLocation(data, callback) {
    models.Location.create(data.payload)
    .then((location) => {
      callback(null, location);
    }).catch((err) => {
      logger.error(err.message);
      callback(err);
    });
  },

  updateLocation(data, callback) {
    models.Location.upsert(data)
    .then((location) => {
      callback(null, location);
    }).catch((err) => {
      logger.error(err.message);
      callback(err);
    });
  },

  deleteLocation(data, callback) {
    models.Location.destroy({ where: { id: data.id } })
    .then(() => {
      callback(null, {});
    })
    .catch((error) => {
      logger.log(error.message);
      callback(error);
    });
  },
};
