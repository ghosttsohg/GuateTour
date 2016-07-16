angular.module('services', ['ionic', 'ngResource'])

.controller('FacebookLoginCtrl', function($scope, $state, $q, UserService, $ionicLoading, $rootScope) {

	var user = {};
	
	console.log('--FacebookLoginCtrl Starts --'+$rootScope.fbLogged);
	 
  // This is the success callback from the login method
  var fbLoginSuccess = function(response) {
    if (!response.authResponse){
      fbLoginError("Cannot find the authResponse");
	  console.log('--Cannot find the authResponse');
      return;
    }

    var authResponse = response.authResponse;

    getFacebookProfileInfo(authResponse)
    .then(function(profileInfo) {
      // For the purpose of this example I will store user data on local storage
      UserService.setUser({
        authResponse: authResponse,
				userID: profileInfo.id,
				name: profileInfo.name,
				email: profileInfo.email,
        picture : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
      });
      $ionicLoading.hide();
      //$state.go('app.home');
    }, function(fail){
      // Fail get profile info
      console.log('--profile info fail', fail);
    });
  };

  // This is the fail callback from the login method
  var fbLoginError = function(error){
    console.log('--fbLoginError', error);
    $ionicLoading.hide();
  };

  // This method is to get the user profile info from the facebook api
  var getFacebookProfileInfo = function (authResponse) {
    var info = $q.defer();
	

    facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
      function (response) {
				console.log(response);
				console.log('--Name:'+response.name);
				user.name = response.name;
				console.log('--Name:'+user.name);
				user.email = response.email;
				console.log('--Email:'+user.email);
				
        info.resolve(response);
		$state.go('app.browse');
      },
      function (response) {
				console.log(response);
        info.reject(response);
      }
    );
    return info.promise;
  };

  //This method is executed when the user press the "Login with facebook" button
  $scope.facebookSignIn = function() {
    facebookConnectPlugin.getLoginStatus(function(success){
      if(success.status === 'connected'){
		$rootScope.fbLogged = "OK";
        // The user is logged in and has authenticated your app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed request, and the time the access token
        // and signed request each expire
        console.log('--getLoginStatus', success.status);

    		// Check if we have our user saved
    		var user = UserService.getUser('facebook');
			console.log('--getLoginStatus - user:'+user);
				
    		if(!user.userID){
					getFacebookProfileInfo(success.authResponse)
					.then(function(profileInfo) {
						// For the purpose of this example I will store user data on local storage
						UserService.setUser({
							authResponse: success.authResponse,
							userID: profileInfo.id,
							name: profileInfo.name,
							email: profileInfo.email,
							picture : "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
						});

						$state.go('app.home');
					}, function(fail){
						// Fail get profile info
						console.log('--profile info fail', fail);
					});
				}else{
					$state.go('app.browse');
				}
      } else {
        // If (success.status === 'not_authorized') the user is logged in to Facebook,
				// but has not authenticated your app
        // Else the person is not logged into Facebook,
				// so we're not sure if they are logged into this app or not.

				console.log('--Not logged');

			$ionicLoading.show({
          template: 'Logging in...'
        });

				// Ask the permissions you need. You can learn more about
				// FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
        facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
      }
    });
  };
	console.log('--FacebookLoginCtrl Ends --');
})

.service('UserService', function() {
	 console.log('--UserService Starts --');
  // For the purpose of this example I will store user data on ionic local storage but you should save it on a database
  var setUser = function(user_data) {
    window.localStorage.starter_facebook_user = JSON.stringify(user_data);
  };

  var getUser = function(){
	return JSON.parse(window.localStorage.starter_facebook_user || '{}');
  };

  //$scope.urlWS = "http://192.168.1.7:8080/DestinosGT/Services/login/registro?nombre="+ $scope.reg.name +"&apellido="+$scope.reg.surname
			//$scope.urlWS = "http://externo.icon.com.gt/DestinosGT/Services/login/registro?nombre=" + $scope.reg.name + "&apellido=" + $scope.reg.surname
				//	+"&email=" + $scope.reg.email + "&user=" + $scope.reg.username + "&pass=" + $scope.reg.pass;
  	  console.log('---Log 2 getUser.name:'+getUser.name);
  return {
    getUser: getUser,
    setUser: setUser
  };
   console.log('--UserService Ends --');
})

.controller('FacebookLogoutCtrl', function($scope, UserService, $ionicActionSheet, $state, $ionicLoading){
	$scope.user = UserService.getUser();
	console.log('--Logout:',user);
	
	$scope.showLogOutMenu = function() {
		var hideSheet = $ionicActionSheet.show({
			destructiveText: 'Logout',
			titleText: 'Are you sure you want to logout? This app is awsome so I recommend you to stay.',
			cancelText: 'Cancel',
			cancel: function() {},
			buttonClicked: function(index) {
				return true;
			},
			destructiveButtonClicked: function(){
				$ionicLoading.show({
				  template: 'Logging out...'
				});

        // Facebook logout
        facebookConnectPlugin.logout(function(){
          $ionicLoading.hide();
          $state.go('app.welcome');
        },
        function(fail){
          $ionicLoading.hide();
        });
			}
		});
	};
})

;