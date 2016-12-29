var map = require("../../../iRobots/baidu.js")
var loader = require('../../../iRobots/loader.js');
var helper = require('../../../iRobots/helper.js');
var db = require('../../../iRobots/db.js')("10.82.0.1", "house");

export var loadSpace = function(geoURL, name) {
	return loader.postJSON(geoURL, {
		kw: name
	}).then(function(json) {
		//增加操作演示方式调用频率过大
		return new Promise(function(r, j) {
			setTimeout(function() {
				r(json);
			}, 100)
		})
	}).catch(function(e) {
		console.log(name, "error");
		return loadSpace(geoURL, name)
	})
}

function getAnJukePoint(info) {
	return {
		lat: info.lat,
		lng: info.lng
	}
}

function getAnJukePrice(info) {
	//console.log(info, "info")
	var upDown = "up";
	var fc = parseFloat(info.midChange ? info.midChange : 0)
	if (fc < 0) {
		upDown = "down"
		fc = -fc;
	}
	var compare = (fc * 100).toFixed(2);
	var price = parseFloat(info.midPrice ? info.midPrice : 0);
	return {
		compare,
		upDown,
		price
	}
};

export var clearPrice = function(table) {
	db.close();
	return db.open(table).then(function() {
		return db.collection.updateMany({}, {
			$set: {
				price: null
			}
		})
	}).then(function() {
		return;
		console.log("clear price");
	})
}

export var updatePrice = function(table, geoURL) {
	db.close();
	let date = new Date();
	return db.open(table).then(function() {
		return db.collection.find({
			price: null
		}, {
			name: 1
		}).toArray()
	}).then(function(arr) {
		return helper.iteratorArr(arr, function(it) {
			var search = it.name;
			return loadSpace(geoURL, search).then(function(data) {
				if (data.matchType > 0) {
					var info = data.info[0];
					var {
						compare,
						upDown,
						price
					} = getAnJukePrice(info)
						//var point = getAnJukePoint(info);
						//var commId = info.commId;
					var _id = it._id

					return {
						compare,
						upDown,
						price,
						//point,
						//commId,
						_id
					}

				}

				return it;
			}).then(function(data) {
				return db.collection.update({
					_id: db.ObjectId(data._id)
				}, {
					$set: {
						compare: data.compare,
						price: data.price,
						//commId: data.id,
						upDown: data.upDown,
						date: date
							//point: data.point
					}
				}).then(function() {
					console.log(search, "price success")
					return data;
				}).catch(function(e) {
					console.log(search, "price error")
					db.close();
					console.log(e);
					return
				})
			})
		})
	}).then(function() {
		db.close();
		console.log("updatePrice success");
		return null;
	})
}


// var community_url = "http://suzhou.anjuke.com/community/view/"
// var table = "suzhou_anjuke_community";

function getCommunityById(url) {
	return loader.getDOM(url).then(function($) {
		return $;
	}).catch(function(e) {
		console.log(url, e)
		return getCommunityById(url);
	})
}

export var updateInfoPrice = function(table, url) {
	let date = new Date();
	db.close();
	return db.open(table).then(function() {
		return db.collection.find({
			price: null
		}, {
			anjukeId: 1
		}).toArray()
	}).then(function(arr) {
		return helper.iteratorArr(arr, function(it) {
			var u = url + it.anjukeId;
			console.log(u)
			return getCommunityById(u).then(function($) {
				console.log($.text())
				var _id = it._id;
				var price = parseFloat($(".comm-avg-price").text());
				var $strong = $(".price-tip strong");
				var upDown = $strong.attr("class").replace(/(^\s*)|(\s*$)/g, "");
				var compare = parseFloat($strong.text().replace(/[^0-9.]/ig, ""));


				return {
					compare,
					upDown,
					price,
					//point,
					//commId,
					_id
				}


			}).then(function(data) {
				console.log(data)
				return db.collection.update({
					_id: db.ObjectId(data._id)
				}, {
					$set: {
						compare: data.compare,
						price: data.price,
						//commId: data.id,
						upDown: data.upDown,
						date: date
							//point: data.point
					}
				}).then(function(t) {

					console.log(u, "price success")
					return null;
				}).catch(function(e) {
					console.log(u, "price error")
					db.close();
					console.log(e);
					return
				})
			})
		})
	}).then(function() {
		db.close();
		console.log("updateInfoPrice finish");
		return null;
	}).catch(function(e) {
		console.log(e);
	})
}

