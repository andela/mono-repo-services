const models = global.models;
const sinon = require('sinon');
const should = require('chai').Should();
const Q = require('q');
const handlers = require('../../events/handlers');

describe('Locations Handler test', () => {
  describe('LocationCreated: success', () => {
    beforeEach(() => {
      sinon.stub(models.Location, 'create', () => {
        const deferred = Q.defer();
        deferred.resolve({ id: 'some id' });
        return deferred.promise;
      });
    });

    afterEach(() => {
      models.Location.create.restore();
    });

    it('should return correct data', (done) => {
      handlers.createLocation({}, (err, data) => {
        should.exist(data);
        data.should.equal('some id');
        done();
      });
    });

    it('error should not exist', (done) => {
      handlers.createLocation({}, (err) => {
        should.not.exist(err);
        done();
      });
    });
  });

  describe('createLocation: failure', () => {
    beforeEach(() => {
      sinon.stub(models.Location, 'create', () => {
        const deferred = Q.defer();
        deferred.reject(new Error('Error occured'));
        return deferred.promise;
      });
    });

    afterEach(() => {
      models.Location.create.restore();
    });

    it('should not return data', (done) => {
      handlers.createLocation({}, (err, data) => {
        should.not.exist(data);
        done();
      });
    });

    it('error should not exist', (done) => {
      handlers.createLocation({}, (err) => {
        should.exist(err);
        err.message.should.equal('Error occured');
        done();
      });
    });
  });

  describe('updateLocation: success', () => {
    beforeEach(() => {
      sinon.stub(models.Location, 'update', () => {
        const deferred = Q.defer();
        deferred.resolve({ id: 'some id' });
        return deferred.promise;
      });
    });

    afterEach(() => {
      models.Location.update.restore();
    });

    it('should return correct data', (done) => {
      handlers.updateLocation({}, (err, data) => {
        should.exist(data);
        data.should.equal('some id');
        done();
      });
    });

    it('should error should not exist', (done) => {
      handlers.updateLocation({}, (err) => {
        should.not.exist(err);
        done();
      });
    });
  });

  describe('updateLocation: failure', () => {
    beforeEach(() => {
      sinon.stub(models.Location, 'update', () => {
        const deferred = Q.defer();
        deferred.reject(new Error('Server Error'));
        return deferred.promise;
      });
    });

    afterEach(() => {
      models.Location.update.restore();
    });

    it('should not return data', (done) => {
      handlers.updateLocation({}, (err, data) => {
        should.not.exist(data);
        done();
      });
    });

    it('should error should not exist', (done) => {
      handlers.updateLocation({}, (err) => {
        should.exist(err);
        err.message.should.equal('Server Error');
        done();
      });
    });
  });

  describe('deleteLocation: success', () => {
    beforeEach(() => {
      sinon.stub(models.Location, 'destroy', () => {
        const deferred = Q.defer();
        deferred.resolve({});
        return deferred.promise;
      });
    });

    afterEach(() => {
      models.Location.destroy.restore();
    });

    it('should return correct data', (done) => {
      handlers.destroyLocation({ payload: { location_id: 1 } }, (err, data) => {
        should.exist(data);
        data.should.deep.equal({});
        done();
      });
    });

    it('should error should not exist', (done) => {
      handlers.destroyLocation({ payload: { location_id: 1 } }, (err) => {
        should.not.exist(err);
        done();
      });
    });
  });

  describe('deleteLocation: failure', () => {
    beforeEach(() => {
      sinon.stub(models.Location, 'destroy', () => {
        const deferred = Q.defer();
        deferred.reject(new Error('Server Error'));
        return deferred.promise;
      });
    });

    afterEach(() => {
      models.Location.destroy.restore();
    });

    it('should not return  data', (done) => {
      handlers.destroyLocation({ payload: { location_id: 1 } }, (err, data) => {
        should.not.exist(data);
        done();
      });
    });

    it('should error should not exist', (done) => {
      handlers.destroyLocation({ payload: { location_id: 1 } }, (err) => {
        should.exist(err);
        err.message.should.equal('Server Error');
        done();
      });
    });
  });
});
