'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CompetitionSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  style: String,
  options: Schema.Types.Mixed
});

module.exports = mongoose.model('Competition', CompetitionSchema);