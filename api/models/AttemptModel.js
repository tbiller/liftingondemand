'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AttemptInteraction = require('./AttemptInteractionModel')
// var attemptInteraction = mongoose.model('AttemptInteraction');

var AttemptSchema = new Schema({
    _id: Schema.Types.ObjectId,
    _appearance: { type: Schema.Types.ObjectId, ref: 'Appearance' },
    attemptName: String,
    weight: String,
    result: String,
    records: String,
    firstNameFrame: Number,
    lastNameFrame: Number,
    lightsFrame: Number,
    lights: Schema.Types.Mixed,
  	numStars: { type: Number, default: 0 }
});

// AttemptSchema.virtual('stars', {
// 	ref: 'AttemptInteraction',
// 	localField: '_id',
// 	foreignField: 'attempt'
// });

// AttemptSchema.virtual('numStars').get(function() {
// 	console.log('innumstars');
// 	console.log(this._id)
// 	return AttemptInteraction.count({'attempt': this._id}, function(err, count) {
// 			console.log('retusend');
// 			if (err) {
// 				console.log(err);
// 				return 0;
// 			}
// 			console.log(count);
// 			return count;
// 		});
// });

module.exports = mongoose.model('Attempt', AttemptSchema);