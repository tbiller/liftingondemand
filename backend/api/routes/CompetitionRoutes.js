'use strict';
module.exports = function(app) {
  var competition = require('../controllers/CompetitionController');

  // competition Routes
  app.route('/competitions')
    .get(competition.list_all_competitions)

  // app.route('/competitions/:competitionId')
  //   .get(competition.get_a_competition)
};