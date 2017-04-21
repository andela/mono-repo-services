const models = global.models;
const logger = require('winston');

module.exports = {
  createLocation(payload, callback) {
    payload.createdAt = payload.updatedAt;
    models.Location.create(payload)
    .then((location) => {
      callback(null, location.id);
    }).catch((err) => {
      logger.error(err.message);
      callback(err);
    });
  },

  updateLocation(payload, callback) {
    models.Location.update(payload,
    { where: { id: payload.id }, fields: ['name', 'timeZone', 'updatedAt'] })
    .then((location) => {
      callback(null, location.id);
    }).catch((err) => {
      logger.error(err.message);
      callback(err);
    });
  },

  destroyLocation(payload, callback) {
    models.Location.destroy({ where: { id: payload.id } })
    .then(() => callback(null, {}))
    .catch((error) => {
      logger.log(error.message);
      callback(error);
    });
  },
};
