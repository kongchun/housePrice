var data = require("./data/trading.js");
var trading = {};
var type = ["餐饮类", "购物类", "旅游类", "金融类", "车房类", "教育类"];

export var init = function(map) {


	trading["卢湾商圈"] = getHeatmap(map, getData("卢湾商圈"), 10);
	trading["三林商圈"] = getHeatmap(map, getData("三林商圈"), 10);

	trading["餐饮类"] = getHeatmap(map, getHData("餐饮类"), 5);
	trading["购物类"] = getHeatmap(map, getHData("购物类"), 5);

	trading["餐饮类"].hide();
	trading["购物类"].hide();
	trading["卢湾商圈"].hide();
	trading["三林商圈"].hide();
	//trading["三林商圈"].show();
}

function getHData(value) {
	var myData = []
	for (var prop in data) {
		//console.log(prop)
		myData = myData.concat(data[prop][value])
	}

	var x = myData.map((i) => {
		return gpsCover(i)
	});

	return x;
}

function getData(value) {
	var myData = []
	type.forEach(function(i) {
		myData = myData.concat(data[value][i]);
	})

	var x = myData.map((i) => {
		return gpsCover(i)

	});


	return x;
}

export var show = function(map, name) {
	trading[name].show();
}

export var hide = function(map, name) {
	trading[name].hide();
}

function gpsCover(obj) {
	var bd = GPS.bd_encrypt(obj.lat, obj.lng);
	return {
		"lng": parseFloat(bd.lon),
		"lat": parseFloat(bd.lat),
		"count": obj.count
	}
}

function getHeatmap(map, points, max) {
	if (!isSupportCanvas()) {
		alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~')
	}
	var max = max || 6;


	var heatmapOverlay = new BMapLib.HeatmapOverlay({
		"radius": 20
	});

	//console.log(points);
	map.addOverlay(heatmapOverlay);
	heatmapOverlay.setDataSet({
		data: points,
		max: max
	});
	//heatmapOverlay.show()
	return heatmapOverlay;
}

function closeHeatmap() {
	heatmapOverlay.hide();
}

function isSupportCanvas() {
	var elem = document.createElement('canvas');
	return !!(elem.getContext && elem.getContext('2d'));
}