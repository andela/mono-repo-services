var grpc = require('grpc');
var env = process.env.NODE_ENV || 'test';
var config = require('../config/config');


var proto = grpc.load(__dirname + '/settings.proto');
var server = new grpc.Server();
var setting = {
  id: 103,
  userId: 'google:103',
  appName: 'skilltree',
  data: {
    'widget_settings': {
      'overall_progress_widget': {
        'description': 'Overall Progress',
        'value': true
      },
      'progress_widget': {
        'description': 'My Progress',
        'value': true
      },
      'progress_criteria_widget': {
        'description': 'Level Criteria',
        'value': true
      },
      'email_settings': {}
    },
    'fields': {
      'fellow_list_widget': [
        {
          'name': "Name",
          'key': "name",
          'order': 0
        },
        {
          'name': "Level",
          'key': "level.'name'",
          'order': 2
        },
        {
          'name': "Cohort",
          'key': "cohort.'name'",
          'order': 3
        },
        {
          'name': "Location",
          'key': "location.name",
          'order': 4
        },
        {
          'name': "Client",
          'key': "placement.client",
          'order': 7
        }
      ]
    }
  }
};
var mockSettings = [
  {
    id: 100,
    userId: 'google:100',
    appName: 'skilltree',
    data: {
      'widget_settings': {
        'overall_progress_widget': {
          'description': 'Overall Progress',
          'value': true
        },
        'progress_widget': {
          'description': 'My Progress',
          'value': false
        },
        'progress_criteria_widget': {
          'description': 'Level Criteria',
          'value': true
        },
        'email_settings': {}
      }
    }
  }, {
    id: 101,
    userId: 'google:100',
    appName: 'kaizen',
    data: {
      'widget_settings': {
        'widget_one': {
          'description': 'Widget One',
          'value': true
        },
        'widget_two': {
          'description': 'Widget two',
          'value': false
        },
        'widget_three': {
          'description': 'Widget three',
          'value': true
        },
        'email_settings': {}
      }
    }
  }, {
    id: 102,
    userId: 'google:102',
    appName: 'skilltree',
    data: {
      'widget_settings': {
        'overall_progress_widget': {
          'description': 'Overall Progress',
          'value': false
        },
        'progress_widget': {
          'description': 'My Progress',
          'value': true
        },
        'progress_criteria_widget': {
          'description': 'Level Criteria',
          'value': true
        },
        'email_settings': {}
      }
    }
  }];

server.addProtoService(proto.settings.micro.service, {
  list: function (call, callback) {
    callback(null, mockSettings);
  },

  create: function (call, callback) {
    callback(null, {});
  },

  update: function (call, callback) {
    if (call.request.id !== setting.id) {
      return callback(new Error('Setting does not exist'));
    }
    return callback(null, {});
  },

  get: function (call, callback) {
    if (call.request.id !== setting.id) {
      return callback(new Error('Setting does not exist'));
    }
    return callback(null, setting);
  },

  delete: function (call, callback) {
    if (call.request.id !== setting.id) {
      return callback(new Error('Setting does not exist'));
    }
    return callback(null, {});
  }
});

server.bind(config.settings, grpc.ServerCredentials.createInsecure());
module.exports = server;
