'use strict';

angular.module('mean.system').controller('GuestbookController', ['$scope', '$stateParams', '$location', 'Global',
  function($scope, $stateParams, $location, Global) {
    $scope.global = Global;
  }
])
.directive('guestbook', function() {
  return {
    restrict: 'E',
    templateUrl: 'system/views/comments.html'
  };
})
.directive('guestbookInput', function() {
  return {
    restrict: 'E',
    templateUrl: 'system/views/guestbookInput.html'
  };
});