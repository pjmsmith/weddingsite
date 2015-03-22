'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  sys = require('sys'),
	Business = mongoose.model('Business'),
	_ = require('lodash');


/**
 * Find business by id
 */
exports.business = function(req, res, next, id) {
  Business.load(id, function(err, business) {
    if (err) return next(err);
    if (!business) return next(new Error('Failed to load business ' + id));
    req.business = business;
    next();
  });
};

/**
 * Create a business
 */
exports.create = function(req, res) {
  var business = new Business(req.body);

  business.save(function(err) {
    if (err) {
      sys.puts(sys.inspect(err));
      return res.status(500).json({
        error: 'Cannot save the business'
      });
    }
    res.json(business);

  });
};

/**
 * Update a comment
 */
exports.update = function(req, res) {
  var business = req.business;

  business = _.extend(business, req.body);

  business.save(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot update the business'
      });
    }
    res.json(business);

  });
};

/**
 * Delete a business
 */
exports.destroy = function(req, res) {
  var business = req.business;

  business.remove(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot delete the business'
      });
    }
    res.json(business);

  });
};

/**
 * Show a business
 */
exports.show = function(req, res) {
  res.json(req.business);
};

/**
 * List of businesses
 */
exports.all = function(req, res) {
  Business.find().sort('-created').exec(function(err, businesses) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot list the businesses'
      });
    }
    res.json(businesses);

  });
};
