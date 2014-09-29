'use strict';

// Declare app level module which depends on filters, and services
var app= angular.module('myApp', ['ngRoute', 'ui.bootstrap']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login',  {templateUrl: 'html/views/login.html', controller: 'loginCtrl'});
  $routeProvider.when('/signup', {templateUrl: 'html/views/signup.html', controller: 'signupCtrl'});
  $routeProvider.when('/home', {templateUrl: 'html/views/home.html', controller: 'homeCtrl'});
  $routeProvider.otherwise({redirectTo: '/login'});
}]);

app.run(function($rootScope, $location, userAuthService){
	var routespermission=['/home'];  //route that require login
	$rootScope.$on('$routeChangeStart', function(){
		if( routespermission.indexOf($location.path()) !=-1)
		{
			var connected=userAuthService.isAuthenticated();
			connected.then(function(msg){
				if(!msg.data) $location.path('/login');
			});
		}
	});
});