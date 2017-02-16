const should = require('chai').should();
const grpc = require('grpc');
const models = global.models;
const proto = grpc.load(
  'shared/location/location.proto',
  'proto',
  { convertFieldsToCamelCase: true }
);
/* eslint-disable new-cap */
const client = new proto.location.micro(process.env.SERVICE_URL,
  grpc.credentials.createInsecure());
/* eslint-enable new-cap */
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
        done();
      });
    });
  });

  describe('#get', () => {
    const payload = { id: locations[0].id };

    it('should return a single location', (done) => {
      client.get(payload, (err, data) => {
        should.not.exist(err);
        data.name.should.equal(locations[0].name);
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
        done();
      });
    });
  });

  describe('#getAllLocationsDetails', () => {
    it('should return the correct data', (done) => {
      client.getAllLocationsDetails({}, (err, result) => {
        const data = result.values;
        data.length.should.equal(2);
        data[0].title.should.equal('Lagos');
        data[0].count.should.equal(35);
        done();
      });
    });
  });

  describe('#getLocationDetails', () => {
    it('should return correct count of data', (done) => {
      const payload = { id: locations[0].id };
      client.getLocationDetails(payload, (err, data) => {
        data.values.length.should.equal(2);
        data.values[0].name.should.equal('D0B-SIMULATIONS');
        data.values[0].count.should.equal(13);
        done();
      });
    });
  });
});
