require('../css/XPlayer.scss');
const utils = require('./utils.js');
const svg = require('./svg.js');
const handleOption = require('./option.js');
const i18n = require('./i18n.js');
const html = require('./html.js');
const Video = require('./video.js');
const dom = require('./dom.js');
const isMobile = /mobile/i.test(window.navigator.userAgent);

class XPlayer {

    /**
     * XPlayer 构造函数
     */
    constructor(option) {
        this.option = handleOption(option);

        // 加上样式
        dom.addClass(this.option.element, 'xplayer');
        // this.option.element.classList.add('xplayer');

        // 如果传入多个清晰度，获取
        if (this.option.video.quality) {
            this.qualityIndex = this.option.video.defaultQuality;
            this.quality = this.option.video.quality[this.option.video.defaultQuality];
        }

        // 界面文案
        this.tran = new i18n(this.option.lang).tran;

        /**
         * 更新进度条, 包括加载进度条和播放进度条
         *
         * @param {String} type - 进度条的类型, 应该为 played, loaded 或者 volume
         * @param {Number} percentage
         * @param {String} direction - 进度条的方向, 应该为 height 或者 width
         */
        this.updateBar = (type, percentage, direction) => {
            percentage = percentage > 0 ? percentage : 0;
            percentage = percentage < 1 ? percentage : 1;
            bar[type + 'Bar'].style[direction] = percentage * 100 + '%';
        };

        // 声明 XPlayer 的事件
        const eventTypes = ['play', 'pause', 'canplay', 'playing', 'ended', 'error'];
        this.event = {};
        for (let i = 0; i < eventTypes.length; i++) {
            this.event[eventTypes[i]] = [];
        }
        // 遍历执行
        this.trigger = (type) => {
            for (let i = 0; i < this.event[type].length; i++) {
                this.event[type][i]();
            }
        };

        this.element = this.option.element;

        this.element.addEventListener('click', function (e) {
            if (e && e.stopPropagation) {
                // 因此它支持W3C的stopPropagation()方法 
                e.stopPropagation();
            } else {
                // 否则，我们需要使用IE的方式来取消事件冒泡 
                window.event.cancelBubble = true;
            }
            if (e && e.preventDefault) {
                e.preventDefault();
            } else {
                // IE中阻止函数器默认动作的方式 
                window.event.returnValue = false;
            }
            return false;
        });

        // 如果为移动设备，添加移动设备的class样式
        if (isMobile) {
            dom.addClass(this.element, 'xplayer-mobile');
            // this.element.classList.add('xplayer-mobile');
        }

        // 插入HTML
        this.element.innerHTML = html.main(option);

        // 实例化视频管理
        this.video = new Video(this.element.getElementsByClassName('xplayer-video-current'));

        // 初始化视频
        this.initVideo();

        // 播放暂停图标的动画事件
        this.bezel = this.element.getElementsByClassName('xplayer-bezel-icon')[0];
        this.bezel.addEventListener('animationend', () => {
            dom.removeClass(this.bezel, 'xplayer-bezel-transition')
            // this.bezel.classList.remove('xplayer-bezel-transition');
        });

        // 播放和暂停按钮的 click 事件
        this.playButton = this.element.getElementsByClassName('xplayer-play-icon')[0];
        this.paused = true;
        this.playButton.addEventListener('click', () => {
            this.toggle();
        });

        const videoWrap = this.element.getElementsByClassName('xplayer-video-wrap')[0];
        const conMask = this.element.getElementsByClassName('xplayer-controller-mask')[0];
        // 如果是PC
        if (!isMobile) {
            videoWrap.addEventListener('click', () => {
                this.toggle();
            });
            conMask.addEventListener('click', () => {
                this.toggle();
            });
        } else {
            const toggleController = () => {
                // if (this.element.classList.contains('xplayer-hide-controller')) {
                if (dom.hasClass(this.element, 'xplayer-hide-controller')) {
                    dom.removeClass(this.element, 'xplayer-hide-controller')
                    // this.element.classList.remove('xplayer-hide-controller');
                } else {
                    dom.addClass(this.element, 'xplayer-hide-controller')
                    // this.element.classList.add('xplayer-hide-controller');
                }
            };
            videoWrap.addEventListener('click', toggleController);
            conMask.addEventListener('click', toggleController);
        }

        const bar = {};
        // 播放进度条
        bar.playedBar = this.element.getElementsByClassName('xplayer-played')[0];
        // 加载进度条
        bar.loadedBar = this.element.getElementsByClassName('xplayer-loaded')[0];
        // 进度条容器
        const pbar = this.element.getElementsByClassName('xplayer-bar-wrap')[0];
        // 当前时间遮罩
        const pbarTimeTips = this.element.getElementsByClassName('xplayer-bar-time')[0];
        let barWidth;

        let lastPlayPos = 0;
        let currentPlayPos = 0;
        let bufferingDetected = false;
        this.playedTime = false;
        window.requestAnimationFrame = (() =>
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            }
        )();

