//绿地华尔道名邸
var loader = require('./loader.js');
var lbs_db = require('./db.js');
var price_db = require('./db.js');
var lbsTable = "bd_lbs";
var priceTable = "price2016";

function runGeocoder() {
	var lbsJsons = [];
	lbs_db.open(lbsTable).then(function() {
		return lbs_db.collection.find({
			"lbs_bd_geocoder.status": 0
		}).toArray()
	}).then(function(data) {
		lbs_db.close()

		var jsons = data.map(function(row) {
			return {
				name: row.name,
				location: row.lbs_bd_geocoder.result.location,
				bd_name: row.name
			}
		})
		return jsons;
	}).then(function(data) {
		lbsJsons = data;
		return price_db.open(priceTable)
	}).then(function(collection) {
		//TOBE:fix
		lbsJsons.map(function(row) {
			return collection.update({
				name: row.name
			}, {
				$set: row
			}).then(function() {
				console.log("success")
				return row;
			})
		})



	}).then(function(data) {

		//price_db.close()

	}).then(function(data) {

	}).catch(function(e) {
		console.error(e);
		lbs_db.close();
		price_db.close();
	})


}



function runPlace() {
	var lbsJsons = [];
	lbs_db.open(lbsTable).then(function() {
		return lbs_db.collection.find({
			"lbs_bd_geocoder.status": 1,
			"lbs_bd_place.status": 0
		}).toArray()
	}).then(function(data) {


		lbs_db.close();

		data = data.filter(function(row) {
			return row.lbs_bd_place.results.length > 0;
		})

		var data = data.map(function(row) {
			return {
				name: row.name,
				location: row.lbs_bd_place.results[0].location,
				bd_name: row.lbs_bd_place.results[0].name
			}
		})

		data = data.filter(function(row) {
			return row.lbs_bd_place.results.length > 0;
		})

		console.log(data)


		return data;
	}).then(function(data) {
		console.log(data)
		console.log("todo filter later")
			/*		lbsJsons = data;
					return price_db.open(priceTable)*/
	}).then(function(collection) {
		//TOBE:fix
		lbsJsons.map(function(row) {
			return collection.update({
				name: row.name
			}, {
				$set: row
			}).then(function() {
				console.log("success")
				return row;
			})
		})



	}).then(function(data) {

		//price_db.close()

	}).then(function(data) {

	}).catch(function(e) {
		console.error(e);
		lbs_db.close();
		price_db.close();
	})


}


//runGeocoder();
//runPlace();
//
function getJSON() {
	price_db.open(priceTable).then(function(collection) {
		return collection.find({
			"bd_name": {
				$ne: null
			},
			"preY1Y2": {
				$ne: ""
			}
		}).toArray()
	}).then(function(data) {
		price_db.close()
		data.map(function(row) {
			console.log(row)
		})
	}).catch(function(e) {
		console.log(e);
	})
}

getJSON()