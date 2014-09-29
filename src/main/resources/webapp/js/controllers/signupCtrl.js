'use strict';

app.controller('signupCtrl', ['$scope','userAuthService', function ($scope,userAuthService) {
	$scope.msgtxt='';
	$scope.signup=function(data){
		userAuthService.register(data,$scope); //call login service
	};
}]);