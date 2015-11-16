angular.module('starter.controllers', ['ionic','ngResource'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, DataBaseService) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
  
  // INICIANDO BD  
  DataBaseService.doOpenDB();
  if (appOptions.dbCreate) {
  	console.log("CREANDO DB");
  	fillDB(DataBaseService);
  	appOptions.dbCreate = false;
  } else {
  	console.log("NO Crear BD");
  }
  
  testTable('GeographicDistribution', DataBaseService);
    
})

.service('DataBaseService', function () {
	var dbModel, 
	    databaseReadyModel = false,
	    readyRsModel = false,
	    rsModel = [];
    return {
    	getDbModel: function () {
            return dbModel;
        },
        getDataBaseReadyModel: function() {
        	return databaseReadyModel;
        },
        setDataBaseReadyModel: function(value) {
        	databaseReadyModel = value;
        },
        getRsModel: function() {
        	return rsModel; 
        },
        getReadyRsModel: function () {
            return readyRsModel;
        },
        setReadyRsModel: function (value) {
            readyRsModel = value;
        },
        doOpenDB: function() {
        	console.log("DataBaseService.doOpenDB");
        	dbModel = window.openDatabase("guateTourDB", "1.1", "guateTourDB", 500000);
        },
        doVerifyDB: function() {
        	console.log("DataBaseService.doVerifyDB");
			dbModel.transaction(
				function(tx) {
					tx.executeSql(
						"SELECT 1 FROM geographicDistribution",
						[],
						function(tx, result) {
							console.log("Select On Table geographicDistribution OK");
							console.log("	VerifyDB is created");
							databaseReadyModel = true;
						}, 
						function(tx, result) {
							console.log("Select On Table geographicDistribution ERROR");
							console.log("	VerifyDB is not created");
							databaseReadyModel = false;
						}
					);
				}
			);
    	},
        
    	doInit: function() {
    		console.log("DataBaseService.doInit");
    		//dbModel = window.openDatabase("guateTourDB", "1.1", "guateTourDB", 500000);
			databaseReadyModel = false;
			this.doInitDatabase();
    	},
    	doInitDatabase: function() {
    		console.log("DataBaseService.doInitDatabase");
        	var current_version = "1.1";
        	function successCDB() {
			    console.log('Database created');
			    console.log('success on db.changeVersion to "'+current_version+'"');
			    console.log(controller.db.version);
			    databaseReadyModel = true;
			}
			function errorCDB(err) {
			    console.log('Error creating database',err);
			    console.log('error in db.changeVersion to "'+current_version+'"');
			    console.log(JSON.stringify(err));
			}
			switch(dbModel.version){
			    case "":
					console.log('db.version == ""');
			        dbModel.changeVersion(
			        	"", //none version 
			        	current_version,
	                    function(tx) {
	                    	
	                    },
	                    successCDB,
	                    errorCDB
	               );
			       break;
			    case current_version:
			        console.log('db.version is already "'+current_version+'"');
			        databaseReadyModel = true;
		        	break;
			}
        },
    	
        doCreateTable: function(tableName, tableColumn) {
			function successDB(t, r) {
				console.log("Create Table "+tableName+" OK");
			}
			function errorDB(t, e) {
				console.log("Create Table "+tableName+" Error:"+e.message);
			}
			if (tableName != null) {
				dbModel.transaction(
					function(tx) {
						tx.executeSql(
							"CREATE TABLE IF NOT EXISTS "+tableName+" ("+tableColumn+")",
							[], 
							successDB,
	                    	errorDB
						);
					}
				);
			}
		},
		doDropTable: function(tableName) {
			dbModel.transaction(
				function(tx) {
					tx.executeSql(
						"DROP TABLE "+tableName,
						[], 
						function(tx, result) {
							console.log("Drop Table "+tableName+" OK");
						}, 
						function(tx, result) {
							console.log("Drop Table "+tableName+" Error:"+result.message);
						}
					);
				}
			);
		},
		doInsertTable: function(tableName, tableColumn, tableValue) {
			dbModel.transaction(
				function(tx) {
					var columns = tableColumn.split(",");
					var params = "";
					for (var i=0; i<columns.length; i++) {
						params+="?";
						if (i<columns.length-1)
							params+=",";
					}
					var query = "INSERT INTO "+tableName+" ("+tableColumn+") values ("+params+")";
					// console.log(query);
					// console.log(JSON.stringify(tableValue));
					// console.log("tableValue.length:"+tableValue.length);
					if (tableValue.length!=null && tableValue.length>0) {
						for (var i=0; i<tableValue.length; i++) {
							tx.executeSql(
								query,
								tableValue[i], 
								function(tx, result) {
									console.log("Insert On Table "+tableName+" OK");
								}, 
								function(tx, result) {
									console.log("Insert On Table Error:"+result.message);
								}
							);
						}
					} else {
						tx.executeSql(
							query,
							tableValue[i], 
							function(tx, result) {
								console.log("Insert On Table "+tableName+" OK");
							}, 
							function(tx, result) {
								console.log("Insert On Table Error:"+result.message);
							}
						);
					}
				}
			);
		},
		getSelectRsTable: function(tableName, tableColumn, whereValue, orderValue) {
			dbModel.transaction(
				function(tx) {
					tx.executeSql(
						"SELECT "+tableColumn+" FROM "+tableName+" WHERE "+whereValue+" "+orderValue,
						[],
						function(tx, result) {
							console.log("Select On Table "+tableName+" OK");
							//console.log("executeSql rows:"+result.rows.length);
							//console.log("executeSql stringify result:"+JSON.stringify(result.rows));
							rsModel = result.rows;
							readyRsModel = true;
						}, 
						function(tx, result) {
							console.log("Select On Table "+tableName+" Error:"+result.message);
						}
					);
				}
			);
		}
    };
})

