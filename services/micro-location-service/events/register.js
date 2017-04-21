/**
 * Register all event handlers here
 */

const locationHandler = require('./handlers');

module.exports = {
  LocationCreatedEvent: locationHandler.createLocation,
  LocationUpdatedEvent: locationHandler.updateLocation,
  LocationDeletedEvent: locationHandler.destroyLocation,
};
