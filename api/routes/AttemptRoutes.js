'use strict';
module.exports = function(app) {
  	var attempt = require('../controllers/AttemptController');
  	// app.route()
 	app.route('/api/attempts_unpopulated')
  		.get(attempt.get_attempts_unpopulated);
  	app.route('/api/attempt/:attempt_id/star')
  		.post(attempt.star_attempt);
  	app.route('/api/attempt/:attempt_id/unstar')
  		.post(attempt.unstar_attempt);

  	// app.route('/attempt/:attempt_id/edit')
  	// 	.post(attempt.edit_attempt);

  	app.route('/api/attempts/top')
  		.get(attempt.top_attempts);


};