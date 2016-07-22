const grpc = require('grpc');
const config = require('../config/config');

const proto = grpc.load(`${__dirname }/cohorts.proto`);

const server = new grpc.Server();

const cohort = {
  id: '-Jb6erRVHRQzuKVlnBtM',
  color: '#000000',
  hidden: true,
  invite_code: 'Jv1VqqY',
  name: 'Ninjas',
  started_at: '2014-09-01T23:00:00.000Z',
  story: 'lorem ipsum...',
  created_at: '2015-11-30T18:52:05.107Z',
  updated_at: '2015-11-30T18:52:05.107Z',
  location_id: '-JltZTD9iU0aD7j9Qr5m',
  start_level_id: null,
  location: {
    id: '-JltZTD9iU0aD7j9Qr5m',
    name: 'Lagos',
  },
  auditor_id: 'auditors user id',
  auditor_name: 'audotors name',
};

server.addProtoService(proto.cohorts.micro.service, {
  list(call, callback) {
    callback(null, { cohorts: [cohort] });
  },

  get(call, callback) {
    callback(null, cohort);
  },

  create(call, callback) {
    callback(null, {});
  },

  update(call, callback) {
    callback(null, {});
  },


  delete(call, callback) {
    callback(null, {});
  },

  inviteCode(call, callback) {
    callback(null, cohort);
  },
});

server.bind(config.cohorts, grpc.ServerCredentials.createInsecure());
module.exports = server;
