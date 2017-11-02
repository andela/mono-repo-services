const models = global.models;
const logger = require('epic_logger');
const producer = require('andela-pubsub').producer;
const _ = require('lodash');
const grpc = require('grpc');
const async = require('async');
const camelcaseKeys = require('camelcase-keys');
const VError = require('verror');
const sharedRootPath = require('path').join(__dirname, '..', 'shared');

const levelsProto = grpc.load({ root: sharedRootPath, file: 'level/level-svc.proto' });
const usersProto = grpc.load({ root: sharedRootPath, file: 'user/user-svc.proto' });
const levelsClient = new levelsProto.level.LevelService(
  process.env.LEVELS_SERVICE_URL,
  grpc.credentials.createInsecure()
);
const usersClient = new usersProto.user.UserService(
  process.env.USERS_SERVICE_URL,
  grpc.credentials.createInsecure()
);

const emit = (payload, attributes, logMetadata) => {
  const message = {
    data: Object.assign({}, payload),
    attributes,
  };
  return new Promise((resolve, reject) => {
    producer.emit(message, 'location', (err) => {
      if (err) {
        logger.error(new VError(err, `Failed to emit to ${attributes.eventType} event`),
          logMetadata);
        return reject(err);
      }
      return resolve({});
    });
  });
};

