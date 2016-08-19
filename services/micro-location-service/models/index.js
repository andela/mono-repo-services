const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const lodash = require('lodash');
const basename = path.basename(module.filename);
require('dotenv').config();

const db = {};
const options = {
  /* eslint-disable no-console */
  logging: console.log,
  /* eslint-enable no-console */
  benchmark: true,
  dialect: process.env.DATABASE_DIALECT,
};

const sequelize = new Sequelize(process.env.DATABASE_URL, Object.assign({}, options));

fs
  .readdirSync(__dirname)
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = lodash.extend({
  sequelize,
  Sequelize,
}, db);
