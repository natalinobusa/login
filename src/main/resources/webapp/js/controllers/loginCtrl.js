'use strict';

app.controller('loginCtrl', ['$scope','userAuthService', function ($scope,userAuthService) {
	$scope.msgtxt='';
	$scope.login=function(data){
		var uid = userAuthService.login(data,$scope);
		$scope.setUserId(uid);
	};
}]);