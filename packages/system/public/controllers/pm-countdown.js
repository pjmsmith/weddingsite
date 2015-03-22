'use strict';

angular.module('mean.system')

.directive('pmCountdown', ['$interval', function($interval) {
  return {
    restrict: 'E',
    link: function(scope, element, attrs) {
      var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      var runCountdown;

      scope.countdownFilters = {
        'years': (oneDay * 366), //2016 is a leap year,
        'weeks': (oneDay * 7),
        'days': oneDay,
        'hours': (1000 * 60 * 60),
        'minutes': (1000 * 60),
        'seconds': 1000
      };

      scope.filterMethod = 'days';

      var calcDaysRemaining = function() {
        var firstDate = new Date(2016, 6, 23, 15);
        var secondDate = new Date();

        var diff = Math.abs((firstDate.getTime() - secondDate.getTime()));

        var daysRemaining = ((diff)/scope.countdownFilters[scope.filterMethod]);

        switch (scope.filterMethod) {
          case 'years':
            break;
          case 'weeks':
            daysRemaining = Math.ceil(daysRemaining);
            break;
          case 'days':
            daysRemaining = Math.round(daysRemaining);
            break;
          case 'hours':
            break;
          case 'minutes':
            daysRemaining = Math.ceil(daysRemaining);
            break;
          case 'seconds':
            daysRemaining = Math.round(daysRemaining);
            break;
          default:
            break;
        }
        scope.daysRemaining = daysRemaining.toFixed(2);
        return scope.daysRemaining;
      };

      scope.daysRemaining = calcDaysRemaining();

      scope.cycleFilter = function() {
        switch (scope.filterMethod) {
          case 'years':
            scope.filterMethod = 'weeks';
            break;
          case 'weeks':
            scope.filterMethod = 'days';
            break;
          case 'days':
            scope.filterMethod = 'hours';
            break;
          case 'hours':
            scope.filterMethod = 'minutes';
            break;
          case 'minutes':
            scope.filterMethod = 'seconds';
            break;
          case 'seconds':
            scope.filterMethod = 'years';
            break;
          default:
            scope.filterMethod = 'days';
        }
        scope.daysRemaining = calcDaysRemaining();
      };

      runCountdown = $interval(calcDaysRemaining, 1000);

      element.on('$destroy', function() {
        $interval.cancel(runCountdown);
      });
    },
    templateUrl: 'system/views/pmCountdown.html'
  };
}]);