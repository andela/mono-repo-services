const grpc = require('grpc');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const proto = grpc.load(`${__dirname}/placement.proto`);
const server = new grpc.Server();

const placement = {
  id: 1,
  email: 'sampleemail@gmail.com',
  level: 'D1',
  status: 'Unplaced',
  type: 'External',
  client: 'Huge',
  created_at: 'Wed Jul 13 2016 14:49:15 GMT+0100 (WAT)',
  updated_at: 'Wed Jul 13 2016 14:49:15 GMT+0100 (WAT)',
};

const status = {
  id: 'userId1234',
  name: 'FellowPlaced',
};


server.addProtoService(proto.placements.micro.service, {
  listPlacements(call, callback) {
    callback(null, { placements: [placement] });
  },

  listStatuses(call, callback) {
    callback(null, { status: [status] });
  },
});

server.bind(config.placement, grpc.ServerCredentials.createInsecure());
module.exports = server;
