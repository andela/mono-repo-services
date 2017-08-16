const mapValues = require('lodash.mapvalues');
const util = require('util');
const winston = require('winston');
const Transport = require('winston/lib/winston/transports/transport').Transport;
const os = require('os');
const VError = require('verror').VError;


/**
 * Map of npm output levels to Stackdriver Logging levels.
 *
 * @type {object}
 * @private
 */
const NPM_LEVEL_NAME_TO_CODE = {
  error: 3,
  warn: 4,
  info: 6,
  verbose: 7,
  debug: 7,
  silly: 7
};

/**
 * Map of Stackdriver Logging levels.
 *
 * @type {object}
 * @private
 */
const STACKDRIVER_LOGGING_LEVEL_CODE_TO_NAME = {
  0: 'emergency',
  1: 'alert',
  2: 'critical',
  3: 'error',
  4: 'warning',
  5: 'notice',
  6: 'info',
  7: 'debug'
};

const isObject = (a) => {
    return (!!a) && (a.constructor === Object);
};

/**
 * Winston transport for Epic Logger.
 */
class EpicTransport extends Transport {

  /**
   * Class constructor.
   *
   * @param {Object} options Configuration options.
   * @param {object=} options.levels - Custom logging levels as supported by
   *     winston. This list is used to translate your log level to the Stackdriver
   *     Logging level. Each property should have an integer value between 0 (most
   *     severe) and 7 (least severe). If you are passing a list of levels to your
   *     winston logger, you should provide the same list here.
   */
  constructor(options = {}) {

    super(options);

    this.name = 'EpicTransport';
    this.level = options.level || 'error';
    this.levels_ = options.levels || winston.config.syslog.levels;
    this.format = options.format.toLowerCase() || 'text'
    this.serviceContext = options.serviceContext;
    if (this.format !== 'json' && this.format !== 'text') {
      throw new Error('EpicTransport: parameter "format" is expected to be "json" or "text".');
    }
  }

    /**
   * log JSON Payload.
   *
   * @param {String} level - Winston log entry level.
   * @param {String} message - Log entry message.
   * @param {Object} meta - Winston meta information.
   * @param {Function} callback - Callback to let Winston know we are done.
   */
  log(level, message, metadata, callback) {
    if (typeof(metadata) == 'function') {
      callback = metadata;
      metadata = {};
    }

    if (this.levels_[level] == undefined) {
      throw new Error('Unknown log level: ' + level);
    }

    const levelCode = this.levels_[level];
    const stackdriverLevel = STACKDRIVER_LOGGING_LEVEL_CODE_TO_NAME[levelCode];
    const isError = levelCode < 4;

    if (levelCode > this.levels_[this.level]) {
      return callback(null, true);
    };

    if (metadata && metadata instanceof VError) {
      message += (message ? ' \n ' : '') + VError.fullStack(metadata);
      metadata = {};
    };
   
    if (metadata && metadata.stack) {
       message += (message ? ' \n ' : '') + metadata.stack;
      if ( metadata instanceof Error) {
        metadata = {}
      } else {
        delete metadata.stack;
      } 
    };

    if (this.format == 'json') {
      this.logJSON(stackdriverLevel, message, metadata, isError);
    } else {
      this.logTEXT(level, message, metadata, isError);
    }
    return callback(null, true);
  }

  /**
   * log JSON Payload.
   *
   * @param {String} level - Winston log entry level.
   * @param {String} message - Log entry message.
   * @param {Object} meta - Winston meta information.
   * @param {Boolean} isError - is log an error?.
   */
  logJSON(level, message, metadata, isError) {
    const data = {
      message,
      severity: level.toUpperCase(),
    };

    if (isError) {
      data.serviceContext = this.serviceContext;
      data.eventTime = (new Date()).toISOString();
      data.context = {
        user: metadata.userId || 'no-user-id',
        httpRequest: {
          url: metadata.endpoint || metadata.eventType || 'no-url',  
          referrer: metadata.correlationId, 
        },
      };
    } else {
      data.time = (new Date()).toISOString();
    }
    if (Object.keys(metadata).length) {
      data.metadata = mapValues(metadata, util.inspect);
    }
    if (isError) {
      return console.error(JSON.stringify(data));
    }
    return console.log(JSON.stringify(data));
  }

    /**
   * log Text Payload.
   *
   * @param {String} level - Winston log entry level.
   * @param {String} message - Log entry message.
   * @param {Object} meta - Winston meta information.
   * @param {Boolean} isError - is log an error?.
   */
  logTEXT(level, message, metadata, isError) {
    let output = winston.config.colorize(level) + `: ${message} \n`;
    if (metadata && metadata instanceof Error) {
      output += winston.config.colorize(level, 'stack');
      output += `=${metadata.stack}`
    } else {
      Object.keys(metadata).forEach((key) => {
        output += winston.config.colorize(level, key);
        output += `: ${metadata[key]}   \n`
      })
    };
    if (isError) {
      return console.error(output);
    }
   return console.log(output);
  }
}

module.exports = EpicTransport