'use strict';

app.controller('appCtrl', function ($scope) {
  $scope.userId = false;

  $scope.setUserId = function (uid) {
    $scope.userId = uid;
  };

  $scope.alerts = [];

  $scope.addAlert = function(severity, message) {
    $scope.alerts.push({'type': severity, 'msg': message});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
})