'use strict';

var locations = require('../controllers/locations');

// Map location authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin) {
    return res.status(401).send('User is not authorized');
  }
  next();
};

module.exports = function(Locations, app, auth) {

  app.route('/locations')
    .get(locations.all)
    .post(auth.requiresLogin, locations.create);
  app.route('/locations/:locationId')
    .get(auth.isMongoId, locations.show)
    .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, locations.update)
    .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, locations.destroy);

  // Finish with setting up the locationId param
  app.param('locationId', locations.location);
};
