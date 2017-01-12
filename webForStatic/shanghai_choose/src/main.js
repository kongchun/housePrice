var marker = require("./marker.js");
var people = require("./people.js");
var line = require("./line.js");
var trading = require("./trading.js");
var brand = require("./brand.js");
var house = require("./house.js");
$(function() {
	initNav();



	var map = initMap();

	people.init(map);
	trading.init(map);
	//people.show(map);
	// //trading.init(map);
	// //trading.show(map, "三林商圈");

	line.init(map);
	// // line.show(map, 1);
	// // line.show(map, 2);
	// // line.show(map, 3);
	// // line.show(map, 4);
	// //line.hide(map);
	// //
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

	var lwChk = $(".trading input");
	lwChk.change(function() {
		if ($(this)[0].checked) {
			trading.show(map, $(this).val());

		} else {
			trading.hide(map, $(this).val());
		}
	})


	var subway = $(".subway input");
	subway.change(function() {
		if ($(this)[0].checked) {
			line.show(map, $(this).val());

		} else {
			line.hide(map, $(this).val());
		}
	})

	var brandChk = $(".brand input");
	brandChk.change(function() {
		if ($("input:checked").length > 5) {
			alert("最多勾选5条");
			this.checked = false;
			return false;
		}
		var arr = [];
		$(".brand input:checked").each(function() {
			arr.push(this.value);
		})
		brand.toggleShow(map, arr);
	})

	var housePrice = $(".house .housePrice");
	housePrice.change(function() {
		console.log(this.checked)
		if ($(this)[0].checked) {
			house.show(map);
		} else {
			house.hide(map);
		}
	})
}

function initMap() {
	var map = new BMap.Map("map"); // 创建地图实例  
	var top_left_navigation = new BMap.NavigationControl();
	var top_left_control = new BMap.ScaleControl({
		anchor: BMAP_ANCHOR_TOP_RIGHT
	}); // 左上角，添加比例尺
	//map.centerAndZoom("上海市", 12); // 初始化地图，设置中心点坐标和地图级别  
	map.addControl(top_left_navigation);
	//map.addControl(top_left_control);
	map.enableScrollWheelZoom(); //启用滚轮放大缩小，默认禁用
	map.enableContinuousZoom(); //启用地图惯性拖拽，默认禁用

	var point = new BMap.Point(121.523859, 31.258039);
	map.centerAndZoom(point, 12);

	map.setMapStyle({
		styleJson: [{
			"featureType": "all",
			"elementType": "all",
			"stylers": {
				"lightness": 61,
				"saturation": -70
			}
		}]
	});
	return map;
}

function initNav() {

	$("#map").height($(window).height() - 50);

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