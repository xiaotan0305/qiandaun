/*
 * Hammer.JS jQuery plugin
 * version 0.3
 * author: Eight Media
 * https://github.com/EightMedia/hammer.js
 */
define("hammer/0.3/hammer",["hammer/0.6.4/hammer","jquery"],function(require){
    var $ = require("jquery");
    $.fn.hammer = function(options)
    {
        return this.each(function()
        {
            var Hammer = require("hammer/0.6.4/hammer");
            var hammer = new Hammer(this, options);

            var $el = $(this);
            $el.data("hammer", hammer);

            var events = ['hold','tap','doubletap','transformstart','transform','transformend','dragstart','drag','dragend','swipe','release'];

            for(var e=0; e<events.length; e++) {
                hammer['on'+ events[e]] = (function(el, eventName) {
                    return function(ev) {
                        el.trigger(jQuery.Event(eventName, ev));
                    };
                })($el, events[e]);
            }
        });
    };
});