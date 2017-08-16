
const logger = require('./index');
const VError = require('verror').VError;

var err1 = new Error('No such file or directory');
var err2 = new VError(err1, 'failed to stat "%s"', '/junk');
var err3 = new VError(err2, 'request failed');

logger.error(err3, { userId: 'some id', endpoint: 'This request Endpoint'});
logger.crit('I have a critical error with fullstack trace', err3);
logger.crit(new Error('this is a critical error'));
logger.crit('This critical error has an initial message', new Error('this is the stack trace'))
logger.error(new Error('We have an error'));
logger.error('we have extra metadata', { name: 'I am that user', stack: new Error('This error also has a stck trace but in the metadata').stack })
logger.warning('just some basic warning');
logger.info('I have extra info in the metadata', { extra: 'info' });
logger.debug('I am just a little debug info');