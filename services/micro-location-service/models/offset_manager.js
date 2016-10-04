module.exports = (sequelize, DataTypes) => {
  const offsetManager = sequelize.define('OffsetManager', {
    topic: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    partition: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    topicOffset: {
      type: DataTypes.INTEGER,
      field: 'topic_offset',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
  }, {
    timestamps: false,
    tableName: 'offset_managers',
  });
  return offsetManager;
};
