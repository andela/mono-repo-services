var grpc = require('grpc');
var env = process.env.NODE_ENV || 'test';
var config = require('../config/config');

var proto = grpc.load(__dirname + '/sample.proto');

var server = new grpc.Server();

var dummyData = {};

server.addProtoService(proto.{service_name}.micro.service, {
  sampleEndpoint1: function (call, callback) {
    callback(null, {});
  },

  sampleEndpoint2: function (call, callback) {
    callback(null, {});
  }
});

server.bind(config.{service_name}, grpc.ServerCredentials.createInsecure());
module.exports = server
