'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LifterSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  yob: String,
  appearances: [{ type: Schema.Types.ObjectId, ref: 'Appearance' }]
});

LifterSchema.query.findByName = function(name, cb) {
  return this.find({ name: new RegExp(name, 'i') }, cb);
};

module.exports = mongoose.model('Lifter', LifterSchema);