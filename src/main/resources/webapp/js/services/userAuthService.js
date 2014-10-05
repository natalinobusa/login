'use strict';
app.factory('userAuthService',function($http, $rootScope, AUTH_EVENTS, sessionService){
	return{
		login:function(credentials){
		    return $http.post('/auth/signin', credentials)
		        .then(function(response){
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                    sessionService.set('loggeduser',response.data);
                    return response.data.username;
                    },
                function() {
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                    sessionService.destroy('loggeduser');
                    return null;
                });
		},
		logout:function(){
		    $http.delete('/auth/session')
			$rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
			sessionService.destroy('loggeduser');
		},
		isAuthenticated:function(){
			//server side authentication
			//var $checkSessionServer=$http.get('/auth/session');
			//return $checkSessionServer;

			//client side session check
			if(sessionService.get('loggeduser')) return true;
			else return false;
		}
	}
});