.controller('MenuCtrl', function($scope, $state, DataBaseService) {
	$scope.searchDataModel = {};
	$scope.goTo = function(txtState){
		console.log("$scope.goTo");
		console.log("txtState:"+txtState);
		$state.go(txtState);		  
    };
	$scope.goSearch = function(txtPattern){
		console.log("$scope.goSearch");
		console.log("txtPattern:"+txtPattern);
		$state.go('app.search', {txtPattern: txtPattern});		  
    };
	
	$scope.exit = function(){
		console.log("$scope.exit");
		ionic.Platform.exitApp(); // stops the app
		console.log("$scope.exit here");
	};
})


.controller('RegionCtrl', function($scope, $state, DataBaseService) {
	console.log("RegionCtrl");
	console.log("RegionCtrl:DataBaseService.getDataBaseReadyModel:"+DataBaseService.getDataBaseReadyModel());
	$scope.regionModel = [];
	DataBaseService.getSelectRsTable("geographicDistribution","*","categoryType = 1 and fatherId = 0","order by name asc");
	//"fatherId, categoryType, name, introduction, information, previsualization", itemValues);
	var interv = setInterval(function(){
  		if (DataBaseService.getReadyRsModel()) {
	  		clearInterval(interv);
	  		DataBaseService.setReadyRsModel(false);
	  		var rs = DataBaseService.getRsModel();
	  		var rows = [];
	  		for (var i=0; i<rs.length; i++) {
	  			console.log("Region:"+rs.item(i).name);
				$scope.regionModel.push(rs.item(i));
			}
			//console.log("exploreRegionCtrl :"+JSON.stringify($scope.regionModel));
			//$scope.$on("$ionicView.afterEnter", function() {
			    setTimeout(function() {
			        Mi.motion.blindsDown({
			            selector: '.card'
			        });
			        Waves.displayEffect();
			    }, 1000);
			//});
	  	}
	},100);
	$scope.goTo = function(txtState, regionId){
		console.log("$scope.goTo");
		console.log("txtState:"+txtState);
		console.log("txtRegionId:"+regionId);
		$state.go(txtState, {txtRegionId: regionId});		  
    };
})

