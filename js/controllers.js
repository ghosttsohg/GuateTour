angular.module('starter.controllers', ['ionic', 'ngResource','ngCordova'])
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
		scope : $scope
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
		//appOptions.dbCreate = false;
	} else {
		console.log("NO Crear BD");
	}

	//testTable('GeographicDistribution', DataBaseService);
	//testTable('Gallery', DataBaseService);
	//testTable('TourDistribution', DataBaseService);
	//testTable('TourSiteRoute', DataBaseService);
}).service('DataBaseService', function() {
	var dbModel,
	    databaseReadyModel = false,
	    readyRsModel = false,
	    rsModel = [];
	return {
		getDbModel : function() {
			return dbModel;
		},
		getDataBaseReadyModel : function() {
			return databaseReadyModel;
		},
		setDataBaseReadyModel : function(value) {
			databaseReadyModel = value;
		},
		getRsModel : function() {
			return rsModel;
		},
		getReadyRsModel : function() {
			return readyRsModel;
		},
		setReadyRsModel : function(value) {
			readyRsModel = value;
		},
		doOpenDB : function() {
			console.log("DataBaseService.doOpenDB");
			dbModel = window.openDatabase("guateTourDB", "1.1", "guateTourDB", 500000);
		},
		doVerifyDB : function() {
			console.log("DataBaseService.doVerifyDB");
			dbModel.transaction(function(tx) {
				tx.executeSql("SELECT 1 FROM GeographicDistribution", [], function(tx, result) {
					console.log("Select On Table GeographicDistribution OK");
					console.log("	VerifyDB is created");
					databaseReadyModel = true;
				}, function(tx, result) {
					console.log("Select On Table GeographicDistribution ERROR");
					console.log("	VerifyDB is not created");
					databaseReadyModel = false;
				});
			});
		},

		doInit : function() {
			console.log("DataBaseService.doInit");
			//dbModel = window.openDatabase("guateTourDB", "1.1", "guateTourDB", 500000);
			databaseReadyModel = false;
			this.doInitDatabase();
		},
		doInitDatabase : function() {
			console.log("DataBaseService.doInitDatabase");
			var current_version = "1.1";
			function successCDB() {
				console.log('Database created');
				console.log('success on db.changeVersion to "' + current_version + '"');
				console.log(controller.db.version);
				databaseReadyModel = true;
			}

			function errorCDB(err) {
				console.log('Error creating database', err);
				console.log('error in db.changeVersion to "' + current_version + '"');
				console.log(JSON.stringify(err));
			}

			switch(dbModel.version) {
			case "":
				console.log('db.version == ""');
				dbModel.changeVersion("", //none version
				current_version, function(tx) {

				}, successCDB, errorCDB);
				break;
			case current_version:
				console.log('db.version is already "' + current_version + '"');
				databaseReadyModel = true;
				break;
			}
		},

		doCreateTable : function(tableName, tableColumn) {
			function successDB(t, r) {
				console.log("Create Table " + tableName + " OK");
			}

			function errorDB(t, e) {
				console.log("Create Table " + tableName + " Error:" + e.message);
			}

			if (tableName != null) {
				dbModel.transaction(function(tx) {
					tx.executeSql("CREATE TABLE IF NOT EXISTS " + tableName + " (" + tableColumn + ")", [], successDB, errorDB);
				});
			}
		},
		doDropTable : function(tableName) {
			dbModel.transaction(function(tx) {
				tx.executeSql("DROP TABLE " + tableName, [], function(tx, result) {
					console.log("Drop Table " + tableName + " OK");
				}, function(tx, result) {
					console.log("Drop Table " + tableName + " Error:" + result.message);
				});
			});
		},
		doInsertTable : function(tableName, tableColumn, tableValue) {
			dbModel.transaction(function(tx) {
				var columns = tableColumn.split(",");
				var params = "";
				for (var i = 0; i < columns.length; i++) {
					params += "?";
					if (i < columns.length - 1)
						params += ",";
				}
				var query = "INSERT INTO " + tableName + " (" + tableColumn + ") values (" + params + ")";
				// console.log(query);
				// console.log(JSON.stringify(tableValue));
				// console.log("tableValue.length:"+tableValue.length);
				if (tableValue.length != null && tableValue.length > 0) {
					for (var i = 0; i < tableValue.length; i++) {
						tx.executeSql(query, tableValue[i], function(tx, result) {
							console.log("Insert On Table " + tableName + " OK");
						}, function(tx, result) {
							console.log("Insert On Table Error:" + result.message);
						});
					}
				} else {
					tx.executeSql(query, tableValue[i], function(tx, result) {
						console.log("Insert On Table " + tableName + " OK");
					}, function(tx, result) {
						console.log("Insert On Table Error:" + result.message);
					});
				}
			});
		},
		getSelectRsTable : function(tableName, tableColumn, whereValue, orderValue) {
			dbModel.transaction(function(tx) {
				//console.log("SELECT " + tableColumn + " FROM " + tableName + " WHERE " + whereValue + " " + orderValue);
				tx.executeSql("SELECT " + tableColumn + " FROM " + tableName + " WHERE " + whereValue + " " + orderValue, [], function(tx, result) {
					console.log("Select On Table " + tableName + " OK");
					//console.log("executeSql rows:"+result.rows.length);
					//console.log("executeSql stringify result:"+JSON.stringify(result.rows));
					rsModel = result.rows;
					readyRsModel = true;
				}, function(tx, result) {
					console.log("Select On Table " + tableName + " Error:" + result.message);
				});
			});
		}
	};
}).controller('MenuCtrl', function($scope, $state, DataBaseService, $rootScope, $ionicPopup, $ionicSideMenuDelegate) {
	$rootScope.logged = '';
	//Valor inicial debe ser ''
	$scope.searchDataModel = {};
	$scope.goTo = function(txtState) {
		console.log("$scope.goTo");
		console.log("txtState:" + txtState);
		$state.go(txtState);
	};

	$scope.goToMenu = function() {
		console.log("$scope.goToMenu");
		$ionicSideMenuDelegate.toggleLeft();
	};

	$scope.goSearch = function(txtPattern) {
		console.log("$scope.goSearch");
		console.log("txtPattern:" + txtPattern);
		$state.go('app.search', {
			txtPattern : txtPattern
		});
	};

	// Function to stop the app
	$scope.exit = function() {
		console.log("$scope.exit");
		ionic.Platform.exitApp();
		console.log("$scope.exit here");
	};

	// Function to logout from app
	$scope.logout = function() {
		console.log("$scope.logout");

		var confirmPopup = $ionicPopup.confirm({
			title : '<div class="titlePopup">LOGOUT</div>',
			template : '<div class="templatePopup">¿Estás seguro que deseas cerrar tu sesión?</div>'
		});

		confirmPopup.then(function(res) {
			console.log('--- Logout? ' + res);
			if (res) {
				$rootScope.logged = '';
			}
			$state.go('app.welcome');
			$ionicSideMenuDelegate.toggleLeft();
		});
	};
}).controller('SearchResultCtrl', function($scope, $state, DataBaseService, $stateParams) {
	$scope.searchResultModel = [];
	DataBaseService.setReadyRsModel(false);
	DataBaseService.getSelectRsTable("GeographicDistribution", "id, name, introduction, previsualization, Case categoryType When '1' then 'app.exploreRegion' when '2' then 'app.deptos' Else 'app.sites' end as navigationPath", "lower(name) like lower('%" + $stateParams.txtPattern + "%')", "");
	var interv = setInterval(function() {
		if (DataBaseService.getReadyRsModel()) {
			clearInterval(interv);
			DataBaseService.setReadyRsModel(false);
			var rs = DataBaseService.getRsModel();
			for (var i = 0; i < rs.length; i++) {
				$scope.searchResultModel.push(rs.item(i));
			}
			DataBaseService.getSelectRsTable("TourDistribution", "id, name, introduction, previsualization, Case categoryType When '1' then 'app.tourTypeList' when '2' then 'app.tourList' end as navigationPath", "lower(name) like lower('%" + $stateParams.txtPattern + "%')", "");
			var interv2 = setInterval(function() {
				if (DataBaseService.getReadyRsModel()) {
					clearInterval(interv2);
					DataBaseService.setReadyRsModel(false);
					var rs2 = DataBaseService.getRsModel();
					for (var i = 0; i < rs2.length; i++) {
						$scope.searchResultModel.push(rs2.item(i));
					}
					if ($scope.searchResultModel == null || $scope.searchResultModel.length <= 0) {
						$scope.searchResultModel.push({
							id : '0',
							name : 'No se encontraron coincidencias',
							introduction : '',
							previsualization : '',
							navigationPath : ''
						});
					}
				}
			}, 250);
		}
	}, 250);
	$scope.goTo = function(txtPathRule, txtId) {
		console.log("$scope.goTo");
		console.log("txtPathRule:" + txtPathRule);
		console.log("txtId:" + txtId);
		if (txtPathRule != null && txtPathRule != '') {
			$state.go(txtPathRule, {
				txtId : txtId,
				isSearch : 'true'
			});
		}
	};
}).controller('RegionCtrl', function($scope, $state, DataBaseService, $stateParams) {
	$scope.regionModel = [];

	if ($stateParams.isSearch == null)
		DataBaseService.getSelectRsTable("region", "*", "1 = 1", "order by region_id asc");
	else
		DataBaseService.getSelectRsTable("region", "*", "name = like '%" + $stateParams.txtId + "%'", "order by region_id asc");

	var intervRegionCtrl = setInterval(function() {
		if (DataBaseService.getReadyRsModel()) {
			clearInterval(intervRegionCtrl);
			DataBaseService.setReadyRsModel(false);
			var rs = DataBaseService.getRsModel();
			var rows = [];
			for (var i = 0; i < rs.length; i++) {
				console.log("region:"+rs.item(i).name);
				$scope.regionModel.push(rs.item(i));
			}
			setTimeout(function() {
				/*Mi.motion.blindsDown({
					selector : '.card'
				});*/
				Waves.displayEffect();
			}, 950);
		}
	}, 100);

	$scope.goTo = function(txtState, txtId) {
		console.log("$scope.goTo");
		console.log("txtState:" + txtState);
		console.log("txtId:" + txtId);
		$state.go(txtState, {
			txtId : txtId
		});
	};
}).controller('DepartmentCtrl', function($scope, $state, DataBaseService, $stateParams) {
	$scope.departamentModel = [];

	if ($stateParams.isSearch == null)
		DataBaseService.getSelectRsTable("department join region_department on department.department_id = region_department.department_id", "department.*", "region_department.region_id = " + $stateParams.txtId, "order by department.department_id asc");
	else
		DataBaseService.getSelectRsTable("department", "*", "name like '%" + $stateParams.txtId + "%'", "order by department_id asc");

	var intervDepts = setInterval(function() {
		if (DataBaseService.getReadyRsModel()) {
			clearInterval(intervDepts);
			DataBaseService.setReadyRsModel(false);
			var rs = DataBaseService.getRsModel();
			for (var i = 0; i < rs.length; i++) {
				$scope.departamentModel.push(rs.item(i));
			}
			setTimeout(function() {
				/*Mi.motion.blindsDown({
					selector : '.card'
				});*/
				Waves.displayEffect();
			}, 950);
		}
	}, 100);

	$scope.goTo = function(txtState, txtId) {
		console.log("$scope.goTo");
		console.log("txtState:" + txtState);
		console.log("txtId:" + txtId);
		$state.go(txtState, {
			txtId : txtId
		});
	};
}).controller('SiteCtrl', function($scope, $state, DataBaseService, $stateParams) {
	$scope.siteModel = [];

	if ($stateParams.isSearch == null)
		DataBaseService.getSelectRsTable("place join department_place on place.place_id = department_place.place_id", "place.*", "department_place.department_id = " + $stateParams.txtId, "order by place.place_id asc");
	else
		DataBaseService.getSelectRsTable("GeographicDistribution", "*", "categoryType = 3 and id = " + $stateParams.txtId, "order by name asc");

	var intervSites = setInterval(function() {
		if (DataBaseService.getReadyRsModel()) {
			clearInterval(intervSites);
			DataBaseService.setReadyRsModel(false);
			var rs = DataBaseService.getRsModel();
			for (var i = 0; i < rs.length; i++) {
				$scope.siteModel.push(rs.item(i));
			}
			setTimeout(function() {
				Mi.motion.blindsDown({
					selector : '.card'
				});
				Waves.displayEffect();
			}, 950);
		}
	}, 100);

	$scope.goTo = function(txtState, txtId, txtTabId) {
		console.log("$scope.goTo");
		console.log("txtState:" + txtState);
		console.log("txtId:" + txtId);
		console.log("txtTabId:" + txtTabId);
		$state.go(txtState, {
			txtId : txtId,
			txtTabId : txtTabId
		});
	};

	$scope.goToGallerySite = function(txtId) {
		console.log("$scope.goTo");
		console.log("txtState:app.siteProfile");
		console.log("txtId:" + txtId);
		$state.go('app.siteGallery', {
			txtId : txtId,
			txtTabId : 'gallery'
		});
	};
}).controller('SiteProfileCtrl', function($scope, $sce, $state, DataBaseService, $stateParams, $ionicTabsDelegate) {
	$scope.siteProfileModel = [];
	$scope.siteProfileContent = '';

	DataBaseService.getSelectRsTable("place", "*", "place_id = " + $stateParams.txtId, "");

	var intervPlaceProfile = setInterval(function() {
		if (DataBaseService.getReadyRsModel()) {
			clearInterval(intervPlaceProfile);
			DataBaseService.setReadyRsModel(false);
			var rs = DataBaseService.getRsModel();
			console.log("length:"+rs.legth);
			for (var i = 0; i < rs.length; i++) {
				$scope.siteProfileModel.push(rs.item(i));
				if ($stateParams.txtTabId == 'services') {
					$scope.siteProfileContent = $sce.trustAsHtml(rs.item(i).service);
				} else if ($stateParams.txtTabId == 'location') {
					$scope.siteProfileContent = $sce.trustAsHtml(rs.item(i).location);
				} else {
					$scope.siteProfileContent = $sce.trustAsHtml(rs.item(i).content);
				}
			}

			setTimeout(function() {
				Mi.motion.fadeSlideInRight({
					selector : '.animate-fade-slide-in-right > *'
				});
				Waves.displayEffect();
			}, 1100);
		}
	}, 100);

	$scope.images = [];

	/*$scope.loadImages = function() {
		DataBaseService.getSelectRsTable("Gallery", "*", "fatherId = " + $stateParams.txtId, "");
		var interv = setInterval(function() {
			if (DataBaseService.getReadyRsModel()) {
				clearInterval(interv);
				DataBaseService.setReadyRsModel(false);
				var rs = DataBaseService.getRsModel();
				for (var i = 0; i < rs.length; i++) {
					$scope.images.push({
						id : rs.item(i).id,
						src : rs.item(i).source
					});
				}
			}
		}, 250);
	};*/
}).controller('TourTypeCtrl', function($scope, $state, DataBaseService, $stateParams) {
	$scope.tourTypeModel = [];

	if ($stateParams.isSearch == null)
		DataBaseService.getSelectRsTable("tour_type", "*", "1 = 1", "order by tour_type_id asc");
	else
		DataBaseService.getSelectRsTable("tour_type", "*", "categoryType = 1 and fatherId = 0 and id = " + $stateParams.txtId, "order by name asc");

	var intervTourType = setInterval(function() {
		if (DataBaseService.getReadyRsModel()) {
			clearInterval(intervTourType);
			DataBaseService.setReadyRsModel(false);
			var rs = DataBaseService.getRsModel();
			var rows = [];
			for (var i = 0; i < rs.length; i++) {
				$scope.tourTypeModel.push(rs.item(i));
			}
			setTimeout(function() {
				/*Mi.motion.blindsDown({
					selector : '.card'
				});*/
				Waves.displayEffect();
			}, 1300);
		}
	}, 100);
	$scope.goTo = function(txtState, txtId) {
		console.log("$scope.goTo");
		console.log("txtState:" + txtState);
		console.log("txtId:" + txtId);
		$state.go(txtState, {
			txtId : txtId
		});
	};
}).controller('TourCtrl', function($scope, $state, DataBaseService, $stateParams) {
	$scope.tourModel = [];

	if ($stateParams.isSearch == null)
		DataBaseService.getSelectRsTable("tour join tour_type_tour on tour.tour_id = tour_type_tour.tour_id", "tour.*", "tour_type_tour.tour_type_id = " + $stateParams.txtId, "order by tour.tour_id asc");
	else
		DataBaseService.getSelectRsTable("TourDistribution", "*", "categoryType = 2 and id = " + $stateParams.txtId, "order by name asc");

	var intervTour = setInterval(function() {
		if (DataBaseService.getReadyRsModel()) {
			clearInterval(intervTour);
			DataBaseService.setReadyRsModel(false);
			var rs = DataBaseService.getRsModel();
			for (var i = 0; i < rs.length; i++) {
				$scope.tourModel.push(rs.item(i));
			}
			setTimeout(function() {
				/*Mi.motion.blindsDown({
					selector : '.card'
				});*/
				Waves.displayEffect();
			}, 1200);
		}
	}, 100);
	$scope.goTo = function(txtState, txtId) {
		console.log("$scope.goTo");
		console.log("txtState:" + txtState);
		console.log("txtId:" + txtId);
		$state.go(txtState, {
			txtId : txtId
		});
	};
}).controller('TourDetailsCtrl', function($scope, $sce, $state, DataBaseService, $stateParams, $ionicTabsDelegate) {
	$scope.siteTourDetailModel = [];
	$scope.siteTourDetailContent = '';

	DataBaseService.getSelectRsTable("tour", "*", "tour_id = " + $stateParams.txtId, "");

	var intervTourDet = setInterval(function() {
		if (DataBaseService.getReadyRsModel()) {
			clearInterval(intervTourDet);
			DataBaseService.setReadyRsModel(false);
			var rs = DataBaseService.getRsModel();
			for (var i = 0; i < rs.length; i++) {
				$scope.siteTourDetailModel.push(rs.item(i));
				//$scope.siteTourDetailContent = $sce.trustAsHtml(rs.item(i).map);
			}

			$scope.siteTourRouteModel = [];
			DataBaseService.getSelectRsTable("place join tour_place on place.place_id = tour_place.place_id", "place.*", "tour_place.tour_id = " + $stateParams.txtId, "order by tour_place.id asc");
			var interv2 = setInterval(function() {
				if (DataBaseService.getReadyRsModel()) {
					clearInterval(interv2);
					DataBaseService.setReadyRsModel(false);
					var rs = DataBaseService.getRsModel();
					for (var i = 0; i < rs.length; i++) {
						$scope.siteTourRouteModel.push(rs.item(i));
					}
					setTimeout(function() {
						/*Mi.motion.blindsDown({
							selector : '.card'
						});*/
						Waves.displayEffect();
					}, 1300);
				}
			}, 100);

		}
	}, 100);
	$scope.goTo = function(txtState, txtId) {
		console.log("$scope.goTo");
		console.log("txtState:" + txtState);
		console.log("txtId:" + txtId);
		$state.go(txtState, {
			txtId : txtId
		});
	};
}).controller('TourSiteProfileCtrl', function($scope, $sce, $state, DataBaseService, $stateParams, $ionicTabsDelegate) {
	$scope.siteProfileModel = [];
	$scope.siteProfileContent = '';

	DataBaseService.getSelectRsTable("place join tour_place on place.place_id = tour_place.place_id", "place.*", "tour_place.tour_id = " + $stateParams.txtId, "order by tour_place.id asc");

	var intervTourSite = setInterval(function() {
		if (DataBaseService.getReadyRsModel()) {
			clearInterval(intervTourSite);
			DataBaseService.setReadyRsModel(false);
			var rs = DataBaseService.getRsModel();
			console.log("rs:"+rs.length);
			for (var i = 0; i < rs.length; i++) {
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
				/*Mi.motion.blindsDown({
					selector : '.card'
				});*/
				Waves.displayEffect();
			}, 1100);
		}
	}, 100);

	$scope.images = [];

	$scope.loadImages = function() {
		DataBaseService.getSelectRsTable("Gallery", "*", "fatherId = " + $stateParams.txtSiteId, "");
		var interv = setInterval(function() {
			if (DataBaseService.getReadyRsModel()) {
				clearInterval(interv);
				DataBaseService.setReadyRsModel(false);
				var rs = DataBaseService.getRsModel();
				for (var i = 0; i < rs.length; i++) {
					$scope.images.push({
						id : rs.item(i).id,
						src : rs.item(i).source
					});

				}
			}
		}, 250);
	};

	$scope.goTo = function(txtState, txtId, txtTabId) {
		console.log("$scope.goTo");
		console.log("txtState:" + txtState);
		console.log("txtId:" + txtId);
		console.log("txtTabId:" + txtTabId);
		$state.go(txtState, {
			txtId : txtId,
			txtTabId : txtTabId
		});
	};

	$scope.goToGallerySite = function(txtId) {
		console.log("$scope.goTo");
		console.log("txtState:app.siteProfile");
		console.log("txtId:" + txtId);
		$state.go('app.ToursiteGallery', {
			txtId : txtId,
			txtTabId : 'gallery'
		});
	};
}).controller('MyToursCtrl', function($scope, $state, DataBaseService, $stateParams) {
	console.log("MyToursCtrl");

	$scope.myTourListModel = [];
	if ($stateParams.isSearch == null)
		DataBaseService.getSelectRsTable("MyTourDistribution", "*", "1 = 1", "order by name asc");
	else
		DataBaseService.getSelectRsTable("MyTourDistribution", "*", "id =" + $stateParams.txtId, "order by name asc");
	var interv = setInterval(function() {
		if (DataBaseService.getReadyRsModel()) {
			clearInterval(interv);
			DataBaseService.setReadyRsModel(false);
			var rs = DataBaseService.getRsModel();
			var rows = [];
			for (var i = 0; i < rs.length; i++) {
				$scope.myTourListModel.push(rs.item(i));
			}
			setTimeout(function() {
				Mi.motion.fadeSlideInRight({
					selector : '.animate-fade-slide-in-right > *'
				});
				Waves.displayEffect();
			}, 1300);
		}
	}, 250);
	$scope.goTo = function(txtState, txtId) {
		console.log("$scope.goTo");
		console.log("txtState:" + txtState);
		console.log("txtId:" + txtId);
		$state.go(txtState, {
			txtId : txtId
		});
	};
	$scope.goToCreateTour = function() {
		console.log("$scope.goToCreateTour");
		$state.go("app.CreateTour");
	};
}).controller('CreateTourCtrl', function($scope, $state, DataBaseService, $stateParams, $ionicPopup, $ionicHistory) {
	$scope.createTourModel
	$scope.siteListModel = [];
	$scope.siteListTourModel = [];

	console.log("CreateTourCtrl");

	if ($stateParams.loadSitesList == null || $stateParams.loadSitesList == "") {
		if ($stateParams.txtIds != null && $stateParams.txtIds != "") {
			console.log("cargar sitios agregados");
			DataBaseService.getSelectRsTable("GeographicDistribution", "id, name, introduction, previsualization", "categoryType = 3 and id in (" + $stateParams.txtIds + ")", "");
			var interv = setInterval(function() {
				if (DataBaseService.getReadyRsModel()) {
					clearInterval(interv);
					DataBaseService.setReadyRsModel(false);
					var rs = DataBaseService.getRsModel();
					var rows = [];
					for (var i = 0; i < rs.length; i++) {
						$scope.siteListTourModel.push(rs.item(i));
					}
					setTimeout(function() {
						Mi.motion.fadeSlideInRight({
							selector : '.animate-fade-slide-in-right > *'
						});
						Waves.displayEffect();
					}, 1300);
				}
			}, 250);
		}
	}

	if ($stateParams.loadSitesList == "true") {
		console.log("cargando sitios...");
		DataBaseService.getSelectRsTable("GeographicDistribution", "id, name, introduction, previsualization", "categoryType = 3", "order by name asc");
		var interv = setInterval(function() {
			if (DataBaseService.getReadyRsModel()) {
				clearInterval(interv);
				DataBaseService.setReadyRsModel(false);
				var rs = DataBaseService.getRsModel();
				var rows = [];
				for (var i = 0; i < rs.length; i++) {
					$scope.siteListModel.push(rs.item(i));
				}
				setTimeout(function() {
					Mi.motion.fadeSlideInRight({
						selector : '.animate-fade-slide-in-right > *'
					});
					Waves.displayEffect();
				}, 1300);
			}
		}, 250);
	}

	$scope.goToSiteList = function() {
		console.log("$scope.goToSiteList");
		$state.go("app.SiteList", {
			txtIds : $stateParams.txtIds,
			loadSitesList : "true"
		});
	};
	$scope.goAddSiteToList = function(txtId) {
		console.log("$scope.goAddSiteToList");
		console.log("txtIds:" + $stateParams.txtIds);
		console.log("txtId:" + txtId);
		if ($stateParams.txtIds == null || $stateParams.txtIds == "") {
			$stateParams.txtIds = txtId;
		} else {
			$stateParams.txtIds = $stateParams.txtIds + "," + txtId;
		}
		$state.go("app.CreateTour", {
			txtIds : $stateParams.txtIds
		});
	};
	$scope.goTo = function(txtState) {
		console.log("$scope.goTo");
		console.log("txtState:" + txtState);
		//$ionicHistory.clearCache();
		$state.go(txtState);
	};
	$scope.createTour = function() {

		var alerta = false;
		if ($scope.createTourModel == null || $scope.createTourModel == "") {
			$scope.logTitleMsg = "Error";
			$scope.msg = "Debe ingresar una descripción para el tour";
			$scope.btn = "assertive";
			alerta = true;
		} else if ($scope.createTourModel.name == undefined || $scope.createTourModel.name == "") {
			$scope.logTitleMsg = "Error";
			$scope.msg = "Debe ingresar un nombre para el tour";
			$scope.btn = "assertive";
			alerta = true;
		} else if ($scope.createTourModel.introduction == undefined || $scope.createTourModel.introduction == "") {
			$scope.logTitleMsg = "Error";
			$scope.msg = "Debe ingresar una descripción para el tour";
			$scope.btn = "assertive";
			alerta = true;
		} else if ($stateParams.txtIds == null || $stateParams.txtIds == "") {
			$scope.logTitleMsg = "Error";
			$scope.msg = "Debe agregar al menos un destino";
			$scope.btn = "assertive";
			alerta = true;
		}
		if (alerta) {
			var alertPopup = $ionicPopup.alert({
				title : '<div class="titlePopup">' + $scope.logTitleMsg + '</div>',
				template : '<div class="templatePopup">' + $scope.msg + '</div>',
				okType : 'button-' + $scope.btn,
			});
		} else {
			var registerValue = [];
			registerValue[0] = [
				$scope.createTourModel.name,
				$scope.createTourModel.introduction
			];

			DataBaseService.doInsertTable(
	      		"MyTourDistribution",
	      		"name, introduction",
	      		registerValue
	      	);
	      	DataBaseService.getSelectRsTable("MyTourDistribution", "*", "name = '"+$scope.createTourModel.name+"' and introduction = '"+$scope.createTourModel.introduction+"'", "");

			var interv = setInterval(function() {
				if (DataBaseService.getReadyRsModel()) {
					clearInterval(interv);
					DataBaseService.setReadyRsModel(false);
					var rs = DataBaseService.getRsModel();
					var rows = [];
					for (var i = 0; i < rs.length; i++) {
						var idsList = $stateParams.txtIds.split(",");
				      	var registerValue2 = [];
				      	for (j = 0; j < idsList.length; j++) {
				  			registerValue2[j] = [
					      	  	rs.item(i).id,
					      	  	idsList[j],
					      	  	j
				      	  	];
				        }
				      	DataBaseService.doInsertTable(
				      		"MyTourSiteRoute",
				      		"tourId, siteId, inOrder",
				      		registerValue2
				      	);
					}
					$scope.logTitleMsg = "OK";
					$scope.msg = "Felicidades, tour creado!";
					$scope.btn = "positive";
					var alertPopup = $ionicPopup.alert({
						title : '<div class="titlePopup">' + $scope.logTitleMsg + '</div>',
						template : '<div class="templatePopup">' + $scope.msg + '</div>',
						okType : 'button-' + $scope.btn,
					});
					alertPopup.then(function(res) {
						$scope.goTo('app.myTours');
					});
				}
			}, 250);
		}
	};
}).controller('MyTourSiteListCtrl', function($scope, $state, DataBaseService, $stateParams) {
	$scope.MyTourSiteListModel = [];
	DataBaseService.getSelectRsTable("GeographicDistribution", "*", "id in (SELECT siteId FROM MyTourSiteRoute WHERE tourId = " + $stateParams.txtId + ")", "");
	var interv = setInterval(function() {
		if (DataBaseService.getReadyRsModel()) {
			clearInterval(interv);
			DataBaseService.setReadyRsModel(false);
			var rs = DataBaseService.getRsModel();
			for (var i = 0; i < rs.length; i++) {
				$scope.MyTourSiteListModel.push(rs.item(i));
			}
			setTimeout(function() {
				Waves.displayEffect();
			}, 1300);
		}
	}, 250);
	$scope.goTo = function(txtState, txtId) {
		console.log("$scope.goTo");
		$state.go(txtState, {
			txtId : txtId
		});
	};
})

