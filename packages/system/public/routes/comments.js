'use strict';

//Setting up route
angular.module('mean.system').config(['$stateProvider',
  function($stateProvider) {
    // Check if the user is connected
    var checkLoggedin = function($q, $timeout, $http, $location) {
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user) {
        // Authenticated
        if (user !== '0') $timeout(deferred.resolve);

        // Not Authenticated
        else {
          $timeout(deferred.reject);
          $location.url('/login');
        }
      });

      return deferred.promise;
    };
   	
    // states for my app
    $stateProvider
      .state('all comments', {
        url: '/comments',
        templateUrl: 'comments/views/listComments.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('create comment', {
        url: '/comments/create',
        templateUrl: 'comments/views/createComment.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('edit comment', {
        url: '/comments/:commentId/edit',
        templateUrl: 'comments/views/editComment.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('comment by id', {
        url: '/comments/:commentId',
        templateUrl: 'comments/views/viewComment.html',
        resolve: {
          loggedin: checkLoggedin
        }
      });
  }
]);
