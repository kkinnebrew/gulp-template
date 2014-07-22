var app = require('./gulp/server');

app.set('port', process.env.PORT || 4000);
app.listen(app.get('port'), function() {
	console.log('Server listening on port %s ...', app.get('port'));
});
