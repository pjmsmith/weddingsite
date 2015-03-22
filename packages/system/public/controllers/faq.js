'use strict';

angular.module('mean.system')

.controller('FaqController', ['$scope', '$stateParams', '$location', 'Global', 'Questions',
	function($scope, $stateParams, $location, Global, Questions) {
		$scope.global = Global;
		$scope.isCreatingNew = false;
		//Sample Data
		/*
		$scope.questions = [
			{
				question: 'Do we need to bring a gift?',
				answer: 'Whatever you want.'
			},
			{
				question: 'What should I wear?',
				answer: 'SF summer attire (bring a jacket for later)'
			},
			{
				question: 'What if I have dietary restrictions?',
				answer: 'Try and bring your own food, but we\'ll see what we can do'
			},
			{
				question: 'How do I ask you questions about the wedding?',
				answer: 'mailto:questions@melissapatrickwedding.com'
			},
		];*/

		$scope.hasAuthorization = function() {
			return $scope.global.isAdmin;
		};

		$scope.create = function(isValid) {
			if (isValid) {
				var question = new Questions({
					question: this.question,
					answer: this.answer,
					sort: this.sort
				});
				question.$save(function(response) {
					$scope.find();
				});

				this.question = '';
				this.answer = '';
				this.sort = 0;

				$scope.isCreatingNew = false;
			} else {
				$scope.submitted = true;
			}
		};

		$scope.remove = function(question) {
			if (question) {
				question.$remove(function(response) {
					for (var i in $scope.questions) {
						if ($scope.questions[i] === question) {
							$scope.questions.splice(i,1);
						}
					}
					$scope.find();
				});
			} else {
				$scope.question.$remove(function(response) {
					$scope.find();
				});
			}
		};

		$scope.update = function(question, isValid) {
			if (isValid) {
				question.isEditing = false;
				if(!question.updated) {
					question.updated = [];
				}
				var editedTime = new Date().getTime();
				question.lastModified = editedTime;
				question.updated.push(editedTime);

				try {
					question.$update(function() {
						$scope.find();
					});
				} catch (e) {
					//doesn't exist yet, try saving it
					question = new Questions({
						question: question.question,
						answer: question.answer,
						sort: question.sort
					});
					question.$save(function(response) {
						$scope.find();
					});
				}
			} else {
				$scope.submitted = true;
			}
		};

		$scope.find = function() {
			Questions.query(function(questions) {
				$scope.questions = questions;
			});
		};

		$scope.findOne = function() {
			Questions.get({
				questionId: $stateParams.questionId
			}, function(question) {
				$scope.question = question;
			});
		};
	}
])
.directive('faq', function() {
  return {
    restrict: 'E',
    templateUrl: 'system/views/questions.html'
  };
});