require('dotenv').config({ silent: true });
global.models = require('./models');
const server = require('./server');
const hystrixMetrics = require('./hystrix_metrics');
const logger = require('epic_logger');
const pg = require('pg');
const pubsub = require('andela-pubsub');
const VError = require('verror');

const dbName = process.env.POSTGRES_DB;
const templateDB = process.env.TEMPLATE_DB;
const handlers = require('./events/register');

pubsub.subscribe([{ topicName: 'location', subscriptionName: 'location' }], handlers);

if (dbName && templateDB) {
  const client = new pg.Client(templateDB);
  client.connect((err) => (
    client.query(`CREATE DATABASE ${dbName}`, (createErr) => {
      if (err) {
        logger.error(new VError(err, `FAILED TO CREATE DB: ${dbName}`), { failure: createErr });
      }
      client.end();
    })
  ));
}

server.start();
hystrixMetrics.start();
