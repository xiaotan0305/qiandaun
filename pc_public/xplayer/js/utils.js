module.exports = {

    /**
     * 把数字秒转换成分:秒格式
     *
     * @param  {[Number]} second 秒
     * @return {[String]} 00:00 [格式化后的时间]
     */
    secondToTime: (second) => {
        const add0 = (num) => num < 10 ? '0' + num : '' + num;
        const min = parseInt(second / 60);
        const sec = parseInt(second - min * 60);
        return add0(min) + ':' + add0(sec);
    },

    /**
     * [getElementViewLeft 获取左边距]
     * @param  {[Object]} element [元素DOM]
     * @return {[Number]}         [左边距]
     * @warn 已知问题，播放器DOM容器在绝对定位时，获取有偏差
     */
    getElementViewLeft: (element) => {
        let actualLeft = element.offsetLeft;
        let current = element.offsetParent;
        const elementScrollLeft = document.body.scrollLeft + document.documentElement.scrollLeft;
        // 如果不是全屏
        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
            while (current !== null) {
                actualLeft += current.offsetLeft;
                current = current.offsetParent;
            }
        } else {
            while (current !== null && current !== element) {
                actualLeft += current.offsetLeft;
                current = current.offsetParent;
            }
        }
        return actualLeft - elementScrollLeft;
    }
};
