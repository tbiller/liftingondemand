'use strict';

var mongoose = require('mongoose'),
  competition = mongoose.model('Competition');

exports.list_all_competitions = function(req, res) {
  competition.find({}, function(err, competition) {
    if (err) res.send(err);
    res.json(competition);
  });
};

// exports.get_a_competition = function(req, res) {
//   competition.findById(req.params.competitionId, function(err, competition) {
//     if (err)
//       res.send(err);
//     res.json(competition);
//   });
// };