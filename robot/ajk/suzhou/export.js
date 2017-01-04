var db = require('../../../../iRobots/db.js')("10.82.0.1", "house");
var fs = require('fs');
var suzhou = [];

exportToTxt();

function exportToTxt() {
	var data = [];
	exportCommunity().then(function(arr) {
		data.push("var suzhou_community =");
		data.push(JSON.stringify(arr));
		data.push(";");
		//console.log(data.join(""));
		return exportDistrict();
	}).then(function(arr) {
		data.push("var suzhou_district =");
		data.push(JSON.stringify(arr));
		data.push(";");
		//console.log(data.join(""));
		return exportArea()
	}).then(function(arr) {
		data.push("var suzhou_area =");
		data.push(JSON.stringify(arr));
		data.push(";");
		//console.log(data.join(""));
		return;
	}).then(function() {
		var str = data.join("");
		fs.writeFile('data.js', str, function(err) {
			if (err) throw err;
			console.log('写入完成');
		});
	})
}

function exportCommunity() {

	db.close()
	return db.open("suzhou_anjuke_community").then(function() {
		return db.collection.find({
			point: {
				$ne: null
			},
			price: {
				$ne: null
			}
		}, {
			anjukeId: 0,
			_id: 0,
			_name: 0,
			area: 0,
			date: 0,
			district: 0
		}).toArray()
	}).then(function(arr) {
		db.close();
		return arr;
	}).catch(function(e) {
		db.close();
		console.log(e);
	})
}

function exportDistrict() {
	db.close();
	return db.open("suzhou_anjuke_area").then(function() {
		return db.collection.find({
			area: "全部"
		}, {
			district: 1,
			area: 1,
			price: 1,
			point: 1,
			upDown: 1,
			compare: 1,
			_id: 0
		}).toArray();
	}).then(function(arr) {
		db.close()
		return arr;
	}).catch(function(e) {
		db.close();
		console.log(e);
	})
}

function exportArea() {
	db.close();
	return db.open("suzhou_anjuke_area").then(function() {
		return db.collection.find({
			area: {
				$ne: "全部"
			}
		}, {
			district: 1,
			area: 1,
			price: 1,
			point: 1,
			upDown: 1,
			compare: 1,
			_id: 0
		}).toArray();
	}).then(function(arr) {
		db.close()
		return arr;
	}).catch(function(e) {
		db.close();
		console.log(e);
	})
}