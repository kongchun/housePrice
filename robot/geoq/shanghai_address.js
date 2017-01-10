//来源：安居客
//获取所有地址信息
var loader = require('../../../iRobots/loader.js');
var helper = require('../../../iRobots/helper.js');
var db = require('../../../iRobots/db.js')("10.82.0.1", "alpha");
var map = require("../../../iRobots/baidu.js")



var area = ["黄浦", "徐汇", "长宁", "静安", "普陀", "虹口", "杨浦", "闵行", "宝山", "嘉定", "浦东", "金山", "松江", "青浦", "奉贤", "崇明"];

const city = "上海市"
const page_size = 20;

var loadBrand = function() {
	var table = "brand";
	var data = ["乐购", "华润万家", "家乐福"]
	var type = "brand";
	loadMoreType(table, type, data)
}


var loadPublic = function() {
	var table = "public";
	var data = ["加油站", "ATM"]
	var type = "public";
	loadMoreType(table, type, data)
}

var loadCompany = function() {
	var table = "company";
	var data = ["中国人保", "中国人寿"]
	var type = "company";
	loadMoreType(table, type, data)
}

var loadMoreType = function(table, type, data) {
	var arr = [];
	area.forEach((i) => {
		data.forEach((j) => {
			arr.push({
				search: i + " " + j,
				district: i,
				name: j
			});
		})
	})

	return helper.iteratorArr(arr, function(it) {
		var search = it.search;
		var name = it.name;
		var district = it.district;
		return loadPlaceAPI(search).then(function(data) {
			return data;
		}).then(function(data) {
			data.map((i) => {
				i.dbname = i.name;
				i.name = name;
				i.type = type;
				i.district = district;
			})
			return data;
		}).then(function(data) {
			var x = data.filter((i) => {
				var dbname = i.dbname.replace("（", "(");
				if (dbname.split("(")[0].indexOf(name) > -1) {
					return true;
				}
			})

			return x;

		}).then(function(data) {
			var countTable = table + "_count";
			db.close();
			return db.open(countTable).then(function() {
				return db.collection.insert({
					district: district,
					name: name,
					count: data.length,
					type: type
				})
			}).then(function() {
				db.close();
				if (data.length == 0) {
					return null;
				}
				return db.open(table).then(function() {
					return db.collection.insertMany(data)
				})
			}).then(function() {
				db.close();
				return;
			})

			console.log(data);
		}).catch(function(e) {
			console.log(e);
		})


	})
}



export var loadPlaceAPI = function(search) {

	var arr = [];
	return load().then(function(matrix) {
		var flatten = matrix.reduce(function(previous, current) {
			return previous.concat(current);
		});
		console.log(search, "success");
		return flatten;
	});

	function load(page_num = 0) {
		return map.loadPlaceAPI(search, city, page_num).then(function(data) {

			if (data.status == 0) {
				var total = data.total;
				arr.push(data.results);
				if (page_size * (page_num + 1) >= total) {
					return arr;
				} else {
					return load(++page_num);
				}
			}
		})

	}

}

//loadBrand()
//loadPublic()
loadCompany()