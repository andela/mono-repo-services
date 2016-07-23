const grpc = require('grpc');
const rolesProto = grpc.load('mock_servers/fellowship_roles/fellowship_roles.proto');
const models = require('../../models');
const should = require('should');
const logger = require('winston');

const config = require('../../config/config')[process.env.NODE_ENV];
/* eslint-disable new-cap */
const client = new rolesProto.fellowship_roles.micro(config.service,
  grpc.credentials.createInsecure());
  /* eslint-disable new-cap */


describe('Roles Controller Test', () => {
  let sampleRole;

  const mockRole = {
    name: 'Sample role',
    level: 'BOOTCAMP',
    skills: [1, 2, 3, 5],
  };

  const mockRole2 = {
    name: 'Another Sample Role',
    level: 'D2_DEVELOPER',
    skills: [3, 2, 1],
  };

  const mockRole3 = {
    name: 'Yet Sample Role',
    level: 'D1_DEVELOPER',
    skills: [1, 2, 4],
  };

  const listArray = [{
    name: mockRole.name,
    levelId: mockRole.level,
    scoreGuidelineIds: mockRole.skills,
  }, {
    name: mockRole2.name,
    levelId: mockRole2.level,
    scoreGuidelineIds: mockRole2.skills,
  }];

  beforeEach((done) => {
    models.Role.destroy({ where: {} }).then(() => {
      models.Role.bulkCreate(listArray).then(() => models.Role.findAll())
      .then((roles) => {
        sampleRole = roles[0];
        done();
      }).catch((err) => logger.error('Error Creating Role', err));
    });
  });

  describe('create', () => {
    it('should create a role successfully', (done) => {
      client.create(mockRole3, (err, res) => {
        should.not.exist(err);
        should.exist(res);
        res.should.be.an.instanceOf(Object);
        done();
      });
    });
  });

  describe('delete', () => {
    it('should delete a role successfully', (done) => {
      client.delete({ id: sampleRole.id }, (err) => {
        should.not.exist(err);
        done();
      });
    });
  });

  describe('update', () => {
    it('should update a role successfully', (done) => {
      mockRole.name = 'new sample role';
      mockRole.id = sampleRole.id;
      client.update(mockRole, (err, res) => {
        should.not.exist(err);
        should.exist(res);
        done();
      });
    });
  });

  describe('find all', () => {
    it('should fetch all roles', (done) => {
      client.list({}, (err, res) => {
        should.exist(res);
        should.not.exist(err);
        res.roles.length.should.equal(2);
        done();
      });
    });
  });

  describe('find one', () => {
    it('should find one role', (done) => {
      client.get({ id: sampleRole.id }, (err, res) => {
        should.not.exist(err);
        res.id.should.equal(sampleRole.id);
        done();
      });
    });
  });
});
