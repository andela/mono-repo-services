var grpc = require('grpc');
var env = process.env.NODE_ENV || 'test';
var config = require('../config/config');

var proto = grpc.load(__dirname + '/fellowship_roles.proto');

var server = new grpc.Server();

var role = {
  id: 1,
  name: 'John Doe',
  level: 3,
  skills: [
    {
      id: 1,
      name: 'Android',
      description: 'Lorem ipsum.....',
      score_guideline_id: 2
    }
  ]
};

server.addProtoService(proto.fellowship_roles.micro.service, {
  create: function (call, callback) {
    callback(null, {});
  },

  delete: function (call, callback) {
    callback(null, {});
  },

  update: function (call, callback) {
    callback(null, {});
  },

  get: function (call, callback) {
    callback(null, role);
  },

  list: function (call, callback) {
    callback(null, { roles: [role] });
  }
});

server.bind(config.fellowship_roles, grpc.ServerCredentials.createInsecure());
module.exports = server
