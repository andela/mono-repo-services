/**
 * Register all event handlers here
 */

var sampleHandler = require('./sampleHandler');

module.exports = function(handlers) {
  handlers['sampleEvent'] = sampleHandler.sampleEvent;
}