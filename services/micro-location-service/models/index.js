const env = process.env.NODE_ENV || 'development';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const lodash = require('lodash');

const basename = path.basename(module.filename);
const logger = require('winston');
const config = require('../database')[env];
require('dotenv').config();

const db = {};
const options = {
  /* eslint-disable no-console */
  logging: console.log,
  /* eslint-enable no-console */
  benchmark: true,
  dialect: config.dialect,
};

const sequelize = new Sequelize(config.url, Object.assign({}, options));

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

function messageProcessed(msgInfo) {
  msgInfo.topicOffset = msgInfo.offset;
  return db.OffsetManager.find({
    where: { topic: msgInfo.topic, partition: msgInfo.partition },
  }).then((lastOffset) => {
    const offset = lastOffset.dataValues.topicOffset;
    if (lastOffset && msgInfo.offset <= offset) {
      return true;
    }
    return false;
  }).catch((err) => {
    logger.error(err.message);
    return false;
  });
}

module.exports = lodash.extend({
  sequelize,
  messageProcessed,
  Sequelize,
  stringifyDates(value) {
    Object.keys(value).forEach((prop) => {
      if (value[prop] instanceof Date) {
        value[prop] = value[prop].toISOString();
      }
    });
    return value;
  },
}, db);