        // 检测加载进度，如果加载得不够，显示loading
        const setCheckLoadingTime = () => {
            this.checkLoading = setInterval(() => {
                // whether the video is buffering
                currentPlayPos = this.video.currentTime();
                if (!bufferingDetected && currentPlayPos < lastPlayPos + 0.01 && !this.video.attr('paused')) {
                    dom.addClass(this.element, 'xplayer-loading');
                    // this.element.classList.add('xplayer-loading');
                    bufferingDetected = true;
                }
                if (bufferingDetected && currentPlayPos > lastPlayPos + 0.01 && !this.video.attr('paused')) {
                    dom.removeClass(this.element, 'xplayer-loading');
                    // this.element.classList.remove('xplayer-loading');
                    bufferingDetected = false;
                }
                lastPlayPos = currentPlayPos;
            }, 100);
        };

        const clearCheckLoadingTime = () => {
            clearInterval(this.checkLoading);
        };

        // 更新播放进度条和播放时间
        this.animationFrame = () => {
            if (this.playedTime) {
                this.updateBar('played', this.video.currentTime() / this.video.duration, 'width');
                this.element.getElementsByClassName('xplayer-ptime')[0].innerHTML = utils.secondToTime(this.video.currentTime());
                this.trigger('playing');
            }
            window.requestAnimationFrame(this.animationFrame);
        };
        window.requestAnimationFrame(this.animationFrame);

        // 开启加载进度检测
        this.setTime = () => {
            this.playedTime = true;
            setCheckLoadingTime();
        };
        // 关闭加载进度检测
        this.clearTime = () => {
            this.playedTime = false;
            clearCheckLoadingTime();
        };

        // 进度条点击的时候
        // 获取点击进度，然后设置视频进度
        pbar.addEventListener('click', (event) => {
            const e = event || window.event;
            barWidth = pbar.clientWidth;
            let percentage = (e.clientX - utils.getElementViewLeft(pbar)) / barWidth;
            percentage = percentage > 0 ? percentage : 0;
            percentage = percentage < 1 ? percentage : 1;
            this.updateBar('played', percentage, 'width');
            this.video.seek(parseFloat(bar.playedBar.style.width) / 100 * this.video.duration);
        });

        // 时间遮罩
        this.isTipsShow = false;
        this.timeTipsHandler = this.timeTipsHandler(
            pbar, pbarTimeTips).bind(this);
        pbar.addEventListener('mousemove', this.timeTipsHandler);
        pbar.addEventListener('mouseover', this.timeTipsHandler);
        pbar.addEventListener('mouseenter', this.timeTipsHandler);
        pbar.addEventListener('mouseout', this.timeTipsHandler);
        pbar.addEventListener('mouseleave', this.timeTipsHandler);

        // 摁着进度条拖动的时候
        const thumbMove = (event) => {
            const e = event || window.event;
            let percentage = (e.clientX - utils.getElementViewLeft(pbar)) / barWidth;
            percentage = percentage > 0 ? percentage : 0;
            percentage = percentage < 1 ? percentage : 1;
            this.updateBar('played', percentage, 'width');
            this.element.getElementsByClassName('xplayer-ptime')[0].innerHTML = utils.secondToTime(percentage * this.video.duration);
        };

        // 摁着进度条拖动结束
        const thumbUp = () => {
            document.removeEventListener('mouseup', thumbUp);
            document.removeEventListener('mousemove', thumbMove);
            this.video.seek(parseFloat(bar.playedBar.style.width) / 100 * this.video.duration);
            this.setTime();
        };

