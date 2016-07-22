const grpc = require('grpc');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const proto = grpc.load(`${__dirname}/fellowship_roles.proto`);
const server = new grpc.Server();

const role = {
  id: 1,
  name: 'John Doe',
  level: 3,
  skills: [
    {
      id: 1,
      name: 'Android',
      description: 'Lorem ipsum.....',
      score_guideline_id: 2,
    },
  ],
};

server.addProtoService(proto.fellowship_roles.micro.service, {
  create(call, callback) {
    callback(null, {});
  },

  delete(call, callback) {
    callback(null, {});
  },

  update(call, callback) {
    callback(null, {});
  },

  get(call, callback) {
    callback(null, role);
  },

  list(call, callback) {
    callback(null, { roles: [role] });
  },
});

server.bind(config.fellowship_roles, grpc.ServerCredentials.createInsecure());
module.exports = server;
