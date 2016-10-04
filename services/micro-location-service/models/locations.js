module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    id: {
      type: DataTypes.STRING,
      unique: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'name should not be emtpy' },
      },
    },
    timeZone: {
      type: DataTypes.STRING,
      field: 'time_zone',
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
    tableName: 'locations',
  });
  return Location;
};