        // 进度条摁着的时候
        pbar.addEventListener('mousedown', () => {
            barWidth = pbar.clientWidth;
            this.clearTime();
            document.addEventListener('mousemove', thumbMove);
            document.addEventListener('mouseup', thumbUp);
        });


        /**
         * 音量控制
         */
        bar.volumeBar = this.element.getElementsByClassName('xplayer-volume-bar-inner')[0];
        const volumeEle = this.element.getElementsByClassName('xplayer-volume')[0];
        const volumeBarWrapWrap = this.element.getElementsByClassName('xplayer-volume-bar-wrap')[0];
        const volumeBarWrap = this.element.getElementsByClassName('xplayer-volume-bar')[0];
        const volumeicon = this.element.getElementsByClassName('xplayer-volume-icon')[0];
        const vWidth = 35;

        // 根据音量变换音量图标
        this.switchVolumeIcon = () => {
            const volumeicon = this.element.getElementsByClassName('xplayer-volume-icon')[0];
            if (this.video.attr('volume') >= 0.8) {
                volumeicon.innerHTML = svg('volume-up');
            } else if (this.video.attr('volume') > 0) {
                volumeicon.innerHTML = svg('volume-down');
            } else {
                volumeicon.innerHTML = svg('volume-off');
            }
        };

        // 拖动音量
        const volumeMove = (event) => {
            const e = event || window.event;
            const percentage = (e.clientX - utils.getElementViewLeft(volumeBarWrap) - 5.5) / vWidth;
            this.volume(percentage);
        };

        // 结束拖动
        const volumeUp = () => {
            document.removeEventListener('mouseup', volumeUp);
            document.removeEventListener('mousemove', volumeMove);
            // volumeEle.classList.remove('xplayer-volume-active');
            dom.removeClass(volumeEle, 'xplayer-volume-active');
        };

        // 点击音量条
        volumeBarWrapWrap.addEventListener('click', (event) => {
            volumeMove(event);
        });

        // 摁着音量条的时候
        volumeBarWrapWrap.addEventListener('mousedown', () => {
            document.addEventListener('mousemove', volumeMove);
            document.addEventListener('mouseup', volumeUp);
            // volumeEle.classList.add('xplayer-volume-active');
            dom.addClass(volumeEle, 'xplayer-volume-active');
        });

        // 点击音量图标
        volumeicon.addEventListener('click', () => {
            if (this.video.attr('muted')) {
                this.video.attr('muted', false);
                this.switchVolumeIcon();
                this.updateBar('volume', this.video.attr('volume'), 'width');
            } else {
                this.video.attr('muted', true);
                volumeicon.innerHTML = svg('volume-off');
                this.updateBar('volume', 0, 'width');
            }
        });


        /**
         * PC端隔2秒隐藏控制条
         */
        let hideTime = 0;
        if (!isMobile) {
            const hideController = () => {
                // this.element.classList.remove('xplayer-hide-controller');
                dom.removeClass(this.element, 'xplayer-hide-controller')
                clearTimeout(hideTime);
                hideTime = setTimeout(() => {
                    if (this.video.attr('played').length) {
                        // this.element.classList.add('xplayer-hide-controller');
                        dom.addClass(this.element, 'xplayer-hide-controller');
                        closeSetting();
                    }
                }, 2000);
            };
            this.element.addEventListener('mousemove', hideController);
            this.element.addEventListener('click', hideController);
        }


        /**
         * 设置
         */
        const settingHTML = html.setting(this.tran);

        // toggle 设置
        const settingIcon = this.element.getElementsByClassName('xplayer-setting-icon')[0];
        const settingBox = this.element.getElementsByClassName('xplayer-setting-box')[0];
        const mask = this.element.getElementsByClassName('xplayer-mask')[0];
        settingBox.innerHTML = settingHTML.original;

