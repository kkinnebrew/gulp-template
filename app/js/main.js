var _ = require('underscore');
var $ = require('jquery');
var template = require('../templates/welcome.hbs');
window.$('body').append(template({ title: 'Welcome to Gulp!' }));