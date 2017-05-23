# Locations Microservice

[![Test Coverage](https://codeclimate.com/repos/57b654f43b66cb7670008610/badges/a7458d3dee1b3a198225/coverage.svg)](https://codeclimate.com/repos/57b654f43b66cb7670008610/coverage) [![Code Climate](https://codeclimate.com/repos/57b654f43b66cb7670008610/badges/a7458d3dee1b3a198225/gpa.svg)](https://codeclimate.com/repos/57b654f43b66cb7670008610/feed) [![Issue Count](https://codeclimate.com/repos/57b654f43b66cb7670008610/badges/a7458d3dee1b3a198225/issue_count.svg)](https://codeclimate.com/repos/57b654f43b66cb7670008610/feed)

Location service manages information on Andela fellows centers. Currently Andela is present in two countries i.e Kenya and Nigeria. Functionalities provided by this service are:
* Create a location
* View details of locations
* Update location's details
* Remove a location

Locations service is written in Node.js and thus implements the following directory layout:

|  Folder/File |  Content Description |
|---|---|
|  controllers/ | Backend controllers i.e functions that process and respond to events   |
|  db/     | Database migration scripts  |
|  events/   |  Events setup and event handlers |
|  models/  |  Backend database models (uses Sequelize ORM)  |
|  server/ |  Map controller methods to grpc endpoints |
|  shared/ | Contain all shared protobuf definition and mock servers  |
|  index.js | Entry point to the application |
| database.js| Database configurations i.e environment variables

More details on the form and design choices of this micro-service can be found at [wiki here](https://github.com/andela/micro-node-starter-kit/wiki)

### Protocol buffers documentation

Details on location API definition can be found in the protocol buffers documentation [here](./proto_doc.md).
Protocol buffers simply provide a way to define the structure of data sent and received within  inter-services communications. More information on protocol buffers and their importance can be found [here](https://developers.google.com/protocol-buffers/docs/overview)

### Endpoints exposed at the API gateway
Locations endpoints exposed on the gateway hold the following resources:   

| Endpoint  | Resource  |
|---|---|
| https://api-staging.andela.com/api/v1/locations  | Details of all locations and their ratings  |
|  https://api-staging.andela.com/api/v1/locations/overviews |  Details of number of fellows for all locations |
|  https://api-staging.andela.com/api/v1/:id/details | Details of number of fellows per location | |

Documentation on this service endpoints can be found in [locations-endpoints](http://products.andela.com/micro-api-docs/#locations-skilltree-service)


***

## Getting Started
Install the following packages to be able to run location service

* [Node.js](https://nodejs.org/en/download/)
* [PostgreSQL](http://www.postgresql.org/download/macosx/)

Upon cloning of the repository [here](https://github.com/andela/micro-location-service):

 * Change directory to the repository  run `cd micro-location-service`.

All services' protocol buffers files are contained in the shared submodule folder.
To sync the submodule (`/shared`) run:
```
git submodule update --init
```


### Setup your database
Once PostgreSQL is installed:
- Open psql - PostgreSQL interactive terminal by running `$ psql`
- Create a Database User
  `CREATE USER postgres WITH PASSWORD 'password';`
- Create a dotenv file (.env) and add DATABASE_URL variable
   `'DATABASE_URL='postgres://postgres:password@localhost:5432/locations` where:
  ```
  postgres - Postgres database
  postgres - Database User username
  password - User password
  localhost - Host
  5432 - Port
  locations - Database name
  ```
  To know your Postgres account users and their roles run `\du`
- Create a Dev Database
   run `CREATE DATABASE locations;`

### Running tests
  - Create the database
    - Run `psql` to initialize postgres.
    you can change the database name  from database.js file.
    - Add the following service urls in your .env file:  
    ```
    SERVICE_URL='0.0.0.0:50062'
    LEVELS_SERVICE_URL='0.0.0.0:50055'
    USERS_SERVICE_URL='0.0.0.0:50051'
    ```
    - Run `npm install` to install location dependencies.
  - Run the command `make test` to run the tests.

### Launch The App

Andela Systems architecture uses [Kafka](http://kafka.apache.org/) as the message broker. Kafka is simply a middleman between Andela services in terms of getting data from one service to another. A service publishes an event and other services can be able to subscribe to that event if they are dependent on it. To do this

- Initiate Kafka & Zookeeper
  - run `make kafka_install` to install kafka.
  - run `make kafka_start` to start kafka.
  - run `make kafka_create` to create `locations-topic` topic on kafka to which records are published. Other services are able to subscribe to this topic.
- Run `npm start` to start the app.

***

## Creating new endpoints
Andela Systems architecture implements [CQRS](https://medium.com/technology-learning/event-sourcing-and-cqrs-a-look-at-kafka-e0c1b90d17d8#.ansu5rx8v). Based on this the READ and WRITE operations use different models. We are separating the READ and WRITE concerns whereby for READ operations i.e getting data directly from the database is handled normally whereas for WRITE operations which involve changing the state of data, we employ use of kafka as an eventstore.
The messages and their data types that we are going to use are clearly defined in the [Protocol buffers documentation](./proto_doc.md)

### Read Operation endpoint  
We'll use `get all locations details` operation to map to an endpoint for demonstration purposes  
  * Create a proto definition for the endpoint   
    To do this navigate  to shared/location/location-svc.proto file
    ```
    rpc List(Empty) returns (Locations) {}
    ```

    `List` is the endpoint and `Locations` is the returned message type of an array containing the `Location` details. `List` doesn't take any arguments therefore the message is `Empty`.

    ```
    message Locations{
      repeated Location values = 1;
    }

    ```

    `Location` message type shows details of each location expected to be returned.

    ```
    message Location {
      string id = 1;
      string name = 2;
      string time_zone = 3;
      string created_at = 4;
      string updated_at = 5;
      string auditor_id = 6;
      string auditor_name = 7;
    }
    ```

* Create a function in locations controllers that will return list of all locations.  
  - Go to `controllers/locations_controller.js`. In our case we have the `index` method.  
  - Navigate to `server/index.js` to map the `List` endpoint to the `index` method.

### Writing tests for the method
We need to create tests for the `index` controller.
Navigate to `tests/controllers/locations_test.js` to  define our tests.
To mock the functional behaviour of models, producer and grpc we have used [sinon](http://sinonjs.org/docs/#stubs)
For example to implement test for listing all locations
```
sinon.stub(models.Location, 'findAll', () => {
  const deferred = Q.defer();
  deferred.resolve(locations);
  return deferred.promise;
});
```
This returns locations object.
To assert that locations object is returned when `index` method is called, create a test case and call `index` method as shown below.

```
it('should return locations data', (done) => {
  controller.index({}, (err, loc) => {
    should.exist(loc);
    loc[0].name.should.equal('Lagos');
    done();
  });
});
```
Note that we are restoring the models, producer and grpc functionalities in the `afterEach` hook.

### Write Operation endpoint
We'll use `create location` operation to map to an endpoint for demonstration purposes.  
* The first two steps of the Read operation apply with only minor modifications  

  ```
  rpc Create(Location) returns (Empty) {}
  ```

  `Create` is the endpoint, `Location`  is the required parameter when creating a new location and no data is returned once location is created thus Empty.

  ```
  message Location {
    string id = 1;
    string name = 2;
    string time_zone = 3;
    string created_at = 4;
    string updated_at = 5;
    string auditor_id = 6;
    string auditor_name = 7;
  }
  ```

  In this case we will use `create` function to map it to the `Create` endpoint. Within that function we can perform validations before emitting the model to kafka.
  Navigate to `events/handlers` file to create `createLocation(` event handler.  
  An event handler is able to:  

  ```
  Consume events   
  Process events   
  Apply resulting  updates on the read store(postgres)
  ```

* In the events folder go to `register.js` file to register this event.

### Writing tests for the methods
The procedure is the same as for Read operation for controller tests but we also have to write tests for event handlers for this Write operation.  
Go to `tests/events/handlers_test.js` to write the event handler test.
An event handler takes in a payload and messageInfo. In this case the payload is an empty object. In reality this should not be empty but since we want to focus on the behaviour of the event handler we have set part of the payload in the beforeEach hook. This is what is sent when create location request is made. msgInfo contains the event details. Other services depending on locations  service can subscribe to this event by subscribing to `locations-topic`.

```
const msgInfo = {
  offset: 1,
  partition: 1,
  topic: 'organisation-topic',
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

Finally write the test case to assert that expected data is returned.

```
it('should return correct data', (done) => {
  handlers.createLocation({}, msgInfo, (err, data) => {
    should.exist(data);
    data.should.equal('some id');
    done();
  });
});
```
