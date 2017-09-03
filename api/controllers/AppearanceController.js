'use strict';

var mongoose = require('mongoose'),
  appearance = mongoose.model('Appearance');

exports.get_appearances = function(req, res) {
  var params = {};
  if (req.query._competition) {
    params['_competition'] = req.query._competition;
    console.log(req.query._competition);
  }
  if (req.query.division) {
    params['division'] = req.query.division;
  }
  if (req.query.weightClass) {
    params['weightClass'] = req.query.weightClass.toLowerCase();
    console.log(req.query.weightClass);
  }
  appearance.find(params).populate('_lifter').exec(function(err, appearances) {
    if (err) return res.send(err);
    res.json(appearances);
  });
};

exports.get_an_appearance_by_params = function(req, res) {
  console.log(req.query)
  appearance.find(req.query)
    .exec(function(err, appearances) {
      if (err) {
        console.log(err);
        res.send(err);
        return;
      }
      console.log(appearances);
      res.json(appearances);
    });
};


// exports.get_all_appearances_for_competition = function(req, res) {
//   appearance.find({_competition: req.query.comp_id}).exec(function(err, appearances) {
//     if (err) res.send(err);
//     res.json(appearances);
//   });
// };

