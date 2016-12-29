var community_gps = require('../community_gps.js');
var community = require('../community.js');
var community_price = require('../community_price.js');
var geoURL = "http://suzhou.anjuke.com/ajax/geomap/";
var table = "suzhou_anjuke_community";
var tableMonth = "suzhou_anjuke_month";
var community_url = "http://suzhou.anjuke.com/community/view/"
var community_mobile_url = "http://m.anjuke.com/su/community/"
var cronJob = require("cron").CronJob;
//updatePrice();

function updatePrice() {
	community_price.clearPrice(table).then(function() {
		return community_price.updatePrice(table, geoURL);
	}).then(function() {
		return community_price.updateMobileInfoPrice(table, community_mobile_url);
	}).then(function() {
		var date = new Date();
		if (date.getDate() == 28) {
			return community_price.priceToMonth(table, tableMonth);
		}
	}).catch(function(e) {
		console.log(e)
	})
}

//每月1号 15号 28号更新价格 每月28号转储价格
new cronJob('0 0 0 1,15,28 * ? ', function() {
	updatePrice()
}, null, true, 'Asia/Shanghai');