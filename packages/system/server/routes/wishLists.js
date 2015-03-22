'use strict';

var wishLists = require('../controllers/wishLists');

// WishList authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin) {
    return res.status(401).send('User is not authorized');
  }
  next();
};

module.exports = function(WishLists, app, auth) {

  app.route('/wishLists')
    .get(wishLists.all)
    .post(auth.requiresLogin, wishLists.create);
  app.route('/wishLists/:wishListId')
    .get(auth.isMongoId, wishLists.show)
    .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, wishLists.update)
    .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, wishLists.destroy);

  // Finish with setting up the wishList param
  app.param('wishListId', wishLists.wishList);
};
