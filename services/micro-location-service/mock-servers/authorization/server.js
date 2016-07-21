var grpc = require('grpc');
var env = process.env.NODE_ENV || 'test';
var config = require('../config/config');

var proto = grpc.load(__dirname + '/authorization.proto');
var server = new grpc.Server();

var activity = {
  id: 1,
  url: 'http:auth.com',
  method: 'GET',
  permission_id: 1,
  created_at: '12/12/12',
  updated_at: '01/01/16'
};

var permission = {
  id: 1,
  name: 'Create User',
  activities: [activity],
  created_at: '12/12/12',
  updated_at: '01/01/16'
};

server.addProtoService(proto.authorization.micro.service, {
  createPermission: function (call, callback) {
    callback(null, {});
  },

  updatePermission: function (call, callback) {
    callback(null, {});
  },

  findPermission: function (call, callback) {
    callback(null, permission);
  },

  listPermission: function (call, callback) {
    callback(null, { permissions: [permission] });
  },

  deletePermission: function (call, callback) {
    callback(null, {});
  },

  createActivity: function (call, callback) {
    callback(null, {});
  },

  updateActivity: function (call, callback) {
    callback(null, {});
  },

  findActivity: function (call, callback) {
    callback(null, activity);
  },

  listActivity: function (call, callback) {
    callback(null, { activities: [activity] });
  },

  deleteActivity: function (call, callback) {
    callback(null, {});
  },

  assignPermission: function (call, callback) {
    callback(null, {});
  },

  fetchPermissions: function (call, callback) {
    callback(null, { permissions: [permission] });
  },

  authorize: function (call, callback) {
    callback(null, { response: true });
  }
});

server.bind(config.authorization, grpc.ServerCredentials.createInsecure());
module.exports = server;
