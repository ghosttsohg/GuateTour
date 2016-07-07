appOptions = {
	dbCreate: false
};

function fillDB(dbService) {
	console.log("FILL DB");
  	
	dbService.doDropTable("region");
	dbService.doDropTable("department");
	dbService.doDropTable("region_department");
	dbService.doDropTable("place");
	dbService.doDropTable("department_place");
	
	dbService.doDropTable("tour_type");
	dbService.doDropTable("tour");
	dbService.doDropTable("tour_type_tour");
	dbService.doDropTable("tour_place");
	
	dbService.doDropTable("gallery");
	dbService.doDropTable("image");
	
	// Create-fill Table Region
	fillRegion(dbService);
	
	// Create-fill Table Department
	fillDepartment(dbService);
	
	// Create-fill Table Place
	fillPlace(dbService);
	
	// Create-fill Table TOUR-TYPE, TOUR, TOUR-TYPE-TOUR, TOUR-PLACE
	fillTours(dbService);
	
	// Create-fill Table Gallery, Image
	fillGallery(dbService);
	
	/*
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
		'GD06dataDeptoGuatemalaSitios.xml'
		//'GD02dataDeptoRegNorOrientalXML.xml',
		//'GD03dataDeptoRegCentralXML.xml', 
		//'GD04dataDeptoRegSurOccidenteXML.xml', 
		//'GD05dataDeptoRegPetenXML.xml',
	];
	
	
	
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
	*/
	
	//testTable('department_place', dbService);

}

function fillRegion(dbService) {
	console.log("Create Region");
	// create Table Region
	dbService.doCreateTable(
		"region", 
		"id INTEGER PRIMARY KEY ASC, region_id INTEGER, name TEXT, introduction TEXT, content TEXT, thumbnail TEXT"
	);
	console.log("fill Region");
	jQuery.get("./data/00dataRegionXML.xml", 
		function(xml){
			console.log("file:00dataRegionXML.xml");
			var json = jQuery.xml2json(xml); 
	  		var registerValue = [];
	      	if (json.regions.register.length==null) {
				registerValue[0] = [
		      		json.regions.register.region_id,
		      		json.regions.register.name, 
		      		json.regions.register.introduction, 
		      		json.regions.register.content,
		      		json.regions.register.thumbnail
		      	];
	      	} else {
	      		for (i = 0; i < json.regions.register.length; i++) {
	      			registerValue[i] = [
			      	  	json.regions.register[i].region_id,
			      		json.regions.register[i].name, 
			      		json.regions.register[i].introduction, 
			      		json.regions.register[i].content,
			      		json.regions.register[i].thumbnail
		      	  	];
		        }
	      	}
	      	dbService.doInsertTable(
	      		"region", 
	      		"region_id, name, introduction, content, thumbnail", 
	      		registerValue
	      	);
		}
	);
}

