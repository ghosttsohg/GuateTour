angular.module('starter.controllers', [])

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
  
  console.log("INICIANDO BD");
  DataBaseService.doInit();
  console.log("databaseReadyModel:"+DataBaseService.getDataBaseReadyModel());
  //var db = DataBaseService.getDbModel();
  DataBaseService.doDropTable("region");
  DataBaseService.doDropTable("departament");
  
  // create and fill table region
  // Next Regions are temporaly unavailable:
  // ["Central", 		"Chimaltenango, Escuitla, Sacatepequez", "scotland.jpg"],
  // ["Nor-Occidente", 	"Quiche, Huehuetenango", "new-zealand.jpg"],
  // ["Norte", 			"Alta Verapaz, Baja Verapaz", "toronto.jpg"],
  // ["Sur-Oriental", 	"Jalapa, Jutiapa, Santa Rosa", "kyoto.jpg"]
  
			
	DataBaseService.doCreateTable("region", "regionId INTEGER PRIMARY KEY ASC, name TEXT, information TEXT, previsualization TEXT");
	var itRegionValues = 
		[
			["Metropolitana",	"Guatemala", "toronto.jpg"],
			["Sur-Occidente", 	"Quetzaltenango, Retalhuleu, San Marcos, Solola, Suchitepequez, Totonicapan", "kyoto.jpg"],
			["Peten", 			"Peten", "hawaii.jpg"],
			["Nor-Oriental", 	"Chiquimula, El Progreso, Izabal, Zacapa", "scotland.jpg"],
			
		];
	DataBaseService.doInsertTable("region", "name, information, previsualization", itRegionValues);
	// create and fill table departament
	DataBaseService.doCreateTable("departament", "departamentId INTEGER PRIMARY KEY ASC, regionId INTEGER, region, name TEXT, information TEXT, previsualization TEXT, FOREIGN KEY(regionId) REFERENCES region(regionId)");
	var itDepartamentValues = 
		[
			[1, "Guatemala", "Info Guatemala", "toronto.jpg"],
			[2, "Alta Verapaz", "Info Alta Verapaz", "scotland.jpg"],
			[2, "Baja Verapaz", "Info Baja Verapaz", "kyoto.jpg"],
			[3, "Chiquimula", "Info Chiquimula", "new-zealand.jpg"],
			[3, "El Progreso", "Info El Progreso", "hawaii.jpg"],
			[3, "Izabal", "Info Izabal", "toronto.jpg"],
			[3, "Zacapa", "Info Zacapa", "scotland.jpg"],
			[4, "Jutiapa", "Info Jutiapa", "kyoto.jpg"],
			[4, "Jalapa", "Info Jalapa", "new-zealand.jpg"],
			[4, "Santa Rosa", "Info Santa Rosa", "hawaii.jpg"],
			[5, "Chimaltenango", "Info Chimaltenango", "toronto.jpg"],
			[5, "Sacatepequez", "Info Sacatepequez", "scotland.jpg"],
			[5, "Escuintla", "Info Escuintla", "kyoto.jpg"],
			[6, "Quetzaltenango", "Info Quetzaltenango", "new-zealand.jpg"],
			[6, "Retalhuleu", "Info Retalhuleu", "hawaii.jpg"],
			[6, "San Marcos", "Info San Marcos", "toronto.jpg"],
			[6, "Suchitepequez", "Info Suchitepequez", "scotland.jpg"],
			[6, "Solola", "Info Solola", "kyoto.jpg"],
			[6, "Totonicapan", "Info Totonicapan", "new-zealand.jpg"],
			[7, "Huhuetenango", "Info Huhuetenango", "hawaii.jpg"],
			[7, "Quiche", "Info Quiche", "toronto.jpg"],
			[8, "Peten", "Info Peten", "scotland.jpg"]
		];
	DataBaseService.doInsertTable("departament", "regionId, name, information, previsualization", itDepartamentValues);
  
})

