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
const grpc = require('grpc');
const proto = grpc.load('mock_servers/sample/sample.proto');
const server = new grpc.Server();
const sampleController = require('../controllers/sample_controller');
global.config = require('konfig')({ path: '../config' });

// setup microservice endpoints and controller functions that processes requests to those endpoints
server.addProtoService(proto.authorization.AuthorizationService.service, {
  createSampleResource: sampleController.create,
  updateSampleResource: sampleController.update,
  deleteSampleResource: sampleController.delete,
  findSampleResource: sampleController.find,
  listSampleResource: sampleController.list,
});

// initialize server
server.bind(global.app.service, grpc.ServerCredentials.createInsecure());

module.exports = server;