module.exports = {
  index(call, callback) {
    const grpcMetadata = camelcaseKeys(call.metadata.getMap());
    const logMetadata = {
      userId: grpcMetadata.authorId,
      correlationId: grpcMetadata.correlationId,
      endpoint: 'List',
    };
    models.Location.findAll({ raw: true }).then((locations) => {
      const values = locations.map(location => (
        models.stringifyDates(location)
      ));
      callback(null, { values });
    }).catch((err) => {
      logMetadata.errors = err.errors;
      logger.error(new VError(err, 'Failed to find locations'), logMetadata);
      callback(err);
    });
  },

  show(call, callback) {
    const grpcMetadata = camelcaseKeys(call.metadata.getMap());
    const logMetadata = {
      userId: grpcMetadata.authorId,
      correlationId: grpcMetadata.correlationId,
      endpoint: 'Get',
    };
    models.Location.findById(call.request.id, { raw: true }).then((location) => {
      if (location) {
        const result = models.stringifyDates(location);
        callback(null, result);
      } else {
        callback({ message: 'location not found', code: grpc.status.NOT_FOUND });
      }
    }).catch((err) => {
      logMetadata.errors = err.errors;
      logger.error(new VError(err, 'Failed to get location'), logMetadata);
      callback(err);
    });
  },

  update(call, callback) {
    const grpcMetadata = camelcaseKeys(call.metadata.getMap());
    const attributes = _.pick(grpcMetadata, 'authorId', 'authorName', 'correlationId');
    const logMetadata = {
      userId: grpcMetadata.authorId,
      correlationId: grpcMetadata.correlationId,
      endpoint: 'Update',
    };
    const payload = _.pick(call.request, ['id', 'name', 'timeZone']);
    models.Location.findById(payload.id).then((location) => {
      if (location) {
        attributes.eventType = 'LocationUpdatedEvent';
        models.sequelize.transaction((transaction) => {
          payload.updatedAt = Date.now();
          const where = { id: payload.id };
          const fields = ['name', 'timeZone', 'updatedAt'];
          return models.Location.update(payload,
            { where, fields }, { transaction })
            .then(() => emit(payload, attributes, logMetadata));
        })
        .then(() => {
          callback(null, {});
        }).catch((err) => {
          logMetadata.errors = err.errors;
          logger.error(new VError(err, 'Failed to update location'), logMetadata);
          callback({ message: 'failed to create location', code: grpc.status.INVALID_ARGUMENT });
        });
      } else {
        callback({ message: 'location not found', code: grpc.status.NOT_FOUND });
      }
    }).catch((err) => {
      logMetadata.errors = err.errors;
      logger.error(new VError(err, 'Failed to update location'), logMetadata);
      callback(err);
    });
  },

  create(call, callback) {
    const grpcMetadata = camelcaseKeys(call.metadata.getMap());
    const attributes = _.pick(grpcMetadata, 'authorId', 'authorName', 'correlationId');
    const logMetadata = {
      userId: grpcMetadata.authorId,
      correlationId: grpcMetadata.correlationId,
      endpoint: 'Create',
    };
    const payload = _.pick(call.request, 'id', 'name', 'timeZone');
    attributes.eventType = 'LocationCreatedEvent';

    models.sequelize.transaction((transaction) => {
      payload.createdAt = payload.updatedAt = Date.now();
      return models.Location.create(payload, { transaction })
        .then(() => emit(payload, attributes, logMetadata));
    })
    .then(() => {
      callback(null, {});
    })
    .catch((err) => {
      logMetadata.errors = err.errors;
      logger.error(new VError(err, 'Failed to create location'), logMetadata);
      callback(err);
    });
  },

  destroy(call, callback) {
    const grpcMetadata = camelcaseKeys(call.metadata.getMap());
    const attributes = _.pick(grpcMetadata, 'authorId', 'authorName', 'correlationId');
    const logMetadata = {
      userId: grpcMetadata.authorId,
      correlationId: grpcMetadata.correlationId,
      endpoint: 'Delete',
    };
    const payload = { id: call.request.id };
    models.Location.findById(call.request.id).then((location) => {
      if (location) {
        attributes.eventType = 'LocationDeletedEvent';
        models.sequelize.transaction((transaction) => (
          models.Location.destroy({ where: { id: payload.id } }, { transaction })
            .then(() => emit(payload, attributes, logMetadata))
        ))
        .then(() => {
          callback(null, {});
        })
        .catch((error) => {
          logMetadata.errors = error.errors;
          logger.error(new VError(error, 'Failed to delete location'), logMetadata);
          callback({ message: 'failed to delete location', code: grpc.status.INVALID_ARGUMENT });
        });
      } else {
        callback({ message: 'location not found', code: grpc.status.NOT_FOUND });
      }
    }).catch((err) => {
      logMetadata.errors = err.errors;
      logger.error(new VError(err, 'Failed to delete location'), logMetadata);
      callback(err);
    });
  },

  allLocationsDetails(call, callback) {
    const grpcMetadata = camelcaseKeys(call.metadata.getMap());
    const logMetadata = {
      userId: grpcMetadata.authorId,
      correlationId: grpcMetadata.correlationId,
      endpoint: 'GetAllLocationsDetails',
    };
    async.waterfall([
      (step) => {
        usersClient.getUsersCountPerLocation({}, call.metadata, (err, data) => {
          if (err) {
            step(err);
          } else {
            step(null, data.values);
          }
        });
      },
      (prev, step) => {
        models.Location.findAll({ raw: true })
         .then((locations) => {
           const result = _.map(locations, location => {
             location.count = prev[location.id];
             location.title = location.name;
             return _.pick(location, ['id', 'title', 'count']);
           });
           step(null, result);
         }).catch((err) => {
           logMetadata.errors = err.errors;
           logger.error(new VError(err, 'Failed to get all locations details'),
            logMetadata);
           step(err);
         });
      },
    ], (err, values) => {
      callback(err, { values });
    });
  },

  getLocationDetails(call, callback) {
    const grpcMetadata = camelcaseKeys(call.metadata.getMap());
    const logMetadata = {
      userId: grpcMetadata.authorId,
      correlationId: grpcMetadata.correlationId,
      endpoint: 'GetLocationDetails',
    };
    const locationID = call.request.id;
    async.waterfall([
      (step) => {
        models.Location.findById(locationID, { raw: true })
          .then((location) => {
            step(null, location);
          })
          .catch((err) => {
            logMetadata.errors = err.errors;
            logger.error(new VError(err, 'Failed to get location details'),
             logMetadata);
            step(err);
          });
      },
      (prev, step) => {
        usersClient.getUsersCountPerLevelByLocation({ id: locationID },
        call.metadata, (err, result) => {
          step(null, result.values);
        });
      },
      (prev, step) => {
        const ids = Object.keys(prev);
        levelsClient.getLevelNames({ ids }, call.metadata, (err, data) => {
          const result = _.map(prev, (count, id) => (
            { id, name: data.values[id], count }
          ));
          step(null, result);
        });
      },
    ],
    (err, values) => {
      callback(err, { values });
    });
  },
};
