module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('offset_managers', {
      topic: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      partition: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      topic_offset: {
        type: Sequelize.INTEGER,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('offset_managers');
  },
};
