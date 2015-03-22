'use strict';

//Businesses service used for businesses REST endpoint
angular.module('mean.system').factory('Businesses', ['$resource',
  function($resource) {
    return $resource('businesses/:businessId', {
      businessId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);