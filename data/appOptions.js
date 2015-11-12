appOptions = {
	dbCreate: false
};

function fillDB(dbService) {
	console.log("POBLANDO DB");
  	
	dbService.doDropTable("GeographicDistribution");
	dbService.doDropTable("TourDistribution");
	
	var xmlGeoDistributionFiles = [
		'00dataRegionesXML.xml', 
		'01dataDeptoRegMetroXML.xml', 
		//'02dataDeptoRegNorOrientalXML.xml',
		//'03dataDeptoRegCentralXML.xml', 
		//'04dataDeptoRegSurOccidenteXML.xml', 
		//'05dataDeptoRegPetenXML.xml',
		'06dataDeptoGuatemalaSitios.xml'
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
	
	/*
	var xmlTourDistributionFiles = [
		'T00dataToursTypesXML.xml', 'T01dataToursCulturalXML.xml', 'T02dataToursReligiosoXML.xml',
		'T03dataToursAventuraXML.xml', 'T04dataToursNaturalezaXML.xml', 'T05dataToursTropicalXML.xml',
	];
	
	// create tourDistribution
	dbService.doCreateTable(
		"TourDistribution", 
		"id INTEGER PRIMARY KEY ASC, fatherId INTEGER, categoryType INTEGER, name TEXT, introduction TEXT, information TEXT, previsualization TEXT"
	);
  	
  	// fill tourDistribution
	for (i=0; i<xmlTourDistributionFiles.length; i++) {
		fillTourDistribution(xmlTourDistributionFiles[i], dbService);
	}
	*/
	
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
		      		json.tourDistribution.register.previsualization
		      	];
	      	} else {
	      		for (i = 0; i < json.tourDistribution.register.length; i++) {
	      			registerTourValue[i] = [
			      	  	json.tourDistribution.register[i].fatherId,
			      	  	json.tourDistribution.register[i].categoryType,
			      	  	json.tourDistribution.register[i].name, 
			      	  	json.tourDistribution.register[i].introduction, 
			      	  	json.tourDistribution.register[i].information, 
			      	  	json.tourDistribution.register[i].previsualization
		      	  	];
		        }
	      	}
	      	dbService.doInsertTable(
	      		"TourDistribution", 
	      		"fatherId, categoryType, name, introduction, information, previsualization", 
	      		registerTourValue
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
					console.log("tableName:"+tableName+", id:"+rs.item(i).id+", fatherId:"+rs.item(i).fatherId+", name:"+rs.item(i).name);
				}
			}
		},500)
	},3000);
}
