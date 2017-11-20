
var JSON = {}; //图片信息
function d2a(n) {
    return n * Math.PI / 180;
}
function a2d(n) {
    return n * 180 / Math.PI;
}
function rnd(n, m) {
    return parseInt(Math.random() * (m - n) + n);
}
function loadImage(arr, fnSucc, fnLoading) {
    var len = arr.length;
    var count = 0;
    for (var i = 0; i < len; i++) {
        var oImg = new Image();
        (function (index) {
            oImg.onload = function () {
                var name = arr[index].split('.')[0];
                JSON[name] = this;
                count++;
                if (count === len) {
                    fnSucc && fnSucc();
                }
                fnLoading && fnLoading(count, len);
            };
        })(i);
        oImg.src = $('#imgSite').val() + 'car/images/' + arr[i];
    }
}
// requestAnimationFrame做兼容
(function () {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    }
})();