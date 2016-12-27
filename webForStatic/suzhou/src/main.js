var G_Map;
var marker = require("./marker.js");
var lastType = 0; //1 district //2area //3 community
$(function() {

	initSize()
	initMap();
	loadAll();

	$(window).on("resize", initSize);

	var map = G_Map;
	marker.showMarkers(map, districtMarkers);
	map.addEventListener("zoomend", function(t) {
		var zoom = map.getZoom();

		if (zoom < 13) {
			if (lastType != 1) {
				map.clearOverlays();
				marker.showMarkers(map, districtMarkers);
				lastType = 1;
				console.log("district");
			}
			return;
		}

		if (zoom < 15) {
			if (lastType != 2) {
				map.clearOverlays();
				marker.showMarkers(map, areaMarkers);
				lastType = 2;
				console.log("area");
			}
			return
		}
		if (lastType != 3) {
			map.clearOverlays();
			lastType = 3;
			console.log("community");
		}

	})

	map.addEventListener("tilesloaded", function() {
		if (lastType == 3) {
			console.log("communityMarkers")
			marker.showMarkersInBounds(map, communityMarkers);
		}
	});
})
var districtMarkers, areaMarkers, communityMarkers;

function loadAll(map) {
	districtMarkers = marker.loadDistrict(suzhou_district);
	areaMarkers = marker.loadArea(suzhou_area);
	communityMarkers = marker.loadCommunity(suzhou_community);
}


function initSize() {
	$("#map").height($(window).height())
}


function initMap() {
	var map = G_Map = new BMap.Map("map"); // 创建地图实例  
	var top_left_navigation = new BMap.NavigationControl();
	var top_left_control = new BMap.ScaleControl({
		anchor: BMAP_ANCHOR_TOP_RIGHT
	}); // 左上角，添加比例尺
	map.centerAndZoom("苏州市", 12); // 初始化地图，设置中心点坐标和地图级别  
	map.addControl(top_left_navigation);
	//map.addControl(top_left_control);
	map.enableScrollWheelZoom(); //启用滚轮放大缩小，默认禁用
	map.enableContinuousZoom(); //启用地图惯性拖拽，默认禁用
}