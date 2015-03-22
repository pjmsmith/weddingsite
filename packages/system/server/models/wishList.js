'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * WishList Schema
 */
var WishListSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  lastModified: {
  	type: Date
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  logo: {
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
WishListSchema.path('name').validate(function(name) {
  return !!name;
}, 'Name cannot be blank');
WishListSchema.path('url').validate(function(url) {
  return !!url;
}, 'URL cannot be blank');

/**
 * Statics
 */
WishListSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).exec(cb);
};

mongoose.model('WishList', WishListSchema);
