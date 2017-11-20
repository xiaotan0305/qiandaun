/*!
 * jWing JavaScript Library v1.0.0
 * http://jwing.com/
 *
 * Includes jquery.js
 * http://jquery.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jwing.org/license
 *
 * Date: 2013-5-8
 */
(function( window, undefined ) {
var $ = window.jQuery,
core_undefined = undefined,
document = window.document,
location = window.location,
version = "1.0.0",
core_Ids = [],
emptyString = "",
$document = $(document),
jSlider = function(config){
	config = config || {};
	var defaults = jSlider.defaults,i;
	if(!$.isPlainObject(config)){
		config = {container:config};
	}
    // 合并默认配置
    for (i in defaults) {
        if (config[i] === undefined) {
            config[i] = defaults[i];
        };
    };
	return new jSlider.fn.init(config);
};
/**
*滚动条 bar track thumb
*/
jSlider.fn = jSlider.prototype = {
	version:version,
	constructor: jSlider,
	init: function(config){
		var that = this,
			name,
            i = 0,
			dom = {},
			container = config['container'],
			sliderw = parseInt(config['width']),
			thumbw = parseInt(config['thumbwidth']),
			maximum = parseInt(config['maximum']),
			minimum = parseInt(config['minimum']),
			value = parseInt(config['value']),
			slider = $(jSlider._templates.replace(/{[^}]+}/g,config['skin'])).width(sliderw).appendTo(container),
			wrap = slider.get(0),
			els = wrap.getElementsByTagName('*'),
			len = els.length;
			
        for (; i < len; i ++) {
            name = els[i].className.split("-").pop();
            if (name) {
                dom[name] = $(els[i]);
            };
        };
		
		var thumb = dom['thumb'],
		hover=thumb[0].className + '-hover',
		drag = function(e){
			var d = e.data;
			if (!event.touches.length) return;
			var touch = event.touches[0];
			that.setbar(touch.pageX - d.pageX + d.left);
			e.stopPropagation();
			e.preventDefault();
		},
		drop = function(e){
			e.stopPropagation();
			e.preventDefault();
			thumb.removeClass(hover);
			$document.unbind('touchmove', drag).unbind('touchend', drop);
			that.config['thumbRelease']({type:'thumbRelease',value:that.value,target:that});
		};

		thumb.bind("touchstart",function(e){
			e.stopPropagation();
			e.preventDefault();
			if (! event.touches.length) return;
			var touch = event.touches[0];
			var d = {
				left: parseInt(thumb.position().left),
				pageX: touch.pageX
			};
			thumb.addClass(hover);
			$document.bind('touchmove', d, drag).bind('touchend', d, drop);
			that.config['thumbPress']({type:'thumbPress',value:that.value,target:that});
		});
		
		var trackbar = dom['track'].width(sliderw-2).add(dom['bar']);
		if(!config['prebar']){
			dom['prebar'].hide();
		}else{
			trackbar = trackbar.add(dom['prebar'])
			this.prevalue = minimum;
		}
		trackbar.bind("touchstart",function(e){
			e.stopPropagation();
			e.preventDefault();
		});

		if(!config['mouseevent']){
			thumb.unbind("touchstart").bind("touchstart",function(e){
				e.stopPropagation();
				e.preventDefault();
			});
		}else{
			trackbar.click(function(e){
				if(!that.slider.left)that.slider.left = slider.offset().left;
				that.setbar(e.pageX-that.slider.left-1);
			});
		}
		if(maximum < minimum) maximum = minimum;
		if(value < minimum) value = minimum;
		if(value > maximum) value = maximum;
		
		this.config = config;
		this.slider = slider;
		this.dom = dom;
		this[0] = wrap;
		this.length = 1;
		this.maxwidth = sliderw-thumbw;
		this.thumbwidth = thumbw;
		this.maximum = maximum;
		this.minimum = minimum;
		this.total = this.maximum - this.minimum;
		this.value = value;
		this.setvalue(value);
		
		return this;
	},
	length: 0,
	setbar:function(left){
		var dom = this.dom,
		l = Math.min(Math.max(left, 0), this.maxwidth);
		dom.bar.css("width",l+this.thumbwidth-2);
		dom.thumb.css("left",l);
		this.value = l*this.total/this.maxwidth + this.minimum;
		this.config['change']({type:'change',value:this.value,target:this});
		return this;
	},
	setvalue:function(value){
		if(this.total==0)return this;
		var left = this.maxwidth*(value-this.minimum)/this.total;
		return this.setbar(left);
	},
	change:function(callback){
		this.config['change'] = callback;
		return this;
	},
	thumbPress:function(callback){
		this.config['thumbPress'] = callback;
		return this;
	},
	thumbRelease:function(callback){
		this.config['thumbRelease'] = callback;
		return this;
	},
	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_Ids.push,
	sort: core_Ids.sort,
	splice: core_Ids.splice
};
jSlider.fn.init.prototype = jSlider.fn;
jSlider._templates = '<div class="jwslider-{id}"><div class="jwslider-track">&nbsp;</div><div class="jwslider-prebar">&nbsp;</div><div class="jwslider-bar">&nbsp;</div><div class="jwslider-thumb">&nbsp;</div></div>';
jSlider.defaults = {
	container:document.body,
	width:200,
	thumbwidth:10,
	skin:"default",
	maximum:100,
	minimum:0,
	value:0,
	prebar:false,
	mouseevent:true,
	change:function(e){},
	thumbPress:function(e){},
	thumbRelease:function(e){}
};
$.jSlider = jSlider;
})( window );
