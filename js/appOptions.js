appOptions = {
	dbCreate: true
};

function fillDB(dbService) {
	console.log("POBLANDO DB");
  	
	dbService.doDropTable("GeographicDistribution");
	dbService.doDropTable("Gallery");
	dbService.doDropTable("TourDistribution");
	dbService.doDropTable("TourSiteRoute");
	dbService.doDropTable("MyTourDistribution");
	dbService.doDropTable("MyTourSiteRoute");
	
	// create MyTourDistribution
	dbService.doCreateTable(
		"MyTourDistribution", 
		"id INTEGER PRIMARY KEY ASC, name TEXT, introduction TEXT"
	);
	
	dbService.doCreateTable(
		"MyTourSiteRoute", 
		"id INTEGER PRIMARY KEY ASC, tourId INTEGER, siteId INTEGER, inOrder INTEGER"
	);
	
	var xmlGeoDistributionFiles = [
		'GD00dataRegionesXML.xml', 
		'GD01dataDeptoRegMetroXML.xml', 
		//'GD02dataDeptoRegNorOrientalXML.xml',
		//'GD03dataDeptoRegCentralXML.xml', 
		//'GD04dataDeptoRegSurOccidenteXML.xml', 
		//'GD05dataDeptoRegPetenXML.xml',
		'GD06dataDeptoGuatemalaSitios.xml'
	];
	
	// create GeographicDistribution
	dbService.doCreateTable(
		"GeographicDistribution", 
		"id INTEGER PRIMARY KEY ASC, fatherId INTEGER, categoryType INTEGER, name TEXT, introduction TEXT, information TEXT, services TEXT, location TEXT, previsualization TEXT"
	);
	// fill GeographicDistribution
	for (i=0; i<xmlGeoDistributionFiles.length; i++) {
		fillGeographicDistribution(xmlGeoDistributionFiles[i], dbService);
	}
	
	var xmlGalleryFiles = [
		'G03GallerySitesXML.xml'
	];
	
	// create Gallery
	dbService.doCreateTable(
		"Gallery", 
		"id INTEGER PRIMARY KEY ASC, fatherId INTEGER, information TEXT, source TEXT"
	);
	// fill Gallery
	for (i=0; i<xmlGalleryFiles.length; i++) {
		fillGallery(xmlGalleryFiles[i], dbService);
	}
	
	var xmlTourDistributionFiles = [
		'TD00dataToursTypesXML.xml', 
		'TD01dataToursMetroXML.xml'
	];
	
	// create TourDistribution
	dbService.doCreateTable(
		"TourDistribution", 
		"id INTEGER PRIMARY KEY ASC, fatherId INTEGER, categoryType INTEGER, name TEXT, introduction TEXT, information TEXT, services TEXT, location TEXT, previsualization TEXT, map TEXT"
	);
  	
  	// fill TourDistribution
	for (i=0; i<xmlTourDistributionFiles.length; i++) {
		fillTourDistribution(xmlTourDistributionFiles[i], dbService);
	}
	
	// create TourSiteRoute
	dbService.doCreateTable(
		"TourSiteRoute", 
		"id INTEGER PRIMARY KEY ASC, tourId INTEGER, siteId INTEGER, inOrder INTEGER"
	);
	
	var xmlTourSiteRouteFiles = [
		'TR00dataTourSiteRouteXML.xml'
	];
	
	// fill TourSiteRoute
	for (i=0; i<xmlTourSiteRouteFiles.length; i++) {
		fillTourSiteRoute(xmlTourSiteRouteFiles[i], dbService);
	}
	
	//testTable('GeographicDistribution', dbService);
	//testTable('TourDistribution', dbService);
}

function fillGeographicDistribution(file, dbService) {
	jQuery.get('./data/'+file, 
		function(xml){
			console.log("file:"+file);
			var json = jQuery.xml2json(xml); 
	  		var registerDistValue = [];
	      	if (json.geographicDistribution.register.length==null) {
				registerDistValue[0] = [
		      		json.geographicDistribution.register.fatherId,
		      		json.geographicDistribution.register.categoryType,
		      		json.geographicDistribution.register.name, 
		      		json.geographicDistribution.register.introduction, 
		      		json.geographicDistribution.register.information,
		      		json.geographicDistribution.register.services,
		      		json.geographicDistribution.register.location,
		      		json.geographicDistribution.register.previsualization
		      	];
	      	} else {
	      		for (i = 0; i < json.geographicDistribution.register.length; i++) {
	      			registerDistValue[i] = [
			      	  	json.geographicDistribution.register[i].fatherId,
			      	  	json.geographicDistribution.register[i].categoryType,
			      	  	json.geographicDistribution.register[i].name, 
			      	  	json.geographicDistribution.register[i].introduction, 
			      	  	json.geographicDistribution.register[i].information,
			      	  	json.geographicDistribution.register[i].services,
		      			json.geographicDistribution.register[i].location, 
			      	  	json.geographicDistribution.register[i].previsualization
		      	  	];
		        }
	      	}
	      	dbService.doInsertTable(
	      		"GeographicDistribution", 
	      		"fatherId, categoryType, name, introduction, information, services, location, previsualization", 
	      		registerDistValue
	      	);
		}
	);
}

