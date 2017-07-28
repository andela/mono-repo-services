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
Or run
```
make shared
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

  Andela Systems architecture uses [Google pub/sub](https://cloud.google.com/pubsub/) as a messaging service. Cloud Pub/Sub is a fully-managed real-time messaging service that allows you to send and receive messages between independent applications. You can leverage Cloud Pub/Sub’s flexibility to decouple systems and components hosted on Google Cloud Platform or elsewhere on the Internet.

  - Initiate pub/sub emulator locally
    - run `gcloud beta emulators pubsub start` and follow the steps.
  ***

### Running the Application Locally via Docker Compose
Ensure you have at least version 1.13.1 of Docker. Install the latest version from [here](https://www.docker.com/products/overview)
**TLDR;** For the first time, run
```
make bootstrap
```

Generate the docker-compose.yml file by running:

```
make gen_compose
```

Copy docker-compose.override.yml.sample to docker-compose.override.yml by running:
```
cp docker-compose.override.yml.sample docker-compose.override.yml
```

The generation of the docker-compose is done using a Python package called `envtpl`. If you do not have it already, install it with:

```bash
pip install envtpl
```

Map `localhost` to `api-dev.andela.com` by adding a new line in your `etc/hosts` file with:

```
127.0.0.1 api-dev.andela.com
```
You will need superuser permissions to do that.

After the docker-compose file has been generated, run the application with:

```
make compose
```
This will start and run all dependent containers.

>`make compose` task first runs `gcloud docker -a` which gives Docker temporary access to our
private registry. **NOTE**: for this first command to succeed you have to be authenticated
by running  `gcloud auth`. Next up will be `docker-compose pull --ignore-pull-failures`
that pulls the latest images of the dependent services followed by `docker-compose up -d postgres kafka`
that starts up kafka and postgres. Finally we have `docker-compose up -d api-gateway` that starts up
the api-gateway.



Start up the location service by running:
```
docker-compose up -d location-svc
```

View the location service logs by running:
```
docker-compose logs -f location-svc
```

#### Stopping Docker Compose

Stop a running instance of micro-location-service with:
```
docker-compose stop location-svc
```

To stop all running containers, run:
```
docker-compose down -v
```

### Updating Docker Compose Files
> Never update docker-compose.yml file directly since it's generated. Modify
micro-shared/compose/docker-compose.yml.jinja instead and regenerate using `make gen_compose`.
To add more dependent MS, simply modify the gen_compose make task in the Makefile and regenerate docker-compose.yml file. To override docker-compose configuration, simple add needed changes to docker-compose.override.yml file. Note that this file is git ignored. You can modify it anyway you want to suit your taste. Docker-compose uses both files by default.

***

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

  In this case we will use `create` function to map it to the `Create` endpoint. Within that function we can perform validations before emitting the model to pub/sub.
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
