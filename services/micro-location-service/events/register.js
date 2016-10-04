/**
 * Register all event handlers here
 */

const locationHandler = require('./handlers');

module.exports = () => {
  const handlers = {};
  handlers.LocationCreatedEvent = locationHandler.createLocation;
  handlers.LocationUpdatedEvent = locationHandler.updateLocation;
  handlers.LocationDeletedEvent = locationHandler.destroyLocation;
  return handlers;
};
