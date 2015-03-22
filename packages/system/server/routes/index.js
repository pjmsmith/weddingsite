'use strict';

var mean = require('meanio');
var config = mean.loadConfig();
//var socketIO = require('socket.io');
var yelp = require('yelp').createClient({
  consumer_key: config.yelp.consumerKey, 
  consumer_secret: config.yelp.consumerSecret,
  token: config.yelp.token,
  token_secret: config.yelp.tokenSecret
});

module.exports = function(System, app, auth, database) {
  //var io = socketIO.listen(app.listen(3000));
  var hashtag = 'spring';
  /*io.sockets.on('connection', function (socket) {
    socket.emit('loadRecent', { url: 'https://api.instagram.com/v1/tags/' + hashtag + '/media/recent?client_id=' + config.instagram.clientID });
  });*/

  // Home route
  var index = require('../controllers/index');
  var social = require('../controllers/social');
  var seatingChart = require('../controllers/seatingChart');
  app.route('/')
    .get(index.render);

  app.route('/social')
    .get(social.render);

  //Should really move these Instagram and Yelp handlers to their own files...
  app.post('/auth/instagram/callback', function(req, res, next) {
    console.log('Received new hashtag POST from Instagram');
    var data = req.body;

    data.forEach(function(tag) {
      var url = 'https://api.instagram.com/v1/tags/' + tag.object_id + '/media/recent?client_id=' + config.instagram.clientID;
      //io.sockets.emit('loadRecent', { url: url });
    });

    return res.end();
  });

  app.get('/yelp/:businessName', function(req, res, next) {
    yelp.business(req.params.businessName, function(error, data) {
      console.log(error);
      res.json(data);
    });
  });

  app.route('/seatingChart')
    .get(seatingChart.render)

  app.get('/*',function(req, res, next){
    res.header('workerID' , JSON.stringify(mean.options.workerid) );
    next(); // http://expressjs.com/guide.html#passing-route control
  });

};