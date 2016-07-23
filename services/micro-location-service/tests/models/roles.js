const models = require('../../models/');
const should = require('should');

describe('roles model tests', () => {
  let mockRole;

  beforeEach((done) => {
    mockRole = {
      name: 'Senior Consultant',
      levelId: 'D0A',
      scoreGuidelineIds: [1, 2, 3, 4, 5],
    };
    models.Role.destroy({ where: {} }).then(() => done());
  });

  it('should create a role in the database', (done) => {
    models.Role.create(mockRole).then((role) => {
      should.exist(role);
      role.scoreGuidelineIds.should.deepEqual([1, 2, 3, 4, 5]);
      role.name.should.equal(mockRole.name);
      role.levelId.should.equal(mockRole.levelId);
      done();
    });
  });

  it('should delete a role in the database', (done) => {
    models.Role.create(mockRole).then((role) => {
      role.destroy().then(() => {
        models.Role.findOne({
          where: {
            id: role.id,
          },
        }).then((foundRole) => {
          should.not.exist(foundRole);
          done();
        });
      });
    });
  });

  it('should update a role in the database', (done) => {
    const newRole = {
      name: 'Architect',
      levelId: 'DOB',
      scoreGuidelineIds: [6, 7, 8],
    };

    models.Role.create(mockRole).then((fetchedRole) => {
      const role = fetchedRole;
      role.name = newRole.name;
      role.levelId = newRole.levelId;
      role.scoreGuidelineIds = newRole.scoreGuidelineIds;

      role.save().then((updatedRole) => {
        should.exist(updatedRole);
        updatedRole.scoreGuidelineIds.should.deepEqual([6, 7, 8]);
        updatedRole.name.should.equal(role.name);
        updatedRole.levelId.should.equal(role.levelId);
        done();
      });
    });
  });

  it('should find a role in the database', (done) => {
    models.Role.create(mockRole).then((role) => {
      models.Role.findOne({
        where: {
          id: role.id,
        },
      }).then((foundRole) => {
        foundRole.name.should.equal(mockRole.name);
        foundRole.levelId.should.equal(mockRole.levelId);
        done();
      });
    });
  });
});
