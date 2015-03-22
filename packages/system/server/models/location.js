'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Marker Schema
 */
var MarkerSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  lastModified: {
    type: Date
  },
  id: {
    type: Number,
    required: true,
    default: 1
  },
  longitude: {
    type: Number,
    required: true,
    default: -122.410181
  },
  latitude: {
    type: Number,
    required: true,
    default: 37.801360
  },
  showWindow: {
    type: Boolean,
    default: false
  },
  animation: {
    type: Number,
    default: 0
  },
  labelContent: {
    type: String,
    trim: true
  },
  labelAnchor: {
    type: String,
    trim: true
  },
  labelClass: {
    type: String,
    trim: true,
    default: 'marker-labels'
  },
  message: {
    type: String,
    trim: true
  }
});

/**
 * Location Schema
 */
var LocationSchema = new Schema({
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
    unique: true,
    dropDups: true,
    trim: true
  },
  photo: {
    type: String,
    trim: true
  },
  photoClass: {
    type: String,
    trim: true
  },
  longitude: {
    type: Number,
    required: true,
    default: -122.410181
  },
  latitude: {
    type: Number,
    required: true,
    default: 37.801360
  },
  markers: [MarkerSchema],
  details: {
    type: String,
    trim: true
  },
  directions: {
    type: String,
    trim: true
  }
});

/**
 * Validations
 */
MarkerSchema.path('latitude').validate(function(latitude) {
  return !!latitude;
}, 'Latitude cannot be blank');
MarkerSchema.path('longitude').validate(function(longitude) {
  return !!longitude;
}, 'Longitude cannot be blank');

LocationSchema.path('name').validate(function(name) {
  return !!name;
}, 'Name cannot be blank');
LocationSchema.path('latitude').validate(function(latitude) {
  return !!latitude;
}, 'Latitude cannot be blank');
LocationSchema.path('longitude').validate(function(longitude) {
  return !!longitude;
}, 'Longitude cannot be blank');

/**
 * Statics
 */
MarkerSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).exec(cb);
};
LocationSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).exec(cb);
};

mongoose.model('Marker', MarkerSchema);
mongoose.model('Location', LocationSchema);