.controller('DepartmentCtrl', function($scope, $state, DataBaseService, $stateParams) {
	console.log("DepartmentCtrl");
	console.log("DepartmentCtrl:DataBaseService.getDataBaseReadyModel:"+DataBaseService.getDataBaseReadyModel());
	console.log("$stateParams.regionId:"+$stateParams.txtRegionId);
	$scope.departamentModel = [];
	DataBaseService.getSelectRsTable("geographicDistribution","*","categoryType = 2 and fatherId = "+$stateParams.txtRegionId,"order by name asc");
	var interv = setInterval(function(){
  		if (DataBaseService.getReadyRsModel()) {
	  		clearInterval(interv);
	  		DataBaseService.setReadyRsModel(false);
	  		var rs = DataBaseService.getRsModel();
	  		console.log("rs:"+rs.length);
	  		for (var i=0; i<rs.length; i++) {
	  			console.log("Department:"+rs.item(i).name);
				$scope.departamentModel.push(rs.item(i));
			}
			setTimeout(function() {
	            // Mi.motion.slideUp('.slide-up');
	            Waves.displayEffect();
	        }, 1000);
	  	}
    },500);
    $scope.goTo = function(txtState, departmentId){
		console.log("$scope.goTo");
		console.log("txtState:"+txtState);
		console.log("txtDepartmentId:"+departmentId);
		$state.go(txtState, {txtDepartmentId: departmentId});		  
    };
})

.controller('SiteCtrl', function($scope, $state, DataBaseService, $stateParams) {
	console.log("siteCtrl");
	console.log("siteCtrl:DataBaseService.getDataBaseReadyModel:"+DataBaseService.getDataBaseReadyModel());
	console.log("$stateParams.departmentId:"+$stateParams.txtDepartmentId);
	$scope.siteModel = [];
	DataBaseService.getSelectRsTable("geographicDistribution","*","categoryType = 3 and fatherId = "+$stateParams.txtDepartmentId,"order by name asc");
	var interv = setInterval(function(){
  		if (DataBaseService.getReadyRsModel()) {
	  		clearInterval(interv);
	  		DataBaseService.setReadyRsModel(false);
	  		var rs = DataBaseService.getRsModel();
	  		console.log("rs:"+rs.length);
	  		for (var i=0; i<rs.length; i++) {
	  			console.log("Site:"+rs.item(i).name);
				$scope.siteModel.push(rs.item(i));
			}
			setTimeout(function() {
	            // Mi.motion.slideUp('.slide-up');
	            Waves.displayEffect();
	        }, 1000);
	  	}
    },500);
    $scope.goTo = function(txtState, txtSiteId, txtTabId){
		console.log("$scope.goTo");
		console.log("txtState:"+txtState);
		console.log("txtSiteId:"+txtSiteId);
		console.log("txtTabId:"+txtTabId);
		$state.go(txtState, {txtSiteId: txtSiteId, txtTabId: txtTabId});		  
    };
    $scope.goToGallerySite = function(siteId){
		console.log("$scope.goTo");
		console.log("txtState:app.siteProfile");
		console.log("txtSiteId:"+siteId);
		$state.go('app.siteGallery', {txtSiteId: siteId, txtTabId: 'gallery'});		  
    };
})


