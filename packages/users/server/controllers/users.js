'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  async = require('async'),
  config = require('meanio').loadConfig(),
  crypto = require('crypto'),
  nodemailer = require('nodemailer'),
  templates = require('../template'),
  url = require('url');

/**
 * Auth callback
 */
exports.authCallback = function(req, res) {
  res.redirect((req.session.redirect_to ? req.session.redirect_to : '/'));
};

/**
 * Instagram Subscription callback
 */
exports.subscriptionCallback = function(req, res, complete) {
  var body, headers, parsedRequest;
  parsedRequest = url.parse(req.url, true);
  if (parsedRequest.query['hub.mode'] === 'subscribe' && (parsedRequest.query['hub.challenge'] !== null) && parsedRequest.query['hub.challenge'].length > 0) {
    body = parsedRequest.query['hub.challenge'];
    headers = {
      'Content-Length': body.length,
      'Content-Type': 'text/plain'
    };
    res.writeHead(200, headers);
    res.write(body);
    if ((parsedRequest.query['hub.verify_token'] !== null) && (complete !== null)) {
      complete(parsedRequest.query['hub.verify_token']);
    }
  } else {
    res.writeHead(400);
  }
  return res.end();
};

/**
 * Show login form
 */
exports.signin = function(req, res) {
  if (req.query.ref) {
    req.session.redirect_to = '/#!/' + req.query.ref;
  }
  if (req.isAuthenticated()) {
    return res.redirect(req.session.redirect_to);
  }
  res.redirect('/#!/login');
};

/**
 * Logout
 */
exports.signout = function(req, res) {
  req.logout();
  req.session.destroy();
  res.redirect('/');
};

/**
 * Session
 */
exports.session = function(req, res) {
  res.redirect((req.session.redirect_to ? req.session.redirect_to : '/'));
};

/**
 * Create user
 */
exports.create = function(req, res, next) {
  var user = new User(req.body);

  user.provider = 'local';

  // because we set our user.provider to local our models/user.js validation will always be true
  req.assert('name', 'You must enter a name').notEmpty();
  req.assert('email', 'You must enter a valid email address').isEmail();
  req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
  req.assert('username', 'Username cannot be more than 20 characters').len(1, 20);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).send(errors);
  }

  // Hard coded for now. Will address this with the user permissions system in v0.3.5
  user.roles = ['authenticated'];
  user.save(function(err) {
    if (err) {
      switch (err.code) {
        case 11000:
        case 11001:
          res.status(400).json([{
            msg: 'Username already taken',
            param: 'username'
          }]);
          break;
        default:
          var modelErrors = [];

          if (err.errors) {

            for (var x in err.errors) {
              modelErrors.push({
                param: x,
                msg: err.errors[x].message,
                value: err.errors[x].value
              });
            }

            res.status(400).json(modelErrors);
          }
      }

      return res.status(400);
    }
    req.logIn(user, function(err) {
      if (err) return next(err);
      return res.redirect('/');
    });
    res.status(200);
  });
};
/**
 * Send User
 */
exports.me = function(req, res) {
  res.json(req.user || null);
};

/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
  User
    .findOne({
      _id: id
    })
    .exec(function(err, user) {
      if (err) return next(err);
      if (!user) return next(new Error('Failed to load User ' + id));
      req.profile = user;
      next();
    });
};

/**
 * Resets the password
 */

exports.resetpassword = function(req, res, next) {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, function(err, user) {
    if (err) {
      return res.status(400).json({
        msg: err
      });
    }
    if (!user) {
      return res.status(400).json({
        msg: 'Token invalid or expired'
      });
    }
    req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
    var errors = req.validationErrors();
    if (errors) {
      return res.status(400).send(errors);
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.save(function(err) {
      req.logIn(user, function(err) {
        if (err) return next(err);
        return res.send({
          user: user
        });
      });
    });
  });
};

/**
 * Send reset password email
 */
function sendMail(mailOptions) {
  var transport = nodemailer.createTransport(config.mailer);
  transport.sendMail(mailOptions, function(err, response) {
    if (err) return err;
    return response;
  });
}

/**
 * Callback for forgot password link
 */
exports.forgotpassword = function(req, res, next) {
  async.waterfall([

      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({
          $or: [{
            email: req.body.text
          }, {
            username: req.body.text
          }]
        }, function(err, user) {
          if (err || !user) return done(true);
          done(err, user, token);
        });
      },
      function(user, token, done) {
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        user.save(function(err) {
          done(err, token, user);
        });
      },
      function(token, user, done) {
        var mailOptions = {
          to: user.email,
          from: config.emailFrom
        };
        mailOptions = templates.forgot_password_email(user, req, token, mailOptions);
        sendMail(mailOptions);
        done(null, true);
      }
    ],
    function(err, status) {
      var response = {
        message: 'Mail successfully sent',
        status: 'success'
      };
      if (err) {
        response.message = 'User does not exist';
        response.status = 'danger';
      }
      res.json(response);
    }
  );
};

/**
 * List of Users
 */
exports.all = function(req, res) {
  User.find().sort('-created').exec(function(err, comments) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot list the users'
      });
    }
    res.json(comments);

  });
};