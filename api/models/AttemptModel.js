'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AttemptInteraction = require('./AttemptInteractionModel')
// var attemptInteraction = mongoose.model('AttemptInteraction');

var AttemptSchema = new Schema({
    _id: Schema.Types.ObjectId,
    _appearance: { type: Schema.Types.ObjectId, ref: 'Appearance' },
    attemptName: String,
    liftName: String,
    attemptNumber: Number,
    weight: String,
    weightValue: Number,
    result: String,
    records: String,
    firstNameTime: Number,
    lastNameTime: Number,
    lightsTime: Number,
    lights: Schema.Types.Mixed,
    division: String,
    weightclass: String,
    style: String,
    edited: {type: Boolean, default: false},
  	numStars: { type: Number, default: 0 }
});

AttemptSchema.index({ liftName: 1});
AttemptSchema.index({ numStars: -1, weightValue: -1 });
AttemptSchema.set('autoIndex', false);
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