'use strict';

//Photos service used for photos REST endpoint
angular.module('mean.system').factory('Photos', ['$resource',
  function($resource) {
    return $resource('photos/:photoId', {
      photoId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);