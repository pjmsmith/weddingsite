'use strict';

angular.module('mean.system')

.controller('HotelController', ['$rootScope', '$scope', '$http', '$stateParams', '$location', 'Global', 'Businesses',
  function($rootScope, $scope, $http, $stateParams, $location, Global, Businesses) {
    $scope.global = Global;
    $scope.isCreatingNew = false;
    var category = $scope.category = 'hotel';

    $scope.hotels = [
      {
        businessId: 'fairmont-san-francisco-san-francisco',
        category: 'hotel',
        description: 'Sample description text',
        instructions: 'Instructions to get group rate or whatever',
        url: 'www.fairmont.com/san-francisco',
        sort: 0
      }
    ];

    $scope.hasAuthorization = function() {
      $('body').toggleClass('is-admin', $scope.global.isAdmin);
      return $scope.global.isAdmin;
    };


    $scope.create = function(isValid) {
      if (isValid) {
        var business = new Businesses({
          businessId: this.businessId,
          category: this.category,
          description: this.description,
          instructions: this.instructions,
          url: this.url,
          sort: this.sort
        });
        business.$save(function(response) {
          $scope.find(category);
        });

        this.businessId = '';
        this.category = category;
        this.description = '';
        this.instructions = '';
        this.url = '';
        this.sort = 0;
        $scope.isCreatingNew = false;

      } else {
        $scope.createSubmitted = true;
      }
    };

    $scope.remove = function(business) {
      if (business) {
        business.$remove(function(response) {
          for (var i in $scope.businesss) {
            if ($scope.businesss[i] === business) {
              $scope.businesss.splice(i,1);
            }
          }
          $scope.find(category);
        });
      } else {
        $scope.business.$remove(function(response) {
          $scope.find(category);
        });
      }
    };

    $scope.update = function(business, isValid) {
      if (isValid) {
        business.isEditing = false;
        if(!business.updated) {
          business.updated = [];
        }
        var editedTime = new Date().getTime();
        business.edited = true;
        business.lastModified = editedTime;
        business.updated.push(editedTime);

        business.$update(function() {
          $scope.find(category);
        });
      } else {
        $scope.editSubmitted = true;
      }
    };

    $scope.find = function(categoryName) {
      $scope.businesses = [];
      Businesses.query(function(businesses) {
        $scope.businesses = businesses;
        $scope.hotels = [];

        var yelpSuccess = function(response) {
          console.log(response);
          var hotel = this;
          hotel.name = response.name;
          hotel.photo = response.image_url;
          hotel.phone = response.display_phone;
          hotel.address = response.location.display_address;
          hotel.rating = response.rating_img_url;
          hotel.yelpUrl = response.url;
          hotel.yelpSnippet = response.snippet_text;
          $scope.hotels.push(hotel);
        };
        var yelpError = function() {
          console.log('Could not load business from Yelp');
        };

        for (var i = 0; i < businesses.length; i += 1) {
          var business = businesses[i];
          if (business.category === categoryName) {
            //load yelp data
            $http.get('/yelp/' + business.businessId)
              .success(yelpSuccess.bind(business))
              .error(yelpError);
          }
        }
      });
    };

    $scope.findOne = function() {
      Businesses.get({
        businessId: $stateParams.businessId
      }, function(business) {
        $scope.business = business;
      });
    };
  }
])

.directive('hotels', function() {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'system/views/hotels.html'
  };
});