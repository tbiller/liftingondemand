'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AttemptInteractionSchema = new Schema({
    // _id: Schema.Types.ObjectId,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    target: { type: Schema.Types.ObjectId, ref: 'Attempt' },
    type: String,
    date: { type: Date, default: function() { return new Date() } }
});

module.exports = mongoose.model('AttemptInteraction', AttemptInteractionSchema);