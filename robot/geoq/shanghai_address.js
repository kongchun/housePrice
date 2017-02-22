//来源：安居客
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
	var data = ["世纪华联"]
	var type = "brand";
	loadMoreType(table, type, data)
}

// db.district.find({}).forEach((it)=> { 
//     var data = ["乐购", "华润万家", "家乐福"]
//     data.forEach((name,i)=>{
//         var count = db.brand.find({district:it.district,name:name}).count();
//         db.brand_count.save({district:it.district,name:name,point:it.point,count:count})
//     })
// });
// 
var data = ["世纪华联"]


function exportTable(table, data) {
	var obj = {};
	helper.iteratorArr(data, function(it) {

		var x = obj[it] = {};
		//console.log(obj)
		var countTable = table + "_count";
		return db.open(countTable).then(function() {
			return db.collection.find({
				name: it
			}, {
				_id: 0,
				name: 0,
				point: 0
			}).toArray()
		}).then(function(data) {
			db.close();
			//console.log(data);
			x["district_count"] = (data);
			return db.open(table).then(function() {
				return db.collection.find({
					name: it
				}, {
					_id: 0,
					location: 1,
					dbname: 1
				}).toArray()
			})

		}).then(function(data) {
			db.close();
			x["area"] = (data);
			//console.log(JSON.stringify(obj))
			return obj;
		}).catch(function(e) {
			console.log(e);
		})
	}).then(function(data) {
		console.log(JSON.stringify(obj))
	})
}

exportTable("brand", ["乐购", "华润万家", "家乐福", "世纪华联", "永辉", "苏果", "卜蜂莲花", "麦德龙", "大润发", "物美", "乐天玛特", "欧尚", "万宁", "沃尔玛", "易买得", "7-ELEVEN便利店", "OK便利店", "惠康超市", "百佳超市", "易买得", "个护化妆", "屈臣氏", "莎莎", "鸥美药妆", "丝芙兰", "亿莎", "悦诗风吟", "卓悦", "采活", "蝶翠诗", "幻彩", "惠之林", "娇兰佳人", "千色", "妍丽", "名创优品", "谜尚", "珠宝服饰", "C&A", "GAP", "H&M", "Zara", "迪卡侬", "优衣库", "六福", "周大福", "周生生", "万达国际电影城", "星美国际影城", "保利国际影城", "博纳国际电影城", "大地数字影院", "横店影视电影城", "金逸国际电影城", "UME国际影城", "餐饮", "Costa", "必胜客", "汉堡王", "肯德基", "麦当劳", "太平洋咖啡", "味千", "星巴克", "呷哺呷哺", "庆丰包子铺", "大众", "斯柯达", "宾利", "兰博基尼", "本田", "凯迪拉克", "别克", "雪佛兰", "欧宝", "萨博", "宝马", "劳斯莱斯", "日产", "英菲尼迪", "雷诺", "梅赛德斯-奔驰", "精灵", "丰田", "雷克萨斯", "斯巴鲁", "东风雪铁龙", "东风标致", "DS", "三菱", "菲亚特", "阿尔法-罗密欧", "法拉利", "玛莎拉蒂", "现代", "起亚", "东风悦达起亚", "福特", "马自达", "林肯", "捷豹", "路虎", "保时捷", "东风", "吉利", "沃尔沃", "奇瑞", "克莱斯勒", "吉普", "道奇", "荣威", "名爵", "观致"]);

// data.forEach((i) => {
// 	var obj = {};
// 	json(obj, i);
// })

// function json(obj, name) {
// 	db.open("brand_count").then(function() {
// 		return db.collection.find({
// 			name: name
// 		}, {
// 			_id: 0,
// 			count: 1,
// 			district: 1,
// 			point: 1
// 		}).toArray()
// 	}).then(function(data) {
// 		db.close();
// 		db.open("")
// 		obj[name] = data;
// 		console.log(JSON.stringify(obj))
// 	})
// }

var loadPublic = function() {
	var table = "public";
	var data = ["加油站", "ATM"]
	var type = "public";
	loadMoreType(table, type, data)
}

//exportTable("public", ["加油站", "ATM"]);

var loadCompany = function() {
	var table = "company";
	var data = ["中国人保", "中国人寿"]
	var type = "company";
	loadMoreType(table, type, data)
}

//exportTable("company", ["中国人保", "中国人寿"]);

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
			console.log(data)
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
			// return db.open(countTable).then(function() {
			// 	return db.collection.insert({
			// 		district: district,
			// 		name: name,
			// 		count: data.length,
			// 		type: type
			// 	})
			// }).then(function() {
			// 	db.close();
			//----------
			// if (data.length == 0) {
			// 	return null;
			// }
			// return db.open(table).then(function() {
			// 	return db.collection.insertMany(data)
			// }).then(function() {
			// 	db.close();
			// 	return;
			// })

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
//loadCompany()
//

// map.loadGeocoderGPSAPI([121.402553, 31.257011]).then(function(data) {
// 	console.log((data))
// })