'use strict';
module.exports = function(app) {
  var lifter = require('../controllers/LifterController');

  // competition Routes
  app.route('/lifters')
    .get(lifter.get_all_lifters)

  app.route('/lifter/:lifterId')
    .get(lifter.get_a_lifter)

  app.route('/lifterByParams')
  	.get(lifter.get_a_lifter_by_name_and_yob)
};