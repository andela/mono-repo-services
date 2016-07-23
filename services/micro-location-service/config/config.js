/**
 * Enter the configuration details for the three (3) different environments
 * database url: postgres database url connection string
 * service: the host and port that the microservice should run on e.g '0.0.0.0:50050'
 * kafkaConnection: the host and port of the server that is running the kafka message broker
 * e.g '192.168.99.100:32769'
 */
const development = {
  database: {
    url: process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/db_name_dev',
  },
  service: '0.0.0.0:50050',
};

const production = {
  database: {
    url: process.env.DATABASE_URL,
  },
  service: '0.0.0.0:50050',
};

const test = {
  database: {
    url: process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/db_name_test',
  },
  service: '0.0.0.0:50050',
};

const config = {
  development,
  production,
  staging: production,
  test,
};

module.exports = config;
