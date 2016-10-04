const models = global.models;
const sinon = require('sinon');
const should = require('chai').Should();
const Q = require('q');
const handlers = require('../../events/handlers');

const msgInfo = {
  offset: 1,
  partition: 1,
  topic: 'organisation-topic',
  createdAt: new Date(),
  updatedAt: new Date(),
};

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
      handlers.createLocation({}, msgInfo, (err, data) => {
        should.exist(data);
        data.should.equal('some id');
        done();
      });
    });

    it('error should not exist', (done) => {
      handlers.createLocation({}, msgInfo, (err) => {
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

    it('should not return data', (done) => {
      handlers.createLocation({}, msgInfo, (err, data) => {
        should.not.exist(data);
        done();
      });
    });

    it('error should not exist', (done) => {
      handlers.createLocation({}, msgInfo, (err) => {
        should.exist(err);
        err.message.should.equal('Error occured');
        done();
      });
    });
  });

  describe('updateLocation: success', () => {
    beforeEach(() => {
      sinon.stub(models.Location, 'upsert', () => {
        const deferred = Q.defer();
        deferred.resolve({ id: 'some id' });
        return deferred.promise;
      });
    });

    it('should return correct data', (done) => {
      handlers.updateLocation({}, msgInfo, (err, data) => {
        should.exist(data);
        data.should.equal('some id');
        done();
      });
    });

    it('should error should not exist', (done) => {
      handlers.updateLocation({}, msgInfo, (err) => {
        should.not.exist(err);
        done();
      });
    });
  });

  describe('updateLocation: failure', () => {
    beforeEach(() => {
      sinon.stub(models.Location, 'upsert', () => {
        const deferred = Q.defer();
        deferred.reject(new Error('Server Error'));
        return deferred.promise;
      });
    });

    it('should not return data', (done) => {
      handlers.updateLocation({}, msgInfo, (err, data) => {
        should.not.exist(data);
        done();
      });
    });

    it('should error should not exist', (done) => {
      handlers.updateLocation({}, msgInfo, (err) => {
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

    it('should return correct data', (done) => {
      handlers.destroyLocation({ payload: { location_id: 1 } }, msgInfo, (err, data) => {
        should.exist(data);
        data.should.deep.equal({});
        done();
      });
    });

    it('should error should not exist', (done) => {
      handlers.destroyLocation({ payload: { location_id: 1 } }, msgInfo, (err) => {
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

    it('should not return  data', (done) => {
      handlers.destroyLocation({ payload: { location_id: 1 } }, msgInfo, (err, data) => {
        should.not.exist(data);
        done();
      });
    });

    it('should error should not exist', (done) => {
      handlers.destroyLocation({ payload: { location_id: 1 } }, msgInfo, (err) => {
        should.exist(err);
        err.message.should.equal('Server Error');
        done();
      });
    });
  });
});
