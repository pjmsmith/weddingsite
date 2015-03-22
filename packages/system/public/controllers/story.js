'use strict';

angular.module('mean.system')

.controller('StoryController', ['$scope', '$stateParams', '$location', '$anchorScroll', 'Global', 'StoryPersons',
	function($scope, $stateParams, $location, $anchorScroll, Global, StoryPersons) {
		$scope.global = Global;
		//Sample Data
		/*var stories = {
			bride: [
				{
					role: 'The Bride',
					name: 'Melissa',
					photo: 'system/assets/img/story-bride.jpg',
					photoClass: 'story-photo-circle',
					story: 'Melissa is from Novato.',
					group: 'bride'
				}
			],
			groom: [
				{
					role: 'The Groom',
					name: 'Patrick',
					photo: 'system/assets/img/story-groom.jpg',
					photoClass: 'story-photo-circle',
					story: 'Patrick is from Sunnyvale.',
					group: 'groom'
				}
			],
			couple: [
				{
					role: 'The Relationship',
					photo: 'system/assets/img/story-couple.jpg',
					photoClass: 'story-photo-banner',
					story: 'They live in San Francisco.',
					group: 'couple'
				}
			],
			proposal: [
				{
					role: 'The Proposal',
					photo: 'system/assets/img/story-proposal.jpg',
					photoClass: 'story-photo-banner',
					story: 'They got engaged at Land\'s End in San Francisco.',
					group: 'proposal'
				}
			],
			bridesmaids: [
				{
					role: 'Maid of Honor',
					name: 'Placeholder',
					photo: '',
					story: '',
					sort: 0,
					group: 'bridesmaids'
				},
				{
					role: 'Bridesmaid',
					name: 'Placeholder',
					photo: '',
					story: '',
					sort: 1,
					group: 'bridesmaids'
				},
				{
					role: 'Bridesmaid',
					name: 'Placeholder',
					photo: '',
					story: '',
					sort: 2,
					group: 'bridesmaids'
				},
				{
					role: 'Bridesmaid',
					name: 'Placeholder',
					photo: '',
					story: '',
					sort: 3,
					group: 'bridesmaids'
				},
				{
					role: 'Bridesmaid',
					name: 'Placeholder',
					photo: '',
					story: '',
					sort: 4,
					group: 'bridesmaids'
				}
			],
			groomsmen: [
				{
					role: 'Best Man',
					name: 'Placeholder',
					photo: '',
					story: '',
					sort: 0,
					group: 'groomsmen'
				},
				{
					role: 'Groomsman',
					name: 'Placeholder',
					photo: '',
					story: '',
					sort: 1,
					group: 'groomsmen'
				},
				{
					role: 'Groomsman',
					name: 'Placeholder',
					photo: '',
					story: '',
					sort: 2,
					group: 'groomsmen'
				},
				{
					role: 'Groomsman',
					name: 'Placeholder',
					photo: '',
					story: '',
					sort: 3,
					group: 'groomsmen'
				},
				{
					role: 'Groomsman',
					name: 'Placeholder',
					photo: '',
					story: '',
					sort: 4,
					group: 'groomsmen'
				}
			],
			support: [
				{
					role: 'Ring Bearer',
					name: 'Placeholder',
					photo: '',
					story: '',
					sort: 0,
					group: 'support'	
				},
				{
					role: 'Flower Girl',
					name: 'Placeholder',
					photo: '',
					story: '',
					sort: 1,
					group: 'support'	
				},
				{
					role: 'Usher',
					name: 'Placeholder',
					photo: '',
					story: '',
					sort: 2,
					group: 'support'	
				},
				{
					role: 'Usher',
					name: 'Placeholder',
					photo: '',
					story: '',
					sort: 3,
					group: 'support'	
				}
			],
		};

		for (var story in stories) {
			$scope[story] = stories[story];
		}*/

		$scope.hasAuthorization = function() {
			return $scope.global.isAdmin;
		};

		$scope.create = function(storyPerson, isValid) {
			if (isValid) {
				storyPerson = new StoryPersons({
					name: storyPerson.name,
					story: storyPerson.story,
					sort: storyPerson.sort,
					role: storyPerson.role,
					group: storyPerson.group,
					photo: storyPerson.photo,
					photoClass: storyPerson.photoClass
				});
				storyPerson.$save(function(response) {
					$scope.findGroup(storyPerson.group);
				});

				storyPerson.name = '';
				storyPerson.story = '';
				storyPerson.sort = 0;
				storyPerson.role = '';
				storyPerson.group = '';
				storyPerson.photo = '';
				storyPerson.photoClass = '';
			} else {
				$scope.submitted = true;
			}
		};

		$scope.remove = function(storyPerson) {
			if (storyPerson) {
				storyPerson.$remove(function(response) {
					for (var i in $scope.storyPersons) {
						if ($scope.members[i] === storyPerson) {
							$scope.members.splice(i,1);
						}
					}
					$scope.findGroup(storyPerson.group);
				});
			} else {
				$scope.storyPerson.$remove(function(response) {
					$scope.findGroup(storyPerson.group);
				});
			}
		};

		$scope.update = function(storyPerson, isValid) {
			if (isValid) {
				storyPerson.isEditing = false;
				if(!storyPerson.updated) {
					storyPerson.updated = [];
				}
				var editedTime = new Date().getTime();
				storyPerson.lastModified = editedTime;
				storyPerson.updated.push(editedTime);

				try {
					storyPerson.$update(function() {
						$scope.find();
					});
				} catch (e) {
					//doesn't exist yet, try saving it
					storyPerson = new StoryPersons({
						name: storyPerson.name,
						story: storyPerson.story,
						sort: storyPerson.sort,
						role: storyPerson.role,
						group: storyPerson.group,
						photo: storyPerson.photo,
						photoClass: storyPerson.photoClass
					});
					storyPerson.$save(function(response) {
						$scope.findGroup(storyPerson.group);
					});
				}
			} else {
				$scope.submitted = true;
			}
		};

		$scope.find = function() {
			StoryPersons.query(function(storyPersons) {
				$scope.storyPersons = storyPersons;
			});
		};

		$scope.findGroup = function(group) {
			$scope.stories = [];
			StoryPersons.query(function(storyPersons) {
				$scope.storyPersons = storyPersons;
				$scope.members = [];

				for (var i = 0; i < storyPersons.length; i += 1) {
					var story = storyPersons[i];
					if (story.group === group) {
						story.isCollapsed = true;
						$scope.members.push(story);
					}
				}
				//add a blank, unsaved entry to allow adding new members
				if ($scope.global.isAdmin) {
					$scope.members.push({'group': group});
				}
				$scope.members.sort(function(a, b) {
					return a.sort - b.sort;
				});
			});
		};

		$scope.findOne = function() {
			StoryPersons.get({
				storyPersonId: $stateParams.storyPersonId
			}, function(storyPerson) {
				$scope.storyPerson = storyPerson;
			});
		};

		$scope.goToNext = function(current) {
			for (var i = 0; i < $scope.members.length; i += 1) {
				if ($scope.members[i]._id === current._id) {
					if (i + 1 === $scope.members.length) {
						i = -1;
					}
					$scope.members[i + 1].isCollapsed = false;
					var newHash = 'story_' + $scope.members[i + 1]._id;
					if ($location.hash() !== newHash) {
						$location.hash(newHash);
					} else {
						$anchorScroll();
					}
					break;
				}
			}
		};
	}
])
.directive('story', function() {
  return {
    restrict: 'E',
    templateUrl: 'system/views/story.html'
  };
})
.directive('storyParty', function() {
  return {
    restrict: 'E',
    templateUrl: 'system/views/storyParty.html'
  };
});