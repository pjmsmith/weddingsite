'use strict';

var businesses = require('../controllers/businesses');

// Comment authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin) {
    return res.status(401).send('User is not authorized');
  }
  next();
};

module.exports = function(Businesses, app, auth) {

  app.route('/businesses')
    .get(businesses.all)
    .post(auth.requiresLogin, businesses.create);
  app.route('/businesses/:businessId')
    .get(auth.isMongoId, businesses.show)
    .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, businesses.update)
    .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, businesses.destroy);

  // Finish with setting up the businessId param
  app.param('businessId', businesses.business);
};