//Controlador Login
.controller('LoginCtrl', ['$scope', '$http', '$ionicPopup', '$ionicSideMenuDelegate', '$state', '$rootScope',
function($scope, $http, $ionicPopup, $ionicSideMenuDelegate, $state, $rootScope) {

	$scope.welcomeName = "";
	$scope.logTitleMsg = "";
	$scope.msg = "";
	$scope.errorMsg = "";
	$scope.btn = "";
	//Arreglo que contendra los datos de usuario que devuelve el WS
	$scope.user = {};
	//Variable para armar el WS con el user y pass
	$scope.urlWS = "";
	//Funcion que ejecuta el login
	$scope.login = function(user) {
		console.log("--- user.username:" + $scope.user.username + " - user.pass:" + $scope.user.pass + " ---");
		$scope.urlWS = "http://externo.icon.com.gt/DestinosGT/Services/login?user="
		//$scope.urlWS = "http://192.168.1.7:8080/DestinosGT/Services/login?user="
		+ $scope.user.username + "&pass=" + $scope.user.pass + "";



		$http.get($scope.urlWS).then(function(resp) {
			$scope.errorMsg = resp.data.message;

			if (resp.data.id == '0') {
				console.log("-- ERROR --" + resp.data.id);
				$scope.logTitleMsg = "Error";
				$scope.msg = $scope.errorMsg;
				$scope.btn = "assertive";
			} else if (resp.data.id == '1') {
				console.log("-- OK --" + resp.data.id);
				$scope.welcomeName = resp.data.username;
				$scope.logTitleMsg = "Te damos la bienvenida";
				$scope.msg = $scope.welcomeName;
				$scope.btn = "positive";
				$rootScope.logged = resp.data.username;
			}

			var alertPopup = $ionicPopup.alert({
				title : '<div class="titlePopup">' + $scope.logTitleMsg + '</div>',
				template : '<div class="templatePopup">' + $scope.msg + '</div>',
				okType : 'button-' + $scope.btn,
			});

			alertPopup.then(function(res) {
				console.log('Thank you:' + res);
				if (res && resp.data.id == '1') {
					$state.go('app.welcome');
					$ionicSideMenuDelegate.toggleLeft();
				}else{
					$state.go('app.login');
				}
			});
		}, function(err) {
			console.log("-- ERROR:--" + err.status);

			if (err.status == '503') {

				var alertPopupError = $ionicPopup.alert({
				title : '<div class="titlePopup"> Error </div>',
				template : '<div class="templatePopup">Ups! Lo sentimos, en este momento no es posible realizar esta acción, por favor intenta más tarde.</div>',
				okType : 'button-energized',
				});
				alertPopupError.then(function(res) {
					console.log("--Resp data id fin---");
				});
			}

		});

	$scope.welcomeName = null;
	$scope.logTitleMsg = null;
	$scope.msg = null;
	$scope.errorMsg = null;
	$scope.btn = null;
	};
}])

