'use strict';

angular.module('mean.system')

.controller('LocationController', ['$scope', '$stateParams', '$window', '$location', 'Global', 'uiGmapGoogleMapApi', 'Locations',
  function($scope, $stateParams, $window, $location, Global, GoogleMapApi, Locations) {
    $scope.global = Global;
    // Sample Data
    /*
    GoogleMapApi.then(function(maps) {
      //church 37.801360, -122.410181
      //hotel 37.792295, -122.410783
      $scope.map = { 
        ceremony: { 
          latitude: 37.801360, 
          longitude: -122.410181 
        },
        reception: { 
          latitude: 37.792295,
          longitude: -122.410783,
        },
        options: {
          streetViewControl: false,
          panControl: false,
          maxZoom: 20,
          minZoom: 10,
          disableDefaultUI: true,
          styles: [
            {
              'stylers': [
                {
                  'hue': '#007fff'
                },
                {
                  'saturation': 89
                }
              ]
            },
            {
              'featureType': 'water',
              'stylers': [
                {
                  'color': '#ffffff'
                }
              ]
            },
            {
              'featureType': 'administrative.country',
              'elementType': 'labels',
              'stylers': [
                {
                  'visibility': 'off'
                }
              ]
            }
          ]
        },
        zoom: 18,
        markers: [
        {
          id: 1,
          latitude: 37.801360,
          longitude: -122.410181,
          showWindow: false,
          options: {
            animation: 0,
            labelContent: 'Be at the church by 3:00 PM',
            labelAnchor: '110 0',
            labelClass: 'marker-labels'
          },
          message: 'Our wedding ceremony will be a full Catholic mass. Please be on time!'
        },
        {
          id: 2,
          latitude: 37.792295,
          longitude: -122.410783,
          showWindow: false,
          options: {
            animation: 0,
            labelContent: 'The reception will be from<br/>4:30PM until Midnight.',
            labelAnchor: '90 0',
            labelClass: 'marker-labels'
          },
          message: 'If you want to stay at the Fairmont Hotel, please be sure to reserve your room as soon as possible!'
        }]
      };
      var onMarkerClicked = function (marker) {
        marker.showWindow = true;
        $scope.$apply();
      };
      $scope.onMarkerClicked = onMarkerClicked;

      /*_.each($scope.map.markers, function (marker) {
        marker.closeClick = function () {
          marker.showWindow = false;
          $scope.$evalAsync();
        };
        marker.onClicked = function () {
          onMarkerClicked(marker);
        };
      });
    });*/

    //Hard-coded options
    var mapOptions = {
      streetViewControl: false,
      panControl: false,
      maxZoom: 20,
      minZoom: 10,
      disableDefaultUI: false,
      styles: [
        {
          'stylers': [
            {
              'hue': '#007fff'
            },
            {
              'saturation': 89
            }
          ]
        },
        {
          'featureType': 'water',
          'stylers': [
            {
              'color': '#ffffff'
            }
          ]
        },
        {
          'featureType': 'administrative.country',
          'elementType': 'labels',
          'stylers': [
            {
              'visibility': 'off'
            }
          ]
        }
      ]
    };
    var defaultZoom = 17;

    var onMarkerClicked = function (marker) {
        marker.showWindow = true;
        $scope.$apply();
    };
    $scope.onMarkerClicked = onMarkerClicked;

    var onMapClicked = function(mapModel, eventName, originalEventArgs) {
      var e = originalEventArgs[0];
      var lat = e.latLng.lat();
      var lon = e.latLng.lng();
      if ($scope.location.isEditing){
        if (!$scope.location.addingMarker) {
          $scope.location.latitude = lat;
          $scope.location.longitude = lon;
        } else {
          $scope.location.markers.push({
            id: $scope.location.markers.length + 1,
            latitude: lat,
            longitude: lon
          });
          var markers = [];
          for (var i in $scope.location.markers) {
            var marker = $scope.location.markers[i];
            marker.options = {
              labelAnchor: marker.labelAnchor,
              labelClass: marker.labelClass,
              labelContent: marker.labelContent
            };
            markers.push(marker);
          }
          $scope.map.markers = markers;
          $scope.addingMarker = false;
        }
      }

      //scope apply required because this event handler is outside of the angular domain
      $scope.$apply();
    };
    $scope.onMapClicked = onMapClicked;
    $scope.isCreatingNew = false;

    $scope.hasAuthorization = function() {
      return $scope.global.isAdmin;
    };

    $scope.create = function(isValid) {
      if (isValid) {
        var location = new Locations({
          name: this.name,
          latitude: this.latitude,
          longitude: this.longitude,
          details: this.details,
          directions: this.directions,
          photo: this.photo,
          photoClass: this.photoClass,
          markers: this.markers
        });
        location.$save(function(response) {
          $scope.find(this.name);
        });

        this.name = '';
        this.latitude = 0;
        this.longitude = 0;
        this.details = '';
        this.directions = '';
        this.photo = '';
        this.photoClass = '';
        this.markers = [];

        $scope.isCreatingNew = false;
      } else {
        $scope.submitted = true;
      }
    };

    $scope.remove = function(location) {
      if (location) {
        location.$remove(function(response) {
          for (var i in $scope.locations) {
            if ($scope.locations[i] === location) {
              $scope.locations.splice(i,1);
            }
          }
          $scope.find(location.name);
        });
      }
    };

    $scope.removeMarker = function(location, marker) {
      var locationFound = false;
      if (location && marker) {
        for (var i in $scope.locations) {
          if ($scope.locations[i] === location) {
            for (var j in $scope.locations[i].markers) {
              if ($scope.locations[i].markers[j] === marker) {
                $scope.locations[i].markers.splice(j,1);
                locationFound = true;
              }
            }
          }
        }
        if (locationFound) {
          location.$update(function() {
            $scope.find(location.name);
          });
        }
      }
    };

    $scope.update = function(location, isValid) {
      if (isValid) {
        location.isEditing = false;
        if(!location.updated) {
          location.updated = [];
        }
        var editedTime = new Date().getTime();
        location.lastModified = editedTime;
        location.updated.push(editedTime);

        try {
          location.$update(function() {
            $scope.find(location.name);
          });
        } catch (e) {
          //doesn't exist yet, try saving it
          location = new Locations({
            name: location.name,
            latitude: location.latitude,
            longitude: location.longitude,
            details: location.details,
            directions: location.directions,
            photo: location.photo,
            photoClass: location.photoClass,
            markers: this.markers
          });
          location.$save(function(response) {
            $scope.find(location.name);
          });
        }
      } else {
        $scope.submitted = true;
      }
    };

    $scope.find = function(name) {
      Locations.query(function(locations) {
        $scope.locations = locations;
        var foundLocation = false;
        for (var i = 0; i < locations.length; i += 1) {
          if (locations[i].name === name) {
            $scope.location = locations[i];
            foundLocation = true;
          }
        }
        if (!foundLocation) {
          $scope.location = {
            isEditing: false,
            center: {
              latitude: 37,
              longitude: -122
            }
          };
        }
        GoogleMapApi.then(function(maps) {
          var markers = [];
          for (var i in $scope.location.markers) {
            var marker = $scope.location.markers[i];
            marker.options = {
              labelAnchor: marker.labelAnchor,
              labelClass: marker.labelClass,
              labelContent: marker.labelContent
            };
            markers.push(marker);
          }
          $scope.map = {
            center: {
              latitude: $scope.location.latitude,
              longitude: $scope.location.longitude
            },
            zoom: defaultZoom,
            options: mapOptions,
            markers: markers
          };
        });
      });
    };

    $scope.findOne = function(name) {
      Locations.get({
        locationId: $stateParams.locationId
      }, function(location) {
        GoogleMapApi.then(function(maps) {
          $scope.location = location;
          $scope.map = {
            center: {
              latitude: location.latitude,
              longitude: location.longitude
            },
            zoom: defaultZoom,
            options: mapOptions,
            markers: location.markers
          };
        });
      });
    };

    $scope.updateDirections = function(address) {
      GoogleMapApi.then(function(maps){
        var url = 'http://maps.google.com/maps?saddr=' + address + '&daddr=' + $scope.location.latitude + ',' + $scope.location.longitude;
        $window.open(url, '_blank');
      });
    };
  }
])
.directive('location', function() {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'system/views/location.html'
  };
});