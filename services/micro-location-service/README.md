# Locations Microservice

[![Test Coverage](https://codeclimate.com/repos/57b654f43b66cb7670008610/badges/a7458d3dee1b3a198225/coverage.svg)](https://codeclimate.com/repos/57b654f43b66cb7670008610/coverage) [![Code Climate](https://codeclimate.com/repos/57b654f43b66cb7670008610/badges/a7458d3dee1b3a198225/gpa.svg)](https://codeclimate.com/repos/57b654f43b66cb7670008610/feed) [![Issue Count](https://codeclimate.com/repos/57b654f43b66cb7670008610/badges/a7458d3dee1b3a198225/issue_count.svg)](https://codeclimate.com/repos/57b654f43b66cb7670008610/feed)

## Description
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

## Documentation
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

Documentation on this service endpoints can be found in [Andela API Documentation](https://docs.andela.com/)


***
## Setup
### Requirements / Dependencies
Install the following packages to be able to run location service

* [Node.js](https://nodejs.org/en/download/)
* [Npm](https://www.npmjs.com/)
* [PostgreSQL](https://www.postgresql.org/)

### Getting Started
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

## Testing
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

## Run The Service
### Launch The App

  Andela Systems architecture uses [Google pub/sub](https://cloud.google.com/pubsub/) as a messaging service. Cloud Pub/Sub is a fully-managed real-time messaging service that allows you to send and receive messages between independent applications. You can leverage Cloud Pub/Sub’s flexibility to decouple systems and components hosted on Google Cloud Platform or elsewhere on the Internet.

  Initiate pub/sub emulator locally
  - run `gcloud beta emulators pubsub start` and follow the steps.
  
  To launch the app:
  - Run `npm run start_dev` to start the app.
  ***

### Running the Application Locally via Docker Compose
Ensure you have at least version 1.13.1 of Docker. Install the latest version from [here](https://www.docker.com/products/overview)

- Please refer to [development toolkit](https://github.com/andela/development-toolkit) to use the new development environment setup

*OR*

- **TLDR;** For the first time, run
    
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

## Microservices

Services micro-location-service depends on include:
* [micro-api-gateway](https://github.com/andela/micro-api-gateway)
* [micro-user-service](https://github.com/andela/micro-user-service)
* [micro-authorization-service](https://github.com/andela/micro-authorization-service)
* [micro-level-service](https://github.com/andela/micro-level-service)

## Contribute

Bug reports and pull requests are welcome. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [engineering playbook conventions](https://github.com/andela/engineering-playbook/wiki/Conventions).

To contribute:
* Clone this repository
* Create and checkout to the contribution branch
* Make your contribution and push the branch
* Raise a pull request to develop and assign appropriate [Technology](https://github.com/orgs/andela/teams/technology/teams) team member as a reviewer
* Ask the repo owner to merge once all checks have passed

## Deployment

- Pull Requests to `develop` branch are deployed to staging environment
- Pull Requests to `master` branch are deployed to production environment