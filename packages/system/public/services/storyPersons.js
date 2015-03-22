'use strict';

//StoryPersons service used for getting people and their stories REST endpoint
angular.module('mean.system').factory('StoryPersons', ['$resource',
  function($resource) {
    return $resource('storyPersons/:storyPersonId', {
      storyPersonId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);