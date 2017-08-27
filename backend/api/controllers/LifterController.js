'use strict';

var mongoose = require('mongoose'),
  lifter = mongoose.model('Lifter');

exports.get_all_lifters = function(req, res) {
  lifter.find({}).exec(function(err, lifters) {
    if (err) res.send(err);
    res.json(lifters);
  });
};

exports.get_a_lifter = function(req, res) {
	lifter.findById(req.params.lifterId).populate(
		{
		  	path: 'appearances',
		  	populate: {
		  		path: '_competition'
		  	}
		}).exec(function(err, lifter) {
			console.log(req.params.lifterId);
			console.log(err);
			if (err) {
				res.send(err);
				return;
			}
			res.json(lifter);
	  	});
};

// exports.get_a_competition = function(req, res) {
//   competition.findById(req.params.competitionId, function(err, competition) {
//     if (err)
//       res.send(err);
//     res.json(competition);
//   });
// };