//Controlador Registro
.controller('SigninCtrl', ['$scope', '$http', '$ionicPopup', '$ionicSideMenuDelegate', '$state', '$rootScope',
function($scope, $http, $ionicPopup, $ionicSideMenuDelegate, $state, $rootScope) {
	//Variables
	$scope.id = "";
	$scope.welcomeName = "";
	$scope.logTitleMsg = "";
	$scope.msg = "";
	$scope.errorMsg = "";
	$scope.btn = "";
	//Arreglo para datos del usuario
	$scope.reg = {};
	//Variable para almacenar URL del servicio web
	$scope.urlWS = "";
	//Función para creación del nuevo usuario
	$scope.signin = function(reg) {
		//$scope.urlWS = "http://192.168.1.7:8080/DestinosGT/Services/login/registro?nombre="+ $scope.reg.name +"&apellido="+$scope.reg.surname
		$scope.urlWS = "http://externo.icon.com.gt/DestinosGT/Services/login/registro?nombre=" + $scope.reg.name + "&apellido=" + $scope.reg.surname
					+"&email=" + $scope.reg.email + "&user=" + $scope.reg.username + "&pass=" + $scope.reg.pass;
		$http.get($scope.urlWS).then(function(resp) {
			$scope.errorMsg = resp.data.message;
			$scope.id = resp.data.id;
			console.log("-- OK --" + $scope.id);
			if (resp.data.id == '1') {
				console.log("-- OK --" + resp.data.id);
				$scope.welcomeName = resp.data.username;
				$scope.logTitleMsg = "Te damos la bienvenida";
				$scope.msg = $scope.welcomeName;
				$scope.btn = "positive";
				$rootScope.logged = resp.data.username;
			} else {
				console.log("-- ERROR --" + resp.data.id);
				$scope.logTitleMsg = "Error";
				$scope.msg = $scope.errorMsg;
				$scope.btn = "assertive";
			}
			var alertPopup = $ionicPopup.alert({
				title : '<div class="titlePopup">' + $scope.logTitleMsg + '</div>',
				template : '<div class="templatePopup">' + $scope.msg + '</div>',
				okType : 'button-' + $scope.btn,
			});
			alertPopup.then(function(res) {
				console.log('Thank you:' + res);
				if (res && resp.data.id == '1') {
					$state.go('app.welcome');
					$ionicSideMenuDelegate.toggleLeft();
				}
			});
		}, function(err) {
			console.error('ERR', err);
			// err.status will contain the status code
			console.log("-- ERROR:" + err.status);
		});
	};
}])
//Suggestion Controller
/*.controller('SuggestCtrl', ['$scope', '$http', '$ionicPopup', '$ionicSideMenuDelegate', '$state', '$rootScope', '$cordovaFileTransfer',
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
		console.log("--- $scope.reg.image:" + $scope.reg.image + " ---4");

	//	$scope.urlWS = "http://192.168.1.7:8080/DestinosGT/Services/suggestion?place="
	//		+$scope.reg.place+ "&location=" +$scope.reg.location+ "&description=" +$scope.reg.description+ "&email=" +$scope.reg.email
	//		+"&image" +$scope.reg.image + "";*/

			//$scope.urlWS = "http://externo.icon.com.gt/DestinosGT/Services/login?user="
