const server = require('./server');
const eventHandlers = require('./event_handlers');
const hystrixMetrics = require('./hystrix_metrics');
const logger = require('winston');
const pg = require('pg');
const models = require('./models');
const dbName = process.env.POSTGRES_DB;
const templateDB = process.env.TEMPLATE_DB;

if (dbName && templateDB) {
  const client = new pg.Client(templateDB);
  client.connect((err) => (
    client.query(`CREATE DATABASE ${dbName}`, (createErr) => {
      if (err) {
        logger.info('FAILED TO CREATE DB: ', createErr);
      }
      client.end();
    })
  ));
}

models.sequelize.sync();
eventHandlers.start();
server.start();
hystrixMetrics.start();
