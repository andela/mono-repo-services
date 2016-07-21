'use strict';

module.exports = function (sequelize, DataTypes) {
  var SampleModel = sequelize.define('sample_model', {
    model_field_1: DataTypes.STRING,
    model_field_2: DataTypes.STRING
  }, {
    underscored: true
  });

  return SampleModel;
};