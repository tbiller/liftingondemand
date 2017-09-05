'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AppearanceSchema = new Schema({
	_id: Schema.Types.ObjectId,
	_lifter: { type: Schema.Types.ObjectId, ref: 'Lifter' },
	_competition: { type: Schema.Types.ObjectId, ref: 'Competition' },
	division: String,
	weightClass: String,
	place: String,
	lot: Number,
	team: String,
	bodyweight: Number,
	wilks: Number,
	total: Schema.Types.Mixed,
	attempts: [{ type: Schema.Types.ObjectId, ref: 'Attempt' }]
});

module.exports = mongoose.model('Appearance', AppearanceSchema);