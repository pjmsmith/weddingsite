'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	GuestbookComment = mongoose.model('Comment'),
	_ = require('lodash');


/**
 * Find comment by id
 */
exports.comment = function(req, res, next, id) {
  GuestbookComment.load(id, function(err, comment) {
    if (err) return next(err);
    if (!comment) return next(new Error('Failed to load comment ' + id));
    req.comment = comment;
    next();
  });
};

/**
 * Create a comment
 */
exports.create = function(req, res) {
  var comment = new GuestbookComment(req.body);
  comment.user = req.user;

  comment.save(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot save the comment'
      });
    }
    res.json(comment);

  });
};

/**
 * Update a comment
 */
exports.update = function(req, res) {
  var comment = req.comment;

  comment = _.extend(comment, req.body);

  comment.save(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot update the comment'
      });
    }
    res.json(comment);

  });
};

/**
 * Delete a comment
 */
exports.destroy = function(req, res) {
  var comment = req.comment;

  comment.remove(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot delete the comment'
      });
    }
    res.json(comment);

  });
};

/**
 * Show a comment
 */
exports.show = function(req, res) {
  res.json(req.comment);
};

/**
 * List of Comments
 */
exports.all = function(req, res) {
  GuestbookComment.find().sort('-created').populate('user', 'name username').exec(function(err, comments) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot list the comments'
      });
    }
    res.json(comments);

  });
};
