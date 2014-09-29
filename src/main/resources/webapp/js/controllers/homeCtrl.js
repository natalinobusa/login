'use strict';

app.controller('homeCtrl', ['$scope','userAuthService', function($scope,userAuthService){
	$scope.txt='Page Home';
	$scope.logout=function(){
		userAuthService.logout();
	}
}])