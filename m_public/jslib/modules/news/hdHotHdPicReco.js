/**
 * Created by LXM on 14-12-10.
 */
define("modules/news/hdHotHdPicReco",['jquery'],function (require, exports, module) {
    "use strict";
    module.exports = function (options) {
        var $ = require("jquery");

        window.scrollTo(0, 1);

        $(".Back").on("click",function(){
            history.back(-1);
        });
    }
});