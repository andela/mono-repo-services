const mock = require('mock-require');
const promise = {
  then(cb) {
    cb();
    return {
      catch() {

      },
    };
  },
};

mock('no-kafka', {
  Producer() {
    return {
      init() {
        return {
          then(cb) {
            cb();
            return promise;
          },
        };
      },
      send() {
        return promise;
      },
    };
  },
});
const server = require('../../server');
module.exports = server;
