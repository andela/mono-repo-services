const bugsnag = require('bugsnag');
const Transport = require('winston/lib/winston/transports/transport').Transport;

class BugsnagTransport extends Transport {
  constructor({ level = 'error', apiKey, ...opts }) {
    super({ level, apiKey, ...opts });
    this.name = 'bugsnag';
    this.level = level;
    bugsnag.register(apiKey, Object.assign({}, opts));
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
    bugsnag.notify(msg, {
      severity: levelMapping[level],
      meta,
      userId: (meta || {}).userId
    }, () => cb(null, true));
  };
}

module.exports = BugsnagTransport;