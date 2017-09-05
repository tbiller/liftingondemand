'use strict';

var mongoose = require('mongoose'),
  attempt = mongoose.model('Attempt'),
  attemptInteraction = mongoose.model('AttemptInteraction');

exports.get_attempts_unpopulated = function(req, res) {
	attempt
		.find()
		.exec(function(err, attempts) {
			if (err) return handleError(err, res);
		  	res.json(attempts);
		});
};

exports.star_attempt = function(req, res) {
	var attempt_id = req.params.attempt_id;
	var user_id = req.body.user_id || null;

	if (!attempt_id) {
		res.status(500).send('Attempt id must be submitted')
		return;
	}

	var interactionParams = {
		user: user_id, 
		attempt: attempt_id,
		type: 'star'
	};

	var interaction = new attemptInteraction(interactionParams);

	if (!user_id) {
		attemptInteraction.create(interactionParams, function(err, addedModel) {
			if (err) return handleError(err, res);
			res.send(addedModel);
			return;
		});
	} else {
		attemptInteraction.update(
			interactionParams, 
			{ date: new Date() }, 
			{ upsert: true }, 
			function(err, raw) {
				if (err) return handleError(err, res);
				// console.log('Raw response: ', raw);
				res.send();
				return
			}
		);
	}
	
};

exports.unstar_attempt = function(req, res) {
	var attempt_id = req.params.attempt_id;
	var user_id = req.body.user_id || null;

	if (!attempt_id) {
		res.status(500).send('Attempt id must be submitted')
		return;
	}
	if (!user_id) {
		res.status(500).send('User id must be submitted')
		return;
	}

	var interactionParams = {
		user: user_id, 
		attempt: attempt_id,
		type: 'star'
	};

	attemptInteraction.remove(interactionParams,
		function(err) {
			if (err) return handleError(err, res);
			res.send();
			return
		}
	);
	
};

function handleError(err, res) {
	console.log(err);
	res.send(err);
	return;
}
