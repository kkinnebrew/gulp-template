var $ = require('jquery');
var _ = require('underscore');

var template = require('../templates/goodbye.html');

var printMessage = require('./message.coffee');

printMessage('Welcome');

$('body').append(template);
