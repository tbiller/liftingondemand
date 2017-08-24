'use strict';

var express = require('express'),
  app = express(),
  port = process.env.PORT || 3001,
  mongoose = require('mongoose'),
  Competition = require('./api/models/CompetitionModel'),
  Lifter = require('./api/models/LifterModel'),
  Appearance = require('./api/models/AppearanceModel'),
  bodyParser = require('body-parser');
  
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/powerlifting', { useMongoClient: true }); 
// db = mongoose.connection();

// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var competitionRoutes = require('./api/routes/CompetitionRoutes'); //importing route
var lifterRoutes = require('./api/routes/LifterRoutes'); //importing route
var appearanceRoutes = require('./api/routes/AppearanceRoutes'); //importing route
// var competitionRoutes = require('./api/routes/CompetitionRoutes'); //importing route


competitionRoutes(app); //register the route
lifterRoutes(app);
appearanceRoutes(app);

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);


console.log(' RESTful API server started on: ' + port);