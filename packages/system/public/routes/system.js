'use strict';

// $viewPathProvider, to allow overriding system default views
angular.module('mean.system').provider('$viewPath', function() {
  function ViewPathProvider() {
    var overrides = {};

    this.path = function(path) {
      return function() {
        return overrides[path] || path;
      };
    };

    this.override = function(defaultPath, newPath) {
      if (overrides[defaultPath]) {
        throw new Error('View already has an override: ' + defaultPath);
      }
      overrides[defaultPath] = newPath;
      return this;
    };

    this.$get = function() {
      return this;
    };
  }

  return new ViewPathProvider();
});

// $meanStateProvider, provider to wire up $viewPathProvider to $stateProvider
angular.module('mean.system').provider('$meanState', ['$stateProvider', '$viewPathProvider', function($stateProvider, $viewPathProvider) {
  function MeanStateProvider() {
    this.state = function(stateName, data) {
      if (data.templateUrl) {
        data.templateUrl = $viewPathProvider.path(data.templateUrl);
      }
      $stateProvider.state(stateName, data);
      return this; 
    };

    this.$get = function() {
      return this;
    };
  }

  return new MeanStateProvider();
}]);

//Setting up route
angular.module('mean.system').config(['$meanStateProvider', '$urlRouterProvider',
  function($meanStateProvider, $urlRouterProvider) {
    // For unmatched routes:
    $urlRouterProvider.otherwise('/');

    // states for my app
    $meanStateProvider
      .state('home', {
        url: '/',
        templateUrl: 'system/views/index.html'
      });

    $meanStateProvider
      .state('our-story', {
        url: '/our-story',
        templateUrl: 'system/views/our-story.html'
      });

    $meanStateProvider
      .state('wedding-party', {
        url: '/wedding-party',
        templateUrl: 'system/views/wedding-party.html'
      });

    $meanStateProvider
      .state('ceremony', {
        url: '/ceremony',
        templateUrl: 'system/views/ceremony.html'
      });

    $meanStateProvider
      .state('reception', {
        url: '/reception',
        templateUrl: 'system/views/reception.html'
      });

    $meanStateProvider
      .state('travel', {
        url: '/travel',
        templateUrl: 'system/views/travel.html'
      });

    $meanStateProvider
      .state('activities', {
        url: '/activities',
        templateUrl: 'system/views/activities.html'
      });

    $meanStateProvider
      .state('registry', {
        url: '/registry',
        templateUrl: 'system/views/registry.html'
      });

    $meanStateProvider
      .state('guestbook', {
        url: '/guestbook',
        templateUrl: 'system/views/guestbook.html'
      });

    $meanStateProvider
      .state('faq', {
        url: '/faq',
        templateUrl: 'system/views/faq.html'
      });

    $meanStateProvider
      .state('Log Out', {        
        controller: function () {
          window.location = '/logout';
        }
      });      
  }
]).config(['$locationProvider',
  function($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
