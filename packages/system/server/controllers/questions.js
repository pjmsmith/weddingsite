'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  sys = require('sys'),
	Question = mongoose.model('Question'),
	_ = require('lodash');


/**
 * Find question by id
 */
exports.question = function(req, res, next, id) {
  Question.load(id, function(err, question) {
    if (err) return next(err);
    if (!question) return next(new Error('Failed to load question ' + id));
    req.question = question;
    next();
  });
};

/**
 * Create a question
 */
exports.create = function(req, res) {
  var question = new Question(req.body);

  question.save(function(err) {
    if (err) {
      sys.puts(sys.inspect(err));
      return res.status(500).json({
        error: 'Cannot save the question'
      });
    }
    res.json(question);

  });
};

/**
 * Update a comment
 */
exports.update = function(req, res) {
  var question = req.question;

  question = _.extend(question, req.body);

  question.save(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot update the question'
      });
    }
    res.json(question);

  });
};

/**
 * Delete a question
 */
exports.destroy = function(req, res) {
  var question = req.question;

  question.remove(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot delete the question'
      });
    }
    res.json(question);

  });
};

/**
 * Show a question
 */
exports.show = function(req, res) {
  res.json(req.question);
};

/**
 * List of questions
 */
exports.all = function(req, res) {
  Question.find().sort('-created').exec(function(err, questions) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot list the questions'
      });
    }
    res.json(questions);

  });
};
