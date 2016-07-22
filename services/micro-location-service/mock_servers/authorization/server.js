const grpc = require('grpc');
const config = require('../config/config');
const proto = grpc.load(`${__dirname}/authorization.proto`);
const server = new grpc.Server();

const activity = {
  id: 1,
  url: 'http:auth.com',
  method: 'GET',
  permission_id: 1,
  created_at: '12/12/12',
  updated_at: '01/01/16',
};

const permission = {
  id: 1,
  name: 'Create User',
  activities: [activity],
  created_at: '12/12/12',
  updated_at: '01/01/16',
};

server.addProtoService(proto.authorization.micro.service, {
  createPermission(call, callback) {
    callback(null, {});
  },

  updatePermission(call, callback) {
    callback(null, {});
  },

  findPermission(call, callback) {
    callback(null, permission);
  },

  listPermission(call, callback) {
    callback(null, { permissions: [permission] });
  },

  deletePermission(call, callback) {
    callback(null, {});
  },

  createActivity(call, callback) {
    callback(null, {});
  },

  updateActivity(call, callback) {
    callback(null, {});
  },

  findActivity(call, callback) {
    callback(null, activity);
  },

  listActivity(call, callback) {
    callback(null, { activities: [activity] });
  },

  deleteActivity(call, callback) {
    callback(null, {});
  },

  assignPermission(call, callback) {
    callback(null, {});
  },

  fetchPermissions(call, callback) {
    callback(null, { permissions: [permission] });
  },

  authorize(call, callback) {
    callback(null, { response: true });
  },
});

server.bind(config.authorization, grpc.ServerCredentials.createInsecure());
module.exports = server;
