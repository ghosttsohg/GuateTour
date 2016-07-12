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

			var win = function(r) {
				alert("Good job! " + error.code);
				console.log("Code = " + r.responseCode);
				console.log("Response = " + r.response);
				console.log("Sent = " + r.bytesSent);
			}

			var fail = function(error) {
				alert("An error has occurred: Code = " + error.code);
				console.log("upload error source " + error.source);
				console.log("upload error target " + error.target);
			}
			
			// Destination URL
			var url = "http://192.168.1.7:8080/DestinosGT/uploadFile";
//			var url = "http://externo.icon.com.gt/DestinosGT/uploadFile";
			var fileURI = "Memoria interna/bluetooth/pana.png";
			
			
			console.log("--- path:" + fileURI + " ---");
			
			/*var options = {
				 fileKey: "file",
				 fileName: fileURI.substr(fileURI.lastIndexOf('/')+1),
				 chunkedMode: false,
				 mimeType: "image/png",
				 // directory represents remote directory,  fileName represents final remote file name
			//	params : {'place':'reg.place', 'location':'reg.location', 'description':'reg.description', 'email':'reg.email'}
			 };*/
			 
			 var options = new FileUploadOptions();
				options.fileKey = "file";
				options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
				options.mimeType = "text/plain";
				options.chunkedMode = true;

				var params = {};
				params.place = "reg.place";
				params.location = "reg.location";

				options.params = params;


			$cordovaFileTransfer.upload(fileURI, encodeURI(url), win, fail,  options).then(function(result) {
					console.log("SUCCESS: " + JSON.stringify(result.response));
					var alertPopupSuccess1 = $ionicPopup.alert({
						title : '<div class="titlePopup"> SUCCESS </div>',
						template : '<div class="templatePopup">SUCCESS {{result.response}}</div>',
						okType : 'button-energized',
						});
			}, function(err) {
					console.log("ERROR: " + JSON.stringify(err));
					var alertPopupError1 = $ionicPopup.alert({
						title : '<div class="titlePopup"> ERROR </div>',
						template : '<div class="templatePopup">ERROR {{err}}</div>',
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