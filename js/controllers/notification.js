(function () {
  var app = angular.module('app');
  app.directive('notification', ['$log', '$timeout', function ($log, $timeout) {
    return {
      scope: {
        show: '=',
        type: '@',
        message: '@',
        timeout: '@'
       },
      template: '<div uib-alert class="alert alert-dismissible {{alertType}}"  ng-show="show" dismiss-on-timeout="{{timeout}}" close="closeAlert()">{{message}}</div>',
      link: function ($scope, $elements, $attributes, directiveCtrl, transclude) {
        $scope.alertType = 'alert-' + ($scope.type || 'warning');
        // TODO: timeout is not working in comment Modal
        $scope.closeAlert = function () {
          $scope.show = false;
        };
      }
    };
  }]);
})();
