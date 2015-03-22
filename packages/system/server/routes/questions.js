'use strict';

var questions = require('../controllers/questions');

// FAQ authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin) {
    return res.status(401).send('User is not authorized');
  }
  next();
};

module.exports = function(Questions, app, auth) {

  app.route('/questions')
    .get(questions.all)
    .post(auth.requiresLogin, questions.create);
  app.route('/questions/:questionId')
    .get(auth.isMongoId, questions.show)
    .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, questions.update)
    .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, questions.destroy);

  // Finish with setting up the questionId param
  app.param('questionId', questions.question);
};
