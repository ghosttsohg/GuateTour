angular.module('moreActions', ['ionic', 'ngResource', 'ngCordova'])

//Suggestion Controller
.controller('SuggestCtrl', ['$scope', '$http', '$ionicPopup', '$ionicSideMenuDelegate', '$state', '$rootScope', '$cordovaFileTransfer',
function($scope, $http, $ionicPopup, $ionicSideMenuDelegate, $state, $rootScope, $cordovaFileTransfer) {

	//Variables
	$scope.welcomeName = "";

	//Arreglo para datos del usuario
	$scope.reg = {};

	//Variable para armar el WS con el user y pass
	$scope.urlWS = "";

		//Funcion que ejecuta el login
	$scope.suggestion = function(user) {
		console.log("--- $scope.reg.place:" + $scope.reg.place + " ---");
		console.log("--- $scope.reg.location:" + $scope.reg.location + " ---");
		console.log("--- $scope.reg.description:" + $scope.reg.description + " ---");
		console.log("--- $scope.reg.email:" + $scope.reg.email + " ---");
		console.log("--- $scope.reg.image:" + $scope.reg.image + " ---");

		var image = document.getElementById('myImage');
		console.log("--- path:" + reg.image + " ---");
		
	/*	$scope.urlWS = "http://192.168.1.7:8080/DestinosGT/Services/suggestion?place="
			+$scope.reg.place+ "&location=" +$scope.reg.location+ "&description=" +$scope.reg.description+ "&email=" +$scope.reg.email
			+"&image" +$scope.reg.image + "";*/

			//$scope.urlWS = "http://externo.icon.com.gt/DestinosGT/Services/login?user="
	}

//upload method for suggestion
	$scope.upload = function() {
		console.log("--- $scope.reg.place:" + $scope.reg.place + " ---");
		console.log("--- $scope.reg.location:" + $scope.reg.location + " ---");
		console.log("--- $scope.reg.description:" + $scope.reg.description + " ---");
		console.log("--- $scope.reg.email:" + $scope.reg.email + " ---");
		console.log("--- $scope.reg.image:" + $scope.reg.image + " ---");

		
			// Destination URL
			var url = "http://192.168.1.7:8080/DestinosGT/uploadFile";
//			var url = "http://externo.icon.com.gt/DestinosGT/uploadFile";
			var filePath= "/storage/emulated/0/bluetooth/pana.png";
			console.log('---filePath:'+filePath);
			//$scope.picData = fileEntry.nativeURL;
			//console.log('---picData:'+picData);
			
			var mankey = {
				 fileName: filePath.substr(filePath.lastIndexOf('/')+1),
				 mimeType: "image/png",

				 // directory represents remote directory,  fileName represents final remote file name
				params : {
							'place':$scope.reg.place, 
							'location':$scope.reg.location, 
							'description':$scope.reg.description, 
							'email':$scope.reg.email}
			 };
			 
					$cordovaFileTransfer.upload(encodeURI(url), filePath, mankey).then(function(result) {
					console.log("SUCCESS: " + JSON.stringify(result.response));
					var alertPopupSuccess1 = $ionicPopup.alert({
						title : '<div class="titlePopup"> Gracias! </div>',
						template : '<div class="templatePopup">Tu sugerencia fue enviada con éxito, pronto será atendida por nuestros administradores. {{result.response}}</div>',
						okType : 'button-energized',
						});
						$scope.reg = $scope.$new(true);
						$state.go('app.browse');
			}, function(err) {
					console.log("ERROR: " + JSON.stringify(err));
					var alertPopupError1 = $ionicPopup.alert({
						title : '<div class="titlePopup"> Ups, lo sentimos! </div>',
						template : '<div class="templatePopup">Hubo un problema al enviar tu sugerencia, por favor intenta más tarde. {{err}}</div>',
						okType : 'button-energized',
						});
			}, function (progress) {
					// constant progress updates
			});
}
}])
//Controlador para leer archivo **PENDIENTE

/*.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);*/

//Module Ends
;