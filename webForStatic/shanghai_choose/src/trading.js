var data = require("./data/trading.js");
var trading = {};
var type = ["餐饮类", "购物类", "旅游类", "金融类", "车房类", "教育类"];

var addr = {
	"北外滩商圈": [
		[121.500431, 31.234144],
		[121.552990, 31.279110]
	],
	"大宁商圈": [
		[121.442832, 31.233495],
		[121.495421, 31.296448]
	],
	"卢湾商圈": [
		[121.42497, 31.18102],
		[121.498556, 31.23320]
	],
	"三林商圈": [
		[121.507267, 31.187762],
		[121.559826, 31.232728]
	]
};

export var init = function(map) {
	console.log(BMapLib)
	trading["卢湾商圈"] = getHeatmap(map, getData("卢湾商圈"), 10);
	trading["三林商圈"] = getHeatmap(map, getData("三林商圈"), 10)
}


function getData(value) {
	var myData = []
	type.forEach(function(i) {
		myData = myData.concat(data[value][i]);
	})
	return myData;
}

export var show = function(map, name) {
	//trading[name].show();
}

function getHeatmap(map, points, max) {

	if (!isSupportCanvas()) {
		alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~')
	}
	var max = max || 6;


	var heatmapOverlay = new BMapLib.HeatmapOverlay({
		"radius": 20
	});

	console.log(points);
	map.addOverlay(heatmapOverlay);
	heatmapOverlay.setDataSet({
		data: points,
		max: 100
	});
	heatmapOverlay.show()
	return heatmapOverlay;
}

function closeHeatmap() {
	heatmapOverlay.hide();
}

function isSupportCanvas() {
	var elem = document.createElement('canvas');
	return !!(elem.getContext && elem.getContext('2d'));
}