appOptions = {
	dbCreate: false,
	dbName: 'guateTourDB',
	dbVersion: '1.1',
	dbSize: 500000
}

function fillDB(dbService) {
	console.log("POBLANDO DB");
  	
	dbService.doDropTable("geographicDistribution");
	dbService.doDropTable("tourDistribution");
	
	jQuery.get('./data/dataXML.xml', 
		function(xml){
			
			var json = jQuery.xml2json(xml); 
	  		
	  		var registerDistValue = [];
	  		
	  		dbService.doCreateTable(
	  			"geographicDistribution", 
	  			"id INTEGER PRIMARY KEY ASC, fatherId INTEGER, categoryType INTEGER, name TEXT, introduction TEXT, information TEXT, previsualization TEXT"
	  		);
			
			// create geographicDistribution
	      	if (json.geographicDistribution.register.length==null) {
				registerDistValue = [
		      		json.geographicDistribution.register.fatherId,
		      		json.geographicDistribution.register.categoryType,
		      		json.geographicDistribution.register.name, 
		      		json.geographicDistribution.register.introduction, 
		      		json.geographicDistribution.register.information, 
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
			      	  	json.geographicDistribution.register[i].previsualization
		      	  	];
		        }
	      	}
	      	
	      	dbService.doInsertTable(
	      		"geographicDistribution", 
	      		"fatherId, categoryType, name, introduction, information, previsualization", 
	      		registerDistValue
	      	);
	      	
	      	var registerTourValue = [];
	      	
	      	dbService.doCreateTable(
	  			"tourDistribution", 
	  			"id INTEGER PRIMARY KEY ASC, fatherId INTEGER, categoryType INTEGER, name TEXT, introduction TEXT, information TEXT, previsualization TEXT"
	  		);
	  		
	      	// create tourDistribution
	      	if (json.tourDistribution.register.length==null) {
				registerTourValue = [
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
	      		"tourDistribution", 
	      		"fatherId, categoryType, name, introduction, information, previsualization", 
	      		registerTourValue
	      	);
      	}
	);
	
	setTimeout(function() {
		dbService.getSelectRsTable("tourDistribution","*","1=1","");
		var interv = setInterval(function() {
			if (dbService.getReadyRsModel()) {
				clearInterval(interv);
				dbService.setReadyRsModel(false);
				var rs = dbService.getRsModel();
				console.log("rs:"+rs.length);
				for (var i=0; i<rs.length; i++) {
					console.log("id:"+rs.item(i).id+", fatherId:"+rs.item(i).fatherId+", name:"+rs.item(i).name);
				}
			}
		},500)
	},3000);
	
}
