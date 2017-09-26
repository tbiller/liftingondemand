'use strict';

var express = require('express'),
	path = require('path'),
	app = express(),
	port = process.env.PORT || 3001,
	mongoose = require('mongoose'),
	Competition = require('./api/models/CompetitionModel'),
	Lifter = require('./api/models/LifterModel'),
	Appearance = require('./api/models/AppearanceModel'),
	Attempt = require('./api/models/AttemptModel'),
	AttemptInteraction = require('./api/models/AttemptInteractionModel'),
	bodyParser = require('body-parser');
  
var competitionRoutes = require('./api/routes/CompetitionRoutes');
var lifterRoutes = require('./api/routes/LifterRoutes');
var appearanceRoutes = require('./api/routes/AppearanceRoutes'); 
var attemptRoutes = require('./api/routes/AttemptRoutes'); 

app.use(express.static(path.join(__dirname, './client/build')))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

competitionRoutes(app);
lifterRoutes(app);
appearanceRoutes(app);
attemptRoutes(app);

mongoose.Promise = global.Promise;

// mongoose.connect('mongodb://localhost:27017/powerlifting', { useMongoClient: true }); 
mongoose.connect('mongodb://admintb:EKTtesDH9Eyx@ds161443.mlab.com:61443/powerlifting', { useMongoClient: true }); 

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.join(__dirname, './client/build', 'index.html'));
});

app.listen(port);



console.log(' RESTful API server started on: ' + port);