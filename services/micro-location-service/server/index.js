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
const locationsController = require('../controllers/locations_controller');
const healthCheck = require('micro-health-check');

const bugsnag = require('bugsnag');
const winston = require('winston');
const winstonBugsnag = require('winston-bugsnag');

if (process.env.NODE_ENV === 'production') {
  bugsnag.register(process.env.BUGSNAG_API_KEY);
  winston.add(winstonBugsnag);
}

const proto = grpc.load(
  'shared/location/location.proto',
  'proto',
  { convertFieldsToCamelCase: true }
);
const server = new grpc.Server();
global.healthStatus = healthCheck.setStatus;

// setup microservice endpoints and controller functions that processes requests to those endpoints
server.addProtoService(proto.location.micro.service, {
  list: locationsController.index,
  get: locationsController.show,
  create: locationsController.create,
  update: locationsController.update,
  delete: locationsController.destroy,
  getAllLocationsDetails: locationsController.allLocationsDetails,
  getLocationDetails: locationsController.getLocationDetails,
});

global.healthStatus('', 1);
server.addProtoService(healthCheck.service, healthCheck.implementation());
// initialize server
server.bind(process.env.SERVICE_URL, grpc.ServerCredentials.createInsecure());
module.exports = server;
