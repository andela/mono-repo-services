const models = global.models;
const logger = require('winston');
const producer = require('../kafka_producer');
const _ = require('lodash');
const grpc = require('grpc');
const async = require('async');
const sharedRootPath = require('path').join(__dirname, '..', 'shared');
const levelsProto = grpc.load({ root: sharedRootPath, file: 'levels/levels.proto' });
const usersProto = grpc.load({ root: sharedRootPath, file: 'users/users.proto' });
const levelsClient = new levelsProto.levels.micro(
  process.env.LEVELS_SERVICE_URL,
  grpc.credentials.createInsecure()
);
const usersClient = new usersProto.users.micro(
  process.env.USERS_SERVICE_URL,
  grpc.credentials.createInsecure()
);

module.exports = {
  index(call, callback) {
    models.Location.findAll({ raw: true }).then((locations) => {
      const result = locations.map(location => (
        models.stringifyDates(location)
      ));
      callback(null, result);
    }).catch((err) => {
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
    models.Location.findById(payload.id).then((location) => {
      if (location) {
        const message = {
          eventType: 'LocationUpdatedEvent',
          payload,
        };

        producer.emitModel(models.Location, message, (err, response) => {
          callback(err, response);
        });
      } else {
        logger.error('location not found');
        callback({ message: 'location not found', code: grpc.status.NOT_FOUND });
      }
    }).catch((err) => {
      logger.error(err.message);
      callback(err);
    });
  },

  create(call, callback) {
    const payload = _.pick(call.request, 'id', 'name', 'timeZone');
    const message = {
      eventType: 'LocationCreatedEvent',
      payload,
    };
    producer.emitModel(models.Location, message, (err, response) => {
      callback(err, response);
    });
  },

  destroy(call, callback) {
    models.Location.findById(call.request.id).then((location) => {
      if (location) {
        const message = {
          eventType: 'LocationDeletedEvent',
          payload: { id: call.request.id },
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
         }).catch(err => {
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
          .catch(err => {
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
