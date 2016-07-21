'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var lodash = require('lodash');
var basename = path.basename(module.filename);
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/database.json')[env];
var db = {};
var options = {
  logging: console.log,
  benchmark: true
};

var sequelize = new Sequelize(config.url, Object.assign({}, config, options));

fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function (file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = lodash.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db);
