'use strict';

angular.module('mean.system')

.controller('IndexController', ['$scope', 'Global',
  function($scope, Global, GoogleMapApi) {
    $scope.global = Global;
  }
]);