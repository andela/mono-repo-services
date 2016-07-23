const models = require('../../models');
const should = require('should');
const logger = require('winston');
const handlers = require('../../event_handlers/fellowship_role');

describe('Roles Event Handlers Test', () => {
  let sampleRole;

  const mockRole = {
    name: 'Sample role',
    level: 'BOOTCAMP',
    skills: [1, 2, 3, 5],
    created_at: '2015-01-01T18:52:44.4+01:00',
  };

  const mockRole2 = {
    name: 'Another Sample Role',
    level: 'D2_DEVELOPER',
    skills: [3, 2, 1],
    created_at: '2015-01-01T18:52:44.4+01:00',
  };

  const mockRole3 = {
    name: 'Yet Sample Role',
    level: 'D1_DEVELOPER',
    skills: [1, 2, 4],
    created_at: '2015-01-01T18:52:44.4+01:00',
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
      handlers.createRole(mockRole3, (err, res) => {
        should.not.exist(err);
        should.exist(res);
        done();
      });
    });

    it('should respond with error', (done) => {
      handlers.createRole({ invalid: 'invalid' }, (err) => {
        should.exist(err);
        done();
      });
    });
  });

  describe('delete', () => {
    it('should delete a role successfully', (done) => {
      handlers.deleteRole({ id: sampleRole.id }, (err, res) => {
        should.not.exist(err);
        should.exist(res);
        models.Role.findOne({
          where: {
            id: sampleRole.id,
          },
        }).then((_role) => {
          should.not.exist(_role);
          done();
        });
      });
    });

    it('should not delete skill that is not in database', (done) => {
      handlers.deleteRole({ id: 123244 }, (err) => {
        should.exist(err);
        done();
      });
    });
  });

  describe('update', () => {
    it('should update a role successfully', (done) => {
      mockRole.name = 'new sample role';
      mockRole.id = sampleRole.id;
      handlers.updateRole(mockRole, (err, res) => {
        should.not.exist(err);
        should.exist(res);
        models.Role.findOne({
          where: {
            id: mockRole.id,
          },
        }).then((_role) => {
          _role.name.should.be.exactly(mockRole.name);
          done();
        });
      });
    });

    it('should not edit skill that is not in database', (done) => {
      handlers.updateRole({ id: 123244 }, (err) => {
        should.exist(err);
        done();
      });
    });
  });
});
