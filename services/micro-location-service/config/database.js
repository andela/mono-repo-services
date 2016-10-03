/**
 * Enter the configuration details for the three (3) different environments
 * database url: postgres database url connection string
 * service: the host and port that the microservice should run on e.g '0.0.0.0:50050'
 * kafkaConnection: the host and port of the server that is running the kafka message broker
 * e.g '192.168.99.100:32769'
 */
const development = {
  url: process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/location_dev',
  dialect: 'postgres',
};

const production = {
  url: process.env.DATABASE_URL,
  dialect: 'postgres',
};

const test = {
  url: process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/location_test',
  dialect: 'postgres',
};

const config = {
  development,
  production,
  minikube: production,
  staging: production,
  test,
};

module.exports = config;
