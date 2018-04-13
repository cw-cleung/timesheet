(function(){
  var app = angular.module('app');
  app.directive('helloWorld', ['$log', function($log){
    return {
      template: '<div>{{message}}</div>',
      link:function($scope, $elements, $attributes, directiveCtrl, transclude){
        $scope.message = 'Hello, World!';
      }
    };
  }]);
})();
