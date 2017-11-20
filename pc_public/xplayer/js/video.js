const dom = require('./dom.js');

class Video {
    constructor(videos, duration) {
        this.videos = videos;
        this.multi = this.videos.length > 1;
        this.index = 0;
        this.current = this.videos[this.index];

        this.duration = duration || 0;
        this.durationArr = [];
        this.eventAll = [];
        this.eventCurrent = [];

        this.on('all', 'durationchange', (i, video) => {
            if (video.duration !== 1) { // some Android browsers will output 1 at first
                this.durationArr[i] = video.duration;
                if (!duration) {
                    this.duration = this.durationArr.reduce((sum, cur) => sum + cur);
                }
            }
        });
        this.on('current', 'end', () => {
            this.switch(this.index + 1);
        });
    }

    /**
     * [switch 切换]
     * @param  {[type]} index [第几个]
     * @param  {[type]} time  [时间]
     */
    switch(index, time) {
        if (this.index !== index) {
            dom.addClass(this.videos[index], 'xplayer-video-current');
            // this.videos[index].classList.add('xplayer-video-current');
            if (!this.current.paused) {
                this.videos[index].play();
            }
            dom.removeClass(this.current, 'xplayer-video-current')
            // this.current.classList.remove('xplayer-video-current');
            this.current.pause();

            this.index = index;
            this.current = this.videos[this.index];
            this.videos[index].currentTime = time ? time : 0;
        } else {
            this.videos[index].currentTime = time ? time : 0;
        }
    }

    /**
     * [on 时间绑定]
     * @param  {[type]}   type     [类型]
     * @param  {[type]}   event    [事件]
     * @param  {Function} callback [回调]
     */
    on(type, event, callback) {
        if (typeof callback === 'function') {
            if (type === 'all') {
                if (!this.eventAll[event]) {
                    this.eventAll[event] = [];
                }
                this.eventAll[event].push(callback);
            } else {
                if (!this.eventCurrent[event]) {
                    this.eventCurrent[event] = [];
                }
                this.eventCurrent[event].push(callback);
            }

            if (['seeking'].indexOf(event) === -1) {
                for (let i = 0; i < this.videos.length; i++) {
                    this.videos[i].addEventListener(event, (ev) => {
                        if (type === 'all' || this.videos[i] === this.current) {
                            callback(i, this.videos[i], ev);
                        }
                    });
                }
            }
        }
    }

    /**
     * [trigger 触发时间]
     * @param  {[type]} type  [类型]
     * @param  {[type]} event [事件]
     */
    trigger(type, event) {
        const events = type === 'all' ? this.eventAll : this.eventCurrent;
        if (events[event]) {
            for (let i = 0; i < events[event].length; i++) {
                events[event][i]();
            }
        }
    }

    /**
     * [currentTime 获取当前时间]
     * @return {[type]} [时间]
     */
    currentTime() {
        if (this.durationArr.slice(0, this.index).length) {
            return this.durationArr.slice(0, this.index).reduce((sum, cur) => sum + cur) + this.current.currentTime;
        } else {
            return this.current.currentTime;
        }
    }

    /**
     * [seek 跳转时间]
     * @param  {[type]} time [时间]
     */
    seek(time) {
        time = Math.max(time, 0);
        time = Math.min(time, this.duration);

        let i = 0;
        let tmptime = 0;
        while (tmptime <= time) {
            tmptime += this.durationArr[i];
            i++;
        }

        let currentTime;
        if (this.durationArr.slice(0, this.index).length) {
            currentTime = time - this.durationArr.slice(0, i - 1).reduce((sum, cur) => sum + cur);
        } else {
            currentTime = time;
        }

        this.switch(i - 1, currentTime);

        this.trigger('all', 'seeking');
    }

    /**
     * [attr 设置或获取参数]
     * @param  {[type]} option [key]
     * @param  {[type]} value  [value]
     * @return {[type]}        [当前视频]
     */
    attr(option, value) {
        if (value !== undefined) {
            for (let i = 0; i < this.videos.length; i++) {
                this.videos[i][option] = value;
            }
        }
        return this.current[option];
    }

    // 播放
    play() {
        this.current.play();
    }

    // 暂停
    pause() {
        this.current.pause();
    }

    // 播放或者暂停
    toggle() {
        this.current.paused ? this.play() : this.pause();
    }
}

module.exports = Video;
