'use strict';

angular.module('mean.system').controller('HeaderController', ['$scope', '$rootScope', 'Global', 'Menus',
  function($scope, $rootScope, Global, Menus) {
    $scope.global = Global;
    $scope.menus = {};

    // Default hard coded menu items for main menu
    var defaultMainMenu = [
      {
        title: 'Our Story',
        link: 'our-story',
        roles: ['anonymous'],
      },
      {
        title: 'Wedding Party',
        link: 'wedding-party',
        roles: ['anonymous']
      },
      {
        title: 'Events',
        link: 'events',
        roles: ['anonymous'],
        dropdown: [{
          title: 'Ceremony',
          link: 'ceremony',
          roles: ['anonymous']
        },
        {
          title: 'Reception',
          link: 'reception',
          roles: ['anonymous']
        }]
      },
      {
        title: 'Travel & Lodging',
        link: 'locations',
        roles: ['anonymous'],
        dropdown: [
        {
          title: 'Room Blocks',
          link: 'travel',
          roles: ['anonymous']
        },
        {
          title: 'Local Attractions',
          link: 'activities',
          roles: ['anonymous']
        }]
      },
      {
        title: 'Registry',
        link: 'registry',
        roles: ['anonymous']
      },
      {
        title: 'Guestbook',
        link: 'guestbook',
        roles: ['anonymous']
      },
      {
        title: 'FAQ',
        link: 'faq',
        roles: ['anonymous']
      }
    ];

    // Query menus added by modules. Only returns menus that user is allowed to see.
    function queryMenu(name, defaultMenu) {
      Menus.query({
        name: name,
        defaultMenu: defaultMenu
      }, function(menu) {
        $scope.menus[name] = menu;
      });
    }

    // Query server for menus and check permissions
    queryMenu('main', defaultMainMenu);
    queryMenu('account', []);

    $scope.isCollapsed = false;

    $scope.toggleCollapsibleMenu = function() {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    $scope.$on('$stateChangeSuccess', function() {
      $scope.isCollapsed = false;
    });

    $rootScope.$on('loggedin', function() {
      queryMenu('main', defaultMainMenu);

      $scope.global = {
        authenticated: !! $rootScope.user,
        user: $rootScope.user
      };
    });
  }
]);
