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
    var point = new BMap.Point(120.628132, 31.3107369);

    map.centerAndZoom(point, 12); // 初始化地图，设置中心点坐标和地图级别 
    map.enableScrollWheelZoom(); // 允许滚轮缩放

    map.setCurrentCity("苏州市"); // 设置地图显示的城市 此项是必须设置的

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

        var myPriceMap = [];
        var json = [];
        $.each(data, function(i, row) {
            // console.log(row)

            json.push({
                lat: row.location.lat,
                lng: row.location.lng,
                count: row.y2
            })

            var point = new BMap.Point(row.location.lng, row.location.lat);
            var marker = new ComplexCustomOverlay(point, row.preY1Y2, row.name + " : " + row.y2 + "元/平米，浮动:" + row.preY1Y2, getUp(row.preY1Y2));
            myPriceMap.push(marker);
        })

        $("#hotmap").click(function() {
            try {
                myHeatMap.remove();
            } catch (e) {}
            $.each(myPriceMap, function(i, marker) {
                map.removeOverlay(marker);
            })

            myHeatMap.show(json, 50000)
        })


        $("#priceMap").click(function() {
            try {
                myHeatMap.remove();
            } catch (e) {}



            $.each(myPriceMap, function(i, marker) {
                map.addOverlay(marker);
            })
        })


        // $.each(data, function(i, row) {
        //     var point = new BMap.Point(row.location.lng, row.location.lat);
        //     var marker = new ComplexCustomOverlay(point, row.name, row.y2 + "元/平米，浮动:" + row.preY1Y2);
        //     map.addOverlay(marker);

        // })
    })

})

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