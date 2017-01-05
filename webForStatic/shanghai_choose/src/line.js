var data = require("./data/line.js");
var arr = [];
var nameIndex = {};



function getPolyline(path) {
	var points = path.map((i) => {

		return new BMap.Point(i.lng, i.lat);
	})
	var polyline = new BMap.Polyline(points, {
		strokeColor: "blue",
		strokeWeight: 6,
		strokeOpacity: 0.5
	});
	return polyline
}

var options = {
	size: BMAP_POINT_SIZE_SMALL,
	shape: BMAP_POINT_SHAPE_CIRCLE,
	color: 'blue'
}

function getMarker(arr) {


	var points = arr.map((i) => {

		return new BMap.Point(i.position.lng, i.position.lat);
	})
	var pointCollection = new BMap.PointCollection(points, options);
	return pointCollection;
}


export var init = function(map) {

	console.log("start init line");
	data.forEach(function(line, i) {
		arr.push({
			polyline: getPolyline(line.path),
			marker: getMarker(line.station)
		})
		nameIndex[line.name] = i
	})

	//console.log(arr);
	//console.log(nameIndex);
}

export var show = function(map, i) {

	if (i) {
		var lineName = `地铁${i}号线`;
		var i = arr[nameIndex[lineName]];
		map.addOverlay(i.polyline);
		map.addOverlay(i.marker);
		return;
	}
	arr.forEach(function(i) {
		map.addOverlay(i.polyline);
		map.addOverlay(i.marker);
		console.log("show line")
	})
}

export var hide = function(map) {
	arr.forEach(function(i) {
		map.removeOverlay(i.polyline);
		map.removeOverlay(i.marker);
		console.log("show line")
	})
}