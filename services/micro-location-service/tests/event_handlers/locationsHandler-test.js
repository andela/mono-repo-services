const models = global.models;
const sinon = require('sinon');
const should = require('chai').Should();
const Q = require('q');
const handlers = require('../../event_handlers/locationsHandler');

describe('Locations Handler test', () => {
  afterEach(() => {
    sinon.restore(models.Location, 'create');
    sinon.restore(models.Location, 'upsert');
  });
  describe('LocationCreated: success', () => {
    beforeEach(() => {
      sinon.stub(models.Location, 'create', () => {
        const deferred = Q.defer();
        deferred.resolve({ id: 'some id' });
        return deferred.promise;
      });
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

  describe('LocationCreated: failure', () => {
    beforeEach(() => {
      sinon.stub(models.Location, 'create', () => {
        const deferred = Q.defer();
        deferred.reject(new Error('Error occured'));
        return deferred.promise;
      });
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

  describe('LocationUpdated: success', () => {
    beforeEach(() => {
      sinon.stub(models.Location, 'upsert', () => {
        const deferred = Q.defer();
        deferred.resolve({ id: 'some id' });
        return deferred.promise;
      });
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

  describe('LocationUpdated: failure', () => {
    beforeEach(() => {
      sinon.stub(models.Location, 'upsert', () => {
        const deferred = Q.defer();
        deferred.reject(new Error('Server Error'));
        return deferred.promise;
      });
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

  describe('LocationDestroyed: success', () => {
    beforeEach(() => {
      sinon.stub(models.Location, 'destroy', () => {
        const deferred = Q.defer();
        deferred.resolve({});
        return deferred.promise;
      });
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

  describe('LocationDestroyed: failure', () => {
    beforeEach(() => {
      sinon.stub(models.Location, 'destroy', () => {
        const deferred = Q.defer();
        deferred.reject(new Error('Server Error'));
        return deferred.promise;
      });
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
