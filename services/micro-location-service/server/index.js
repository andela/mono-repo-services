'use strict';

/**
 * The Server module that set ups the grpc server for the microservice
 *
 * require the following:
 * grpc: the grpc client for node
 * proto: load the proto file that contains the interface definitions for the microservice
 * server: the grpc server client object
 * config: config file that holds server config details
 * sampleController: controllers that handles the microservice endpoints
 */
var grpc = require('grpc');
var proto = grpc.load('mock_servers/sample/sample.proto');
var server = new grpc.Server();

var env = process.env.NODE_ENV || 'development';
var config = require('../config/config')[env];

var sampleController = require('../controllers/sample_controller');

// setup microservice endpoints and controller functions that processes requests to those endpoints
server.addProtoService(proto.authorization.AuthorizationService.service, {
  createSampleResource: sampleController.create,
  updateSampleResource: sampleController.update,
  deleteSampleResource: sampleController.delete,
  findSampleResource: sampleController.find,
  listSampleResource: sampleController.list,
});

// initialize server
server.bind(config.service, grpc.ServerCredentials.createInsecure());

module.exports = server;
