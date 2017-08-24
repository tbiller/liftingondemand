'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LifterSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  appearances: [{ type: Schema.Types.ObjectId, ref: 'Appearance' }]
});

module.exports = mongoose.model('Lifter', LifterSchema);