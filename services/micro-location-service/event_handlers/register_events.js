/**
 * Register all event handlers here
 */

const sampleHandler = require('./sampleHandler');

module.exports = () => {
  const handlers = {};
  handlers.sampleEvent = sampleHandler.sampleEvent;
  return handlers;
};
