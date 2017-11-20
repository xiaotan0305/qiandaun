/*
 * @Author: anchen
 * @Date:   2015-06-02 10:45:23
 * @Last Modified by:   anchen
 * @Last Modified time: 2015-06-02 10:46:12
 */

(function () {
    'use strict';
    var html = document.documentElement;
    function onWindowResize() {
        html.style.fontSize = html.getBoundingClientRect().width / 20 + 'px';
    }

    window.addEventListener('resize', onWindowResize);
    onWindowResize();
})();