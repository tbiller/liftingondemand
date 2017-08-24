'use strict';
module.exports = function(app) {
  var lifter = require('../controllers/LifterController');

  // competition Routes
  app.route('/lifters')
    .get(lifter.get_all_lifters)

  // app.route('/competitions/:competitionId')
  //   .get(competition.get_a_competition)
};