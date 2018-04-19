app.controller('topNavBarCtrl', ['$scope', '$rootScope', '$interval', '$timeout', '$state', '$stateParams', '$http',
  function ($scope, $rootScope, $interval, $timeout, $state, $stateParams, $http) {

    $scope.links = [];


    $http({
      method: 'GET',
      url: './menu/menu.json'
    }).then(function (success) {
      _.forEach(success.data, function (value) {
        $scope.links.push(value);
      });
    }, function (error) {
      console.log("there was an error when getting menu.json");
    });
  }
]);