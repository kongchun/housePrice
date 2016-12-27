//绿地华尔道名邸
var loader = require('./loader.js');
var db = require('./db.js');
var dbTable = "bd_lbs"; //数据库
function runUpdateLBS() {
	var data = {};
	db.open(dbTable).then(function(collection) {
		return collection.findOne({
			lbs_bd_geocoder: null
		})
	}).then(function(data) {
		return loadGeocoderAPI(data.name).then(function(result) {
			return {
				name: data.name,
				lbs_bd_geocoder: result
			}
		})
	}).then(function(data) {
		return db.collection.update({
			name: data.name
		}, {
			$set: data
		}).then(function() {
			return data;
		})

	}).then(function(data) {
		console.log("success:" + data.name)
		runUpdateLBS()
	}).catch(function(e) {
		console.log(e)
		db.close();
	})
}


function runUpdatePlaceLBS() {
	var data = {};
	db.open(dbTable).then(function(collection) {
		return collection.findOne({
			lbs_bd_place: null
		})
	}).then(function(data) {
		return loadPlaceAPI(data.name).then(function(result) {
			return {
				name: data.name,
				lbs_bd_place: result
			}
		})
	}).then(function(data) {
		return db.collection.update({
			name: data.name
		}, {
			$set: data
		}).then(function() {
			return data;
		})

	}).then(function(data) {
		console.log("success:" + data.name)
		runUpdatePlaceLBS()
	}).catch(function(e) {
		console.log(e)
		db.close();
	})
}

/*
loadGeocoderAPI("雅戈尔太阳城邸").then(function(data) {
	console.log(data)
});
loadPlaceAPI("雅戈尔太阳城邸").then(function(data) {
	console.log(data)
});;
*/
function loadGeocoderAPI(name, city) {
	function getUrl(name, city = "苏州") {
		return `http://api.map.baidu.com/geocoder/v2/?output=json&address=${name}&city=${city}&ak=8hr2ZB5zsFI6dcId9Uj6ORy2kuLIP8vA`
	}

	var url = encodeURI(getUrl(name));
	return loader.getJSON((url)).then(function(data) {
		return data;
	}).catch(function(e) {
		console.log(e);
	})
}

function loadPlaceAPI(name, city) {
	function getPlaceUrl(name, city = "苏州") {
		return `http://api.map.baidu.com/place/v2/search?q=${name}&region=${city}&output=json&ak=8hr2ZB5zsFI6dcId9Uj6ORy2kuLIP8vA`
	}
	var url = encodeURI(getPlaceUrl(name));
	return loader.getJSON((url)).then(function(data) {
		return data;
	}).catch(function(e) {
		console.log(e);
	})

}

//runUpdateLBS();
//runUpdatePlaceLBS()