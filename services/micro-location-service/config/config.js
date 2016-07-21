'use strict';

/**
 * Enter the configuration details for the three (3) different environments
 * database url: postgres database url connection string
 * service: the host and port that the microservice should run on e.g '0.0.0.0:50050'
 * kafkaConnection: the host and port of the server that is running the kafka message broker e.g '192.168.99.100:32769'
 */
var development = {
  database: {
    url: process.env.DATABASE_URL || 'postgres://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}'
  },
  service: '{host}:{port}',
  kafka: {
    groupId: '{service-name}-group',
    clientId: '{service-name}',
    connectionString: process.env.KAFKA_PEERS || 'localhost:9092'
  }
};

var production = {
  database: {
    url: process.env.DATABASE_URL,
    port: process.env.DATABASE_PORT,
    host: process.env.DATABASE_HOST,
  },
  service: '{host}:{port}',
  kafka: {
    groupId: '{service-name}-group',
    clientId: '{service-name}',
    connectionString: process.env.KAFKA_PEERS || 'localhost:9092'
  }
};

var test = {
  database: {
    url: process.env.DATABASE_URL || 'postgres://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}'
  },
  service: '{host}:{port}',
  kafka: {
    groupId: '{service-name}-group',
    clientId: '{service-name}',
    connectionString: process.env.KAFKA_PEERS || 'localhost:9092'
  }
};

var config = {
  development: development,
  production: production,
  staging: production,
  test: test
};

module.exports = config;