        // 关闭设置
        const closeSetting = () => {
            // if (settingBox.classList.contains('xplayer-setting-box-open')) {
            if (dom.hasClass(settingBox, 'xplayer-setting-box-open')) {
                // settingBox.classList.remove('xplayer-setting-box-open');
                dom.removeClass(settingBox, 'xplayer-setting-box-open');
                // mask.classList.remove('xplayer-mask-show');
                dom.removeClass(mask, 'xplayer-mask-show');
                setTimeout(() => {
                    // settingBox.classList.remove('xplayer-setting-box-narrow');
                    dom.removeClass(settingBox, 'xplayer-setting-box-narrow');
                    settingBox.innerHTML = settingHTML.original;
                    settingEvent();
                }, 300);
            }
        };
        // 打开设置
        const openSetting = () => {
            // settingBox.classList.add('xplayer-setting-box-open');
            dom.addClass(settingBox, 'xplayer-setting-box-open');
            // mask.classList.add('xplayer-mask-show');
            dom.addClass(mask, 'xplayer-mask-show');
        };

        // 点击遮罩时关闭设置
        mask.addEventListener('click', () => {
            closeSetting();
        });
        // 点击设置icon时打开设置
        settingIcon.addEventListener('click', () => {
            openSetting();
        });

        // 循环控制
        this.loop = this.option.loop;
        const settingEvent = () => {
            const loopEle = this.element.getElementsByClassName('xplayer-setting-loop')[0];
            const loopToggle = loopEle.getElementsByClassName('xplayer-toggle-setting-input')[0];

            loopToggle.checked = this.loop;

            loopEle.addEventListener('click', () => {
                loopToggle.checked = !loopToggle.checked;
                if (loopToggle.checked) {
                    this.loop = true;
                } else {
                    this.loop = false;
                }
            });

            // 速度控制
            const speedEle = this.element.getElementsByClassName('xplayer-setting-speed')[0];
            speedEle.addEventListener('click', () => {
                // settingBox.classList.add('xplayer-setting-box-narrow');
                dom.addClass(settingBox, 'xplayer-setting-box-narrow');
                settingBox.innerHTML = settingHTML.speed;

                const speedItem = settingBox.getElementsByClassName('xplayer-setting-speed-item');
                for (let i = 0; i < speedItem.length; i++) {
                    speedItem[i].addEventListener('click', () => {
                        this.video.attr('playbackRate', speedItem[i].dataset.speed);
                        closeSetting();
                    });
                }
            });

            // 旋转控制
            const rotateEles = this.element.querySelectorAll('.xplayer-rotate-icon');
            const rotateEle = Array.prototype.slice.call(rotateEles);
            let rotateIndex = 1;
            const video = document.getElementsByClassName('xplayer-video')[0];
            rotateEle.forEach( (element) => {
                element.addEventListener('click', function () {
                    let angle = video.style.transform;
                    if (angle) {
                        angle = parseInt(angle.split('rotate(')[1].split('deg)')[0]);
                    }else {
                        angle = 0;
                    }
                    if (dom.hasClass(element, 'next')) {
                        video.style.transform = 'rotate(' + (angle + 90) + 'deg)';
                        rotateIndex++;
                        // if (rotateIndex > 4) {
                        //     rotateIndex = 1;
                        // }
                    }else {
                        rotateIndex--;
                        video.style.transform = 'rotate(' + (angle - 90) + 'deg)';
                        // if (rotateIndex > 4) {
                        //     rotateIndex = 1;
                        // }
                    }
                });
            });
        };
        settingEvent();

        // 设置视频长度
        // 兼容性: 安卓浏览器一开始会返回1
        if (this.video.duration !== 1) {
            this.element.getElementsByClassName('xplayer-dtime')[0].innerHTML = this.video.duration ? utils.secondToTime(this.video.duration) : '00:00';
        }

        // 自动播放
        if (this.option.autoplay && !isMobile) {
            this.play();
        } else if (isMobile) {
            this.pause();
        }