.service('DataBaseService', function () {
    //var property = 'First';
	var dbModel, 
	    databaseReadyModel = false,
	    rsModel = [],
	    readyRsModel = false;
    return {
    	getDbModel: function () {
            return dbModel;
        },
        getDataBaseReadyModel: function() {
        	return databaseReadyModel;
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
    	doInit: function() {
    		dbModel = window.openDatabase("guateTourDB", "1.1", "guateTourDB", 500000);
			this.databaseReadyModel = false;
			this.doInitDatabase();
    	},
        doInitDatabase: function() {
        	var current_version = "1.1";
			function errorCDB(err) {
			    console.log('Error creating database',err);
			    console.log('error in db.changeVersion to "'+current_version+'"');
			    console.log(JSON.stringify(err));
			}
			function successCDB() {
			    console.log('Database created');
			    console.log('success on db.changeVersion to "'+current_version+'"');
			    console.log(controller.db.version);
			    databaseReadyModel = true;
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
				console.log("Create Table OK");
			}
			function errorDB(t, e) {
				console.log("Create Table Error:"+e.message);
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
			function successDB(t, r) {
				console.log("Drop Table OK");
			}
			function errorDB(t, e) {
				console.log("Drop Table Error:"+e.message);
			}
			dbModel.transaction(
				function(tx) {
					tx.executeSql(
						"DROP TABLE "+tableName,
						[], 
						successDB,
                    	errorDB
					);
				}
			);
		},
		doInsertTable: function(tableName, tableColumn, tableValue) {
			function successDB(t, r) {
				console.log("Insert On Table OK");
			}
			function errorDB(t, e) {
				console.log("Insert On Table Error:"+e.message);
			}
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
					console.log(query);
					for (var i=0; i<tableValue.length; i++) {
						tx.executeSql(
							query,
							tableValue[i], 
							successDB, 
							errorDB
						);
					}
				}
			);
		},
		getSelectRsTable: function(tableName, tableColumn, whereValue, orderValue) {
			function successDB(t, r) {
				console.log("Select On Table OK");
			}
			function errorDB(t, e) {
				console.log("Select On Table Error:"+e.message);
			}
			dbModel.transaction(
				function(tx) {
					tx.executeSql(
						"SELECT "+tableColumn+" FROM "+tableName+" WHERE "+whereValue+" "+orderValue,
						[],
						function(tx, result) {
							console.log("Select On Table OK");
							//console.log("executeSql rows:"+result.rows.length);
							//console.log("executeSql stringify result:"+JSON.stringify(result.rows));
							rsModel = result.rows;
							readyRsModel = true;
						}, 
						errorDB
					);
				}
			);
		}
    };
})

.controller('PlaylistCtrl', function($scope, $stateParams, $txtPattern) {
})

.controller('RegionCtrl', function($scope, $state, DataBaseService) {
	$scope.regionModel = [];
	DataBaseService.getSelectRsTable("region","regionId, name, information, previsualization","1=1","");
	var interv = setInterval(function(){
  		if (DataBaseService.getReadyRsModel()) {
	  		clearInterval(interv);
	  		DataBaseService.setReadyRsModel(false);
	  		var rs = DataBaseService.getRsModel();
	  		var rows = [];
	  		for (var i=0; i<rs.length; i++) {
				$scope.regionModel.push(rs.item(i));
			}
			console.log("exploreRegionCtrl :"+JSON.stringify($scope.regionModel));
			//$scope.$on("$ionicView.afterEnter", function() {
			//setTimeout(function(){
			    //Waves.displayEffect();
			    setTimeout(function() {
			        Mi.motion.blindsDown({
			            selector: '.card'
			        });
			    }, 500);
			//}, 100);
			//});
	  	}
	  },100);
	$scope.goTo = function(regionId){
		console.log("$scope.goTo");
		console.log("txtRegionId:"+regionId);
		$state.go('app.deptos', {txtRegionId: regionId});		  
   };
})

.controller('DepartamentCtrl', function($scope, $stateParams, DataBaseService) {
	console.log("$stateParams.regionId:"+$stateParams.txtRegionId);
	$scope.departamentModel = [];
	DataBaseService.getSelectRsTable("departament","departamentId, regionId, name, information, previsualization","regionId = "+$stateParams.txtRegionId,"");
	var interv = setInterval(function(){
  		if (DataBaseService.getReadyRsModel()) {
	  		clearInterval(interv);
	  		DataBaseService.setReadyRsModel(false);
	  		var rs = DataBaseService.getRsModel();
	  		for (var i=0; i<rs.length; i++) {
				$scope.departamentModel.push(rs.item(i));
			}
			console.log("exploreDepartamentCtrl :"+JSON.stringify($scope.departamentModel));
	  	}
	  },100);
})

.controller('SearchCtrl', function($scope, $state, DataBaseService) {
	console.log("SearchCtrl");
	$scope.searchDataModel = {};
	$scope.goTo = function(txtPattern){
		console.log("$scope.goTo");
		console.log("txtPattern:"+txtPattern);
		$state.go('app.search', {txtPattern: txtPattern});		  
   };
})

.controller('SearchResultCtrl', function($scope, $state, $stateParams, DataBaseService) {
	console.log("SearchResultCtrl");
	console.log("$stateParams.txtPattern:"+$stateParams.txtPattern);
	$scope.searchResultModel = [];
	DataBaseService.setReadyRsModel(false);
	DataBaseService.getSelectRsTable("region","regionId as id, name","lower(name) like lower('%"+$stateParams.txtPattern+"%')","");
	var interv = 
	setInterval(function(){
  		if (DataBaseService.getReadyRsModel()) {
	  		clearInterval(interv);
	  		DataBaseService.setReadyRsModel(false);
	  		var rs = DataBaseService.getRsModel();
	  		for (var i=0; i<rs.length; i++) {
				$scope.searchResultModel.push(rs.item(i));
			}
			DataBaseService.getSelectRsTable("departament","departamentId as id, name","lower(name) like lower('%"+$stateParams.txtPattern+"%')","");
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

;
