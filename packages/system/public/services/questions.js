'use strict';

//Questions service used for FAQs REST endpoint
angular.module('mean.system').factory('Questions', ['$resource',
  function($resource) {
    return $resource('questions/:questionId', {
      questionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);