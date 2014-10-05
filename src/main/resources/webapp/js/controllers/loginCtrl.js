'use strict';

app.controller('loginCtrl', ['$scope', '$location', 'userAuthService', function ($scope, $location, userAuthService) {
  $scope.credentials = {
    username: '',
    password: ''
  };
  $scope.login = function (credentials) {
    console.log(credentials)
    userAuthService.login(credentials).then(function (username) {
      $scope.setCurrentUser(username);
      $location.path('/home')
    }, function () {
      $location.path('/login')
    });
  };
}]);