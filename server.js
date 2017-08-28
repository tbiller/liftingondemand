'use strict';

var express = require('express'),
	path = require('path'),
	app = express(),
	port = process.env.PORT || 3001,
	mongoose = require('mongoose'),
	Competition = require('./api/models/CompetitionModel'),
	Lifter = require('./api/models/LifterModel'),
	Appearance = require('./api/models/AppearanceModel'),
	bodyParser = require('body-parser');
  
var competitionRoutes = require('./api/routes/CompetitionRoutes');
var lifterRoutes = require('./api/routes/LifterRoutes');
var appearanceRoutes = require('./api/routes/AppearanceRoutes'); 

app.use(express.static(path.join(__dirname, './client/build')))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

competitionRoutes(app);
lifterRoutes(app);
appearanceRoutes(app);

mongoose.Promise = global.Promise;

// mongoose.connect('mongodb://localhost/powerlifting', { useMongoClient: true }); 
mongoose.connect('mongodb://admintb:EKTtesDH9Eyx@ds161443.mlab.com:61443/powerlifting', { useMongoClient: true }); 

app.use((req, res) => {
	console.log(path.join(__dirname, './client/build/index.html'));
	res.sendFile(path.join(__dirname, './client/build/index.html'));
});

app.use(function(req, res) {
	res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);



console.log(' RESTful API server started on: ' + port);