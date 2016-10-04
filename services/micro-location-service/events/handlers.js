const models = global.models;
const logger = require('winston');

function writeWithOffset(info, fn) {
  return models.sequelize.transaction((transaction) =>
  models.sequelize.query(
      `INSERT INTO offset_managers VALUES
      (:topic, :partition, :offset, :updatedAt, :createdAt)
       ON CONFLICT(topic, partition)
       DO UPDATE SET topic=EXCLUDED.topic, partition=EXCLUDED.partition,
       topic_offset=EXCLUDED.topic_offset, updated_at=EXCLUDED.updated_at`, {
         replacements: info,
         type: 'RAW',
         transaction,
       })
      .then(() => fn(transaction))
  );
}

module.exports = {
  createLocation(payload, msgInfo, callback) {
    payload.createdAt = payload.updatedAt;
    writeWithOffset(msgInfo, (transaction) => models.Location.create(payload, { transaction }))
    .then((location) => {
      callback(null, location.id);
    }).catch((err) => {
      logger.error(err.message);
      callback(err);
    });
  },

  updateLocation(payload, msgInfo, callback) {
    writeWithOffset(msgInfo, (transaction) => models.Location.upsert(payload, { transaction }))
    .then((location) => {
      callback(null, location.id);
    }).catch((err) => {
      logger.error(err.message);
      callback(err);
    });
  },

  destroyLocation(payload, msgInfo, callback) {
    writeWithOffset(msgInfo, (transaction) => models.Location.destroy(
      { where: { id: payload } },
      { transaction })
    ).then(() => {
      callback(null, {});
    })
    .catch((error) => {
      logger.log(error.message);
      callback(error);
    });
  },
};
