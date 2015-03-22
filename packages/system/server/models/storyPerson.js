'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * StoryPerson Schema
 */
var StoryPersonSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  lastModified: {
  	type: Date
  },
  group: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  story: {
    type: String,
    required: false,
    trim: true
  },
  photo: {
    type: String,
    required: false,
    trim: true
  },
  photoClass: {
    type: String,
    required: false,
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
StoryPersonSchema.path('name').validate(function(name) {
  return !!name;
}, 'Name cannot be blank');
StoryPersonSchema.path('group').validate(function(group) {
  return !!group;
}, 'group cannot be blank');
StoryPersonSchema.path('role').validate(function(role) {
  return !!role;
}, 'Role cannot be blank');

/**
 * Statics
 */
StoryPersonSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).exec(cb);
};

mongoose.model('StoryPerson', StoryPersonSchema);
