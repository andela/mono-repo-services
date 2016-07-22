const assessment = require('./assessment/server');
const authentication = require('./authentication/server');
const authorization = require('./authorization/server');
const fellowshipRoles = require('./fellowship_roles/server');
const placement = require('./placements/server');
const users = require('./users/server');
const settings = require('./settings/server');

assessment.start();
authentication.start();
authorization.start();
fellowshipRoles.start();
placement.start();
users.start();
settings.start();
