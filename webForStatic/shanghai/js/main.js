require.config({
    baseUrl: "js",
    paths: {
        "jquery": '//apps.bdimg.com/libs/jquery/1.9.1/jquery.min',
        "jquery.cookie": '//apps.bdimg.com/libs/jquery.cookie/1.4.1/jquery.cookie.min',
        "jqueryui": '//cdn.bootcss.com/jqueryui/1.11.4/jquery-ui.min',
        "bootstrap": '//apps.bdimg.com/libs/bootstrap/3.3.4/js/bootstrap.min',
        "bdapi": "//api.map.baidu.com/getscript?v=2.0&ak=8hr2ZB5zsFI6dcId9Uj6ORy2kuLIP8vA&services=&t=20160401164342",
        "heatmap": "//api.map.baidu.com/library/Heatmap/2.0/src/Heatmap_min",
        "jquery.slimscroll": "jquery.slimscroll",
        "app": "script"
    },

    shim: {
        bootstrap: {
            deps: ['jquery']
        },
        "heatmap": {
            deps: ['bdapi']
        },
        "jqueryui": {
            deps: ['jquery']
        },
        "jquery.slimscroll": {
            deps: ['jquery']
        },
        "jquery.cookie": {
            deps: ['jquery']
        },
        "app": {
            deps: ['jquery', "jquery.cookie", "jquery.slimscroll"]
        }

    }
});

window.BMap_loadScriptTime = (new Date).getTime();


define("map", ["bdapi"], function() {
    var map = new BMap.Map("container");


    map.centerAndZoom("上海", 12); // 初始化地图，设置中心点坐标和地图级别 
    map.enableScrollWheelZoom(); // 允许滚轮缩放


    var top_left_navigation = new BMap.NavigationControl();
    map.addControl(top_left_navigation);
    return map;
});



define("myHeatMap", ["map", "heatmap"], function(map) {

    var heatmapOverlay = null;
    var myHeatMap = {
        show: function(points, max) {
            showHeatmap(points, max);
        },
        hide: function() {
            closeHeatmap();
        },
        remove: function() {
            map.removeOverlay(heatmapOverlay);
            heatmapOverlay = null;
        }
    }



    function isSupportCanvas() {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    }

    function showHeatmap(points, max) {

        if (!isSupportCanvas()) {
            alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~')
        }
        var max = max || 6;

        //console.log((points))
        //coverPoints(points);
        //console.log((points))


        heatmapOverlay = new BMapLib.HeatmapOverlay({
            "radius": 20
        });
        map.addOverlay(heatmapOverlay);
        heatmapOverlay.setDataSet({
            data: points,
            max: max
        });

    }

    function closeHeatmap() {
        heatmapOverlay.hide();
    }

    return myHeatMap;
})



require(["app", "jquery", "jqueryui", "bootstrap", "map", "myHeatMap", "data", "complexCustomOverlay"], function(app, $, $ui, bootstrap, map, myHeatMap, data, ComplexCustomOverlay) {


    $(function() {
        App.init();

        //划分行政区域显示
        //loadDistrict(map);

        map.addEventListener("zoomend", function(t) {
            var zoom = map.getZoom();
            console.log(zoom)
            map.clearOverlays();
            if (zoom < 14) {
                loadDistrict(map);
            } else {
                loadArea(map);
            }
        })

        // $("#hotmap").click(function() {

        // })


        // $("#priceMap").click(function() {

        // })
    })

})

function loadDistrict(map) {
    districtData.forEach(function(i) {
        polygon(map, i.boundary, getColorByPrice(i.price));
        markerDistrict(map, i);
    })
}

function loadArea(map) {
    areaData.forEach(function(i) {
        markerArea(map, i);
    })
}

function markerArea(map, i) {
    var opts = {
        position: getPoint(i.point), // 指定文本标注所在的地理位置
        offset: new BMap.Size(0, 0) //设置文本偏移量
    }
    var fillColor = color[1]
    var compare = "";
    if (i.upDown == "up") {
        compare = i.compare + "% ↑"

    } else {
        compare = i.compare + "% ↓"
        fillColor = color[3]
    }
    var text = `${i.area} ${i.price}元/m²<br/>浮动：${compare}`
    var label = new BMap.Label(text, opts); // 创建文本标注对象
    label.setStyle({
        borderRadius: "10px",
        backgroundColor: fillColor,
        color: "white",
        fontSize: "12px",
        fontFamily: "微软雅黑",
        padding: "8px",
        border: 0
    });
    map.addOverlay(label);
}

