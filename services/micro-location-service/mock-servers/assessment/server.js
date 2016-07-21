var grpc = require('grpc');
var env = process.env.NODE_ENV || 'test';
var config = require('../config/config');

var proto = grpc.load(__dirname + '/assessment.proto');
var server = new grpc.Server();

var data = [
  {
    id: 1,
    level: 'D0A_MONTH_ONE',
    score: 3,
    description: "no description",
    skill: {
      name: "first skill"
    }
  },
  {
    id: 2,
    level: 'D0B_SIMULATIONS',
    score: 5,
    description: "no description",
    skill: {
      name: "second skill"
     }
  }
]

function notImplemented(call, callback) {
  callback(null, null);
}
function fetch(call, callback) {
   callback(null, { scoreGuidelines: data });
 }

server.addProtoService(proto.assessment.micro.service, {
  createScoreGuideline: notImplemented,
  updateScoreGuideline: notImplemented,
  getScoreGuideline: notImplemented,
  listScoreGuidelines: notImplemented,
  fetchScoreGuidelines: fetch,

  createSkill: notImplemented,
  updateSkill: notImplemented,
  getSkill: notImplemented,
  listSkills: notImplemented,
  deleteSkill: notImplemented,

  createScore: notImplemented,
  getScore: notImplemented,
  listScores: notImplemented,
  scoreEvaluators: notImplemented

});

server.bind(config.assessment, grpc.ServerCredentials.createInsecure());
module.exports = server
