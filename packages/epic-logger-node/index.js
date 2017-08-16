const winston = require('winston');
const EpicTransport = require('./epic_transport');
const winstonBugsnag = require('winston-bugsnag');
const env = process.env.NODE_ENV || 'development';
const VError = require('verror').VError;

const podName = process.env.POD_NAME || 'myService-1'
const values = podName.split('-')
const serviceContext = { service: values[0], version: values[1] };

let format = 'text';
let level = 'debug';
if (env === 'staging' || env === 'production' ) {
  format = 'json';
  level = 'info';
};

winston.configure({
    transports: [
    new EpicTransport(
      { format,
        level,
        serviceContext,
        levels: winston.config.syslog.levels,
      },
    ),
  ],
});

if (env === 'production') {
  bugsnag.register(process.env.BUGSNAG_API_KEY);
  winston.add(winstonBugsnag);
}

winston.setLevels(winston.config.syslog.levels);

// monkey patch error and crit winston methods
['error', 'crit'].forEach((target) => {
  var method = winston[target];
  winston[target] = function() {
    let args = Array.prototype.slice.call(arguments);
    if (args && args[0] && args[0] instanceof VError) {
      args = [VError.fullStack(args[0])].concat(args.slice(1));
    }
    method.apply(this, args);
  }
});

module.exports = winston;