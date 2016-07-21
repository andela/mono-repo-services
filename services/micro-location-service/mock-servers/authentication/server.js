var grpc = require('grpc');
var env = process.env.NODE_ENV || 'test';
var config = require('../config/config');

var proto = grpc.load(__dirname + '/authentication.proto');
var server = new grpc.Server();

var user = {
  id: 1,
  first_name: 'John',
  last_name: 'Doe',
  name: 'John Doe',
  email: 'john.doe@andela.com',
  picture: 'image.jpg',
  access_token: '123ert456'
};

server.addProtoService(proto.authentication.micro.service, {
  generateToken: function (call, callback) {
    callback(null, { token: '123ert456' });
  },

  validateToken: function (call, callback) {
    callback(null, user);
  }
});

server.bind(config.authentication, grpc.ServerCredentials.createInsecure());
module.exports = server;
