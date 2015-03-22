'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Question Schema
 */
var QuestionSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  lastModified: {
  	type: Date
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    trim: true
  },
  sort: {
    type: Number,
    default: 0
  }
});

/**
 * Validations
 */
QuestionSchema.path('question').validate(function(question) {
  return !!question;
}, 'Question cannot be blank');

/**
 * Statics
 */
QuestionSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).exec(cb);
};

mongoose.model('Question', QuestionSchema);
