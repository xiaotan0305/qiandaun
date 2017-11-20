module.exports = (option) => {
    const isMobile = /mobile/i.test(window.navigator.userAgent);
    // 兼容性: 一些移动端浏览器不支持自动播放
    if (isMobile) {
        option.autoplay = false;
    }

    var lang = navigator.language || navigator.browserLanguage;

    // 默认设置
    const defaultOption = {
        element: document.getElementsByClassName('xplayer')[0],
        autoplay: false,
        theme: '#c00',
        loop: false,
        logo: 'http://static.test.soufunimg.com/common_m/m_public/201511/images/app_fang.png',
        lang: lang.indexOf('zh') !== -1 ? 'zh' : 'en',
        screenshot: false,
        hotkey: true,
        preload: 'auto',
        contextmenu: [
            {
                text: 'FangPlayer v0.1',
                link: 'http://fang.com/'
            },
            {
                text: 'By 房天下',
                link: ''
            }
        ]
    };

    for (const defaultKey in defaultOption) {
        if (defaultOption.hasOwnProperty(defaultKey) && !option.hasOwnProperty(defaultKey)) {
            option[defaultKey] = defaultOption[defaultKey];
        }
    }

    if (Object.prototype.toString.call(option.video.url) !== '[object Array]') {
        option.video.url = [option.video.url];
    }

    if (option.video && !option.video.hasOwnProperty('type')) {
        option.video.type = 'auto';
    }

    if (option.video.quality) {
        option.video.url = [option.video.quality[option.video.defaultQuality].url];
    }

    return option;
};