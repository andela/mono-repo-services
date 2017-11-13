# Location Service

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

### Development Environment Setup
- Please refer to the [development toolkit](https://github.com/andela/development-toolkit)

### Microservices

Services micro-location-service depends on include:
* [micro-api-gateway](https://github.com/andela/micro-api-gateway)
* [micro-user-service](https://github.com/andela/micro-user-service)
* [micro-authorization-service](https://github.com/andela/micro-authorization-service)
* [micro-level-service](https://github.com/andela/micro-level-service)

## Testing
- Run the command `make test` to run the tests.

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
