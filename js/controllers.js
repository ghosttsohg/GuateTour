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
	DataBaseService.doCreateTable("region", "regionId INTEGER PRIMARY KEY ASC, name TEXT, information TEXT");
	var itRegionValues = 
		[
			["Metropolitana",	"Info region metropolitana"],
			["Central", 		"Info region Central"],
			["Sur-Occidente", 	"Info region sur-occidente"],
			["Nor-Occidente", 	"Info region nor-occidente"],
			["Peten", 			"Info region peten"],
			["Norte", 			"Info region norte"],
			["Nor-Oriental", 	"Info region nor-oriental"],
			["Sur-Oriental", 	"Info region sur-oriental"]
		];
	DataBaseService.doInsertTable("region", "name, information", itRegionValues);
	// create and fill table departament
	DataBaseService.doCreateTable("departament", "departamentId INTEGER PRIMARY KEY ASC, name TEXT, information TEXT");
	var itDepartamentValues = 
		[
			["Guatemala",	"Info region metropolitana"],
			["Villa Nueva", 		"Info region Central"],
			["San Miguel Petapa", 	"Info region sur-occidente"],
			["Mixco", 	"Info region nor-occidente"],
			["Amatitlan", 			"Info region peten"],
			["Villa Canales", 			"Info region norte"],
			["Chinautla", 	"Info region nor-oriental"]
		];
	DataBaseService.doInsertTable("departament", "name, information", itDepartamentValues);
  
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

.controller('exploreRegionCtrl', function($scope, DataBaseService) {
	$scope.regionModel = [];
	DataBaseService.getSelectRsTable("region","regionId, name, information","1=1","");
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
	  	}
	  },100);
})

.controller('exploreDepartamentCtrl', function($scope, DataBaseService) {
	$scope.departamentModel = [];
	DataBaseService.getSelectRsTable("departament","departamentId, name, information","1=1","");
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

.controller('SearchResultCtrl', function($scope, $stateParams, DataBaseService) {
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
})

;
