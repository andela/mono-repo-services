const models = require('../../models/');
const should = require('should');

describe('Location Model', () => {
  let mockLocation;
  let createLocation;
  beforeEach((done) => {
    mockLocation = {
      id: 1,
      name: 'Brazil',
    };

    models.Location.destroy({ where: {} }).then(() => {
      createLocation = models.Location.create(mockLocation);
      done();
    });
  });

  afterEach((done) => {
    models.Location.destroy({ where: {} }).then(() => {
      done();
    });
  });

  it('should create a location', (done) => {
    createLocation.then((location) => {
      should.exist(location);
      location.name.should.equal(mockLocation.name);
      done();
    });
  });

  it('should be able to find a location', (done) => {
    createLocation.then((createdLocation) => {
      models.Location.findOne({
        where: {
          id: createdLocation.id,
        },
      }).then((location) => {
        should.exist(location);
        location.id.should.equal(createdLocation.id);
        done();
      });
    });
  });

  it('should be able to update a location', (done) => {
    createLocation.then((location) => {
      const newName = 'New Test Location';
      location.name = newName;
      location.save().then((newLocation) => {
        should.exist(newLocation);
        newLocation.name.should.not.equal(mockLocation.name);
        newLocation.name.should.equal(newName);
        done();
      });
    });
  });

  it('should be able to delete a location', (done) => {
    createLocation.then((location) => {
      location.destroy().then(() => {
        models.Location.findOne({
          where: {
            id: location.id,
          },
        }).then((newLocation) => {
          should.not.exist(newLocation);
          done();
        });
      });
    });
  });
});
