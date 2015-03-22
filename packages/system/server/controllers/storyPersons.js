'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	StoryPerson = mongoose.model('StoryPerson'),
	_ = require('lodash');


/**
 * Find storyPerson by id
 */
exports.storyPerson = function(req, res, next, id) {
  StoryPerson.load(id, function(err, storyPerson) {
    if (err) return next(err);
    if (!storyPerson) return next(new Error('Failed to load storyPerson ' + id));
    req.storyPerson = storyPerson;
    next();
  });
};

/**
 * Create a storyPerson
 */
exports.create = function(req, res) {
  var storyPerson = new StoryPerson(req.body);

  storyPerson.save(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot save the storyPerson'
      });
    }
    res.json(storyPerson);

  });
};

/**
 * Update a comment
 */
exports.update = function(req, res) {
  var storyPerson = req.storyPerson;

  storyPerson = _.extend(storyPerson, req.body);

  storyPerson.save(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot update the storyPerson'
      });
    }
    res.json(storyPerson);

  });
};

/**
 * Delete a storyPerson
 */
exports.destroy = function(req, res) {
  var storyPerson = req.storyPerson;

  storyPerson.remove(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot delete the storyPerson'
      });
    }
    res.json(storyPerson);

  });
};

/**
 * Show a storyPerson
 */
exports.show = function(req, res) {
  res.json(req.storyPerson);
};

/**
 * List of storyPersons
 */
exports.all = function(req, res) {
  StoryPerson.find().sort('-created').exec(function(err, storyPersons) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot list the storyPersons'
      });
    }
    res.json(storyPersons);

  });
};
