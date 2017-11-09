const bugsnag = require('bugsnag');
const winston = require('winston');
const EpicTransport = require('./epic_transport');
const BugsnagTransport = require('./bugsnag_transport');
const env = process.env.NODE_ENV || 'development';
const VError = require('verror').VError;

const podName = process.env.POD_NAME || 'default-service-1234567890-abcde';
const deploymentTag = process.env.DEPLOYMENT_TAG || 'abcde'
const serviceName = podName.substring(0, podName.length - 17); // Pod name : servicename +  '-' + 10 bytes numeric + '-' + 5 bytes alphanumeric string
const serviceContext = {
  service: serviceName,
  version: deploymentTag
};

let format = 'text';
let level = 'debug';

if (env === 'staging' || env === 'production') {
  format = 'json';
  level = 'info';
}

const transports = [
    new EpicTransport({
      format,
      level,
      serviceContext,
      handleExceptions: true,
      levels: winston.config.syslog.levels
    }),
  ];

if (env === 'production' || env === 'staging') {
  const apiKey = process.env.BUGSNAG_API_KEY;
  transports.push(new BugsnagTransport({ apiKey, level, serviceContext }));
}

winston.configure({ transports });
winston.setLevels(winston.config.syslog.levels);

// monkey patch error and crit winston methods
['error', 'crit'].forEach((target) => {
  var method = winston[target];
  winston[target] = function () {
    let args = Array.prototype.slice.call(arguments);
    if (args && args[0] && args[0] instanceof VError) {
      args = [VError.fullStack(args[0])].concat(args.slice(1));
    }
    method.apply(this, args);
  };
});

process.on('unhandledRejection', function (err) {
  winston.error(err, { cause: 'unhandled rejection' });
});

module.exports = winston;
