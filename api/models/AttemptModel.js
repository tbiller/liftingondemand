'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
    lights: Schema.Types.Mixed
});

module.exports = mongoose.model('Attempt', AttemptSchema);