        // 浏览器全屏
        this.element.getElementsByClassName('xplayer-full-icon')[0].addEventListener('click', () => {
            if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
                if (this.element.requestFullscreen) {
                    this.element.requestFullscreen();
                } else if (this.element.mozRequestFullScreen) {
                    this.element.mozRequestFullScreen();
                } else if (this.element.webkitRequestFullscreen) {
                    this.element.webkitRequestFullscreen();
                } else if (this.video.attr('webkitEnterFullscreen')) {
                    // Safari for iOS
                    this.video.current.webkitEnterFullscreen();
                }
            } else {
                if (document.cancelFullScreen) {
                    document.cancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }
            }
        });
        // 网页全屏
        this.element.getElementsByClassName('xplayer-full-in-icon')[0].addEventListener('click', () => {
            // if (this.element.classList.contains('xplayer-fulled')) {
            if (dom.hasClass(this.element, 'xplayer-fulled')) {
                // this.element.classList.remove('xplayer-fulled');
                dom.removeClass(this.element, 'xplayer-fulled');
            } else {
                // this.element.classList.add('xplayer-fulled');
                dom.addClass(this.element, 'xplayer-fulled');
            }
        });

        /**
         * 热键
         * 空格 => 播放、暂停
         * 左右方向键 => 快进、快退5秒
         * 上下方向键 => 音量加、减10%
         */
        const handleKeyDown = (e) => {
            const tag = document.activeElement.tagName.toUpperCase();
            const editable = document.activeElement.getAttribute('contenteditable');
            if (tag !== 'INPUT' && tag !== 'TEXTAREA' && editable !== '' && editable !== 'true') {
                const event = e || window.event;
                let percentage;
                switch (event.keyCode) {
                    case 27:
                        // if (this.element.classList.contains('xplayer-fulled')) {
                        if (dom.hasClass(this.element, 'xplayer-fulled')) {
                            // this.element.classList.remove('xplayer-fulled');
                            dom.removeClass(this.element, 'xplayer-fulled');
                        }
                        break;
                    case 32:
                        event.preventDefault();
                        this.toggle();
                        break;
                    case 37:
                        event.preventDefault();
                        this.video.seek(this.video.currentTime() - 5);
                        break;
                    case 39:
                        event.preventDefault();
                        this.video.seek(this.video.currentTime() + 5);
                        break;
                    case 38:
                        event.preventDefault();
                        percentage = this.video.attr('volume') + 0.1;
                        this.volume(percentage);
                        break;
                    case 40:
                        event.preventDefault();
                        percentage = this.video.attr('volume') - 0.1;
                        this.volume(percentage);
                        break;
                }
            }
        };
        // 如果传入的配置参数允许热键，则监听
        if (this.option.hotkey) {
            document.addEventListener('keydown', handleKeyDown);
        }

        /**
         * 右键
         */
        const menu = this.element.getElementsByClassName('xplayer-menu')[0];
        this.element.addEventListener('contextmenu', (e) => {
            const event = e || window.event;
            event.preventDefault();

            // menu.classList.add('xplayer-menu-show');
            dom.addClass(menu, 'xplayer-menu-show');

            const clientRect = this.element.getBoundingClientRect();
            const menuLeft = event.clientX - clientRect.left;
            const menuTop = event.clientY - clientRect.top;
            // 如果超出右边界
            if (menuLeft + menu.offsetWidth >= clientRect.width) {
                menu.style.right = clientRect.width - menuLeft + 'px';
                menu.style.left = 'initial';
            } else {
                menu.style.left = event.clientX - this.element.getBoundingClientRect().left + 'px';
                menu.style.right = 'initial';
            }
            // 如果超出下边界
            if (menuTop + menu.offsetHeight >= clientRect.height) {
                menu.style.bottom = clientRect.height - menuTop + 'px';
                menu.style.top = 'initial';
            } else {
                menu.style.top = event.clientY - this.element.getBoundingClientRect().top + 'px';
                menu.style.bottom = 'initial';
            }

            // 显示遮罩
            // mask.classList.add('xplayer-mask-show');
            dom.addClass(mask, 'xplayer-mask-show');
            mask.addEventListener('click', () => {
                // mask.classList.remove('xplayer-mask-show');
                // menu.classList.remove('xplayer-menu-show');
                dom.removeClass(mask, 'xplayer-mask-show');
                dom.removeClass(menu, 'xplayer-menu-show');
            });
        });

        /**
         * 切换清晰度
         */
        if (this.option.video.quality) {
            this.element.getElementsByClassName('xplayer-quality-list')[0].addEventListener('click', (e) => {
                // if (e.target.classList.contains('xplayer-quality-item')) {
                if (dom.hasClass(e.target, 'xplayer-quality-item')) {
                    this.switchQuality(e.target.dataset.index);
                }
            });
        }

        /**
         * 截图
         */
        if (this.option.screenshot) {
            const camareIcon = this.element.getElementsByClassName('xplayer-camera-icon')[0];
            camareIcon.addEventListener('click', () => {
                const canvas = document.createElement("canvas");
                canvas.width = this.video.attr('videoWidth');
                canvas.height = this.video.attr('videoHeight');
                canvas.getContext('2d').drawImage(this.video.current, 0, 0, canvas.width, canvas.height);

                camareIcon.href = canvas.toDataURL();
                camareIcon.download = `XPlayer-snap-${Date.now()}.png`;
            });
        }
    }

    /**
     * [play 播放]
     * @param  {[type]} time [时间]
     */
    play(time) {
        if (Object.prototype.toString.call(time) === '[object Number]') {
            this.video.seek(time);
        }
        this.paused = false;
        if (this.video.attr('paused')) {
            this.bezel.innerHTML = svg('play');
            // this.bezel.classList.add('xplayer-bezel-transition');
            dom.addClass(this.bezel, 'xplayer-bezel-transition');
        }

        this.playButton.innerHTML = svg('pause');

        this.video.play();
        this.setTime();
        // this.element.classList.add('xplayer-playing');
        dom.addClass(this.element, 'xplayer-playing');
        this.trigger('play');
    }

    /**
     * [pause 暂停]
     */
    pause() {
        this.paused = true;
        // this.element.classList.remove('xplayer-loading');
        dom.removeClass(this.element, 'xplayer-loading');

        if (!this.video.attr('paused')) {
            this.bezel.innerHTML = svg('pause');
            // this.bezel.classList.add('xplayer-bezel-transition');
            dom.addClass(this.bezel, 'xplayer-bezel-transition');
        }

        this.ended = false;
        this.playButton.innerHTML = svg('play');
        this.video.pause();
        this.clearTime();
        // this.element.classList.remove('xplayer-playing');
        dom.removeClass(this.element, 'xplayer-playing');
        this.trigger('pause');
    }

    /**
     * [volume 设置音量]
     * @param  {[type]} percentage [音量]
     */
    volume(percentage) {
        percentage = percentage > 0 ? percentage : 0;
        percentage = percentage < 1 ? percentage : 1;
        this.updateBar('volume', percentage, 'width');
        this.video.attr('volume', percentage);
        if (this.video.attr('muted')) {
            this.video.attr('muted', false);
        }
        this.switchVolumeIcon();
    }

    /**
     * 暂停或者播放
     */
    toggle() {
        if (this.video.attr('paused')) {
            this.play();
        } else {
            this.pause();
        }
    }

    /**
     * 监听事件
     */
    on(event, callback) {
        if (typeof callback === 'function') {
            this.event[event].push(callback);
        }
    }


    /**
     * 切换播放视频
     *
     * @param {Object} video - new video info
     */
    switchVideo(video) {
        this.video.attr('poster', video.pic ? video.pic : '');
        this.video.attr('src', video.url);
        this.pause();
        this.updateBar('played', 0, 'width');
        this.updateBar('loaded', 0, 'width');
        this.element.getElementsByClassName('xplayer-ptime')[0].innerHTML = '00:00';
    }

    initVideo() {

        /**
         * 视频事件
         */
        // show video time: the metadata has loaded or changed
        this.video.on('all', 'durationchange', (i, video) => {
            if (video.duration !== 1) { // 兼容性: 安卓浏览器一开始会输出1
                this.element.getElementsByClassName('xplayer-dtime')[0].innerHTML = utils.secondToTime(this.video.duration);
            }
        });

        // show video loaded bar: to inform interested parties of progress downloading the media
        this.video.on('current', 'progress', (i, video) => {
            const percentage = video.buffered.length ? video.buffered.end(video.buffered.length - 1) / video.duration : 0;
            this.updateBar('loaded', percentage, 'width');
        });

        // video download error: an error occurs
        this.video.on('all', 'error', () => {
            this.notice(this.tran('This video fails to load'), -1);
            this.trigger('pause');
        });

        // video can play: enough data is available that the media can be played
        this.video.on('current', 'canplay', () => {
            this.trigger('canplay');
        });

        // music end
        this.ended = false;
        this.video.on('all', 'ended', (i) => {
            if (i === this.video.videos.length - 1) {
                this.updateBar('played', 1, 'width');
                if (!this.loop) {
                    this.ended = true;
                    this.pause();
                    this.trigger('ended');
                } else {
                    this.video.switch(0);
                    this.video.play();
                }
                this.danIndex = 0;
            }
        });

        this.video.on('current', 'play', () => {
            if (this.paused) {
                this.play();
            }
        });

        this.video.on('current', 'pause', () => {
            if (!this.paused) {
                this.pause();
            }
        });

        // control volume
        this.video.attr('volume', parseInt(this.element.getElementsByClassName('xplayer-volume-bar-inner')[0].style.width) / 100);
    }

    /**
     * [switchQuality 切换清晰度]
     * @param  {[type]} index [清晰度的次序]
     */
    switchQuality(index) {
        if (this.qualityIndex === index || this.switchingQuality) {
            return;
        } else {
            this.qualityIndex = index;
        }
        this.switchingQuality = true;
        this.quality = this.option.video.quality[index];
        this.element.getElementsByClassName('xplayer-quality-icon')[0].innerHTML = this.quality.name;

        this.video.pause();
        const videoHTML = html.video(false, null, this.option.screenshot, 'auto', this.quality.url);
        const videoEle = new DOMParser().parseFromString(videoHTML, 'text/html').body.firstChild;
        const parent = this.element.getElementsByClassName('xplayer-video-wrap')[0];
        parent.insertBefore(videoEle, parent.getElementsByTagName('div')[0]);
        this.prevVideo = this.video;
        this.video = new Video([videoEle], this.prevVideo.duration);
        this.initVideo();
        this.video.seek(this.prevVideo.currentTime());
        this.notice(`${this.tran('Switching to')} ${this.quality.name} ${this.tran('quality')}`, -1);
        this.video.on('current', 'canplay', () => {
            if (this.prevVideo) {
                if (this.video.currentTime() !== this.prevVideo.currentTime()) {
                    this.video.seek(this.prevVideo.currentTime());
                    return;
                }
                parent.removeChild(this.prevVideo.current);
                // this.video.current.classList.add('xplayer-video-current');
                dom.addClass(this.video.current, 'xpalyer-video-current');
                this.video.play();
                this.prevVideo = null;
                this.notice(`${this.tran('Switched to')} ${this.quality.name} ${this.tran('quality')}`);
                this.switchingQuality = false;
            }
        });
    }

    timeTipsHandler(pbar, timeTips) {
        // http://stackoverflow.com/questions/1480133/how-can-i-get-an-objects-absolute-position-on-the-page-in-javascript
        const cumulativeOffset = (element) => {
            let top = 0,
                left = 0;

            if (element) {
                top += element.offsetTop || 0;
                left += element.offsetLeft || 0;
                element = element.offsetParent;
            }

            return {
                top: top,
                left: left
            };
        };

        return (e) => {
            if (!this.video.duration) {
                return;
            }
            const { clientX } = e;
            const px = cumulativeOffset(pbar).left;
            const tx = clientX - px;
            timeTips.innerText = utils.secondToTime(this.video.duration * (tx / pbar.offsetWidth));
            timeTips.style.left = `${(tx - 20)}px`;
            switch (e.type) {
                case 'mouseenter':
                case 'mouseover':
                case 'mousemove':
                    if (this.isTipsShow) {
                        return;
                    }
                    // timeTips.classList.remove('hidden');
                    dom.removeClass(timeTips, 'hidden');
                    this.isTipsShow = true;
                    break;
                case 'mouseleave':
                case 'mouseout':
                    if (!this.isTipsShow) {
                        return;
                    }
                    // timeTips.classList.add('hidden');
                    dom.addClass(timeTips, 'hidden');
                    this.isTipsShow = false;
                    break;
            }
        };
    }

    /**
     * [notice 提示]
     * @param  {[type]} text [文案]
     * @param  {[type]} time [显示时长]
     */
    notice(text, time) {
        const noticeEle = this.element.getElementsByClassName('xplayer-notice')[0];
        noticeEle.innerHTML = text;
        noticeEle.style.opacity = 1;
        if (this.noticeTime) {
            clearTimeout(this.noticeTime);
        }
        if (time && time < 0) {
            return;
        }
        this.noticeTime = setTimeout(() => {
            noticeEle.style.opacity = 0;
        }, time || 2000);
    }
}

module.exports = XPlayer;
