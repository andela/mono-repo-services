'use strict';

module.exports = function (sequelize, DataTypes) {
  var SampleModel = sequelize.define('Activity', {
    id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
    model_field_1: { type: DataTypes.STRING, allowNull: false },
    model_field_2: { type: DataTypes.STRING, allowNull: false }
  }, {
    underscored: true
  });

  return SampleModel;
};
