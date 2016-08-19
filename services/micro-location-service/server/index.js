/**
 * The Server module that set ups the grpc server for the microservice
 *
 * require the following:
 * grpc: the grpc client for node
 * proto: load the proto file that contains the interface definitions for the microservice
 * server: the grpc server client object
 * config: config file that holds server config details
 * locationsController: controllers that handles the microservice endpoints
 */
const grpc = require('grpc');
const proto = grpc.load('shared/locations/locations.proto');
const server = new grpc.Server();
const locationsController = require('../controllers/locations_controller');
require('dotenv').config({ silent: true });
// global.config = require('config')();

// setup microservice endpoints and controller functions that processes requests to those endpoints
server.addProtoService(proto.locations.micro.service, {
  list: locationsController.index,
  get: locationsController.show,
  create: locationsController.create,
  update: locationsController.update,
  delete: locationsController.destroy,
  getAllLocationsDetails: locationsController.allLocationsDetails,
  getLocationDetails: locationsController.getLocationDetails,
});

// initialize server
server.bind(process.env.SERVICE_URL, grpc.ServerCredentials.createInsecure());

module.exports = server;
