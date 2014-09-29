'use strict';
app.factory('userAuthService',function($http, $location, sessionService){
	return{
		login:function(data,scope){
			var $promise=$http.post('/auth/signin',data);
			$promise.then(function(response){
				var uid=response.data.uid;
				if(uid){

					sessionService.set('uid',uid);
					$location.path('/home');
					return uid;
				} else
{
                          					scope.addAlert('danger','incorrect information');
                          					$location.path('/login');
                          					return null;
                          				}
			}, function()  {
                          					scope.addAlert('danger','login service unavailable right now.');
                          					$location.path('/login');
                          					return null;
                          				});
		},
		register:function(data, scope){
		    var $promise=$http.post('/auth/signup',data);
        	$promise.then(function(response){
        		var uid=response.data.uid;
                if(uid){
                    sessionService.set('uid',msg);
                    $location.path('/home');
                }
                else  {
                    scope.msgtxt='The email has already been registered';
                    $location.path('/signup');
                }
            });
		},
		logout:function(){
			sessionService.destroy('uid');
			$location.path('/login');
		},
		isAuthenticated:function(){
			var $checkSessionServer=$http.post('/auth/check');
			return $checkSessionServer;
			/*
			if(sessionService.get('user')) return true;
			else return false;
			*/
		}
	}
});