'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  sys = require('sys'),
	Location = mongoose.model('Location'),
	_ = require('lodash');


/**
 * Find location by id
 */
exports.location = function(req, res, next, id) {
  Location.load(id, function(err, location) {
    if (err) return next(err);
    if (!location) return next(new Error('Failed to load location ' + id));
    req.location = location;
    next();
  });
};

/**
 * Create a location
 */
exports.create = function(req, res) {
  var location = new Location(req.body);

  location.save(function(err) {
    if (err) {
      sys.puts(sys.inspect(err));
      return res.status(500).json({
        error: 'Cannot save the location'
      });
    }
    res.json(location);

  });
};

/**
 * Update a comment
 */
exports.update = function(req, res) {
  var location = req.location;

  location = _.extend(location, req.body);

  location.save(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot update the location'
      });
    }
    res.json(location);

  });
};

/**
 * Delete a location
 */
exports.destroy = function(req, res) {
  var location = req.location;

  location.remove(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot delete the location'
      });
    }
    res.json(location);

  });
};

/**
 * Show a location
 */
exports.show = function(req, res) {
  res.json(req.location);
};

/**
 * List of locations
 */
exports.all = function(req, res) {
  Location.find().sort('-created').exec(function(err, locations) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot list the locations'
      });
    }
    res.json(locations);

  });
};
