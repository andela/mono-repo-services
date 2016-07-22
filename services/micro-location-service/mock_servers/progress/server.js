const grpc = require('grpc');
const config = require('../config/config');
const proto = grpc.load(`${__dirname}/progress.proto`);
const server = new grpc.Server();

const allProgress = {
  progress: {
    '2016-05': {
      values: [
        51.8397817460317,
        38.2037727591036,
        45.9000599371693,
        0.165178571428571,
        40.7522321428571,
        85,
        51.8586309523809,
      ],
    },
    '2016-06': {
      values: [
        57.7560079834472,
        39.6573550775178,
        47.759713534117,
        0.165178571428571,
        40.0966042154567,
        89.3888888888889,
        58.8229166666667,
      ],
    },
    '2016-07': {
      values: [
        59.1215540089648,
        41.6207435442404,
        48.0219801660592,
        0.165457589285714,
        40.1986973067916,
        88.3333333333333,
        63.9598214285714,
      ],
    },
  },
};

const progress = { progress: 90.1 };
const cohortAverage = { progress: 70.1 };
const levelAverage = { progress: 60.1 };

server.addProtoService(proto.progress.micro.service, {
  listAll(call, callback) {
    if ((new Date(call.request.end)) > new Date('2016-07')) {
      return callback(new Error('Error retrieving data'));
    }
    return callback(null, allProgress);
  },

  create(call, callback) {
    callback(null, {});
  },

  getUserProgress(call, callback) {
    if (call.request.id === '') {
      return callback(new Error('Error fething user progress'));
    }
    return callback(null, progress);
  },

  getCohortAverage(call, callback) {
    if (call.request.id === '') {
      return callback(new Error('Error fething cohort progress'));
    }
    return callback(null, cohortAverage);
  },

  getLevelAverage(call, callback) {
    if (call.request.id === '') {
      return callback(new Error('Error fething level progress'));
    }
    return callback(null, levelAverage);
  },
});

server.bind(config.placement, grpc.ServerCredentials.createInsecure());
module.exports = server;
