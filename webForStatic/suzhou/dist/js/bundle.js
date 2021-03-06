! function r(o, n, e) {
	function t(a, u) {
		if (!n[a]) {
			if (!o[a]) {
				var l = "function" == typeof require && require;
				if (!u && l) return l(a, !0);
				if (i) return i(a, !0);
				var c = new Error("Cannot find module '" + a + "'");
				throw c.code = "MODULE_NOT_FOUND", c
			}
			var f = n[a] = {
				exports: {}
			};
			o[a][0].call(f.exports, function(r) {
				var n = o[a][1][r];
				return t(n ? n : r)
			}, f, f.exports, r, o, n, e)
		}
		return n[a].exports
	}
	for (var i = "function" == typeof require && require, a = 0; a < e.length; a++) t(e[a]);
	return t
}({
	1: [function(r, o, n) {
		"use strict";

		function e(r) {
			l = a.loadDistrict(suzhou_district), c = a.loadArea(suzhou_area), f = a.loadCommunity(suzhou_community)
		}

		function t() {
			$("#map").height($(window).height())
		}

		function i() {
			var r = new BMap.Map("map"),
				o = new BMap.NavigationControl({
					type: BMAP_NAVIGATION_CONTROL_SMALL
				});
			return r.centerAndZoom("苏州市", 12), r.addControl(o), r.enableScrollWheelZoom(), r.enableContinuousZoom(), r
		}
		var a = r("./marker.js"),
			u = 0;
		$(function() {
			t();
			var r = i();
			e(), $(window).on("resize", t), a.showMarkers(r, l), r.addEventListener("zoomend", function(o) {
				var n = r.getZoom();
				return n < 13 ? void(1 != u && (r.clearOverlays(), a.showMarkers(r, l), u = 1, console.log("district"))) : n < 15 ? void(2 != u && (r.clearOverlays(), a.showMarkers(r, c), u = 2, console.log("area"))) : void(3 != u && (r.clearOverlays(), u = 3, console.log("community")))
			}), r.addEventListener("tilesloaded", function() {
				3 == u && (console.log("communityMarkers"), a.showMarkersInBounds(r, f))
			})
		});
		var l, c, f
	}, {
		"./marker.js": 2
	}],
	2: [function(r, o, n) {
		"use strict";

		function e(r) {
			return new BMap.Point(r.lng, r.lat)
		}

		function t(r, o) {
			var n = u(r, o),
				e = n.point,
				t = n.text,
				i = n.fillColor,
				a = f(map, e, t, i);
			return a
		}

		function i(r, o) {
			var n = l(r, o),
				e = n.point,
				t = n.text,
				i = n.fillColor,
				a = f(map, e, t, i);
			return a
		}
		Object.defineProperty(n, "__esModule", {
			value: !0
		});
		var a = ["#FF6600", "#FF9933", "#FFCC33", "#99CC33", "#789E27"],
			u = (n.loadDistrict = function(r) {
				var o = r.map(function(r) {
					return t(r, r.district)
				});
				return o
			}, n.loadArea = function(r) {
				var o = r.map(function(r) {
					return t(r, r.area)
				});
				return o
			}, n.loadCommunity = function(r) {
				var o = r.map(function(r) {
					return i(r, r.name)
				});
				return o
			}, n.showMarkers = function(r, o) {
				o.forEach(function(o) {
					r.addOverlay(o)
				})
			}, n.showMarkersInBounds = function(r, o) {
				var n = r.getBounds();
				o.forEach(function(o) {
					var e = BMapLib.GeoUtils.isPointInRect(o.point, n);
					e ? r.addOverlay(o) : r.removeOverlay(o)
				})
			}, function(r, o) {
				var n = c(r),
					e = n.point,
					t = n.compare,
					i = n.fillColor,
					a = o + " " + r.price + "元/m²<br/>浮动：" + t;
				return {
					point: e,
					text: a,
					fillColor: i
				}
			}),
			l = function(r, o) {
				var n = c(r),
					e = n.point,
					t = n.compare,
					i = n.fillColor,
					a = o + " <br/>" + r.price + "元/m² " + t;
				return {
					point: e,
					text: a,
					fillColor: i
				}
			},
			c = function(r) {
				var o = e(r.point),
					n = "",
					t = a[1];
				return "up" == r.upDown ? n = r.compare + "% ↑" : (n = r.compare + "% ↓", t = a[3]), {
					point: o,
					compare: n,
					fillColor: t
				}
			},
			f = function(r, o, n, e) {
				var t = {
						position: o,
						offset: new BMap.Size((-30), (-30))
					},
					i = new BMap.Label(n, t);
				return i.setStyle({
					backgroundColor: e,
					fontSize: "14px",
					fontFamily: "微软雅黑",
					padding: "6px",
					border: 0,
					opacity: .9
				}), i
			}
	}, {}]
}, {}, [1]);