.controller('SiteProfileCtrl', function($scope, $sce, $state, DataBaseService, $stateParams, $ionicTabsDelegate) {
	console.log("SiteProfileCtrl");
	console.log("SiteProfileCtrl:DataBaseService.getDataBaseReadyModel:"+DataBaseService.getDataBaseReadyModel());
	console.log("$stateParams.txtSiteId:"+$stateParams.txtSiteId);
	console.log("$stateParams.txtTabId:"+$stateParams.txtTabId);
	$scope.siteProfileModel = [];
	$scope.siteProfileContent = '';
	DataBaseService.getSelectRsTable("geographicDistribution","*","categoryType = 3 and id = "+$stateParams.txtSiteId,"");
	var interv = setInterval(function(){
  		if (DataBaseService.getReadyRsModel()) {
	  		clearInterval(interv);
	  		DataBaseService.setReadyRsModel(false);
	  		var rs = DataBaseService.getRsModel();
	  		for (var i=0; i<rs.length; i++) {
	  			console.log("Site:"+rs.item(i).name);
				$scope.siteProfileModel.push(rs.item(i));
				if ($stateParams.txtTabId == 'services') {
					$scope.siteProfileContent = $sce.trustAsHtml(rs.item(i).services);
				} else if ($stateParams.txtTabId == 'location') {
					$scope.siteProfileContent = $sce.trustAsHtml(rs.item(i).location);
				} else {
					$scope.siteProfileContent = $sce.trustAsHtml(rs.item(i).information);
				}
			}
			setTimeout(function() {
		        Mi.motion.fadeSlideInRight({
		            selector: '.animate-fade-slide-in-right > *'
		        });
		        Waves.displayEffect();
		    }, 1000);
	  	}
    },500);
    var arrayImages = [
    	'./templates/images/ionic.jpg',
    	'./templates/images/hawaii.jpg',
    	'./templates/images/thum_selfieMonkey1.jpg',
    	'./templates/images/thumb_banerCollageGT1.jpg',
    	'./templates/images/thumb_castilloSanFelipeGt1.jpg',
    	'./templates/images/thumb_IglesiaSantaDelfinaGt1.jpg',
    	'./templates/images/thumb_irtraReuGt1.jpg',
    	'./templates/images/thumb_MuseoPopolVuhGt1.jpg',
    	'./templates/images/thumb_parqueLaAuroraGt1.jpg',
    	'./templates/images/thumb_petenGt1.jpg',
    	'./templates/images/thumb_PlayDoradaGt1.jpg',
    	'./templates/images/thumb_RaftingGt1.jpg',
    	'./templates/images/thumb_SemucChampeyGt1.jpg',
    	'./templates/images/thumb_TeatroAbrilGt1.jpg',
    	'./templates/images/thumb_teatroNacionalGt1.jpg'
    ]
    $scope.images = [];
    $scope.loadImages = function() {
        for(var i = 0; i < arrayImages.length; i++) {
            $scope.images.push({id: i, src: arrayImages[i]});
        }
    }
})


.controller('SearchResultCtrl', function($scope, $state, DataBaseService, $stateParams) {
	console.log("SearchResultCtrl");
	console.log("SearchResultCtrl:DataBaseService.getDataBaseReadyModel:"+DataBaseService.getDataBaseReadyModel());
	console.log("$stateParams.txtPattern:"+$stateParams.txtPattern);
	$scope.searchResultModel = [];
	DataBaseService.setReadyRsModel(false);
	DataBaseService.getSelectRsTable("region","id, name","lower(name) like lower('%"+$stateParams.txtPattern+"%')","");
	var interv = 
	setInterval(function(){
  		if (DataBaseService.getReadyRsModel()) {
	  		clearInterval(interv);
	  		DataBaseService.setReadyRsModel(false);
	  		var rs = DataBaseService.getRsModel();
	  		for (var i=0; i<rs.length; i++) {
				$scope.searchResultModel.push(rs.item(i));
			}
			DataBaseService.getSelectRsTable("departament","id, name","lower(name) like lower('%"+$stateParams.txtPattern+"%')","");
			var interv2 = 
			setInterval(function(){
		  		if (DataBaseService.getReadyRsModel()) {
			  		clearInterval(interv2);
			  		DataBaseService.setReadyRsModel(false);
			  		var rs2 = DataBaseService.getRsModel();
			  		for (var i=0; i<rs2.length; i++) {
						$scope.searchResultModel.push(rs2.item(i));
					}
					if ($scope.searchResultModel==null || $scope.searchResultModel.length<=0) {
						$scope.searchResultModel.push({name:'No se encontraron coincidencias'});
					}
			  	}
			},100);
	    }
	},100);
	$scope.goTo = function(regionId){
		console.log("$scope.goTo");
		console.log("txtRegionId:"+regionId);
		$state.go('app.deptos', {txtRegionId: regionId});		  
   };
})

