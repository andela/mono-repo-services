module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('sample_models', 'model_field_3', { type: Sequelize.STRING });
  },

  down(queryInterface) {
    return queryInterface.removeColumn('sample_models', 'model_field_3');
  },
};