/*	}

//upload method for suggestion
		$scope.upload = function() {
			console.log("--- $scope.reg.place:" + $scope.reg.place + " ---");
			console.log("--- $scope.reg.location:" + $scope.reg.location + " ---");
			console.log("--- $scope.reg.description:" + $scope.reg.description + " ---");
			console.log("--- $scope.reg.email:" + $scope.reg.email + " ---");
			console.log("--- $scope.reg.image:" + $scope.reg.image + " ---4");

			// Destination URL
			var url = "http://192.168.1.7:8080/DestinosGT/uploadFile";

			var options = {
					 fileKey: "reg.image",//"file",
					 //fileName: filename,
					 chunkedMode: false,
					 mimeType: "image/jpg",
			 //params : {'directory':'upload', 'fileName':filename}
			 // directory represents remote directory,  fileName represents final remote file name
					params : {'place':'reg.place', 'location':'reg.location', 'description':'reg.description', 'email':'reg.email'}
			 };

			$cordovaFileTransfer.upload(url, "/android_asset/www/img/ionic.png", options).then(function(result) {
					console.log("SUCCESS: " + JSON.stringify(result.response));
			}, function(err) {
					console.log("ERROR: " + JSON.stringify(err));
			}, function (progress) {
					// constant progress updates
			});
}
}])
*/

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
;
