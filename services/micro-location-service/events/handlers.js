const models = global.models;
const logger = require('epic_logger');
const VError = require('verror');

module.exports = {
  createLocation(payload, metadata, callback) {
    payload.createdAt = payload.updatedAt;
    models.Location.create(payload)
    .then((location) => {
      callback(null, location.id);
    }).catch((err) => {
      metadata.errors = err.errors;
      logger.error(new VError(err, 'Failed to create location'), metadata);
      callback(err);
    });
  },

  updateLocation(payload, metadata, callback) {
    models.Location.update(payload,
    { where: { id: payload.id }, fields: ['name', 'timeZone', 'updatedAt'] })
    .then((location) => {
      callback(null, location.id);
    }).catch((err) => {
      metadata.errors = err.errors;
      logger.error(new VError(err, 'Failed to update location'), metadata);
      callback(err);
    });
  },

  destroyLocation(payload, metadata, callback) {
    models.Location.destroy({ where: { id: payload.id } })
    .then(() => callback(null, {}))
    .catch((error) => {
      metadata.errors = error.errors;
      logger.error(new VError(error, 'Failed to delete location'), metadata);
      callback(error);
    });
  },
};
