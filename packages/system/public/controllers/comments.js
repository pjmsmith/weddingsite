'use strict';

angular.module('mean.system').controller('CommentsController', ['$rootScope', '$scope', '$stateParams', '$location', 'Global', 'Comments',
  function($rootScope, $scope, $stateParams, $location, Global, Comments) {
    $scope.global = Global;
    
    $rootScope.$on('loggedin', function() {
      $scope.$apply();
    });

    $scope.hasAuthorization = function(comment) {
      if (!comment || !comment.user) return false;
      return $scope.global.isAdmin || comment.user._id === $scope.global.user._id;
    };


    $scope.create = function(isValid) {
      if (isValid) {
        var comment = new Comments({
          title: this.title,
          content: this.content
        });
        comment.$save(function(response) {
          $location.path('guestbook');
          $scope.find();
        });

        this.title = '';
        this.content = '';
      } else {
        $scope.createSubmitted = true;
      }
    };

    $scope.remove = function(comment) {
      if (comment) {
        comment.$remove(function(response) {
          for (var i in $scope.comments) {
            if ($scope.comments[i] === comment) {
              $scope.comments.splice(i,1);
            }
          }
          $location.path('guestbook');
          $scope.find();
        });
      } else {
        $scope.comment.$remove(function(response) {
          $location.path('guestbook');
          $scope.find();
        });
      }
    };

    $scope.update = function(comment, isValid) {
      if (isValid) {
        comment.isEditing = false;
        if(!comment.updated) {
          comment.updated = [];
        }
        var editedTime = new Date().getTime();
        comment.edited = true;
        comment.lastModified = editedTime;
        comment.updated.push(editedTime);

        comment.$update(function() {
          $location.path('guestbook');
          $scope.find();
        });
      } else {
        $scope.editSubmitted = true;
      }
    };

    $scope.find = function() {
      Comments.query(function(comments) {
        $scope.comments = comments;
      });
    };

    $scope.findOne = function() {
      Comments.get({
        commentId: $stateParams.commentId
      }, function(comment) {
        $scope.comment = comment;
      });
    };
  }
]);
