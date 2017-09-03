'use strict';
module.exports = function(app) {
  var appearance = require('../controllers/AppearanceController');

  // competition Routes
	 app.route('/appearances')
	    .get(appearance.get_appearances)
 	app.route('/appearanceByParams')
  		.get(appearance.get_an_appearance_by_params)
  // app.route('/'/competitions/:competitionId'/:competitionId')
  //   .get(competition.get_a_competition)
};