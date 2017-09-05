'use strict';

var mongoose = require('mongoose'),
  attempt = mongoose.model('Attempt'),
  attemptInteraction = mongoose.model('AttemptInteraction');

exports.get_attempts_unpopulated = function(req, res) {
	attempt
		.find()
		.exec(function(err, attempts) {
			if (err) {
				console.log(err);
				res.send(err);
				return;
			}
		  	res.json(attempts);
		});
};

exports.star_attempt = function(req, res) {
	var attempt_id = req.params.attempt_id;
	var user_id = req.body.user_id || null;

	if (!attempt_id) {
		res.status(404).send('Attempt id must be submitted')
		return;
	}

	if (!user_id) {
		attemptInteraction.create({
			user: null, 
			attempt_id: attempt_id,
			type: 'star'
		}, function(err, addedModel) {
			if (err) {
				console.log(err);
				res.send(err);
				return;
			}
			res.send(addedModel);
			return;
		});
	}
	
};


