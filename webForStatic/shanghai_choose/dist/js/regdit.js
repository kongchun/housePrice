function initMap(){var n=new BMap.Map("map"),e=new BMap.NavigationControl;new BMap.ScaleControl({anchor:BMAP_ANCHOR_TOP_RIGHT});return n.centerAndZoom("上海市",12),n.addControl(e),n.enableScrollWheelZoom(),n.enableContinuousZoom(),n}var marker=require("./marker.js"),line=require("./line.js");$(function(){var n=initMap();line.init(n),line.show(n,1),line.show(n,2),line.show(n,3),line.show(n,4)});