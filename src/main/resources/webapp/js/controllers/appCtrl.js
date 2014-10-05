'use strict';

app.controller('appCtrl',  ['$scope', '$location', 'AUTH_EVENTS', 'userAuthService', function ($scope, $location, AUTH_EVENTS, userAuthService) {

  // app global scope

  // user id / info
  $scope.currentUser = false;
  $scope.setCurrentUser = function (username) {
    $scope.currentUser = username;
  };

  // global navigation and links
  $scope.logout = function() {
    userAuthService.logout();
    $scope.currentUser = false;
    $location.path('/login');
  }

  $scope.$on(AUTH_EVENTS.notAuthenticated, function() { this.logout()});
  $scope.$on(AUTH_EVENTS.notAuthenticated, function() { this.logout()});
  $scope.$on(AUTH_EVENTS.sessionTimeout, function() { this.logout()});

  // alert widget
  $scope.addAlert = function(severity, message) {
    $scope.alerts.push({'type': severity, 'msg': message});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
}])