'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AttemptInteractionSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    attempt: { type: Schema.Types.ObjectId, ref: 'Attempt' },
    type: String,
    date: { type: Date, default: function() { return new Date() } }
});

module.exports = mongoose.model('AttemptInteraction', AttemptInteractionSchema);