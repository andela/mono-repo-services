const models = global.models;
const logger = require('winston');

module.exports = {
  createLocation(payload, callback) {
    models.Location.create(payload)
    .then((location) => {
      callback(null, location.id);
    }).catch((err) => {
      logger.error(err.message);
      callback(err);
    });
  },

  updateLocation(payload, callback) {
    models.Location.upsert(payload)
    .then((location) => {
      callback(null, location.id);
    }).catch((err) => {
      logger.error(err.message);
      callback(err);
    });
  },

  destroyLocation(payload, callback) {
    models.Location.destroy({ where: { id: payload.id } })
    .then(() => {
      callback(null, {});
    })
    .catch((error) => {
      logger.log(error.message);
      callback(error);
    });
  },
};