function markerDistrict(map, i) {
    //var arr = boundary(i.boundary);
    //console.log(map.getViewport(arr).center);
    var opts = {
        position: getPoint(i.point), // 指定文本标注所在的地理位置
        offset: new BMap.Size(-30, -10) //设置文本偏移量
    }
    var compare = "";
    if (i.upDown == "up") {
        compare = i.compare + "% ↑"
    } else {
        compare = i.compare + "% ↓"
    }
    var text = `${i.district} ${i.price}元/m²;${compare}`
    var label = new BMap.Label(text, opts); // 创建文本标注对象
    label.setStyle({
        backgroundColor: "#4D98DD",
        color: "white",
        fontSize: "12px",
        fontFamily: "微软雅黑",
        padding: "4px",
        border: 0
    });
    map.addOverlay(label);
}

function polygon(map, boundaryData, fillColor) {
    var arr = boundary(boundaryData);
    var polygon = new BMap.Polygon(arr, {
        fillColor: fillColor,
        fillOpacity: 0.8,
        strokeColor: "black",
        strokeWeight: 1,
        strokeOpacity: 0.5
    });
    map.addOverlay(polygon);
}

function boundary(boundaryData) {
    return boundaryData.map(function(it) {
        return getPoint(it);
    })
}

var color = ["#FF6600", "#FF9933", "#FFCC33", "#99CC33", "#789E27"]

function getColorByPrice(price) {
    if (price > 80000) {
        return color[0]
    } else if (price > 60000) {
        return color[1]
    } else if (price > 40000) {
        return color[2]
    } else if (price > 20000) {
        return color[3]
    } else {
        return color[4]
    }
}

function getPoint(it) {
    return new BMap.Point(it.lng, it.lat);
}

function getUp(x) {
    if (x.indexOf("-") > -1) {

        return false;
    }
    return true;
}

define("complexCustomOverlay", ["map"], function(mp) {
    function ComplexCustomOverlay(point, text, mouseoverText, up) {
        this._point = point;
        this._text = text;
        this._overText = mouseoverText;
        this.up = up;
    }
    ComplexCustomOverlay.prototype = new BMap.Overlay();
    ComplexCustomOverlay.prototype.initialize = function(map) {
        this._map = map;
        var div = this._div = document.createElement("div");
        div.style.position = "absolute";
        div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
        if (this.up) {
            div.style.backgroundColor = "#EE5D5B";
            div.style.border = "1px solid #BC3B3A";
        } else {
            div.style.backgroundColor = "#a8bc7b";
            div.style.border = "1px solid #eee";
        }

        div.style.color = "white";
        div.style.height = "18px";
        div.style.padding = "2px";
        div.style.lineHeight = "14px";
        div.style.whiteSpace = "nowrap";
        div.style.MozUserSelect = "none";
        div.style.fontSize = "12px"
        var span = this._span = document.createElement("span");
        div.appendChild(span);
        span.appendChild(document.createTextNode(this._text));
        var that = this;

        var arrow = this._arrow = document.createElement("div");
        arrow.style.background = "url(images/label.png) no-repeat";
        arrow.style.position = "absolute";
        arrow.style.width = "11px";
        arrow.style.height = "10px";
        arrow.style.top = "16px";
        arrow.style.left = "10px";
        arrow.style.overflow = "hidden";
        div.appendChild(arrow);

        if (this.up) {
            arrow.style.backgroundPosition = "0px 0px";
        } else {
            arrow.style.backgroundPosition = "0px -10px";
        }

        div.onmouseover = function() {
            this.style.backgroundColor = "#6BADCA";
            this.style.borderColor = "#eee";
            this.getElementsByTagName("span")[0].innerHTML = that._overText;
            arrow.style.backgroundPosition = "0px -20px";
        }

        div.onmouseout = function() {
            if (getUp(that._text)) {
                this.style.backgroundColor = "#EE5D5B";
                this.style.border = "1px solid #BC3B3A";
                arrow.style.backgroundPosition = "0px 0px";
            } else {
                this.style.backgroundColor = "#a8bc7b";
                this.style.border = "1px solid #eee";
                arrow.style.backgroundPosition = "0px -10px";
            }
            this.getElementsByTagName("span")[0].innerHTML = that._text;

        }

        mp.getPanes().labelPane.appendChild(div);

        return div;
    }
    ComplexCustomOverlay.prototype.draw = function() {
        var map = this._map;
        var pixel = map.pointToOverlayPixel(this._point);
        this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
        this._div.style.top = pixel.y - 30 + "px";
    }

    return ComplexCustomOverlay;
})