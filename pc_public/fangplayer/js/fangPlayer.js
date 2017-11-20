/**
 * [FangPlayer]
 * @author: fenglinzeng@fang.com
 * @data: 20170717
 */
(function (w, f) {
    'use strict';
    if (typeof define === 'function') {
        define('//static.soufunimg.com/common_m/pc_public/fangplayer/build/fangPlayer.js', ['jquery'], function (require) {
            var $ = require('jquery');
            return f($,require);
        });
    } else if (typeof exports === 'object') {
        module.exports = f(w);
    } else {
        if (!w.jQuery) {
            console.error('jQuery undefined');
            return;
        }
        w.fangPlayer = f(w.jQuery);
    }
})(window, function ($,require) {
    'use strict';

    var url = {
        jsurl: 'http://static.soufunimg.com/common_m/pc_public/xplayer/build/XPlayer.js',
        cssurl: 'http://static.soufunimg.com/common_m/pc_public/xplayer/build/XPlayer.css',
        swfObj: 'http://static.soufunimg.com/common_m/pc_public/fangplayer/build/swfobject2.2.js',
        swf: 'http://img2s.soufun.com/v/player6test/http_loader.swf'
    };

    function fangPlayer(opts) {
        this.opts = opts;

        this.XPlayer = {
            jsurl: url.js,
            cssurl: url.css
        };

        this.swfVersionStr = '10.2.0';
        this.xiSwfUrlStr = 'playerProductInstall.swf';
        this.flashvars = {
            Vinfoid: this.opts.Vinfoid,
            imgURL: this.opts.poster ? this.opts.poster : ''
        };
        this.params = {
            allowfullscreen: 'true',
            allowscriptaccess: 'always',
            bgcolor: '#ffffff',
            quality: 'high',
            wmode: 'Opaque',
            pluginspage: 'http://www.adobe.com/go/getflash'
        };

        this.attributes = {
            align: 'middle',
            id: 'fang_http_player',
            name: 'fang_http_player'
        };

        this.debug = opts.debug;
        this.holder = opts.holder;

        this.isFlashSupport = this.flashCheck();
        this.print(this.isFlashSupport);

        var type = this.opts.type;
        return this.checkType(type);
    }

    /**
     * [checkType 判断播放器类型]
     * @param  {[type]} type [类型]
     * @return {[type]}      [执行对应类型的初始化方法]
     */
    fangPlayer.prototype.checkType = function (type) {
        this.print(type);
        // if (type === 'Vinfoid') {
        //     var Vinfoid = this.flashvars.Vinfoid;
        //     if (Vinfoid) {
        //         return this.flashFirst();
        //     }
        //     return this.HTML5First();
        // } else
        if (type === 'html5') {
            return this.HTML5First();
        } else if (type === 'flash') {
            return this.flashFirst();
        }
        return this.HTML5First();
        // return this.flashFirst();
    };

    fangPlayer.prototype.HTML5First = function () {
        if (this.videoCheck()) {
            this.loadHTML5Player();
        } else {
            this.loadFlashPlayer();
        }
    };

    fangPlayer.prototype.flashFirst = function () {
        if (this.isFlashSupport.f) {
            this.loadFlashPlayer();
        } else if (this.videoCheck()) {
            this.loadHTML5Player();
        } else {
            this.loadFlashPlayer();
            console.error('播放器:不支持flash也不支持html5');
        }
    };


    /**
     * [printf 根据debug决定是否console]
     * @param  {[type]} info [console的内容]
     */
    fangPlayer.prototype.print = function (info) {
        if (this.debug) {
            return console.log(info);
        }
        return false;
    };

    /**
     * [getData 拆url]
     * @param  {[type]} url [url]
     * @return {[type]}     [url带的数据，键值形式]
     */
    fangPlayer.prototype.getData = function (url) {
        var result = {};
        var temp = url.split('&');
        for (var i in temp) {
            if (temp.hasOwnProperty(i)) {
                var s = temp[i].split('=');
                result[s[0]] = s[1];
            }
        }
        return result;
    };

    /**
     * [getCookie 获取Cookie]
     * @param  {[type]} name [cookie的key]
     * @return {[type]}      [cookie的value]
     */
    fangPlayer.prototype.getCookie = function (name) {
        var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
        if (arr = document.cookie.match(reg)) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    };

    /**
     * [videoCheck 检测是否支持HTML5的video播放]
     * @return {[type]} [description]
     */
    fangPlayer.prototype.videoCheck = function () {
        if (!!document.createElement('video').canPlayType) {
            var vidTest = document.createElement('video');
            var oggTest = vidTest.canPlayType('video/ogg; codecs="theora, vorbis"');
            if (!oggTest) {
                var h264Test = vidTest.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
                if (!h264Test) {
                    return false;
                } else {
                    if (h264Test === 'probably') {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else {
                if (oggTest === 'probably') {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            return false;
        }
    };

    /**
     * [flashCheck 检测对flash的支持]
     * @return {[obj]} [{f: 是否支持flash,v: flash版本号}]
     */
    fangPlayer.prototype.flashCheck = function () {
        var hasFlash = 0;
        var flashVersion = 0;
        // var isIE = /*@cc_on!@*/ 0;
        var isIE = navigator.userAgent.indexOf('MSIE') > -1;
        var swf, VSwf;
        if (isIE) {
            swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
            if (swf) {
                hasFlash = 1;
                VSwf = swf.GetVariable('$version');
                flashVersion = parseInt(VSwf.split(' ')[1].split(',')[0]);
            }
        } else if (navigator.plugins && navigator.plugins.length > 0) {
            swf = navigator.plugins['Shockwave Flash'];
            if (swf) {
                hasFlash = 1;
                var words = swf.description.split(' ');
                for (var i = 0; i < words.length; ++i) {
                    if (isNaN(parseInt(words[i]))) {
                        continue;
                    }
                    flashVersion = parseInt(words[i]);
                }
            }
        }
        return { f: hasFlash, v: flashVersion };
    };

    /**
     * [loadStyleFile 加载CSS]
     * @param  {[type]} url  [css文件地址]
     * @param  {[type]} succ [成功回调]
     * @param  {[type]} fail [失败回调]
     */
    fangPlayer.prototype.loadStyleFile = function (url, succ, fail) {
        var cssObj = document.createElement('link');
        cssObj.type = 'text/css';
        cssObj.rel = 'stylesheet';
        cssObj.href = url;
        cssObj.onload = function () {
            succ && succ();
        };
        cssObj.onerror = function (ev) {
            fail && fail(ev);
        };
        document.getElementsByTagName('head')[0].appendChild(cssObj);
    };

    /**
     * [loadStyleFile 加载js]
     * @param  {[type]} url  [js文件地址]
     * @param  {[type]} succ [成功回调]
     * @param  {[type]} fail [失败回调]
     */
    fangPlayer.prototype.loadScriptFile = function (url, succ, fail) {
        var jsObj = document.createElement('script');
        jsObj.type = 'text/javascript';
        jsObj.src = url;
        jsObj.onload = function () {
            succ && succ();
        };
        jsObj.onerror = function (ev) {
            fail && fail(ev);
        };
        document.body.appendChild(jsObj);
    };

    /**
     * [loadFlashPlayer 加载flash播放器]
     */
    fangPlayer.prototype.loadFlashPlayer = function () {
        var that = this;
        var flashOpts = this.opts;

        function succ() {
            var el = document.querySelector(that.holder);
            if (!el) {
                return console.error('FangPlayer：页面中不存在容器DIV，请检查holder参数');
            }
            var swfDOM = document.createElement('div');
            swfDOM.id = 'fangFlash';
            el.appendChild(swfDOM);
            swfobject.embedSWF(flashOpts.swf || url.swf, 'fangFlash', '100%', '100%', that.swfVersionStr, that.xiSwfUrlStr, that.flashvars, that.params, that.attributes);
        }

        function fail() {
            console.log('Flash加载失败');
        }

        // succ();

        this.loadScriptFile(url.swfObj, succ, fail);

        flashOpts.onLoad && flashOpts.onLoad();
    };

    fangPlayer.prototype.getVideoInfo = function (Vinfoid) {
        // var that = this;
        // $.ajax({
        //     url: 'http://jks.v.soufun.com/Interface/GetVideoInfoByIds.aspx',
        //     type: 'get',
        //     data: {
        //         Vinfoid: Vinfoid,
        //         encode: 'utf-8'
        //     },
        // })
        // .done(function(data) {
        //     console.log(data);
        // });
        
    };

    /**
     * [loadHTML5Player 加载HTML5播放器]
     */
    fangPlayer.prototype.loadHTML5Player = function (src, img, autoPlay) {
        var that = this;
        var jsurl = this.XPlayer.jsurl;
        var cssurl = this.XPlayer.cssurl;
        var holder = this.holder;

        if (!document.querySelector(holder)) {
            return console.error('FangPlayer：页面中不存在容器DIV，请检查holder参数');
        }

        var mp4Opts = this.opts;
        var poster = mp4Opts.poster ? mp4Opts.poster : '';
        var mp4Src = mp4Opts.src ? mp4Opts.src : '';

        if (src) {
            mp4Src = src;
        }
        if (img) {
            poster = img;
        }

        // 播放时统计定时器
        var playingTimer = null;
        /**
         * [startPlayingCount 开启播放时5秒钟统计]
         * @param  {[type]} xp [description]
         * @return {[type]}    [description]
         */
        function startPlayingCount(xp) {
            playingTimer = setInterval(function () {
                // 如果在播放
                if (!xp.video.current.paused) {
                    mp4Opts.onPlaying && mp4Opts.onPlaying(xp);
                }
            }, 1000);
        }

        /**
         * [stopPlayingCount 关闭播放时5秒钟统计]
         * @return {[type]} [description]
         */
        function stopPlayingCount() {
            clearInterval(playingTimer);
        }

        /**
         * [jsSucc js加载成功回调]
         * @return {[type]} [description]
         */
        function jsSucc() {
            var XPlayer = window.XPlayer || require('XPlayer');
            if (XPlayer) {
                // that.uniqueCookie = that.getCookie('unique_cookie');
                // that.globalCookie = that.getCookie('global_cookie');
                // that.getVideoInfo();
                var xp = new XPlayer({
                    element: document.querySelector(holder),
                    video: {
                        url: mp4Src,
                        pic: poster
                    },
                    autoplay: autoPlay || false
                });
                var isFirst = true;
                xp.on('play', function () {
                    startPlayingCount(xp);
                    if (isFirst) {
                        mp4Opts.onFirstPlay && mp4Opts.onFirstPlay(xp);
                    } else {
                        mp4Opts.onPlay && mp4Opts.onPlay(xp);
                    }
                    isFirst = false;
                });
                xp.on('pause', function () {
                    // ended的时候会连续触发两次pause事件，所以粗暴的依靠时间来排除
                    var ct = parseInt(xp.video.current.currentTime);
                    var duration = parseInt(xp.video.duration);
                    if (duration - ct !== 0) {
                        mp4Opts.onPause && mp4Opts.onPause(xp);
                    }
                    isFirst = false;
                    stopPlayingCount(xp);
                });
                xp.on('ended', function () {
                    mp4Opts.onEnd && mp4Opts.onEnd(xp);
                    isFirst = false;
                });

                that.onLoad && that.onLoad();
            } else {
                console.log('看起来XPlyaer的加载有点问题');
            }
        }

        /**
         * [jsFail js加载错误]
         * @param  {[type]} ev [错误信息对象]
         */
        function jsFail(ev) {
            console.log('js加载发生错误:', ev);
        }

        /**
         * [cssSucc css加载成功回调]
         */
        function cssSucc() {
            that.loadScriptFile(url.jsurl, jsSucc, jsFail);
        }

        /**
         * [cssFail css加载失败回调]
         * @param {[type]} ev [错误信息对象]
         */
        function cssFail(ev) {
            console.log('css加载发生错误', ev);
        }

        // 先加载样式，然后在成功回调里加载js
        this.loadStyleFile(url.cssurl, cssSucc, cssFail);
    };

    fangPlayer.prototype.onFlashError = function (data) {
        console.log(data);
        var img = data.imageUrl;
        var src = data.videoUrl;
        var autoPlay = data.autoplay;
        console.log(this);
        this.loadHTML5Player(src, img, true);
    };

    return fangPlayer;
});
