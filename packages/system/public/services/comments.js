'use strict';

//Comments service used for comments REST endpoint
angular.module('mean.system').factory('Comments', ['$resource',
  function($resource) {
    return $resource('comments/:commentId', {
      commentId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);