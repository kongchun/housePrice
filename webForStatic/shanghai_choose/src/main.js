var marker = require("./marker.js");
var people = require("./people.js");
var line = require("./line.js");
var trading = require("./trading.js");
$(function() {
	initNav();



	var map = initMap();

	people.init(map);
	people.show(map);
	//trading.init(map);
	//trading.show(map, "卢湾商圈");

	line.init(map);
	// line.show(map, 1);
	// line.show(map, 2);
	// line.show(map, 3);
	// line.show(map, 4);
	//line.hide(map);
	//
	initEvent(map);

})

function initEvent(map) {
	var peopleChk = $(".district .people");
	peopleChk.change(function() {
		if ($(this)[0].checked) {
			people.show(map);

		} else {
			people.hide(map);
		}
	})

	var lwChk = $(".trading .lw");
	lwChk.change(function() {
		if ($(this)[0].checked) {
			trading.show(map, "卢湾商圈");

		} else {
			trading.hide(map, "卢湾商圈");
		}
	})

	var lwChk = $(".trading .sl");
	lwChk.change(function() {
		if ($(this)[0].checked) {
			trading.show(map, "三林商圈");

		} else {
			trading.hide(map, "三林商圈");
		}
	})

	var subway = $(".subway input");
	subway.change(function() {
		console.log(1);
		if ($(this)[0].checked) {
			line.show(map, $(this).val());

		} else {
			line.hide(map, $(this).val());
		}
	})
}

function initMap() {
	var map = new BMap.Map("map"); // 创建地图实例  
	var top_left_navigation = new BMap.NavigationControl();
	var top_left_control = new BMap.ScaleControl({
		anchor: BMAP_ANCHOR_TOP_RIGHT
	}); // 左上角，添加比例尺
	map.centerAndZoom("上海市", 12); // 初始化地图，设置中心点坐标和地图级别  
	map.addControl(top_left_navigation);
	//map.addControl(top_left_control);
	map.enableScrollWheelZoom(); //启用滚轮放大缩小，默认禁用
	map.enableContinuousZoom(); //启用地图惯性拖拽，默认禁用
	return map;
}

function initNav() {

	$(".nav-parent a").click(function(e) {
		var dom = $(this).parent(".nav-parent");
		if (dom.hasClass("nav-expanded")) {
			dom.removeClass("nav-expanded")
			$(".nav-children", dom).hide();
		} else {
			dom.addClass("nav-expanded")
			$(".nav-children", dom).show();
		}

	})



}