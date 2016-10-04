const models = require('../../models/');
const should = require('should');

describe('OffsetManager Model', () => {
  let offsetInfo;
  let createOffset;

  beforeEach((done) => {
    offsetInfo = {
      topic: 'sample-topic',
      partition: 1,
      topicOffset: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    models.OffsetManager.destroy({ where: {} }).then(() => {
      createOffset = models.OffsetManager.create(offsetInfo);
      done();
    });
  });

  afterEach((done) => {
    models.OffsetManager.destroy({ where: {} });
    done();
  });

  it('should be able to create an offset if it doesn\'t exist', (done) => {
    createOffset.then((offset) => {
      should.exist(offset);
      should.exist(offset.partition);
      should.exist(offset.topic);
      should.exist(offset.topicOffset);

      done();
    });
  });

  it('should be able to update an offset', (done) => {
    createOffset.then((offset) => {
      offset.topicOffset = 2;
      offset.save().then((savedOffset) => {
        savedOffset.topicOffset.should.not.equal(offsetInfo.topicOffset);
        savedOffset.topicOffset.should.equal(2);
        done();
      });
    });
  });

  it('should be able to find an offset', (done) => {
    createOffset.then((createdOffset) => {
      models.OffsetManager.findOne({
        where: { topic: createdOffset.topic },
      }).then((offset) => {
        should.exist(offset);
        offset.topic.should.equal(createdOffset.topic);
        offset.partition.should.equal(createdOffset.partition);
        offset.topicOffset.should.equal(createdOffset.topicOffset);
        done();
      });
    });
  });

  describe('messageProcessed', () => {
    it('returns true if message offset has been processed', (done) => {
      createOffset.then((offset) => {
        offsetInfo.offset = offset.topicOffset;
        models.messageProcessed(offsetInfo).then((value) => {
          value.should.equal(true);
          done();
        });
      });
    });
    it('returns false if messsage offset is newer', (done) => {
      createOffset.then(() => {
        offsetInfo.offset = 2;
        models.messageProcessed(offsetInfo).then((value) => {
          value.should.equal(false);
          done();
        });
      });
    });
    it('returns false if message offset is not found', (done) => {
      offsetInfo.topic = 'another_topic';
      models.messageProcessed(offsetInfo).then((value) => {
        value.should.equal(false);
        done();
      });
    });
  });
});
