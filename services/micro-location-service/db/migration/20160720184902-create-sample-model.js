module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('sample_models', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      model_field_1: {
        type: Sequelize.STRING,
      },
      model_field_2: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down(queryInterface) {
    return queryInterface.dropTable('sample_models');
  },
};
