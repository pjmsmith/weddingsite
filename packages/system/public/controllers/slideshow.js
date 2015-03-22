'use strict';

angular.module('mean.system')

.controller('SlideshowController', ['$rootScope', '$scope', '$stateParams', '$location', 'Global', 'Photos',
  function($rootScope, $scope, $stateParams, $location, Global, Photos) {
    $scope.global = Global;
    
    $rootScope.$on('loggedin', function() {
      $scope.$apply();
    });

    $scope.hasAuthorization = function() {
      return $scope.global.isAdmin;
    };
    $scope.isCreatingNew = false;
    $scope.slideInterval = 5000;

    $scope.photos = [];
     /* {
        _id: 'asidfjoawi4jo',
        url: '/system/assets/img/story-bride.jpg',
        active: true,
        caption: 'Melissa'
      },
      {
        _id: 'aoisdjfoiasdjgfew',
        url: '/system/assets/img/story-groom.jpg',
        active: false,
        caption: 'Patrick'
      },
      {
        _id: 'asekfoajwoefijwg',
        url: '/system/assets/img/story-proposal.jpg',
        active: false,
        caption: 'Proposal'
      }
    ];*/

    $scope.create = function(isValid) {
      if (isValid) {
        var photo = new Photos({
          url: this.url,
          caption: this.caption,
          sort: this.sort
        });
        photo.$save(function(response) {
          $scope.find();
        });

        this.url = '';
        this.caption = '';
        this.sort = 0;
        $scope.isCreatingNew = false;

      } else {
        $scope.createSubmitted = true;
      }
    };

    $scope.remove = function(photo) {
      if (photo) {
        photo.$remove(function(response) {
          for (var i in $scope.photos) {
            if ($scope.photos[i] === photo) {
              $scope.photos.splice(i,1);
            }
          }
          $scope.find();
        });
      } else {
        $scope.photo.$remove(function(response) {
          $scope.find();
        });
      }
    };

    $scope.update = function(photo, isValid) {
      if (isValid) {
        photo.isEditing = false;
        if(!photo.updated) {
          photo.updated = [];
        }
        var editedTime = new Date().getTime();
        photo.edited = true;
        photo.lastModified = editedTime;
        photo.updated.push(editedTime);

        photo.$update(function() {
          $scope.find();
        });
      } else {
        $scope.editSubmitted = true;
      }
    };

    $scope.find = function() {
      Photos.query(function(photos) {
        $scope.photos = photos;
      });
    };

    $scope.findOne = function() {
      Photos.get({
        photoId: $stateParams.photoId
      }, function(photo) {
        $scope.photo = photo;
      });
    };
  }
])

.directive('slideshow', ['$interval', function($interval) {
  return {
    restrict: 'E',
    templateUrl: 'system/views/slideshow.html'
  };
}]);