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
    time_zone: {
      type: DataTypes.STRING,
    },
  }, {
    underscored: true,
    table_name: 'locations',
  });
  return Location;
};
