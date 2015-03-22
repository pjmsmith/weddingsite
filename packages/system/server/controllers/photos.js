'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  sys = require('sys'),
	Photo = mongoose.model('Photo'),
	_ = require('lodash');


/**
 * Find photo by id
 */
exports.photo = function(req, res, next, id) {
  Photo.load(id, function(err, photo) {
    if (err) return next(err);
    if (!photo) return next(new Error('Failed to load photo ' + id));
    req.photo = photo;
    next();
  });
};

/**
 * Create a photo
 */
exports.create = function(req, res) {
  var photo = new Photo(req.body);

  photo.save(function(err) {
    if (err) {
      sys.puts(sys.inspect(err));
      return res.status(500).json({
        error: 'Cannot save the photo'
      });
    }
    res.json(photo);

  });
};

/**
 * Update a comment
 */
exports.update = function(req, res) {
  var photo = req.photo;

  photo = _.extend(photo, req.body);

  photo.save(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot update the photo'
      });
    }
    res.json(photo);

  });
};

/**
 * Delete a photo
 */
exports.destroy = function(req, res) {
  var photo = req.photo;

  photo.remove(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot delete the photo'
      });
    }
    res.json(photo);

  });
};

/**
 * Show a photo
 */
exports.show = function(req, res) {
  res.json(req.photo);
};

/**
 * List of photos
 */
exports.all = function(req, res) {
  Photo.find().sort('-created').exec(function(err, photos) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot list the photos'
      });
    }
    res.json(photos);

  });
};
