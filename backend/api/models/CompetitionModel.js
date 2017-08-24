'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CompetitionSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
});

module.exports = mongoose.model('Competition', CompetitionSchema);