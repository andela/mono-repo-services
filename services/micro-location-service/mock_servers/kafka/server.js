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

class Producer {
  init() {
    return {
      then(cb) {
        cb();
        return promise;
      },
    };
  }
  send() {
    return promise;
  }
}

mock('no-kafka', {
  Producer,
});
const server = require('../../server');
module.exports = server;