function fillDepartment(dbService) {
	console.log("Create Department");
	// create Table Department
	dbService.doCreateTable(
		"department", 
		"id INTEGER PRIMARY KEY ASC, department_id INTEGER, name TEXT, introduction TEXT, content TEXT, thumbnail TEXT"
	);
	console.log("fill Department");
	jQuery.get("./data/01dataDepartmentXML.xml", 
		function(xml){
			console.log("file:01dataDepartmentXML.xml");
			var json = jQuery.xml2json(xml); 
	  		var registerDeptValue = [];
	      	if (json.depts.register.length==null) {
				registerDeptValue[0] = [
		      		json.depts.register.department_id,
		      		json.depts.register.name, 
		      		json.depts.register.introduction, 
		      		json.depts.register.content,
		      		json.depts.register.thumbnail
		      	];
	      	} else {
	      		for (i = 0; i < json.depts.register.length; i++) {
	      			registerDeptValue[i] = [
			      	  	json.depts.register[i].department_id,
			      		json.depts.register[i].name, 
			      		json.depts.register[i].introduction, 
			      		json.depts.register[i].content,
			      		json.depts.register[i].thumbnail
		      	  	];
		        }
	      	}
	      	dbService.doInsertTable(
	      		"department", 
	      		"department_id, name, introduction, content, thumbnail", 
	      		registerDeptValue
	      	);
		}
	);
	console.log("Create Region-Department");
	// create Table Region-Department
	dbService.doCreateTable(
		"region_department", 
		"id INTEGER PRIMARY KEY ASC, region_id INTEGER, department_id INTEGER"
	);
	console.log("fill Region-Department");
	jQuery.get("./data/02dataRegionDepartmentXML.xml", 
		function(xml){
			console.log("file:02dataRegionDepartmentXML.xml");
			var json = jQuery.xml2json(xml); 
	  		var registerRegDeptValue = [];
	      	if (json.registers.register.length==null) {
				registerRegDeptValue[0] = [
		      		json.registers.register.region_id,
		      		json.registers.register.department_id
		      	];
	      	} else {
	      		for (i = 0; i < json.registers.register.length; i++) {
	      			registerRegDeptValue[i] = [
			      	  	json.registers.register[i].region_id,
			      		json.registers.register[i].department_id
		      	  	];
		        }
	      	}
	      	dbService.doInsertTable(
	      		"region_department", 
	      		"region_id, department_id", 
	      		registerRegDeptValue
	      	);
		}
	);
}

function fillPlace(dbService) {
	console.log("Create Place");
	// create Table Place
	dbService.doCreateTable(
		"place", 
		"id INTEGER PRIMARY KEY ASC, place_id INTEGER, name TEXT, introduction TEXT, content TEXT, service TEXT, location TEXT, thumbnail TEXT"
	);
	console.log("fill Place");
	jQuery.get("./data/03dataPlaceXML.xml", 
		function(xml){
			console.log("file:03dataPlaceXML.xml");
			var json = jQuery.xml2json(xml); 
	  		var registerPlaceValue = [];
	      	if (json.places.register.length==null) {
				registerPlaceValue[0] = [
		      		json.places.register.place_id,
		      		json.places.register.name, 
		      		json.places.register.introduction, 
		      		json.places.register.content,
		      		json.places.register.service,
		      		json.places.register.location,
		      		json.places.register.thumbnail
		      	];
	      	} else {
	      		for (i = 0; i < json.places.register.length; i++) {
	      			registerPlaceValue[i] = [
			      	  	json.places.register[i].place_id,
			      		json.places.register[i].name, 
			      		json.places.register[i].introduction, 
			      		json.places.register[i].content,
			      		json.places.register[i].service,
			      		json.places.register[i].location,
			      		json.places.register[i].thumbnail
		      	  	];
		        }
	      	}
	      	dbService.doInsertTable(
	      		"place", 
	      		"place_id, name, introduction, content, service, location, thumbnail", 
	      		registerPlaceValue
	      	);
		}
	);
	console.log("Create Department-Place");
	// create Table Department-Place
	dbService.doCreateTable(
		"department_place", 
		"id INTEGER PRIMARY KEY ASC, department_id INTEGER, place_id INTEGER"
	);
	console.log("fill Department-Place");
	jQuery.get("./data/04dataDeptPlaceXML.xml", 
		function(xml){
			console.log("file:04dataDeptPlaceXML.xml");
			var json = jQuery.xml2json(xml); 
	  		var registerDeptPlaceValue = [];
	      	if (json.dept_place.register.length==null) {
				registerDeptPlaceValue[0] = [
		      		json.dept_place.register.department_id,
		      		json.dept_place.register.place_id
		      	];
	      	} else {
	      		for (i = 0; i < json.dept_place.register.length; i++) {
	      			registerDeptPlaceValue[i] = [
			      	  	json.dept_place.register[i].department_id,
			      		json.dept_place.register[i].place_id
		      	  	];
		        }
	      	}
	      	dbService.doInsertTable(
	      		"department_place", 
	      		"department_id, place_id", 
	      		registerDeptPlaceValue
	      	);
	      	
		}
	);
}

