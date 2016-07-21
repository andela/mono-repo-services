'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('sample_models', 'model_field_3', { type: Sequelize.STRING });
  },

  down: function (queryInterface) {
    return queryInterface.removeColumn('sample_models', 'model_field_3');
  }
};
