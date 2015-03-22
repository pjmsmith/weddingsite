'use strict';

var photos = require('../controllers/photos');

// FAQ authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin) {
    return res.status(401).send('User is not authorized');
  }
  next();
};

module.exports = function(Photos, app, auth) {

  app.route('/photos')
    .get(photos.all)
    .post(auth.requiresLogin, photos.create);
  app.route('/photos/:photoId')
    .get(auth.isMongoId, photos.show)
    .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, photos.update)
    .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, photos.destroy);

  // Finish with setting up the photoId param
  app.param('photoId', photos.photo);
};
