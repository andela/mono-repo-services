var grpc = require('grpc');
var env = process.env.NODE_ENV || 'test';
var config = require('../config/config');
var proto = grpc.load(__dirname + '/placement.proto');
var server = new grpc.Server();

var placement = {
  id: 1,
  email: 'sampleemail@gmail.com',
  level: 'D1',
  status: 'Unplaced',
  type: 'External',
  client: 'Huge',
  created_at: 'Wed Jul 13 2016 14:49:15 GMT+0100 (WAT)',
  updated_at: 'Wed Jul 13 2016 14:49:15 GMT+0100 (WAT)'
};

var status = {
  id: 'userId1234',
  name: 'FellowPlaced'
};


server.addProtoService(proto.placements.micro.service, {
  listPlacements: function (call, callback) {
    callback(null, { placements: [placement] });
  },

  listStatuses: function (call, callback) {
    callback(null, { status: [status] });
  }
});

server.bind(config.placement, grpc.ServerCredentials.createInsecure());
module.exports = server;
