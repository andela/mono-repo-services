var grpc = require('grpc');
var env = process.env.NODE_ENV || 'test';
var config = require('../config/config');


var proto = grpc.load(__dirname + '/users.proto');
var server = new grpc.Server();

var userPermission = { name: 'ikem' };

var userRole = {
  id: 1,
  name: 'Fellow',
  permissions: [userPermission]
};

var user = {
  id: 1,
  first_name: 'Fname',
  last_name: 'Lname',
  email: 'user@andela.com',
  name: 'Fname Lname',
  access_token: ' ',
  picture: 'user.jpg',
  roles: [userRole]
};

server.addProtoService(proto.users.micro.service, {
  findOrCreateUser: function (call, callback) {
    callback(null, user);
  },

  listRoles: function (call, callback) {
    callback(null, { roles: [userRole] });
  },

  createRole: function (call, callback) {
    callback(null, {});
  },

  editRole: function (call, callback) {
    callback(null, {});
  },

  showRole: function (call, callback) {
    callback(null, userRole);
  },

  assignRole: function (call, callback) {
    callback(null, {});
  },

  unAssignRole: function (call, callback) {
    callback(null, {});
  },

  listUsers: function (call, callback) {
    callback(null, { users: [user] });
  },

  fetchUser: function (call, callback) {
    callback(null, user);
  },

  updateUser: function (call, callback) {
    callback(null, {});
  },

  suspendUser: function (call, callback) {
    callback(null, {});
  },

  restoreUser: function (call, callback) {
    callback(null, {});
  },

  createUser: function (call, callback) {
    callback(null, {});
  }
});

server.bind(config.user_mgt, grpc.ServerCredentials.createInsecure());
module.exports = server;
