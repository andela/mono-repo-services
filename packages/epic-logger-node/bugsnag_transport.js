const bugsnag = require('bugsnag');
const Transport = require('winston/lib/winston/transports/transport').Transport;

class BugsnagTransport extends Transport {
  constructor({ level = 'error', apiKey, serviceContext }) {
    super({ level, apiKey });
    this.name = 'bugsnag';
    this.level = level;
    this.serviceContext = serviceContext;
    bugsnag.register(apiKey);
  }
  
  log(level, msg, meta, cb) {
    const levelMapping = {
      emerg: 'error',
      alert: 'info',
      crit: 'error',
      error: 'error',
      warning: 'warning',
      notice: 'info',
      info: 'info',
      debug: 'info',
    }
    const service = this.serviceContext.service;
    const version = this.serviceContext.version;
    bugsnag.notify(msg, {
      severity: levelMapping[level],
      meta,
      app: { version, service },
      userId: (meta || {}).userId
    }, () => cb(null, true));
  };
}

module.exports = BugsnagTransport;