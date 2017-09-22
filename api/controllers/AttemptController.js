'use strict';

var mongoose = require('mongoose'),
  attempt = mongoose.model('Attempt'),
  utils = require('../utils/Utils');


exports.get_attempts_unpopulated = function(req, res) {
	attempt
		.find()
		.lean()
		.exec(function(err, attempts) {
			if (err) return handleError(err, res);
		  	res.json(attempts);
		});
};

exports.top_attempts = function(req, res) {
	var numAttempts = req.query.num || 20;
	console.log(req.query);
	var lifterPopulate = {
		path: '_appearance',
		populate: {
			path: '_lifter',
			select: 'name'
		},
	};

	var competitionPopulate = {
		path: '_appearance',
		populate: {
			path: '_competition',
			select: 'name dateForSorting style'
		},
	};

	// if (req.query.style) {
	// 	competitionPopulate.populate['match'] = {style: utils.toTitleCase(req.query.style)};
	// }

	// if (req.query.division) {
	// 	lifterPopulate['match'] = {division: req.query.division.toLowerCase()};
	// 	competitionPopulate['match'] = {division: req.query.division.toLowerCase()};
	// }


	// console.log(lifterPopulate)
	var query = attempt.find().lean()
		
		.sort({numStars: -1, weightValue: -1})
		.limit(numAttempts)
		.or([{'numStars': {$gt: 0}}, {'result': 'good-lift'}])
		.populate(lifterPopulate)
		.populate(competitionPopulate)

	if (req.query.lift) {
		query.where('liftName').eq(req.query.lift);
	}
	if (req.query.division) {
		query.where('division').eq(req.query.division.toLowerCase());
	}
	if (req.query.weightclass) {
		query.where('weightclass').eq(req.query.weightclass);
	}
	if (req.query.style) {
		query.where('style').eq(req.query.style);
	}

	query.exec(function(err, attempts) {
		if (err) return handleError(err, res);
	  	res.json(attempts);
	});
}

exports.star_attempt = function(req, res) {
	changeStar(1, req, res);
}

exports.unstar_attempt = function(req, res) {
	changeStar(-1, req, res);
}


function changeStar(num, req, res) {
	var attempt_id = req.params.attempt_id;
	var user_id = req.body.user_id || null;

	if (!attempt_id) {
		res.send('Attempt id must be submitted')
		return;
	}



	attempt.findById(attempt_id, function(err, attempt) {
		if (err) return res.send('Attempt not recognized')
		attempt.set('numStars', Math.max(0, +attempt.numStars + +num));
		attempt.save();
		console.log(attempt.numStars);
		return res.send();
	})
} 

// exports.star_attempt = function(req, res) {
// 	var attempt_id = req.params.attempt_id;
// 	var user_id = req.body.user_id || null;

// 	if (!attempt_id) {
// 		res.status(500).send('Attempt id must be submitted')
// 		return;
// 	}

// 	var interactionParams = {
// 		user: user_id, 
// 		attempt: attempt_id,
// 		type: 'star'
// 	};

// 	var interaction = new attemptInteraction(interactionParams);

// 	if (!user_id) {
// 		attemptInteraction.create(interactionParams, function(err, addedModel) {
// 			if (err) return handleError(err, res);
// 			res.send(addedModel);
// 			return;
// 		});
// 	} else {
// 		attemptInteraction.update(
// 			interactionParams, 
// 			{ date: new Date() }, 
// 			{ upsert: true }, 
// 			function(err, raw) {
// 				if (err) return handleError(err, res);
// 				// console.log('Raw response: ', raw);
// 				res.send();
// 				return
// 			}
// 		);
// 	}
	
// };

// exports.unstar_attempt = function(req, res) {
// 	var attempt_id = req.params.attempt_id;
// 	var user_id = req.body.user_id || null;

// 	if (!attempt_id) {
// 		res.status(500).send('Attempt id must be submitted')
// 		return;
// 	}
// 	if (!user_id) {
// 		res.status(500).send('User id must be submitted')
// 		return;
// 	}

// 	var interactionParams = {
// 		user: user_id, 
// 		attempt: attempt_id,
// 		type: 'star'
// 	};

// 	attemptInteraction.remove(interactionParams,
// 		function(err) {
// 			if (err) return handleError(err, res);
// 			res.send();
// 			return
// 		}
// 	);
	
// };


function handleError(err, res) {
	console.log(err);
	res.send(err);
	return;
}
