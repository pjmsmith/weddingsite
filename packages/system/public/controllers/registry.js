'use strict';

angular.module('mean.system')

.controller('RegistryController', ['$scope', '$stateParams', '$location', 'Global', '$window', 'WishLists',
	function($scope,  $stateParams, $location, Global, $window, WishLists) {
		$scope.global = Global;
		
		//Sample Data
		/*
		$scope.stores = [
			{
				name: 'Target',
				url: 'http://www.target.com',
				logo: 'system/assets/img/registry-target.png'
			},
			{
				name: 'Williams-Sonoma',
				url: 'http://www.williams-sonoma.com'
			},
			{
				name: 'Wayfair',
				url: 'http://www.wayfair.com',
				logo: 'system/assets/img/registry-wayfair.jpg'
			}
		];*/
		$scope.isCreatingNew = false;

		$scope.hasAuthorization = function() {
			return $scope.global.isAdmin;
		};

		$scope.create = function(isValid) {
			if (isValid) {
				var wishList = new WishLists({
					name: this.name,
					url: this.url,
					sort: this.sort,
					logo: this.logo
				});
				wishList.$save(function(response) {
					$scope.find();
				});

				this.name = '';
				this.url = '';
				this.sort = 0;
				this.logo = '';

				$scope.isCreatingNew = false;
			} else {
				$scope.submitted = true;
			}
		};

		$scope.remove = function(wishList) {
			if (wishList) {
				wishList.$remove(function(response) {
					for (var i in $scope.wishLists) {
						if ($scope.stores[i] === wishList) {
							$scope.stores.splice(i,1);
						}
					}
					$scope.find();
				});
			} else {
				$scope.wishList.$remove(function(response) {
					$scope.find();
				});
			}
		};

		$scope.update = function(wishList, isValid) {
			if (isValid) {
				wishList.isEditing = false;
				if(!wishList.updated) {
					wishList.updated = [];
				}
				var editedTime = new Date().getTime();
				wishList.lastModified = editedTime;
				wishList.updated.push(editedTime);

				try {
					wishList.$update(function() {
						$scope.find();
					});
				} catch (e) {
					//doesn't exist yet, try saving it
					wishList = new WishLists({
						name: wishList.name,
						url: wishList.url,
						sort: wishList.sort,
						logo: wishList.photo
					});
					wishList.$save(function(response) {
						$scope.find();
					});
				}
			} else {
				$scope.submitted = true;
			}
		};

		$scope.find = function() {
			WishLists.query(function(wishLists) {
				$scope.stores = wishLists;
			});
		};

		$scope.findOne = function() {
			WishLists.get({
				wishListId: $stateParams.wishListId
			}, function(wishList) {
				$scope.wishList = wishList;
			});
		};
	}
])
.directive('registry', function() {
  return {
    restrict: 'E',
    templateUrl: 'system/views/registryButtons.html'
  };
});