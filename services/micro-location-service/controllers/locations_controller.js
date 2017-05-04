const models = global.models;
const logger = require('winston');
const producer = require('../kafka_producer');
const _ = require('lodash');
const grpc = require('grpc');
const async = require('async');
const camelcaseKeys = require('camelcase-keys');
const sharedRootPath = require('path').join(__dirname, '..', 'shared');

const levelsProto = grpc.load({ root: sharedRootPath, file: 'level/level.proto' });
const usersProto = grpc.load({ root: sharedRootPath, file: 'user/user.proto' });
const levelsClient = new levelsProto.level.micro(
  process.env.LEVELS_SERVICE_URL,
  grpc.credentials.createInsecure()
);
const usersClient = new usersProto.user.micro(
  process.env.USERS_SERVICE_URL,
  grpc.credentials.createInsecure()
);

module.exports = {
  index(call, callback) {
    models.Location.findAll({ raw: true }).then((locations) => {
      const values = locations.map(location => (
        models.stringifyDates(location)
      ));
      callback(null, { values });
    }).catch((err) => {
      logger.error(err.message);
      callback(err);
    });
  },

  show(call, callback) {
    models.Location.findById(call.request.id, { raw: true }).then((location) => {
      if (location) {
        const result = models.stringifyDates(location);
        callback(null, result);
      } else {
        callback({ message: 'location not found', code: grpc.status.NOT_FOUND });
      }
    }).catch((err) => {
      logger.error(err.message);
      callback(err);
    });
  },

  update(call, callback) {
    const payload = _.pick(call.request, ['id', 'name', 'timeZone']);
    const metadata = camelcaseKeys(call.metadata.getMap());
    models.Location.findById(payload.id).then((location) => {
      if (location) {
        const message = {
          eventType: 'LocationUpdatedEvent',
          payload,
          authorId: metadata.authorId,
          authorName: metadata.authorName,
        };

        producer.emitModel(models.Location, message, (err, response) => {
          callback(err, response);
        });
      } else {
        callback({ message: 'location not found', code: grpc.status.NOT_FOUND });
      }
    }).catch((err) => {
      logger.error(err.message);
      callback(err);
    });
  },

  create(call, callback) {
    const metadata = camelcaseKeys(call.metadata.getMap());
    const payload = _.pick(call.request, 'id', 'name', 'timeZone');
    const message = {
      eventType: 'LocationCreatedEvent',
      payload,
      authorId: metadata.authorId,
      authorName: metadata.authorName,
    };
    producer.emitModel(models.Location, message, (err, response) => {
      callback(err, response);
    });
  },

  destroy(call, callback) {
    const metadata = camelcaseKeys(call.metadata.getMap());
    models.Location.findById(call.request.id).then((location) => {
      if (location) {
        const message = {
          eventType: 'LocationDeletedEvent',
          payload: { id: call.request.id },
          authorId: metadata.authorId,
          authorName: metadata.authorName,
        };

        producer.emit(message, (err) => {
          callback(err, {});
        });
      } else {
        callback({ message: 'location not found', code: grpc.status.NOT_FOUND });
      }
    }).catch((err) => {
      logger.error(err.message);
      callback(err);
    });
  },

  allLocationsDetails(call, callback) {
    async.waterfall([
      (step) => {
        usersClient.getUsersCountPerLocation({}, (err, data) => {
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
           logger.error(err);
           step(err);
         });
      },
    ], (err, values) => {
      callback(err, { values });
    });
  },

  getLocationDetails(call, callback) {
    const locationID = call.request.id;
    async.waterfall([
      (step) => {
        models.Location.findById(locationID, { raw: true })
          .then((location) => {
            step(null, location);
          })
          .catch((err) => {
            logger.error(err);
            step(err);
          });
      },
      (prev, step) => {
        usersClient.getUsersCountPerLevelByLocation({ id: locationID }, (err, result) => {
          step(null, result.values);
        });
      },
      (prev, step) => {
        const ids = Object.keys(prev);
        levelsClient.getLevelNames({ ids }, (err, data) => {
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
