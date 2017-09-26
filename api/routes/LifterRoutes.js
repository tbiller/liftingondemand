'use strict';
module.exports = function(app) {
  var lifter = require('../controllers/LifterController');

  // competition Routes
  app.route('/api/lifters')
    .get(lifter.get_all_lifters)

  app.route('/api/lifter/:lifterId')
    .get(lifter.get_a_lifter)

  app.route('/api/lifterByParams')
  	.get(lifter.get_a_lifter_by_name_and_yob)
};