function fillGallery(file, dbService) {
	jQuery.get('./data/'+file, 
		function(xml){
			console.log("file:"+file);
			var json = jQuery.xml2json(xml); 
	  		var registerImageValue = [];
	      	if (json.gallery.register.length==null) {
				registerImageValue[0] = [
		      		json.gallery.register.fatherId,
		      		json.gallery.register.information,
		      		json.gallery.register.source
		      	];
	      	} else {
	      		for (i = 0; i < json.gallery.register.length; i++) {
	      			registerImageValue[i] = [
			      	  	json.gallery.register[i].fatherId,
			      	  	json.gallery.register[i].information,
			      	  	json.gallery.register[i].source
		      	  	];
		        }
	      	}
	      	dbService.doInsertTable(
	      		"Gallery", 
	      		"fatherId, information, source", 
	      		registerImageValue
	      	);
		}
	);
}

function fillTourDistribution(file, dbService) {
	jQuery.get('./data/'+file, 
		function(xml){
			console.log("file:"+file);
			var json = jQuery.xml2json(xml); 
	      	var registerTourValue = [];	      	
	      	if (json.tourDistribution.register.length==null) {
				registerTourValue[0] = [
					json.tourDistribution.register.fatherId,
		      		json.tourDistribution.register.categoryType,
		      		json.tourDistribution.register.name, 
		      		json.tourDistribution.register.introduction, 
		      		json.tourDistribution.register.information,
		      		json.tourDistribution.register.services,
		      		json.tourDistribution.register.location,
		      		json.tourDistribution.register.previsualization,
		      		json.tourDistribution.register.map
		      	];
	      	} else {
	      		for (i = 0; i < json.tourDistribution.register.length; i++) {
	      			registerTourValue[i] = [
			      	  	json.tourDistribution.register[i].fatherId,
			      	  	json.tourDistribution.register[i].categoryType,
			      	  	json.tourDistribution.register[i].name, 
			      	  	json.tourDistribution.register[i].introduction, 
			      	  	json.tourDistribution.register[i].information,
			      	  	json.tourDistribution.register[i].services,
		      			json.tourDistribution.register[i].location,
			      	  	json.tourDistribution.register[i].previsualization,
			      	  	json.tourDistribution.register[i].map
		      	  	];
		        }
	      	}
	      	dbService.doInsertTable(
	      		"TourDistribution", 
	      		"fatherId, categoryType, name, introduction, information, services, location, previsualization, map", 
	      		registerTourValue
	      	);
      	}
	);
}

function fillTourSiteRoute(file, dbService) {
	jQuery.get('./data/'+file, 
		function(xml){
			console.log("file:"+file);
			var json = jQuery.xml2json(xml); 
	      	var registerValue = [];	      	
	      	if (json.tourSiteRoute.register.length==null) {
				registerValue[0] = [
					json.tourSiteRoute.register.tourId,
					json.tourSiteRoute.register.siteId,
		      		json.tourSiteRoute.register.order
		      	];
	      	} else {
	      		for (i = 0; i < json.tourSiteRoute.register.length; i++) {
	      			registerValue[i] = [
			      	  	json.tourSiteRoute.register[i].tourId,
			      	  	json.tourSiteRoute.register[i].siteId,
			      	  	json.tourSiteRoute.register[i].order
		      	  	];
		        }
	      	}
	      	dbService.doInsertTable(
	      		"TourSiteRoute", 
	      		"tourId, siteId, inOrder", 
	      		registerValue
	      	);
      	}
	);
}


function testTable(tableName, dbService) {
	setTimeout(function() {
		dbService.getSelectRsTable(tableName,"*","1=1","");
		var interv = setInterval(function() {
			if (dbService.getReadyRsModel()) {
				clearInterval(interv);
				dbService.setReadyRsModel(false);
				var rs = dbService.getRsModel();
				console.log("rs:"+rs.length);
				for (var i=0; i<rs.length; i++) {
					//console.log("tableName:"+tableName+", id:"+rs.item(i).id+", fatherId:"+rs.item(i).fatherId+", name:"+rs.item(i).name);
					//console.log("tableName:"+tableName+", id:"+rs.item(i).id+", fatherId:"+rs.item(i).fatherId+", source:"+rs.item(i).source);
					//console.log("tableName:"+tableName+", id:"+rs.item(i).id+", tourId:"+rs.item(i).tourId+", siteId:"+rs.item(i).siteId+", inOrder:"+rs.item(i).inOrder);
					console.log("tableName:"+tableName+", id:"+rs.item(i).id+", name:"+rs.item(i).name);
				}
			}
		},500);
	},3000);
}
