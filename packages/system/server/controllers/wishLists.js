'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	WishList = mongoose.model('WishList'),
	_ = require('lodash');


/**
 * Find wishList by id
 */
exports.wishList = function(req, res, next, id) {
  WishList.load(id, function(err, wishList) {
    if (err) return next(err);
    if (!wishList) return next(new Error('Failed to load wishList ' + id));
    req.wishList = wishList;
    next();
  });
};

/**
 * Create a wishList
 */
exports.create = function(req, res) {
  var wishList = new WishList(req.body);

  wishList.save(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot save the wishList'
      });
    }
    res.json(wishList);

  });
};

/**
 * Update a comment
 */
exports.update = function(req, res) {
  var wishList = req.wishList;

  wishList = _.extend(wishList, req.body);

  wishList.save(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot update the wishList'
      });
    }
    res.json(wishList);

  });
};

/**
 * Delete a wishList
 */
exports.destroy = function(req, res) {
  var wishList = req.wishList;

  wishList.remove(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot delete the wishList'
      });
    }
    res.json(wishList);

  });
};

/**
 * Show a wishList
 */
exports.show = function(req, res) {
  res.json(req.wishList);
};

/**
 * List of wishLists
 */
exports.all = function(req, res) {
  WishList.find().sort('-created').exec(function(err, wishLists) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot list the wishLists'
      });
    }
    res.json(wishLists);

  });
};
