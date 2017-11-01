const should = require('chai').should();
const sinon = require('sinon');
const Q = require('q');
const grpc = require('grpc');
const controller = require('../../controllers/locations_controller');
const producer = require('andela-pubsub').producer;

const metadata = new grpc.Metadata();

const models = global.models;
const locations = [
  {
    id: '-KPE-AopjdUJrbOELUuk',
    name: 'Lagos',
    timeZone: '+2',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '-KPE-IC7p2-CpGKnmUni',
    name: 'Kenya',
    timeZone: '+4',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('Locations controllers', () => {
  describe('List all Locations: Success', () => {
    beforeEach(() => {
      sinon.stub(models.Location, 'findAll', () => Promise.resolve(locations));
    });

    afterEach(() => {
      models.Location.findAll.restore();
    });

    it('should not return error', (done) => {
      controller.index({ metadata }, (err) => {
        should.not.exist(err);
        done();
      });
    });

    it('should return locations data', (done) => {
      controller.index({ metadata }, (err, loc) => {
        should.exist(loc);
        const data = loc.values;
        data[0].name.should.equal('Lagos');
        done();
      });
    });

    it('should contain correct data count', (done) => {
      controller.index({ metadata }, (err, result) => {
        result.values.length.should.equal(2);
        done();
      });
    });
  });

  describe('List all Locations: failure', () => {
    beforeEach(() => {
      sinon.stub(models.Location, 'findAll', () => Promise.reject(new Error('Something happened')));
    });

    afterEach(() => {
      models.Location.findAll.restore();
    });

    it('should contain correct error message', (done) => {
      controller.index({ metadata }, (err, result) => {
        should.not.exist(result);
        err.message.should.equal('Something happened');
        done();
      });
    });
  });

  describe('Get a Location: success', () => {
    const call = { metadata, request: { id: '-KPE-AopjdUJrbOELUuk' } };
    beforeEach(() => {
      sinon.stub(models.Location, 'findById', () => Promise.resolve(locations[0]));
    });

    afterEach(() => {
      models.Location.findById.restore();
    });

    it('should not return error', (done) => {
      controller.show(call, (err) => {
        should.not.exist(err);
        done();
      });
    });

    it('should return data', (done) => {
      controller.show(call, (err, location) => {
        should.exist(location);
        location.name.should.equal('Lagos');
        done();
      });
    });

    it('should contain correct data', (done) => {
      controller.show(call, (err, result) => {
        result.id.should.equal('-KPE-AopjdUJrbOELUuk');
        done();
      });
    });
  });

  describe('Get a user: failure', () => {
    const call = { metadata, request: { id: 1 } };
    beforeEach(() => {
      const err = new Error('there was a problem');
      sinon.stub(models.Location, 'findById', () => Promise.reject(err));
    });

    afterEach(() => {
      models.Location.findById.restore();
    });

    it('should return error', (done) => {
      controller.show(call, (err) => {
        should.exist(err);
        err.message.should.equal('there was a problem');
        done();
      });
    });

    it('should not return data', (done) => {
      controller.show(call, (err, result) => {
        should.not.exist(result);
        done();
      });
    });
  });

  describe('Location not found', () => {
    const call = { metadata, request: { id: '-KPE-AopjdUJrbOELUuk' } };
    beforeEach(() => {
      sinon.stub(models.Location, 'findById', () => {
        const deferred = Q.defer();
        deferred.resolve(null);
        return deferred.promise;
      });
    });

    afterEach(() => {
      models.Location.findById.restore();
    });

    it('should return error', (done) => {
      controller.show(call, (err) => {
        should.exist(err);
        err.message.should.equal('location not found');
        done();
      });
    });

    it('should not return data', (done) => {
      controller.show(call, (err, result) => {
        should.not.exist(result);
        done();
      });
    });

    it('should correct error message', (done) => {
      controller.show(call, (err) => {
        err.message.should.equal('location not found');
        done();
      });
    });
  });

  describe('Update success', () => {
    const call = { metadata, request: {} };
    beforeEach(() => {
      sinon.stub(models.Location, 'findById', () => Promise.resolve(locations[0]));
      sinon.stub(producer, 'emit', (data, location, cb) => {
        cb(null, {});
      });
    });

    afterEach(() => {
      models.Location.findById.restore();
      producer.emit.restore();
    });

    it('should not return error', (done) => {
      controller.update(call, (err) => {
        should.not.exist(err);
        done();
      });
    });

    it('should  return data', (done) => {
      controller.show(call, (err, result) => {
        should.exist(result);
        result.name.should.equal('Lagos');
        done();
      });
    });
  });

  describe('Update failure', () => {
    const call = { metadata, request: {} };
    beforeEach(() => {
      sinon.stub(models.Location, 'findById', () => Promise.reject(new Error('Error Occured')));
      sinon.stub(producer, 'emit', (model, data, location, cb) => {
        cb(null, {});
      });
    });

    afterEach(() => {
      models.Location.findById.restore();
      producer.emit.restore();
    });

    it('should return error', (done) => {
      controller.update(call, (err, result) => {
        should.exist(err);
        should.not.exist(result);
        err.message.should.equal('Error Occured');
        done();
      });
    });
  });

  describe('Create', () => {
    const call = { metadata, request: { name: 'Nigeria' } };
    beforeEach(() => {
      sinon.stub(models.Location, 'findById', () => Promise.resolve(locations[0]));
      sinon.stub(models.Location, 'create', () => Promise.resolve());
      sinon.stub(producer, 'emit', (data, location, cb) => {
        cb(null, {});
      });
    });

    afterEach(() => {
      models.Location.findById.restore();
      models.Location.create.restore();
      producer.emit.restore();
    });

    it('should return data', (done) => {
      controller.create(call, (err, result) => {
        should.not.exist(err);
        should.exist(result);
        result.should.deep.equal({});
        done();
      });
    });
  });

  describe('Destroy: Success', () => {
    const call = { metadata, request: {} };
    beforeEach(() => {
      sinon.stub(models.Location, 'findById', () => Promise.resolve(locations[0]));
      sinon.stub(producer, 'emit', (data, location, cb) => {
        cb(null, {});
      });
    });

    afterEach(() => {
      models.Location.findById.restore();
      producer.emit.restore();
    });

    it('should return data', (done) => {
      controller.destroy(call, (err, result) => {
        should.not.exist(err);
        should.exist(result);
        result.should.deep.equal({});
        done();
      });
    });
  });

  describe('Destroy: Failure', () => {
    const call = { metadata, request: {} };
    beforeEach(() => {
      sinon.stub(models.Location, 'findById', () => Promise.reject(new Error('Error occured')));
      sinon.stub(producer, 'emit', (data, location, cb) => {
        cb(null, {});
      });
    });

    afterEach(() => {
      models.Location.findById.restore();
      producer.emit.restore();
    });

    it('should return error', (done) => {
      controller.destroy(call, (err, result) => {
        should.exist(err);
        should.not.exist(result);
        err.message.should.equal('Error occured');
        done();
      });
    });
  });

  describe('All details', () => {
    beforeEach(() => {
      sinon.stub(models.Location, 'findAll', () => Promise.resolve(locations));
    });

    afterEach(() => {
      models.Location.findAll.restore();
    });

    it('should return the correct data', (done) => {
      controller.allLocationsDetails({ metadata }, (err, result) => {
        const data = result.values;
        data.length.should.equal(2);
        data[0].title.should.equal('Lagos');
        data[0].count.should.equal(35);
        done();
      });
    });
  });

  describe('getLocationDetails', () => {
    beforeEach(() => {
      sinon.stub(models.Location, 'findById', () => Promise.resolve(locations[0]));
    });

    afterEach(() => {
      models.Location.findById.restore();
    });

    it('should return correct count of data', (done) => {
      controller.getLocationDetails({ request: { id: '-KPE-AopjdUJrbOELUuk' }, metadata },
      (err, data) => {
        data.values.length.should.equal(2);
        data.values[0].name.should.equal('D0B-SIMULATIONS');
        data.values[0].count.should.equal(13);
        done();
      });
    });
  });
});
