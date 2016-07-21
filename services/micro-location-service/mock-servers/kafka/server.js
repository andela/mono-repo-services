var mock = require('mock-require'),
  server,
  promise = {
    then: function (cb) {
      cb();
      return {
        catch: function () {

        }
      };
    }
  };
mock('no-kafka', {
  Producer: function () {
    return {
      init: function () {
        return {
          then: function (cb) {
            cb();
            return promise;
          }
        };
      },
      send: function () {
        return promise;
      }
    };
  }
});
server = require('../../server');
module.exports = server;
