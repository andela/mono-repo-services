require('dotenv').config({ silent: true });
global.models = require('./models');
const server = require('./server');
const eventHandlers = require('./events');
const hystrixMetrics = require('./hystrix_metrics');
const logger = require('winston');
const pg = require('pg');
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

eventHandlers.start();
server.start();
hystrixMetrics.start();