function fillTours(dbService) {
	console.log("Create Tour-Type");
	// create Table Tour-Type
	dbService.doCreateTable(
		"tour_type", 
		"id INTEGER PRIMARY KEY ASC, tour_type_id INTEGER, name TEXT, introduction TEXT, content TEXT, thumbnail TEXT"
	);
	console.log("fill Tour-Type");
	jQuery.get("./data/05dataToursTypesXML.xml", 
		function(xml){
			console.log("file:05dataToursTypesXML.xml");
			var json = jQuery.xml2json(xml); 
	  		var registerTourTypeValue = [];
	      	if (json.tours_type.register.length==null) {
				registerTourTypeValue[0] = [
		      		json.tours_type.register.tour_type_id,
		      		json.tours_type.register.name, 
		      		json.tours_type.register.introduction, 
		      		json.tours_type.register.content,
		      		json.tours_type.register.thumbnail
		      	];
	      	} else {
	      		for (i = 0; i < json.tours_type.register.length; i++) {
	      			registerTourTypeValue[i] = [
			      	  	json.tours_type.register[i].tour_type_id,
			      		json.tours_type.register[i].name, 
			      		json.tours_type.register[i].introduction, 
			      		json.tours_type.register[i].content,
			      		json.tours_type.register[i].thumbnail
		      	  	];
		        }
	      	}
	      	dbService.doInsertTable(
	      		"tour_type", 
	      		"tour_type_id, name, introduction, content, thumbnail", 
	      		registerTourTypeValue
	      	);
		}
	);
	console.log("Create Tour");
	// create Table Tour
	dbService.doCreateTable(
		"tour", 
		"id INTEGER PRIMARY KEY ASC, tour_id INTEGER, name TEXT, introduction TEXT, content TEXT, thumbnail TEXT, map TEXT"
	);
	console.log("fill Tour");
	jQuery.get("./data/06dataToursXML.xml", 
		function(xml){
			console.log("file:06dataToursXML.xml");
			var json = jQuery.xml2json(xml); 
	  		var registerTourValue = [];
	      	if (json.tours.register.length==null) {
				registerTourValue[0] = [
		      		json.tours.register.tour_id,
		      		json.tours.register.name, 
		      		json.tours.register.introduction, 
		      		json.tours.register.content,
		      		json.tours.register.thumbnail,
		      		json.tours.register.map
		      	];
	      	} else {
	      		for (i = 0; i < json.tours.register.length; i++) {
	      			registerTourValue[i] = [
			      	  	json.tours.register[i].tour_id,
			      		json.tours.register[i].name, 
			      		json.tours.register[i].introduction, 
			      		json.tours.register[i].content,
			      		json.tours.register[i].thumbnail,
			      		json.tours.register[i].map
		      	  	];
		        }
	      	}
	      	dbService.doInsertTable(
	      		"tour", 
	      		"tour_id, name, introduction, content, thumbnail, map", 
	      		registerTourValue
	      	);
		}
	);
	console.log("Create Tour-Type-Tour");
	// create Table Tour-Type-Tour
	dbService.doCreateTable(
		"tour_type_tour", 
		"id INTEGER PRIMARY KEY ASC, tour_type_id INTEGER, tour_id INTEGER"
	);
	console.log("fill Tour-Type-Tour");
	jQuery.get("./data/07dataTourTypeTourXML.xml", 
		function(xml){
			console.log("file:07dataTourTypeTourXML.xml");
			var json = jQuery.xml2json(xml); 
	  		var registerTourTypeTourValue = [];
	      	if (json.tour_type_tour.register.length==null) {
				registerTourTypeTourValue[0] = [
					json.tour_type_tour.register.tour_type_id,
		      		json.tour_type_tour.register.tour_id
		      	];
	      	} else {
	      		for (i = 0; i < json.tour_type_tour.register.length; i++) {
	      			registerTourTypeTourValue[i] = [
			      	  	json.tour_type_tour.register[i].tour_type_id,
			      	  	json.tour_type_tour.register[i].tour_id
		      	  	];
		        }
	      	}
	      	dbService.doInsertTable(
	      		"tour_type_tour", 
	      		"tour_type_id, tour_id", 
	      		registerTourTypeTourValue
	      	);
		}
	);
	console.log("Create Tour-Place");
	// create Table Tour-Place
	dbService.doCreateTable(
		"tour_place", 
		"id INTEGER PRIMARY KEY ASC, tour_id INTEGER, place_id INTEGER"
	);
	console.log("fill Tour-Place");
	jQuery.get("./data/08dataTourPlaceXML.xml", 
		function(xml){
			console.log("file:08dataTourPlaceXML.xml");
			var json = jQuery.xml2json(xml); 
	  		var registerTourPlaceValue = [];
	      	if (json.tour_place.register.length==null) {
				registerTourPlaceValue[0] = [
					json.tour_place.register.tour_id,
		      		json.tour_place.register.place_id
		      	];
	      	} else {
	      		for (i = 0; i < json.tour_place.register.length; i++) {
	      			registerTourPlaceValue[i] = [
			      	  	json.tour_place.register[i].tour_id,
			      	  	json.tour_place.register[i].place_id
		      	  	];
		        }
	      	}
	      	dbService.doInsertTable(
	      		"tour_place", 
	      		"tour_id, place_id", 
	      		registerTourPlaceValue
	      	);
		}
	);
}