.controller('TourTypeCtrl', function($scope, $state, DataBaseService) {
	console.log("TourTypeCtrl");
	console.log("TourTypeCtrl:DataBaseService.getDataBaseReadyModel:"+DataBaseService.getDataBaseReadyModel());
	$scope.tourTypeModel = [];
	DataBaseService.getSelectRsTable("tourDistribution","*","categoryType = 1 and fatherId = 0","order by name asc");
	var interv = setInterval(function(){
  		if (DataBaseService.getReadyRsModel()) {
	  		clearInterval(interv);
	  		DataBaseService.setReadyRsModel(false);
	  		var rs = DataBaseService.getRsModel();
	  		var rows = [];
	  		for (var i=0; i<rs.length; i++) {
	  			console.log("Type:"+rs.item(i).name);
				$scope.tourTypeModel.push(rs.item(i));
			}
		    setTimeout(function() {
		        Mi.motion.blindsDown({
		            selector: '.card'
		        });
		        Waves.displayEffect();
		    }, 1000);
	  	}
	},100);
	$scope.goTo = function(txtState, typeId){
		console.log("$scope.goTo");
		console.log("txtState:"+txtState);
		console.log("txtTypeId:"+typeId);
		$state.go(txtState, {txtTypeId: typeId});		  
    };
})

.controller('TourCtrl', function($scope, $state, DataBaseService, $stateParams) {
	console.log("TourCtrl");
	console.log("TourCtrl:DataBaseService.getDataBaseReadyModel:"+DataBaseService.getDataBaseReadyModel());
	console.log("$stateParams.typeId:"+$stateParams.txtTypeId);
	$scope.tourModel = [];
	DataBaseService.getSelectRsTable("tourDistribution","*","categoryType = 2 and fatherId = "+$stateParams.txtTypeId,"order by name asc");
	var interv = setInterval(function(){
  		if (DataBaseService.getReadyRsModel()) {
	  		clearInterval(interv);
	  		DataBaseService.setReadyRsModel(false);
	  		var rs = DataBaseService.getRsModel();
	  		for (var i=0; i<rs.length; i++) {
	  			console.log("Tour:"+rs.item(i).name);
				$scope.tourModel.push(rs.item(i));
			}
			setTimeout(function() {
	            // Mi.motion.slideUp('.slide-up');
	            Waves.displayEffect();
	        }, 1000);
	  	}
    },500);
    $scope.goTo = function(txtState, tourId){
		console.log("$scope.goTo");
		console.log("txtState:"+txtState);
		console.log("txtTourId:"+tourId);
		$state.go(txtState, {txtTourId: tourId});		  
    };
})

.controller('LoginCtrl', ['$scope', '$http', function($scope, $http) {
	console.log("-- LoginCtrl Inicio --");
	//Nombre de bienvenida
	$scope.welcomeName = "";
	$scope.errorMsg = "";
	
	//Arreglo que contendrá los datos de usuario que devuelve el WS
	$scope.user = {};
	
	//Variable para armar el WS con el user y pass
	$scope.urlWS = "";
	
	//Función que ejecuta el login
	$scope.login = function(user) {
		console.log("--- login()- user.username:"+$scope.user.username +" - user.pass:"+$scope.user.pass +" ---");	
		$scope.urlWS = "http://192.168.1.6:8080/DestinosGT/Services/login?user="+$scope.user.username +"&pass="+$scope.user.pass +""; //localhost-192.168.1.6
	
		//$http.get('http://localhost:8080/DestinosGT/Services/login?user=woody&pass=abc').then(function(resp) { -- cambiar por 192.168.15.6
		$http.get($scope.urlWS).then(function(resp) {
		
			 console.log("-- OK :) --" + resp.data.id);
		 	$scope.welcomeName = resp.data.username;
			$scope.errorMsg = resp.data.message;
		
		  }, function(err) {
			console.error('ERR', err);
			 console.log("-- ERROR:"+err.status) // err.status will contain the status code
		  })
	};
	
	console.log("-- LoginCtrl Fin --");
}])

//REGISTRO
//	$scope.showChanged = function(username){
//		$scope.username = username;
//		console.log("-- username:"+$scope.username +" --");
//	};
//	
//	$scope.showChanged1 = function(pass){
//		$scope.pass = pass;
//		console.log("-- pass:"+$scope.pass +" --");
//	};

;