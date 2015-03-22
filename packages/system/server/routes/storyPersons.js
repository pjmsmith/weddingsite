'use strict';

var storyPersons = require('../controllers/storyPersons');

// StoryPerson authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin) {
    return res.status(401).send('User is not authorized');
  }
  next();
};

module.exports = function(StoryPersons, app, auth) {

  app.route('/storyPersons')
    .get(storyPersons.all)
    .post(auth.requiresLogin, storyPersons.create);
  app.route('/storyPersons/:storyPersonId')
    .get(auth.isMongoId, storyPersons.show)
    .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, storyPersons.update)
    .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, storyPersons.destroy);

  // Finish with setting up the storyPerson param
  app.param('storyPersonId', storyPersons.storyPerson);
};