function fillGallery(dbService) {
	console.log("Create Gallery");
	// create Table Gallery
	dbService.doCreateTable(
		"gallery", 
		"id INTEGER PRIMARY KEY ASC, place_id INTEGER, gallery_id INTEGER, thumbnail TEXT"
	);
	console.log("fill Gallery");
	jQuery.get("./data/09dataGalleryXML.xml", 
		function(xml){
			console.log("file:09dataGalleryXML.xml");
			var json = jQuery.xml2json(xml); 
	  		var registerPlaceGalleryValue = [];
	      	if (json.gallery.register.length==null) {
				registerPlaceGalleryValue[0] = [
		      		json.gallery.register.place_id,
		      		json.gallery.register.gallery_id,
		      		json.gallery.register.thumbnail
		      	];
	      	} else {
	      		for (i = 0; i < json.gallery.register.length; i++) {
	      			registerPlaceGalleryValue[i] = [
			      	  	json.gallery.register[i].place_id,
			      		json.gallery.register[i].gallery_id,
			      		json.gallery.register[i].thumbnail
		      	  	];
		        }
	      	}
	      	dbService.doInsertTable(
	      		"gallery", 
	      		"place_id, gallery_id, thumbnail", 
	      		registerPlaceGalleryValue
	      	);
		}
	);
	console.log("Create Images");
	// create Table Images
	dbService.doCreateTable(
		"images", 
		"id INTEGER PRIMARY KEY ASC, gallery_id INTEGER, source TEXT"
	);
	console.log("fill Images");
	jQuery.get("./data/10dataImagesXML.xml", 
		function(xml){
			console.log("file:10dataImagesXML.xml");
			var json = jQuery.xml2json(xml); 
	  		var registerImageValue = [];
	      	if (json.images.register.length==null) {
				registerImageValue[0] = [
		      		json.images.register.gallery_id,
		      		json.images.register.source
		      	];
	      	} else {
	      		for (i = 0; i < json.images.register.length; i++) {
	      			registerImageValue[i] = [
			      	  	json.images.register[i].gallery_id,
			      		json.images.register[i].source
		      	  	];
		        }
	      	}
	      	dbService.doInsertTable(
	      		"images", 
	      		"gallery_id, source", 
	      		registerImageValue
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
					console.log("tableName:"+tableName+", tour_id:"+rs.item(i).tour_id+", place_id:"+rs.item(i).place_id);
				}
			}
		},500);
	},3000);
}
