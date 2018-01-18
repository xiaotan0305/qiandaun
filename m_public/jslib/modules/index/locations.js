/**
 * 地图公用方法，画地铁线，定位，加载更多，显示提示信息，设置房源状态，小区标点移到中心
 * by limengyang.bj@fang.com 2016-04-28
 */
define('modules/index/locations', ['jquery','modules/map/API/BMap'], function (require) {
    var $ = require('jquery');

	function locations() {
		// 定位坐标
		this.locationpoint = {};
	}

	locations.prototype.get_location = function (callback) {
		var that = this;
		// 如果定位失败或还未定位，使用百度地图定位
		var geolocation = new BMap.Geolocation();
		geolocation.getCurrentPosition(function (r) {
			if (this.getStatus() === BMAP_STATUS_SUCCESS) {
				var gc = new BMap.Geocoder();
				gc.getLocation(r.point, function (rs) {
					addComp = rs.addressComponents;
					that.locationpoint.x = r.point.lng;
					that.locationpoint.y = r.point.lat;
					callback(that.locationpoint);
				});
			} else {
				// 点击定位按钮，定位失败
				callback('定位失败');
			}
		}, {enableHighAccuracy: true});
	};

	return new locations();
});
