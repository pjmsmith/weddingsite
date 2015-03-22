'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Business Schema
 */
var BusinessSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  lastModified: {
  	type: Date
  },
  businessId: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  instructions: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    trim: true
  },
  sort: {
    type: Number,
    required: true,
    default: 0
  }
});

/**
 * Validations
 */
BusinessSchema.path('businessId').validate(function(businessId) {
  return !!businessId;
}, 'BusinessID cannot be blank');

/**
 * Statics
 */
BusinessSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).exec(cb);
};

mongoose.model('Business', BusinessSchema);
