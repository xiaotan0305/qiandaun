/*
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2013 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.9.1
 *
 */
define('lazyload/1.9.1/lazyload',["jquery"],function(require,exports,module){
    var $ = require("jquery");
    var $window = $(window),document = window.document;
    $.fn.lazyload = function(options) {
        var elements = this;
        var $container;
        var settings = {
            threshold       : 0,
            failure_limit   : 0,
            event           : "scroll",
            effect          : "show",
            container       : window,
            data_attribute  : "original",
            skip_invisible  : true,
            appear          : null,
            load            : null,
            placeholder     : "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABQAAD/4QMtaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTEzOUZERjlDQTM0MTFFNEI3OUM4NDM1QjgxRkZGMjUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTEzOUZERkFDQTM0MTFFNEI3OUM4NDM1QjgxRkZGMjUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBMTM5RkRGN0NBMzQxMUU0Qjc5Qzg0MzVCODFGRkYyNSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBMTM5RkRGOENBMzQxMUU0Qjc5Qzg0MzVCODFGRkYyNSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv/uAA5BZG9iZQBkwAAAAAH/2wCEAAICAgICAgICAgIDAgICAwQD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"
        };

        function update() {
            var counter = 0;

            elements.each(function() {
                var $this = $(this);
                if (settings.skip_invisible && !$this.is(":visible")) {
                    return;
                }
                if ($.abovethetop(this, settings) ||
                    $.leftofbegin(this, settings)) {
                        /* Nothing. */
                } else if (!$.belowthefold(this, settings) &&
                    !$.rightoffold(this, settings)) {
                        $this.trigger("appear");
                        /* if we found an image we'll load, reset the counter */
                        counter = 0;
                } else {
                    if (++counter > settings.failure_limit) {
                        return false;
                    }
                }
            });

        }

        if(options) {
            /* Maintain BC for a couple of versions. */
            if (undefined !== options.failurelimit) {
                options.failure_limit = options.failurelimit;
                delete options.failurelimit;
            }
            if (undefined !== options.effectspeed) {
                options.effect_speed = options.effectspeed;
                delete options.effectspeed;
            }

            $.extend(settings, options);
        }

        /* Cache container as jQuery as object. */
        $container = (settings.container === undefined ||
                      settings.container === window) ? $window : $(settings.container);

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (0 === settings.event.indexOf("scroll")) {
            $container.bind(settings.event, function() {
                return update();
            });
        }

        this.each(function() {
            var self = this;
            var $self = $(self);

            self.loaded = false;

            /* If no src attribute given use data:uri. */
            if (!$self.attr("src")) {
                if ($self.is("img")) {
                    $self.attr("src", settings.placeholder);
                }
            }

            /* When appear is triggered load original image. */
            $self.one("appear", function() {
                if (!this.loaded) {
                    if (settings.appear) {
                        var elements_left = elements.length;
                        settings.appear.call(self, elements_left, settings);
                    }
                    $("<img />")
                        .bind("load", function() {

                            var original = $self.attr("data-" + settings.data_attribute);
                            $self.hide();
                            if ($self.is("img")) {
                                $self.attr("src", original);
                            } else {
                                $self.css("background-image", "url('" + original + "')");
                            }
                            $self[settings.effect](settings.effect_speed);

                            self.loaded = true;

                            /* Remove image from array so it is not looped next time. */
                            var temp = $.grep(elements, function(element) {
                                return !element.loaded;
                            });
                            elements = $(temp);

                            if (settings.load) {
                                var elements_left = elements.length;
                                settings.load.call(self, elements_left, settings);
                            }
                        })
                        .attr("src", $self.attr("data-" + settings.data_attribute));
                }
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if (0 !== settings.event.indexOf("scroll")) {
                $self.bind(settings.event, function() {
                    if (!self.loaded) {
                        $self.trigger("appear");
                    }
                });
            }
        });

        /* Check if something appears when window is resized. */
        $window.bind("resize", function() {
            update();
        });

        /* With IOS5 force loading images when navigating with back button. */
        /* Non optimal workaround. */
        if ((/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion)) {
            $window.bind("pageshow", function(event) {
                if (event.originalEvent && event.originalEvent.persisted) {
                    elements.each(function() {
                        $(this).trigger("appear");
                    });
                }
            });
        }

        /* Force initial check if images should appear. */
        $(document).ready(function() {
            update();
        });

        return this;
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };

    $.rightoffold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };

    $.abovethetop = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold  + $(element).height();
    };

    $.leftofbegin = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };

    $.inviewport = function(element, settings) {
         return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) &&
                !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
     };

    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() or */
    /* $("img").filter(":below-the-fold").something() which is faster */

    $.extend($.expr[":"], {
        "below-the-fold" : function(a) { return $.belowthefold(a, {threshold : 0}); },
        "above-the-top"  : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-screen": function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-screen" : function(a) { return !$.rightoffold(a, {threshold : 0}); },
        "in-viewport"    : function(a) { return $.inviewport(a, {threshold : 0}); },
        /* Maintain BC for couple of versions. */
        "above-the-fold" : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-fold"  : function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-fold"   : function(a) { return !$.rightoffold(a, {threshold : 0}); }
    });
    module.exports = $;
});