// const models = require('../../models');
// const sinon = require('sinon');
// const should = require('chai').Should();
// const Q = require('q');
// const handlers = require('../../event_handlers/locationsHandler');
// const locations = [
//   {
//     id: 1,
//     name: 'Lagos',
//     time_zone: '+2',
//     created_at: '2015',
//     updated_at: '2016',
//   },
//   {
//     id: 2,
//     name: 'Kenya',
//     time_zone: '+4',
//     created_at: '2016',
//     updated_at: '2016',
//   },
// ];
//
//
// describe('Locations Handler test', () => {
//   afterEach(() => {
//     sinon.restore(models.locations, 'create');
//     sinon.restore(models.locations, 'upsert');
//   });
//   describe('LocationCreated: success', () => {
//     beforeEach(function () {
//       sinon.stub(models.locations, 'create', (data) => {
//         const deferred = Q.defer();
//         deferred.resolve({});
//         return deferred.promise;
//       });
//     });
//
//     it('should return correct data', (done) => {
//       handlers.LocationCreated({}, (err, data) => {
//         should.exist(data);
//         data.should.deep.equal({});
//         done();
//       });
//     });
//
//     it('error should not exist', (done) => {
//       handlers.LocationCreated({}, (err, data) => {
//         should.not.exist(err);
//         done();
//       });
//     });
//   });
//
//   describe('LocationCreated: failure', () => {
//     beforeEach(function () {
//       sinon.stub(models.locations, 'create', (data) => {
//         const deferred = Q.defer();
//         deferred.reject(new Error('Error occured'));
//         return deferred.promise;
//       });
//     });
//
//     it('should not return data', (done) => {
//       handlers.LocationCreated({}, (err, data) => {
//         should.not.exist(data);
//         done();
//       });
//     });
//
//     it('error should not exist', (done) => {
//       handlers.LocationCreated({}, (err, data) => {
//         should.exist(err);
//         err.message.should.equal('Error occured');
//         done();
//       });
//     });
//   });
//
//   describe('LocationUpdated: success', () => {
//     beforeEach(function () {
//       sinon.stub(models.locations, 'upsert', (data) => {
//         const deferred = Q.defer();
//         deferred.resolve({});
//         return deferred.promise;
//       });
//     });
//
//     it('should return correct data', (done) => {
//       handlers.LocationUpdated({}, (err, data) => {
//         should.exist(data);
//         data.should.deep.equal({});
//         done();
//       });
//     });
//
//     it('should error should not exist', (done) => {
//       handlers.LocationUpdated({}, (err, data) => {
//         should.not.exist(err);
//         done();
//       });
//     });
//   });
//
//   describe('LocationUpdated: failure', () => {
//     beforeEach(function () {
//       sinon.stub(models.locations, 'upsert', (data) => {
//         const deferred = Q.defer();
//         deferred.reject(new Error('Server Error'));
//         return deferred.promise;
//       });
//     });
//
//     it('should not return data', (done) => {
//       handlers.LocationUpdated({}, (err, data) => {
//         should.not.exist(data);
//         done();
//       });
//     });
//
//     it('should error should not exist', (done) => {
//       handlers.LocationUpdated({}, (err, data) => {
//         should.exist(err);
//         err.message.should.equal('Server Error');
//         done();
//       });
//     });
//   });
//
//   describe('LocationDestroyed: success', () => {
//     beforeEach(function () {
//       sinon.stub(models.locations, 'destroy', (data) => {
//         const deferred = Q.defer();
//         deferred.resolve({});
//         return deferred.promise;
//       });
//     });
//
//     it('should return correct data', (done) => {
//       handlers.LocationDestroyed({ payload: { location_id: 1 } }, (err, data) => {
//         should.exist(data);
//         data.should.deep.equal({});
//         done();
//       });
//     });
//
//     it('should error should not exist', (done) => {
//       handlers.LocationDestroyed({ payload: { location_id: 1 } }, (err, data) => {
//         should.not.exist(err);
//         done();
//       });
//     });
//   });
//
//   describe('LocationDestroyed: failure', () => {
//     beforeEach(function () {
//       sinon.stub(models.locations, 'destroy', (data) => {
//         const deferred = Q.defer();
//         deferred.reject(new Error('Server Error'));
//         return deferred.promise;
//       });
//     });
//
//     it('should not return  data', (done) => {
//       handlers.LocationDestroyed({ payload: { location_id: 1 } }, (err, data) => {
//         should.not.exist(data);
//         done();
//       });
//     });
//
//     it('should error should not exist', (done) => {
//       handlers.LocationDestroyed({ payload: { location_id: 1 } }, (err, data) => {
//         should.exist(err);
//         err.message.should.equal('Server Error');
//         done();
//       });
//     });
//   });
// });
