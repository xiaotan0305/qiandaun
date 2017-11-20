const svg = require('./svg.js');

const html = {
    main: (option) => {
        let videos = ``;
        for (let i = 0; i < option.video.url.length; i++) {
            videos += html.video(i === 0, option.video.pic, option.screenshot, option.video.url.length ? 'metadata' : option.preload, option.video.url[i]);
        }
        return `
        <div class="xplayer-mask"></div>
        <div class="xplayer-video-wrap">
            ${videos}
            ${option.logo ? `
            <div class="xplayer-logo"><img src="${option.logo}"></div>
            ` : ``}
            <div class="xplayer-bezel">
                <span class="xplayer-bezel-icon"></span>
                <span class="diplayer-loading-icon">
                    <svg height="100%" version="1.1" viewBox="0 0 22 22" width="100%">
                        <svg x="7" y="1">
                            <circle class="diplayer-loading-dot diplayer-loading-dot-0" cx="4" cy="4" r="2"></circle>
                        </svg>
                        <svg x="11" y="3">
                            <circle class="diplayer-loading-dot diplayer-loading-dot-1" cx="4" cy="4" r="2"></circle>
                        </svg>
                        <svg x="13" y="7">
                            <circle class="diplayer-loading-dot diplayer-loading-dot-2" cx="4" cy="4" r="2"></circle>
                        </svg>
                        <svg x="11" y="11">
                            <circle class="diplayer-loading-dot diplayer-loading-dot-3" cx="4" cy="4" r="2"></circle>
                        </svg>
                        <svg x="7" y="13">
                            <circle class="diplayer-loading-dot diplayer-loading-dot-4" cx="4" cy="4" r="2"></circle>
                        </svg>
                        <svg x="3" y="11">
                            <circle class="diplayer-loading-dot diplayer-loading-dot-5" cx="4" cy="4" r="2"></circle>
                        </svg>
                        <svg x="1" y="7">
                            <circle class="diplayer-loading-dot diplayer-loading-dot-6" cx="4" cy="4" r="2"></circle>
                        </svg>
                        <svg x="3" y="3">
                            <circle class="diplayer-loading-dot diplayer-loading-dot-7" cx="4" cy="4" r="2"></circle>
                        </svg>
                    </svg>
                </span>
            </div>
        </div>
        <div class="xplayer-controller-mask"></div>
        <div class="xplayer-controller">
            <div class="xplayer-icons xplayer-icons-left">
                <button class="xplayer-icon xplayer-play-icon">
                    ${svg('play')}
                </button>
                <div class="xplayer-volume">
                    <button class="xplayer-icon xplayer-volume-icon">
                        ${svg('volume-down')}
                    </button>
                    <div class="xplayer-volume-bar-wrap">
                        <div class="xplayer-volume-bar">
                            <div class="xplayer-volume-bar-inner" style="width: 70%; background: ${option.theme};">
                                <span class="xplayer-thumb" style="background: ${option.theme}"></span>
                            </div>
                        </div>
                    </div>
                </div>
                <span class="xplayer-time"><span class="xplayer-ptime">0:00</span> / <span class="xplayer-dtime">0:00</span></span>
            </div>
            <div class="xplayer-icons xplayer-icons-right">
                ${option.video.quality ? `
                <div class="xplayer-quality">
                    <button class="xplayer-icon xplayer-quality-icon">${option.video.quality[option.video.defaultQuality].name}</button>
                    <div class="xplayer-quality-mask">
                        ${html.qualityList(option.video.quality)}
                    </div>
                </div>
                ` : ``}
                ${option.screenshot ? `
                <a href="#" class="xplayer-icon xplayer-camera-icon">
                    ${svg('camera')}
                </a>
                ` : ``}
                <div class="xplayer-setting">
                    <button class="xplayer-icon xplayer-rotate-icon prev">
                        ${svg('rotate-prev')}
                    </button>
                    <div class="xplayer-setting-box"></div>
                </div>
                <div class="xplayer-setting">
                    <button class="xplayer-icon xplayer-rotate-icon next">
                        ${svg('rotate-next')}
                    </button>
                    <div class="xplayer-setting-box"></div>
                </div>
                <div class="xplayer-setting">
                    <button class="xplayer-icon xplayer-setting-icon">
                        ${svg('setting')}
                    </button>
                    <div class="xplayer-setting-box"></div>
                </div>
                <div class="xplayer-full">
                    <button class="xplayer-icon xplayer-full-in-icon">
                        ${svg('full-in')}
                    </button>
                    <button class="xplayer-icon xplayer-full-icon">
                        ${svg('full')}
                    </button>
                </div>
            </div>
            <div class="xplayer-bar-wrap">
                <div class="xplayer-bar-time hidden">00:00</div>
                <div class="xplayer-bar">
                    <div class="xplayer-loaded" style="width: 0;"></div>
                    <div class="xplayer-played" style="width: 0; background: ${option.theme}">
                        <span class="xplayer-thumb" style="background: ${option.theme}"></span>
                    </div>
                </div>
            </div>
        </div>
        ${html.contextmenuList(option.contextmenu)}
        <div class="xplayer-notice"></div>`;
    },

    contextmenuList: (contextmenu) => {
        let result = '<div class="xplayer-menu">';
        for (let i = 0; i < contextmenu.length; i++) {
            result += `<div class="xplayer-menu-item"><span class="xplayer-menu-label"><a target="_blank" href="${contextmenu[i].link}">${contextmenu[i].text}</a></span></div>`;
        }
        result += '</div>';

        return result;
    },

    qualityList: (quality) => {
        let result = '<div class="xplayer-quality-list">';
        for (let i = 0; i < quality.length; i++) {
            result += `<div class="xplayer-quality-item" data-index="${i}">${quality[i].name}</div>`;
        }
        result += '</div>';

        return result;
    },

    video: (current, pic, screenshot, preload, url) => `<video class="xplayer-video ${current ? `xplayer-video-current"` : ``}" ${pic ? `poster="${pic}"` : ``} webkit-playsinline playsinline ${screenshot ? `crossorigin="anonymous"` : ``} ${preload ? `preload="${preload}"` : ``} src="${url}"></video>`,

    setting: (tran) => ({
        'original': `
            <div class="xplayer-setting-item xplayer-setting-speed">
                <span class="xplayer-label">${tran('Speed')}</span>
                <div class="xplayer-toggle">
                    ${svg('right')}
                </div>
            </div>
            <div class="xplayer-setting-item xplayer-setting-loop">
                <span class="xplayer-label">${tran('Loop')}</span>
                <div class="xplayer-toggle">
                    <input class="xplayer-toggle-setting-input" type="checkbox" name="xplayer-toggle">
                    <label for="xplayer-toggle"></label>
                </div>
            </div>`,
        'speed': `
            <div class="xplayer-setting-speed-item" data-speed="0.5">
                <span class="xplayer-label">0.5</span>
            </div>
            <div class="xplayer-setting-speed-item" data-speed="0.75">
                <span class="xplayer-label">0.75</span>
            </div>
            <div class="xplayer-setting-speed-item" data-speed="1">
                <span class="xplayer-label">${tran('Normal')}</span>
            </div>
            <div class="xplayer-setting-speed-item" data-speed="1.25">
                <span class="xplayer-label">1.25</span>
            </div>
            <div class="xplayer-setting-speed-item" data-speed="1.5">
                <span class="xplayer-label">1.5</span>
            </div>
            <div class="xplayer-setting-speed-item" data-speed="2">
                <span class="xplayer-label">2</span>
            </div>`
    }) 
};

module.exports = html;