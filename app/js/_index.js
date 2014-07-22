var $ = require('jquery');
var template = require('../templates/welcome.hbs');

var html = template({ title: 'Welcome To Gulp' });

$(document).ready(function() {
	$('body').html(html);
});