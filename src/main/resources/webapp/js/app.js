'use strict';

// Declare app level module which depends on filters, and services
var app= angular.module('myApp', ['ngRoute', 'ui.bootstrap']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login',  {templateUrl: 'html/views/login.html', controller: 'loginCtrl'});
  $routeProvider.when('/home', {templateUrl: 'html/views/home.html', controller: 'homeCtrl'});
  $routeProvider.otherwise({redirectTo: '/login'});
}]);

app.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.xsrfCookieName = 'csrf';
  $httpProvider.defaults.xsrfHeaderName = 'X-csrf-token';
}]);

app.config(function ($httpProvider) {
  $httpProvider.interceptors.push([
    '$injector',
    function ($injector) {
      return $injector.get('AuthInterceptor');
    }
  ]);
})

app.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
    return {
        responseError: function (response) {
          $rootScope.$broadcast({
            401: AUTH_EVENTS.notAuthenticated,
            403: AUTH_EVENTS.notAuthorized,
            419: AUTH_EVENTS.sessionTimeout,
            440: AUTH_EVENTS.sessionTimeout
          }[response.status], response);
          return $q.reject(response);
        }
    };
})

app.run(function($rootScope, $location, $http, AUTH_EVENTS, sessionService, userAuthService){
    var loginRoutes    = ['/login']
    var loggedRoutes   = ['/home']
    $rootScope.$on('$routeChangeStart', function(){
		// logged routes not available if not authenticated
		if( loggedRoutes.indexOf($location.path()) !=-1)
		{
			var connected=userAuthService.isAuthenticated();
            if (!connected) {
                sessionService.destroy('loggeduser');
                $location.path('/login');
                return
            }
		}
		// login route only available if not authenticated
		if( passRoutes.indexOf($location.path()) !=-1) {
			var connected=userAuthService.isAuthenticated();
            if (connected) {
                $location.path('/home');
                return;
            }
		}
	});
});