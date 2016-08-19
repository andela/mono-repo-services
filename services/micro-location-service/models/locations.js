module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    id: {
      type: DataTypes.STRING,
      unique: true,
      primaryKey: true,
      field: 'id',
    },
    name: {
      type: DataTypes.STRING,
      field: 'name',
      allowNull: false,
      validate: {
        notEmpty: { msg: 'name should not be emtpy' },
      },
    },
    time_zone: {
      type: DataTypes.STRING,
      field: 'time_zone',
    },
  }, {
    underscored: true,
    table_name: 'locations',
  });
  return Location;
};
