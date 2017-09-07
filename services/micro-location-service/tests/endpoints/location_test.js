const should = require('chai').should();
const grpc = require('grpc');
const models = global.models;
const root = require('path').join(__dirname, '..', '..', 'shared');
const proto = grpc.load(
  { root, file: 'location/location-svc.proto' },
  'proto',
  { convertFieldsToCamelCase: true }
);
/* eslint-disable new-cap */
const client = new proto.location.LocationService(process.env.SERVICE_URL,
  grpc.credentials.createInsecure());
/* eslint-enable new-cap */
const locations = [
  {
    id: '-KPE-AopjdUJrbOELUuk',
    name: 'Lagos',
    timeZone: '+2',
    createdAt: '2017-09-06T20:45:26.743Z',
    updatedAt: '2017-09-06T20:45:26.743Z',
    auditorId: '',
    auditorName: '',
  },
  {
    id: '-KPE-IC7p2-CpGKnmUni',
    name: 'Kenya',
    timeZone: '+4',
    createdAt: '2017-09-06T20:45:26.743Z',
    updatedAt: '2017-09-06T20:45:26.743Z',
    auditorId: '',
    auditorName: '',
  },
];

describe('endpoints', () => {
  beforeEach((done) => {
    models.Location.bulkCreate(locations).then(() => {
      done();
    });
  });

  afterEach((done) => {
    models.Location.destroy({ where: {} }).then(() => {
      done();
    });
  });

  describe('#list', () => {
    it('should return a list of all locations', (done) => {
      client.list({}, (err, result) => {
        should.not.exist(err);
        const data = result.values;
        data.length.should.equal(2);
        data[0].name.should.equal(locations[0].name);
        data[1].name.should.equal(locations[1].name);
        data.should.be.an.instanceOf(Array);
        done();
      });
    });
  });

  describe('#get', () => {
    const payload = { id: locations[0].id };

    it('should return a single location', (done) => {
      client.get(payload, (err, data) => {
        should.not.exist(err);
        data.id.should.equal(locations[0].id);
        data.name.should.equal(locations[0].name);
        data.timeZone.should.equal(locations[0].timeZone);
        data.createdAt.should.equal(locations[0].createdAt);
        data.updatedAt.should.equal(locations[0].updatedAt);
        data.auditorId.should.equal(locations[0].auditorId);
        data.auditorName.should.equal(locations[0].auditorName);
        done();
      });
    });
  });

  describe('#update', () => {
    it('emit LocationUpdatedEvent', (done) => {
      const payload = Object.assign({}, locations[0]);
      payload.timeZone = '+3';
      delete payload.createdAt;
      delete payload.updatedAt;
      client.update(payload, (err, data) => {
        should.not.exist(err);
        should.exist(data);
        data.should.be.an.instanceOf(Object);
        done();
      });
    });
  });

  describe('#create', () => {
    it('emit LocationCreatedEvent', (done) => {
      const payload = Object.assign({}, locations[0]);
      delete payload.createdAt;
      delete payload.updatedAt;

      client.create(payload, (err, data) => {
        should.not.exist(err);
        should.exist(data);
        data.should.be.an.instanceOf(Object);
        done();
      });
    });
  });

  describe('#delete', () => {
    const payload = { id: locations[0].id };
    it('emit LocationDeletedEvent', (done) => {
      client.delete(payload, (err, data) => {
        should.not.exist(err);
        should.exist(data);
        data.should.be.an.instanceOf(Object);
        done();
      });
    });
  });

  describe('#getAllLocationsDetails', () => {
    it('should return the correct data', (done) => {
      client.getAllLocationsDetails({}, (err, result) => {
        const data = result.values;
        should.not.exist(err);
        should.exist(data);
        data.length.should.equal(2);
        data[0].title.should.equal('Lagos');
        data[0].count.should.equal(35);
        data[1].title.should.equal('Kenya');
        data[1].count.should.equal(123);
        done();
      });
    });
  });

  describe('#getLocationDetails', () => {
    it('should return correct count of data', (done) => {
      const payload = { id: locations[0].id };
      client.getLocationDetails(payload, (err, data) => {
        should.not.exist(err);
        should.exist(data);
        data.values.length.should.equal(2);
        data.values[0].id.should.equal('d0-a-trainee');
        data.values[0].name.should.equal('D0B-SIMULATIONS');
        data.values[0].count.should.equal(13);
        data.values[1].id.should.equal('d1-jr-consultant');
        data.values[1].name.should.equal('D1-Developer');
        data.values[1].count.should.equal(22);
        done();
      });
    });
  });
});
