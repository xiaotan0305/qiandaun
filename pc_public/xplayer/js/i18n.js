const tranZH = {
    'Top': '顶部',
    'Bottom': '底部',
    'Rolling': '滚动',
    'About author': '关于作者',
    'DPlayer feedback': '播放器意见反馈',
    'About DPlayer': '关于 DPlayer 播放器',
    'Loop': '循环',
    'Speed': '速度',
    'Rotate': '旋转',
    'Normal': '正常',
    'This video fails to load': '视频加载失败',
    'Switching to': '正在切换至',
    'Switched to': '已经切换至',
    'quality': '画质',
};

module.exports = function (lang) {
    this.lang = lang;
    this.tran = (text) => {
        if (this.lang === 'en') {
            return text;
        }
        else if (this.lang === 'zh') {
            return tranZH[text];
        }
    };
};