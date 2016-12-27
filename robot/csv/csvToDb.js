var csv = require('./csv.js');
var db = require("./db.js");

var file = "data.csv";
var jsons = []

//var [name, y1, y2, preY1Y2, district, area] = [1, 2, 3, 4, 5, 6]

csv.reader(file).then(function(rows) {
	jsons = rows.map(function(row) {
		var [name, y1, y2, preY1Y2, district, area] = row;
		return ({
			name,
			y1,
			y2,
			preY1Y2,
			district,
			area
		})
	})

	return jsons
})

.then(function(data) {
	return db.open("price2016")
}).then(function() {
	return db.insertUnique(jsons)
}).then(function() {
	return db.close()
}).catch(function(e) {
	console.log(e)
})