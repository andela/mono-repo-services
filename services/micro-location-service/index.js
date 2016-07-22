const server = require('./server');
const eventHandlers = require('./event_handlers');
const hystrixMetrics = require('./hystrix_metrics');
const logger = require('winston');
const pg = require('pg');

const user = process.env.POSTGRES_USER;
const password = process.env.POSTGRES_PASSWORD;
const host = process.env.POSTGRES_HOST;
const dbName = process.env.POSTGRES_DB;
const connectionString = `postgres://${user}:${password}@${host}:5432/template1?sslmode=disable`;
const client = new pg.Client(connectionString);
client.connect((err) => (
  client.query(`CREATE DATABASE ${dbName}`, (createErr) => {
    if (err) {
      logger.info('FAILED TO CREATE DB: ', createErr);
    }
    client.end();
  })
));

process.env.DATABASE_URL = `postgres://${user}:${password}@${host}:5432/${dbName}`;

eventHandlers.start();
server.start();
hystrixMetrics.start();
