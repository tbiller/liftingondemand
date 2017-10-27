'use strict';

var mongoose = require('mongoose'),
  lifter = mongoose.model('Lifter');

exports.get_all_lifters = function(req, res) {
	lifter.find({})
	.populate({
		path: 'appearances',
		select: 'weightClass _competition',
		populate: {
			path: '_competition',
			select: 'options.weightClassSuffix',
		}
	})
	.lean()
	.exec(function(err, lifters) {
		if (err)  {
			console.log(err);
			res.send(err);
			return;
		}
		res.json(lifters);
	});
};

exports.get_a_lifter = function(req, res) {
	lifter.findById(req.params.lifterId).populate({
		  	path: 'appearances',
		  	populate: {
		  		path: '_competition',
		  		select: 'name dates dateForSorting'
		  	}
		}).populate({
			path: 'appearances',
		  	populate: {
		  		path: 'attempts',
		  	}
		})
		.lean()
		.exec(function(err, lifter) {
			console.log(req.params.lifterId);
			console.log(err);
			if (err) {
				res.send(err);
				return;
			}
			res.json(lifter);
	  	});
};

exports.get_a_lifter_by_name_and_yob = function(req, res) {
	lifter.find({'yob': req.query.yob}).findByName(req.query.name)
		.exec(function(err, lifters) {
			if (err) {
				console.log(err);
				res.send(err);
				return;
			}
			res.json(lifters);
	  	});
};
// exports.get_a_competition = function(req, res) {
//   competition.findById(req.params.competitionId, function(err, competition) {
//     if (err)
//       res.send(err);
//     res.json(competition);
//   });
// };