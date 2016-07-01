# Starter Kit for Microservice (Node)
This repo is a boilerplate that gets you started on how to develop microservices in NodeJs.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Microservice Configurations](#microservice-configurations)
- [Kafka Producer](#kafka-producer)
- [Event Handlers](#event-handlers)
- [Setting up and Initializing the GRPC Server Object](#setting-up-and-intializing-the-grpc-server-object)
- [Run Microservice](#run-microservice)
- [Helpful Resources](#helpful-resources)

Prerequisites
--------------
- [Node](https://nodejs.org/)
- [Postgres](https://www.postgresql.org/)
- [Npm](https://www.npmjs.com/)

Getting Started
-----------------
#### Via Cloning the Repository:
```
# Get the Project
git clone https://github.com/andela/micro-node-starter-kit.git

# Change git remote url
git remote set origin <url-to-your-git-repo>

# Change Directory
cd micro-node-starter-kit

# Install Dependencies
npm install
```

Project Structure
-------------------
| Name                                  | Description                                         |
| --------------------------------------|-----------------------------------------------------|
| **config**/config.js                  |Configuration file for microservice                  |
| **controllers**/sample_controller.js  |Boilerplate for controllers                          |
| **event_handlers**/index.js           |Init file for the event handlers & Kafka Consumer    |
| **event_handlers**/register_events.js |Register any created event handlers                  |
| **event_handlers**/sampleHandler.js   |Boilerplate for event handlers                       |
| **models**/index.js                   |Initializes Sequelize connection to the database     |
| **models**/sample_model.js            |Boilerplate for models                               |
| **proto**/sample.proto                |Boilerplate for proto files                          |
| **server**/index.js                   |Setups grpc server and exports it                    |
| Dockerfile                            |Config file to dockerize application                 |
| index.js                              |Application Entry point                              |
| kafka_producer.js                     |Producer function that broadcasts events to broker   |
| test                                  |Test Directory                                       |

Microservice Configurations
----------------------------
Microservice configurations are stored in the `config.js` file located in the `config` directory. Configurations for the are specified for the following environments
- Development
- Test
- Production

#### Config Options
| Name                | Description                                         |
|---------------------|-----------------------------------------------------|
| database Url        | Database url connection string                      |
| service             | host address and port the microservice would run on |
| kafkaConnection     | connection string to kafka message broker           |

Kafka Producer
---------------
Every transaction that occurs (e.g creating, updating or deleting of a resource) in the microservice should produce an event that is sent to the message broker, this ensures that are microservice is event-driven. The Kafka producer module handles the production and transmitting of events to the message broker.

The Kafka producer is located in the `kafka_producer.js` file.
##### Customizing Kafka Producer
The only customization to be made in the `kafka_producer.js` file is to assign a `topic_name` and a `producer_id` to the `topicName` and `producerId` variables respectively. That's all, you are good to go.
```js
  var producerId = '{producer_id}';
  var topicName = '{topic_name}';
  var env = process.env.NODE_ENV || 'development';
  var config = require('./config/config')[env];
```
#### KAKFA_ADDR
The `KAFKA_ADDR` is an environment variable that holds the connection string for the message broker. When this environment variable is set it is used in place of the default kafka connection string.
**note:** setting the kafka connection string in production and circleCI testing should be done via environment variables.

Event Handlers
------------------------
The microservice subscribes to events that have been broadcasted to the message broker and it also implements event handlers that processes these subscribed events. The modules that handles all these transactions are located in the `event_handlers` directory.

**event_handlers**/index.js
```js
var strategyName = '{strategy_name}';
var subscriptions = ['{topic_one_name}', '{topic_two_name}', '{topic_three_name}'];
var Kafka = require('no-kafka');
var Promise = require('bluebird');
var logger = require('winston');
...

var dataHandler = function (messageSet, topic, partition) {
  return Promise.each(messageSet, function (m) {
    var request = JSON.parse(m.message.value.toString('utf8'));
    var handler = handlers[request.event_type];
    if (handler) {
      handler(request.payload, function (err, data) {
        if (err) {
          logger.error(err.message)
        }else {
          logger.info("Emitted ", request.event_type, " Data: ", data)
        }
      });
    }
    return consumer.commitOffset({
      topic: topic,
      partition: partition,
      offset: m.offset,
      metadata: 'optional'
    });
  });
};

var strategies = [{
  strategy: strategyName,
  subscriptions: subscriptions,
  handler: dataHandler
}];

module.exports = {
  consumer: consumer,
  strategies: strategies
};
```
The module above initializes the kafka consumer that tracks events in the message broker that has been subscribed to and triggers the necessary event handler that handles the corresponding event when they occur.

##### Customization
The only modifications necessary is to assign a unique `strategy_name` to the `strategyName` variable and an array of topics to the `subscriptions` variable

**event_handlers**/sample_handler.js
```js
'use strict';

var models = require('../models');
var logger = require('winston');
var data;

var extractData = function (payload) {
  // extract and parse data from payload object
};

var processData = function (data) {
  // process data and return result
};

module.exports = {
  sampleEvent: function (payload, cb) {
    // extract data from payload and process, then pass response back in callback
    data = extractData(payload);
    processData(data).then(function (result) {
      logger.info(result);
      cb(null, result);
    }).catch(function (err) {
      logger.error(err);
      cb(err);
    });
  },
};
```
The module above is a template for implementing your own event handlers

**event_handlers**/register_events.js
```js
/**
 * Register all event handlers here
 */

var sampleHandler = require('./sampleHandler');

module.exports = function(handlers) {
  handlers['sampleEvent'] = sampleHandler.sampleEvent;
}
```
All event handlers created must be registered in the `register_events` module above before they can be used.

Setting up and Initializing the GRPC Server Object
--------------------------------------------------
**server**/index.js
```js
var grpc = require('grpc');
var proto = grpc.load('proto/sample.proto');
var server = new grpc.Server();

var env = process.env.NODE_ENV || 'development';
var config = require('../config/config')[env];

var sampleController = require('../controllers/sample_controller');

// setup microservice endpoints and controller functions that processes requests to those endpoints
server.addProtoService(proto.authorization.AuthorizationService.service, {
  createSampleResource: sampleController.create,
  updateSampleResource: sampleController.update,
  deleteSampleResource: sampleController.delete,
  findSampleResource: sampleController.find,
  listSampleResource: sampleController.list,
});

// initialize server
server.bind(config.service, grpc.ServerCredentials.createInsecure());

module.exports = server
```
The setting up and intializing of the GRPC server occurs in the `**server**/index.js` file and this happens in 3 stages:
- Loading the interface defintions of the microservice from the proto files.
```
  var proto = grpc.load('proto/sample.proto');
```
- Setup Proto service and map controller functions to the service endpoints.
```
server.addProtoService(proto.authorization.AuthorizationService.service, {
  createSampleResource: sampleController.create,
  updateSampleResource: sampleController.update,
  deleteSampleResource: sampleController.delete,
  findSampleResource: sampleController.find,
  listSampleResource: sampleController.list,
});
```

- Bind host and port to the server object and export
```
server.bind(config.service, grpc.ServerCredentials.createInsecure());
```
Run Microservice
------------------
cd into project directory and run `npm start` or `node index.js`

Helpful Resources
-------------------
#### Microservices
- [Introduction to Microservices](https://www.nginx.com/blog/introduction-to-microservices/)
- [Migrating from a Monolith to a Microservices Architecture](https://medium.com/@briceicle/migrating-from-a-monolith-to-a-microservices-architecture-99cecf8af366)
- [Building Out an Antifragile Microservice Architecture @ Andela — Design Consideration](https://medium.com/@ikem/building-out-antifragile-microservice-andela-design-consideration-d6e03a185d6a#.nozg0ksq1)
- [Building Scalable Applications Using Event Sourcing and CQRS](https://medium.com/@ikem/event-sourcing-and-cqrs-a-look-at-kafka-e0c1b90d17d8#.6zg1q7iuu)
- [Antifragile Software by Russ Miles](https://drive.google.com/open?id=0B1C3woZnW_mZcUw4TWV0UEZRdGM)
- [Serverless Architecture by Obie Fernandez](https://drive.google.com/open?id=0B1C3woZnW_mZVDJsQjY0WVd5TTA)
- [Best Online Resource on Microservices](https://www.nginx.com/blog/introduction-to-microservices/)

#### gRPC
- [gRPC Website](http://www.grpc.io/)
- [gRPC Github Organisation](https://github.com/grpc/grpc)
- [Building a gRPC service with Node.js](https://io2015codelabs.appspot.com/codelabs/gRPC#1)
- [gRPC: The Story of Microservices at Square](http://apigee.com/about/resources/webcasts/grpc-story-microservices-square)

#### Protocol Buffers
- [Protocol Buffers Website](https://developers.google.com/protocol-buffers/)
- [5 Reasons to Use Protocol Buffers](http://blog.codeclimate.com/blog/2014/06/05/choose-protocol-buffers/)
- [Schema evolution in Avro, Protocol Buffers and Thrift](https://martin.kleppmann.com/2012/12/05/schema-evolution-in-avro-protocol-buffers-thrift.html)

#### Kafka
- [Kafka Design](http://kafka.apache.org/documentation.html#design)
- [Using Kafka and a Samza-like node.js architecture](https://gist.github.com/KyleAMathews/a5c30ef8afef565b8d22)
- [The Log: What every software engineer should know about real-time data's unifying abstraction](https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying)
- [Turning the database inside-out with Apache Samza](http://www.confluent.io/blog/turning-the-database-inside-out-with-apache-samza/)

#### Zipkin
- [Zipkin Website](http://zipkin.io/)
- [Zipkin Github Repo](https://github.com/openzipkin/zipkin)
- [Epic Talk on Distributed Tracing](https://www.youtube.com/watch?v=f9J1Av8rwCE)
- [Distributed Tracing From Application To Database](http://thelastpickle.com/blog/2015/12/07/using-zipkin-for-full-stack-tracing-including-cassandra.html)

#### Deployment
- [Google Offers “Containers as a Service” To Define Kubernetes’ Place in the Cloud Economy](http://thenewstack.io/google-offers-container-as-a-service-to-define-kubernetes-place-in-the-cloud-economy/)
- [Container as a Service - 101](http://cloudtweaks.com/2016/03/containers-as-a-service-101/)
- [Goodbye, SaaS — hello, Containers-as-a-Service](http://venturebeat.com/2015/05/09/goodbye-saas-hello-containers-as-a-service/)
- [An Introduction To Kubernetes](https://www.digitalocean.com/community/tutorials/an-introduction-to-kubernetes)
- [All you need to know about Kubernetes](http://kubernetes.io/docs/)
- [Talk about gRPC, Containers and Kubernetes](https://www.youtube.com/watch?v=UOIJNygDNlE)
- [Another talk about gRPC, Containers and Kubernetes](https://www.youtube.com/watch?v=BZ-uR8LQRkA)
