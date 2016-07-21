'use strict';
var assessment = require('./assessment/server');
var authentication = require('./authentication/server');
var authorization = require('./authorization/server');
var fellowship_roles = require('./fellowship_roles/server');
var placement = require('./placements/server');
var users = require('./users/server');
var settings = require('./settings/server');

assessment.start();
authentication.start();
authorization.start();
fellowship_roles.start();
placement.start();
users.start();
settings.start();
