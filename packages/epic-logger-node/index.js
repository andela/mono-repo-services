const winston = require('winston');
const EpicTransport = require('./epic_transport');
const winstonBugsnag = require('winston-bugsnag');
const env = process.env.NODE_ENV || 'development';

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

module.exports = winston;