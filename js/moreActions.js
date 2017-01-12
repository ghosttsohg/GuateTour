angular.module('moreActions', ['ionic', 'ngResource', 'ngCordova'])

//Suggestion Controller
.controller('SuggestCtrl', ['$scope', '$http', '$ionicPopup', '$ionicSideMenuDelegate', '$state', '$rootScope', '$cordovaFileTransfer', '$cordovaFile',
function($scope, $http, $ionicPopup, $ionicSideMenuDelegate, $state, $rootScope, $cordovaFileTransfer, $cordovaFile) {

	//Variables
	//Arreglo para datos de la sugerencia
	$scope.reg = {};

	//Variable para armar el WS con el user y pass
	var url = "";
	var filePath = "";
	
	//Alertas éxito/error
	var alertPopupSuccess1 = "";
	var alertPopupError1 =  "";

	//Función para cargar la imagen
	$scope.filepathChooser = function() {
		//window.plugins.mfilechooser.open([], function (uri) {
		fileChooser.open(function(uri) {
		   //Here uri provides the selected file path.
			console.log('---File path selected', uri);
			filePath = uri;
			//alert(uri);
		}, function (error) {
			console.log('---Error', error);
			alert(error);
		});
	}

	//upload method for suggestion
	$scope.upload = function(file) {
		console.log("--- $scope.reg.place:" + $scope.reg.place + " ---");
		console.log("--- $scope.reg.location:" + $scope.reg.location + " ---");
		console.log("--- $scope.reg.description:" + $scope.reg.description + " ---");
		console.log("--- $scope.reg.email:" + $scope.reg.email + " ---");
		
			// Destination URL
			//url = "http://externo.icon.com.gt/DestinosGT/uploadFile";
			 url = "http://externo.icon.com.gt/DestinosGT_ADM/uploadFile";
			console.log('---upload() - filePath:'+filePath);
			
			var mankey = {
				 fileName: filePath.substr(filePath.lastIndexOf('/')+1),
				 mimeType: "image/png",
				 params : {
							'place':$scope.reg.place, 
							'location':$scope.reg.location, 
							'description':$scope.reg.description, 
							'email':$scope.reg.email}
			};
					console.log("fileName: " + mankey);
					$cordovaFileTransfer.upload(encodeURI(url), filePath, mankey).then(function(result) {
					console.log("SUCCESS: " + JSON.stringify(result.response));
					alertPopupSuccess1 = $ionicPopup.alert({
						title : '<div class="titlePopup"> Gracias! </div>',
						template : '<div class="templatePopup">Tu sugerencia fue enviada con éxito, pronto será atendida por nuestros administradores. {{result.response}}</div>',
						okType : 'button-energized',
						});
						$scope.reg = $scope.$new(true);
						filePath = null;
						$state.go('app.browse');
			}, function(err) {
					console.log("ERROR: " + JSON.stringify(err));
					alertPopupError1 = $ionicPopup.alert({
						title : '<div class="titlePopup"> Ups, lo sentimos! </div>',
						template : '<div class="templatePopup">Hubo un problema al enviar tu sugerencia, por favor intenta más tarde. {{err}}</div>',
						okType : 'button-energized',
						});
			}, function (progress) {
					// constant progress updates
			});
	}
	
	//Función para campos requeridos
	$scope.requiredField = function() {
		if($scope.reg.place == "undefined" || $scope.reg.location == "undefined" || $scope.reg.description == "undefined" || $scope.reg.email == "undefined"){
			console.log('---Campos requeridos');
			$scope.reqMessage = "El lugar es requerido."
		}
		
	}
}])

//Module Ends
;