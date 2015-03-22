'use strict';

var comments = require('../controllers/comments');

// Comment authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && req.comment.user.id !== req.user.id) {
    return res.status(401).send('User is not authorized');
  }
  next();
};

module.exports = function(Comments, app, auth) {

  app.route('/comments')
    .get(comments.all)
    .post(auth.requiresLogin, comments.create);
  app.route('/comments/:commentId')
    .get(auth.isMongoId, comments.show)
    .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, comments.update)
    .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, comments.destroy);

  // Finish with setting up the commentId param
  app.param('commentId', comments.comment);
};
