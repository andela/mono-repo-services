const grpc = require('grpc');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const proto = grpc.load(`${__dirname}/authentication.proto`);
const server = new grpc.Server();

const user = {
  id: 1,
  first_name: 'John',
  last_name: 'Doe',
  name: 'John Doe',
  email: 'john.doe@andela.com',
  picture: 'image.jpg',
  access_token: '123ert456',
};

server.addProtoService(proto.authentication.micro.service, {
  generateToken(call, callback) {
    callback(null, { token: '123ert456' });
  },

  validateToken(call, callback) {
    callback(null, user);
  },
});

server.bind(config.authentication, grpc.ServerCredentials.createInsecure());
module.exports = server;
