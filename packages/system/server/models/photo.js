'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Photo Schema
 */
var PhotoSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  lastModified: {
  	type: Date
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  caption: {
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
PhotoSchema.path('url').validate(function(url) {
  return !!url;
}, 'URL cannot be blank');

/**
 * Statics
 */
PhotoSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).exec(cb);
};

mongoose.model('Photo', PhotoSchema);
