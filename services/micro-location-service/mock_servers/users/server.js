const grpc = require('grpc');
const config = require('../config/config');
const proto = grpc.load(`${__dirname}/users.proto`);
const server = new grpc.Server();

const userPermission = { name: 'ikem' };

const userRole = {
  id: 1,
  name: 'Fellow',
  permissions: [userPermission],
};

const user = {
  id: 1,
  first_name: 'Fname',
  last_name: 'Lname',
  email: 'user@andela.com',
  name: 'Fname Lname',
  access_token: ' ',
  picture: 'user.jpg',
  roles: [userRole],
};

server.addProtoService(proto.users.micro.service, {
  findOrCreateUser(call, callback) {
    callback(null, user);
  },

  listRoles(call, callback) {
    callback(null, { roles: [userRole] });
  },

  createRole(call, callback) {
    callback(null, {});
  },

  editRole(call, callback) {
    callback(null, {});
  },

  showRole(call, callback) {
    callback(null, userRole);
  },

  assignRole(call, callback) {
    callback(null, {});
  },

  unAssignRole(call, callback) {
    callback(null, {});
  },

  listUsers(call, callback) {
    callback(null, { users: [user] });
  },

  fetchUser(call, callback) {
    callback(null, user);
  },

  updateUser(call, callback) {
    callback(null, {});
  },

  suspendUser(call, callback) {
    callback(null, {});
  },

  restoreUser(call, callback) {
    callback(null, {});
  },

  createUser(call, callback) {
    callback(null, {});
  },
});

server.bind(config.user_mgt, grpc.ServerCredentials.createInsecure());
module.exports = server;
