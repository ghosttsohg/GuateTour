//Based on http://www.html5rocks.com/en/tutorials/webdatabase/todo/

var app = {};
app.db = null;

var shortName = 'guateTourDB'; 
var version = '1.1'; 
var displayName = 'guateTourDB'; 
var maxSize = 500000; 

app.openDb = function() {
	app.db = window.openDatabase(shortName, "1.1", displayName, maxSize);
}

app.createTable = function(tableName, tableColumn) {
	if (tableName != null) {
		var db = app.db;
		db.transaction(
			function(tx) {
				tx.executeSql(
					"CREATE TABLE IF NOT EXISTS "+tableName+" ("+tableColumn+")",
					[]
				);
			}
		);
	}
}

app.insertRow = function(tableName, tableColumn, tableValue) {
	var db = app.db;	
	db.transaction(
		function(tx) {
			tx.executeSql(
				"INSERT INTO "+tableName+" "+tableColumn+" values "+tableValue,
				[]
			);
		}
	);
}

app.getRow = function(tableName, tableColumn, whereValue, orderValue, callback) {
	var db = app.db;
	db.transaction(
		function(tx) {
			tx.executeSql(
				"SELECT "+tableColumn+" FROM "+tableName+" WHERE "+whereValue+" "+orderValue,
				[],
				function(tx, result) {
					//console.log("executeSql rows:"+result.rows.length);
					var rows = [];
					for (var i=0; i<result.rows.length; i++) {
						rows[i]=result.rows[i];
					}
					callback(rows);
				}
			);
		}
	);
}

app.dropTable = function() {
	var db = app.db;
	db.transaction(
		function(tx) {
			tx.executeSql(
				"DROP TABLE region",
				[]
			);
		}
	);
}