export var updateMobileInfoPrice = function(table, url) {
	let date = new Date();
	db.close();
	return db.open(table).then(function() {
		return db.collection.find({
			price: null
		}, {
			anjukeId: 1
		}).toArray()
	}).then(function(arr) {
		return helper.iteratorArr(arr, function(it) {
			var u = url + it.anjukeId;
			console.log(u)
			return getCommunityById(u).then(function($) {
				var _id = it._id;
				var price = parseFloat($(".comm-basic .price em").text().replace(/[^0-9.]/ig, ""));
				var $strong = $(".contrast .st");
				var upDown = $strong.attr("class").replace("st", "").replace(/(^\s*)|(\s*$)/g, "");
				var compare = parseFloat($strong.text().replace(/[^0-9.]/ig, ""));

				return {
					compare,
					upDown,
					price,
					//point,
					//commId,
					_id
				}


			}).then(function(data) {
				console.log(data)
				return db.collection.update({
					_id: db.ObjectId(data._id)
				}, {
					$set: {
						compare: data.compare,
						price: data.price,
						//commId: data.id,
						upDown: data.upDown,
						date: date
							//point: data.point
					}
				}).then(function(t) {

					console.log(u, "price success")
					return null;
				}).catch(function(e) {
					console.log(u, "price error")
					db.close();
					console.log(e);
					return
				})
			})
		})
	}).then(function() {
		db.close();
		console.log("updateInfoPrice finish");
		return null;
	}).catch(function(e) {
		console.log(e);
	})
}

export var priceToMonth = function(fromTable, toTable) {
	db.close();
	return db.open(fromTable).then(function() {
		return db.collection.find({}, {
			_id: 0,
			name: 1,
			price: 1,
			anjukeId: 1,
			compare: 1,
			upDown: 1

		}).toArray()
	}).then(function(data) {
		db.close();
		var date = new Date();
		return data.map((i) => {
			i.year = date.getFullYear();
			i.month = date.getMonth() + 1;
			i.date = date;
			return i;
		})
	}).then(function(data) {
		return db.open(toTable).then(function() {
			return db.collection.insertMany(data);
		})
	}).then(function() {
		db.close();
		console.log("==finish==", "priceToMonth")
		return null;
	}).catch(function(e) {
		db.close();
		console.log(e, "priceToMonth")
	})
}

// console.log(db.ObjectId)
// var table = "suzhou_anjuke_community";
// var data = {
// 	compare: '0.70',
// 	upDown: 'down',
// 	price: '16979',
// 	point: {
// 		lat: '31.334880506951',
// 		lng: '120.56885264886'
// 	},
// 	commId: '165103',
// 	_id: '58363a44d7bbc82a98451b38'
// }
// db.close()
// db.open(table).then(function() {
// 	db.collection.update({
// 		_id: db.ObjectId(data._id)
// 	}, {
// 		$set: {
// 			compare: data.compare,
// 			price: data.price,
// 			commId: data.commId,
// 			upDown: data.upDown,
// 			point: data.point
// 		}
// 	}).then(function() {
// 		console.log(search, "point success")
// 		return data;
// 	}).catch(function(e) {
// 		console.log(search, "point error")
// 		db.close();
// 		console.log(e);
// 		return
// 	})
// })
// 
// 
//test()

function test() {
	db.close()
	db.open("suzhou_anjuke_community").then(function() {
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
			district: 0
		}).toArray()
	}).then(function(arr) {
		db.close()
			// arr.forEach((i) => {
			// 	console.log(JSON.stringify(i))
			// })

		console.log(JSON.stringify(arr))
	})
}