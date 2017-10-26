'use strict';

var mongoose = require('mongoose'),
  appearance = mongoose.model('Appearance');

exports.get_appearances_unpopulated = function(req, res) {
	appearance
		.find()
		.exec(function(err, appearances) {
			if (err) {
				console.log(err);
				res.send(err);
				return;
			}
			res.json(appearances);
		});
}

exports.get_appearances = function(req, res) {
	var params = {};
	if (req.query._competition) {
		params['_competition'] = req.query._competition;
		console.log(req.query._competition);
	}
	if (req.query.division) {
		params['divisions'] = req.query.division.toLowerCase();
	}
	if (req.query.weightClass) {
		params['weightClass'] = req.query.weightClass.toLowerCase();
		console.log(req.query.weightClass);
	}
	if (req.query.videoId) {
		params['videoId'] = req.query.videoId;
		console.log('videoId', req.query.videoId);
	}

	console.log(params)

	appearance
		.find(params)
		.populate('_lifter')
		.populate('attempts')
		.exec(function(err, appearances) {
			if (err) {
				console.log(err);
				res.send(err);
				return;
			}
			res.json(appearances);
		});
};

exports.get_an_appearance_by_params = function(req, res) {
	console.log(req.query)
	appearance.find(req.query)
		.exec(function(err, appearances) {
			if (err) {
				console.log(err);
				res.send(err);
				return;
			}
			console.log(appearances)
			// console.log(appearances);
			res.json(appearances);
		});
};


// exports.get_all_appearances_for_competition = function(req, res) {
//   appearance.find({_competition: req.query.comp_id}).exec(function(err, appearances) {
//     if (err) res.send(err);
//     res.json(appearances);
//   });
// };

