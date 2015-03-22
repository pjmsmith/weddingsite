'use strict';

//WishLists service used for getting registry wishlists REST endpoint
angular.module('mean.system').factory('WishLists', ['$resource',
  function($resource) {
    return $resource('wishLists/:wishListId', {
      wishListId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);