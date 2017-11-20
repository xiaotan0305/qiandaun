// PhotoSwipe - http://www.photoswipe.com/
// Copyright (c) 2012 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: 3.0.5
(function (e) {
	if (!Function.prototype.bind) {
		Function.prototype.bind = function (c) {
			var a = [].slice, b = a.call(arguments, 1), d = this, f = function () {
			}, g = function () {
				return d.apply(this instanceof f ? this : c || {}, b.concat(a.call(arguments)));
			};
			f.prototype = d.prototype;
			g.prototype = new f;
			return g;
		};
	}
	if (typeof e.Code === "undefined") {
		e.Code = {};
	}
	e.Code.Util = {registerNamespace:function () {
		var c = arguments, a = null, b, d, f, g, h;
		b = 0;
		for (g = c.length; b < g; b++) {
			f = c[b];
			f = f.split(".");
			a = f[0];
			typeof e[a] === "undefined" && (e[a] = {});
			a = e[a];
			d = 1;
			for (h = f.length; d < h; ++d) {
				a[f[d]] = a[f[d]] || {}, a = a[f[d]];
			}
		}
	}, coalesce:function () {
		var c, a;
		c = 0;
		for (a = arguments.length; c < a; c++) {
			if (!this.isNothing(arguments[c])) {
				return arguments[c];
			}
		}
		return null;
	}, extend:function (c, a, b) {
		var d;
		this.isNothing(b) && (b = !0);
		if (c && a && this.isObject(a)) {
			for (d in a) {
				this.objectHasProperty(a, d) && (b ? c[d] = a[d] : typeof c[d] === "undefined" && (c[d] = a[d]));
			}
		}
	}, clone:function (c) {
		var a = {};
		this.extend(a, c);
		return a;
	}, isObject:function (c) {
		return c instanceof Object;
	}, isFunction:function (c) {
		return {}.toString.call(c) === "[object Function]";
	}, isArray:function (c) {
		return c instanceof Array;
	}, isLikeArray:function (c) {
		return typeof c.length === "number";
	}, isNumber:function (c) {
		return typeof c === "number";
	}, isString:function (c) {
		return typeof c === "string";
	}, isNothing:function (c) {
		if (typeof c === "undefined" || c === null) {
			return !0;
		}
		return !1;
	}, swapArrayElements:function (c, a, b) {
		var d = c[a];
		c[a] = c[b];
		c[b] = d;
	}, trim:function (c) {
		return c.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
	}, toCamelCase:function (c) {
		return c.replace(/(\-[a-z])/g, function (a) {
			return a.toUpperCase().replace("-", "");
		});
	}, toDashedCase:function (c) {
		return c.replace(/([A-Z])/g, function (a) {
			return "-" + a.toLowerCase();
		});
	}, arrayIndexOf:function (c, a, b) {
		var d, f, g, e;
		g = -1;
		d = 0;
		for (f = a.length; d < f; d++) {
			if (e = a[d], this.isNothing(b)) {
				if (e === c) {
					g = d;
					break;
				}
			} else {
				if (this.objectHasProperty(e, b) && e[b] === c) {
					g = d;
					break;
				}
			}
		}
		return g;
	}, objectHasProperty:function (c, a) {
		return c.hasOwnProperty ? c.hasOwnProperty(a) : "undefined" !== typeof c[a];
	}};
})(window);
(function (e, c) {
	c.Browser = {ua:null, version:null, safari:null, webkit:null, opera:null, msie:null, chrome:null, mozilla:null, android:null, blackberry:null, iPad:null, iPhone:null, iPod:null, iOS:null, is3dSupported:null, isCSSTransformSupported:null, isTouchSupported:null, isGestureSupported:null, _detect:function () {
		this.ua = e.navigator.userAgent;
		this.version = this.ua.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [];
		this.safari = /Safari/gi.test(e.navigator.appVersion);
		this.webkit = /webkit/i.test(this.ua);
		this.opera = /opera/i.test(this.ua);
		this.msie = /msie/i.test(this.ua) && !this.opera;
		this.chrome = /Chrome/i.test(this.ua);
		this.firefox = /Firefox/i.test(this.ua);
		this.fennec = /Fennec/i.test(this.ua);
		this.mozilla = /mozilla/i.test(this.ua) && !/(compatible|webkit)/.test(this.ua);
		this.android = /android/i.test(this.ua);
		this.blackberry = /blackberry/i.test(this.ua);
		this.iOS = /iphone|ipod|ipad/gi.test(e.navigator.platform);
		this.iPad = /ipad/gi.test(e.navigator.platform);
		this.iPhone = /iphone/gi.test(e.navigator.platform);
		this.iPod = /ipod/gi.test(e.navigator.platform);
		var a = document.createElement("div");
		this.is3dSupported = !c.isNothing(a.style.WebkitPerspective);
		this.isCSSTransformSupported = !c.isNothing(a.style.WebkitTransform) || !c.isNothing(a.style.MozTransform) || !c.isNothing(a.style.transformProperty);
		this.isTouchSupported = this.isEventSupported("touchstart");
		this.isGestureSupported = this.isEventSupported("gesturestart");
	}, _eventTagNames:{select:"input", change:"input", submit:"form", reset:"form", error:"img", load:"img", abort:"img"}, isEventSupported:function (a) {
		var b = document.createElement(this._eventTagNames[a] || "div"), d, a = "on" + a;
		d = c.objectHasProperty(b, a);
		d || (b.setAttribute(a, "return;"), d = typeof b[a] === "function");
		return d;
	}, isLandscape:function () {
		return c.DOM.windowWidth() > c.DOM.windowHeight();
	}};
	c.Browser._detect();
})(window, window.Code.Util);
(function (e, c) {
	c.extend(c, {Events:{add:function (a, b, d) {
		this._checkHandlersProperty(a);
		b === "mousewheel" && (b = this._normaliseMouseWheelType());
		typeof a.__eventHandlers[b] === "undefined" && (a.__eventHandlers[b] = []);
		a.__eventHandlers[b].push(d);
		this._isBrowserObject(a) && a.addEventListener(b, d, !1);
	}, remove:function (a, b, d) {
		this._checkHandlersProperty(a);
		b === "mousewheel" && (b = this._normaliseMouseWheelType());
		if (a.__eventHandlers[b] instanceof Array) {
			var f, g, e = a.__eventHandlers[b];
			if (c.isNothing(d)) {
				if (this._isBrowserObject(a)) {
					f = 0;
					for (g = e.length; f < g; f++) {
						a.removeEventListener(b, e[f], !1);
					}
				}
				a.__eventHandlers[b] = [];
			} else {
				f = 0;
				for (g = e.length; f < g; f++) {
					if (e[f] === d) {
						e.splice(f, 1);
						break;
					}
				}
				this._isBrowserObject(a) && a.removeEventListener(b, d, !1);
			}
		}
	}, fire:function (a, b) {
		var d, f, g, h, j = Array.prototype.slice.call(arguments).splice(2);
		b === "mousewheel" && (b = this._normaliseMouseWheelType());
		if (this._isBrowserObject(a)) {
			if (typeof b !== "string") {
				throw "type must be a string for DOM elements";
			}
			g = this._NATIVE_EVENTS[b];
			d = document.createEvent(g ? "HTMLEvents" : "UIEvents");
			d[g ? "initEvent" : "initUIEvent"](b, !0, !0, e, 1);
			if (j.length < 1) {
				a.dispatchEvent(d);
				return;
			}
		}
		this._checkHandlersProperty(a);
		d = typeof b === "string" ? {type:b} : b;
		if (!d.target) {
			d.target = a;
		}
		if (!d.type) {
			throw Error("Event object missing 'type' property.");
		}
		if (a.__eventHandlers[d.type] instanceof Array) {
			g = a.__eventHandlers[d.type];
			j.unshift(d);
			d = 0;
			for (f = g.length; d < f; d++) {
				h = g[d], c.isNothing(h) || h.apply(a, j);
			}
		}
	}, getMousePosition:function (a) {
		var b = {x:0, y:0};
		if (a.pageX) {
			b.x = a.pageX;
		} else {
			if (a.clientX) {
				b.x = a.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
			}
		}
		if (a.pageY) {
			b.y = a.pageY;
		} else {
			if (a.clientY) {
				b.y = a.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
			}
		}
		return b;
	}, getTouchEvent:function (a) {
		return a;
	}, getWheelDelta:function (a) {
		var b = 0;
		c.isNothing(a.wheelDelta) ? c.isNothing(a.detail) || (b = -a.detail / 3) : b = a.wheelDelta / 120;
		return b;
	}, domReady:function (a) {
		document.addEventListener("DOMContentLoaded", a, !1);
	}, _checkHandlersProperty:function (a) {
		c.isNothing(a.__eventHandlers) && c.extend(a, {__eventHandlers:{}});
	}, _isBrowserObject:function (a) {
		if (a === e || a === e.document) {
			return !0;
		}
		return this._isElement(a) || this._isNode(a);
	}, _isElement:function (a) {
		return typeof e.HTMLElement === "object" ? a instanceof e.HTMLElement : typeof a === "object" && a.nodeType === 1 && typeof a.nodeName === "string";
	}, _isNode:function (a) {
		return typeof e.Node === "object" ? a instanceof e.Node : typeof a === "object" && typeof a.nodeType === "number" && typeof a.nodeName === "string";
	}, _normaliseMouseWheelType:function () {
		if (c.Browser.isEventSupported("mousewheel")) {
			return "mousewheel";
		}
		return "DOMMouseScroll";
	}, _NATIVE_EVENTS:{click:1, dblclick:1, mouseup:1, mousedown:1, contextmenu:1, mousewheel:1, DOMMouseScroll:1, mouseover:1, mouseout:1, mousemove:1, selectstart:1, selectend:1, keydown:1, keypress:1, keyup:1, orientationchange:1, touchstart:1, touchmove:1, touchend:1, touchcancel:1, gesturestart:1, gesturechange:1, gestureend:1, focus:1, blur:1, change:1, reset:1, select:1, submit:1, load:1, unload:1, beforeunload:1, resize:1, move:1, DOMContentLoaded:1, readystatechange:1, error:1, abort:1, scroll:1}}});
})(window, window.Code.Util);
(function (e, c) {
	c.extend(c, {DOM:{setData:function (a, b, d) {
		if (c.isLikeArray(a)) {
			var f, g;
			f = 0;
			for (g = a.length; f < g; f++) {
				c.DOM._setData(a[f], b, d);
			}
		} else {
			c.DOM._setData(a, b, d);
		}
	}, _setData:function (a, b, d) {
		c.DOM.setAttribute(a, "data-" + b, d);
	}, getData:function (a, b, d) {
		return c.DOM.getAttribute(a, "data-" + b, d);
	}, removeData:function (a, b) {
		if (c.isLikeArray(a)) {
			var d, f;
			d = 0;
			for (f = a.length; d < f; d++) {
				c.DOM._removeData(a[d], b);
			}
		} else {
			c.DOM._removeData(a, b);
		}
	}, _removeData:function (a, b) {
		c.DOM.removeAttribute(a, "data-" + b);
	}, isChildOf:function (a, b) {
		if (b === a) {
			return !1;
		}
		for (; a && a !== b; ) {
			a = a.parentNode;
		}
		return a === b;
	}, find:function (a, b) {
		if (c.isNothing(b)) {
			b = e.document;
		}
		var d = b.querySelectorAll(a), f = [], g, h;
		g = 0;
		for (h = d.length; g < h; g++) {
			f.push(d[g]);
		}
		return f;
	}, createElement:function (a, b, d) {
		var f, a = document.createElement(a);
		for (f in b) {
			c.objectHasProperty(b, f) && a.setAttribute(f, b[f]);
		}
		a.innerHTML = d || "";
		return a;
	}, appendChild:function (a, b) {
		b.appendChild(a);
	}, insertBefore:function (a, b, d) {
		d.insertBefore(a, b);
	}, appendText:function (a, b) {
		c.DOM.appendChild(document.createTextNode(a), b);
	}, appendToBody:function (a) {
		this.appendChild(a, document.body);
	}, removeChild:function (a, b) {
		b.removeChild(a);
	}, removeChildren:function (a) {
		if (a.hasChildNodes()) {
			for (; a.childNodes.length >= 1; ) {
				a.removeChild(a.childNodes[a.childNodes.length - 1]);
			}
		}
	}, hasAttribute:function (a, b) {
		return !c.isNothing(a.getAttribute(b));
	}, getAttribute:function (a, b, d) {
		a = a.getAttribute(b);
		c.isNothing(a) && !c.isNothing(d) && (a = d);
		return a;
	}, setAttribute:function (a, b, d) {
		if (c.isLikeArray(a)) {
			var f, g;
			f = 0;
			for (g = a.length; f < g; f++) {
				c.DOM._setAttribute(a[f], b, d);
			}
		} else {
			c.DOM._setAttribute(a, b, d);
		}
	}, _setAttribute:function (a, b, d) {
		a.setAttribute(b, d);
	}, removeAttribute:function (a, b) {
		if (c.isLikeArray(a)) {
			var d, f;
			d = 0;
			for (f = a.length; d < f; d++) {
				c.DOM._removeAttribute(a[d], b);
			}
		} else {
			c.DOM._removeAttribute(a, b);
		}
	}, _removeAttribute:function (a, b) {
		this.hasAttribute(a, b) && a.removeAttribute(b);
	}, addClass:function (a, b) {
		if (c.isLikeArray(a)) {
			var d, f;
			d = 0;
			for (f = a.length; d < f; d++) {
				c.DOM._addClass(a[d], b);
			}
		} else {
			c.DOM._addClass(a, b);
		}
	}, _addClass:function (a, b) {
		var d = c.DOM.getAttribute(a, "class", "");
		RegExp("(?:^|\\s+)" + b + "(?:\\s+|$)").test(d) || (d !== "" && (d += " "), d += b, c.DOM.setAttribute(a, "class", d));
	}, removeClass:function (a, b) {
		if (c.isLikeArray(a)) {
			var d, f;
			d = 0;
			for (f = a.length; d < f; d++) {
				c.DOM._removeClass(a[d], b);
			}
		} else {
			c.DOM._removeClass(a, b);
		}
	}, _removeClass:function (a, b) {
		var d = c.DOM.getAttribute(a, "class", ""), d = c.trim(d).split(" "), f = "", g, e;
		g = 0;
		for (e = d.length; g < e; g++) {
			d[g] !== b && (f !== "" && (f += " "), f += d[g]);
		}
		f === "" ? c.DOM.removeAttribute(a, "class") : c.DOM.setAttribute(a, "class", f);
	}, hasClass:function (a, b) {
		return RegExp("(?:^|\\s+)" + b + "(?:\\s+|$)").test(c.DOM.getAttribute(a, "class", ""));
	}, setStyle:function (a, b, d) {
		if (c.isLikeArray(a)) {
			var f, g;
			f = 0;
			for (g = a.length; f < g; f++) {
				c.DOM._setStyle(a[f], b, d);
			}
		} else {
			c.DOM._setStyle(a, b, d);
		}
	}, _setStyle:function (a, b, d) {
		var f;
		if (c.isObject(b)) {
			for (f in b) {
				c.objectHasProperty(b, f) && (f === "width" ? c.DOM.width(a, b[f]) : f === "height" ? c.DOM.height(a, b[f]) : a.style[f] = b[f]);
			}
		} else {
			a.style[b] = d;
		}
	}, getStyle:function (a, b) {
		var d = e.getComputedStyle(a, "").getPropertyValue(b);
		d === "" && (d = a.style[b]);
		return d;
	}, hide:function (a) {
		if (c.isLikeArray(a)) {
			var b, d;
			b = 0;
			for (d = a.length; b < d; b++) {
				c.DOM._hide(a[b]);
			}
		} else {
			c.DOM._hide(a);
		}
	}, _hide:function (a) {
		c.DOM.setData(a, "ccl-disp", c.DOM.getStyle(a, "display"));
		c.DOM.setStyle(a, "display", "none");
	}, show:function (a) {
		if (c.isLikeArray(a)) {
			var b, d;
			b = 0;
			for (d = a.length; b < d; b++) {
				c.DOM._show(a[b]);
			}
		} else {
			c.DOM._show(a);
		}
	}, _show:function (a) {
		if (c.DOM.getStyle(a, "display") === "none") {
			var b = c.DOM.getData(a, "ccl-disp", "block");
			if (b === "none" || b === "") {
				b = "block";
			}
			c.DOM.setStyle(a, "display", b);
		}
	}, width:function (a, b) {
		if (!c.isNothing(b)) {
			c.isNumber(b) && (b += "px"), a.style.width = b;
		}
		return this._getDimension(a, "width");
	}, outerWidth:function (a) {
		var b = c.DOM.width(a);
		b += parseInt(c.DOM.getStyle(a, "padding-left"), 10) + parseInt(c.DOM.getStyle(a, "padding-right"), 10);
		b += parseInt(c.DOM.getStyle(a, "margin-left"), 10) + parseInt(c.DOM.getStyle(a, "margin-right"), 10);
		b += parseInt(c.DOM.getStyle(a, "border-left-width"), 10) + parseInt(c.DOM.getStyle(a, "border-right-width"), 10);
		return b;
	}, height:function (a, b) {
		if (!c.isNothing(b)) {
			c.isNumber(b) && (b += "px"), a.style.height = b;
		}
		return this._getDimension(a, "height");
	}, _getDimension:function (a, b) {
		var d = e.parseInt(e.getComputedStyle(a, "").getPropertyValue(b)), f;
		if (isNaN(d)) {
			f = {display:a.style.display, left:a.style.left}, a.style.display = "block", a.style.left = "-1000000px", d = e.parseInt(e.getComputedStyle(a, "").getPropertyValue(b)), a.style.display = f.display, a.style.left = f.left;
		}
		return d;
	}, outerHeight:function (a) {
		var b = c.DOM.height(a);
		b += parseInt(c.DOM.getStyle(a, "padding-top"), 10) + parseInt(c.DOM.getStyle(a, "padding-bottom"), 10);
		b += parseInt(c.DOM.getStyle(a, "margin-top"), 10) + parseInt(c.DOM.getStyle(a, "margin-bottom"), 10);
		b += parseInt(c.DOM.getStyle(a, "border-top-width"), 10) + parseInt(c.DOM.getStyle(a, "border-bottom-width"), 10);
		return b;
	}, documentWidth:function () {
		return c.DOM.width(document.documentElement);
	}, documentHeight:function () {
		return c.DOM.height(document.documentElement);
	}, documentOuterWidth:function () {
		return c.DOM.width(document.documentElement);
	}, documentOuterHeight:function () {
		return c.DOM.outerHeight(document.documentElement);
	}, bodyWidth:function () {
		return c.DOM.width(document.body);
	}, bodyHeight:function () {
		return c.DOM.height(document.body);
	}, bodyOuterWidth:function () {
		return c.DOM.outerWidth(document.body);
	}, bodyOuterHeight:function () {
		return c.DOM.outerHeight(document.body);
	}, windowWidth:function () {
		return e.innerWidth;
	}, windowHeight:function () {
		return e.innerHeight;
	}, windowScrollLeft:function () {
		return e.pageXOffset;
	}, windowScrollTop:function () {
		return e.pageYOffset;
	}}});
})(window, window.Code.Util);
(function (e, c) {
	c.extend(c, {Animation:{_applyTransitionDelay:50, _transitionEndLabel:e.document.documentElement.style.webkitTransition !== void 0 ? "webkitTransitionEnd" : "transitionend", _transitionEndHandler:null, _transitionPrefix:e.document.documentElement.style.webkitTransition !== void 0 ? "webkitTransition" : e.document.documentElement.style.MozTransition !== void 0 ? "MozTransition" : "transition", _transformLabel:e.document.documentElement.style.webkitTransform !== void 0 ? "webkitTransform" : e.document.documentElement.style.MozTransition !== void 0 ? "MozTransform" : "transform", _getTransitionEndHandler:function () {
		if (c.isNothing(this._transitionEndHandler)) {
			this._transitionEndHandler = this._onTransitionEnd.bind(this);
		}
		return this._transitionEndHandler;
	}, stop:function (a) {
		if (c.Browser.isCSSTransformSupported) {
			var b = {};
			c.Events.remove(a, this._transitionEndLabel, this._getTransitionEndHandler());
			c.isNothing(a.callbackLabel) && delete a.callbackLabel;
			b[this._transitionPrefix + "Property"] = "";
			b[this._transitionPrefix + "Duration"] = "";
			b[this._transitionPrefix + "TimingFunction"] = "";
			b[this._transitionPrefix + "Delay"] = "";
			b[this._transformLabel] = "";
			c.DOM.setStyle(a, b);
		} else {
			c.isNothing(e.jQuery) || e.jQuery(a).stop(!0, !0);
		}
	}, fadeIn:function (a, b, d, f, g) {
		g = c.coalesce(g, 1);
		g <= 0 && (g = 1);
		if (b <= 0 && (c.DOM.setStyle(a, "opacity", g), !c.isNothing(d))) {
			d(a);
			return;
		}
		c.DOM.getStyle(a, "opacity") >= 1 && c.DOM.setStyle(a, "opacity", 0);
		c.Browser.isCSSTransformSupported ? this._applyTransition(a, "opacity", g, b, d, f) : c.isNothing(e.jQuery) || e.jQuery(a).fadeTo(b, g, d);
	}, fadeTo:function (a, b, d, f, c) {
		this.fadeIn(a, d, f, c, b);
	}, fadeOut:function (a, b, d, f) {
		if (b <= 0 && (c.DOM.setStyle(a, "opacity", 0), !c.isNothing(d))) {
			d(a);
			return;
		}
		c.Browser.isCSSTransformSupported ? this._applyTransition(a, "opacity", 0, b, d, f) : e.jQuery(a).fadeTo(b, 0, d);
	}, slideBy:function (a, b, d, f, g, h) {
		var j = {}, b = c.coalesce(b, 0), d = c.coalesce(d, 0), h = c.coalesce(h, "ease-out");
		j[this._transitionPrefix + "Property"] = "all";
		j[this._transitionPrefix + "Delay"] = "0";
		f === 0 ? (j[this._transitionPrefix + "Duration"] = "", j[this._transitionPrefix + "TimingFunction"] = "") : (j[this._transitionPrefix + "Duration"] = f + "ms", j[this._transitionPrefix + "TimingFunction"] = c.coalesce(h, "ease-out"), c.Events.add(a, this._transitionEndLabel, this._getTransitionEndHandler()));
		j[this._transformLabel] = c.Browser.is3dSupported ? "translate3d(" + b + "px, " + d + "px, 0px)" : "translate(" + b + "px, " + d + "px)";
		if (!c.isNothing(g)) {
			a.cclallcallback = g;
		}
		c.DOM.setStyle(a, j);
		f === 0 && e.setTimeout(function () {
			this._leaveTransforms(a);
		}.bind(this), this._applyTransitionDelay);
	}, resetTranslate:function (a) {
		var b = {};
		b[this._transformLabel] = b[this._transformLabel] = c.Browser.is3dSupported ? "translate3d(0px, 0px, 0px)" : "translate(0px, 0px)";
		c.DOM.setStyle(a, b);
	}, _applyTransition:function (a, b, d, f, g, h) {
		var j = {}, h = c.coalesce(h, "ease-in");
		j[this._transitionPrefix + "Property"] = b;
		j[this._transitionPrefix + "Duration"] = f + "ms";
		j[this._transitionPrefix + "TimingFunction"] = h;
		j[this._transitionPrefix + "Delay"] = "0";
		c.Events.add(a, this._transitionEndLabel, this._getTransitionEndHandler());
		c.DOM.setStyle(a, j);
		c.isNothing(g) || (a["ccl" + b + "callback"] = g);
		e.setTimeout(function () {
			c.DOM.setStyle(a, b, d);
		}, this._applyTransitionDelay);
	}, _onTransitionEnd:function (a) {
		c.Events.remove(a.currentTarget, this._transitionEndLabel, this._getTransitionEndHandler());
		this._leaveTransforms(a.currentTarget);
	}, _leaveTransforms:function (a) {
		var b = a.style[this._transitionPrefix + "Property"], d = b !== "" ? "ccl" + b + "callback" : "cclallcallback", f, b = c.coalesce(a.style.webkitTransform, a.style.MozTransform, a.style.transform), g, h = e.parseInt(c.DOM.getStyle(a, "left"), 0), j = e.parseInt(c.DOM.getStyle(a, "top"), 0), i, l, k = {};
		b !== "" && (b = c.Browser.is3dSupported ? b.match(/translate3d\((.*?)\)/) : b.match(/translate\((.*?)\)/), c.isNothing(b) || (g = b[1].split(", "), i = e.parseInt(g[0], 0), l = e.parseInt(g[1], 0)));
		k[this._transitionPrefix + "Property"] = "";
		k[this._transitionPrefix + "Duration"] = "";
		k[this._transitionPrefix + "TimingFunction"] = "";
		k[this._transitionPrefix + "Delay"] = "";
		c.DOM.setStyle(a, k);
		e.setTimeout(function () {
			if (!c.isNothing(g)) {
				k = {}, k[this._transformLabel] = "", k.left = h + i + "px", k.top = j + l + "px", c.DOM.setStyle(a, k);
			}
			c.isNothing(a[d]) || (f = a[d], delete a[d], f(a));
		}.bind(this), this._applyTransitionDelay);
	}}});
})(window, window.Code.Util);
(function (e, c, a) {
	a.registerNamespace("Code.Util.TouchElement");
	a.TouchElement.EventTypes = {onTouch:"CodeUtilTouchElementOnTouch"};
	a.TouchElement.ActionTypes = {touchStart:"touchStart", touchMove:"touchMove", touchEnd:"touchEnd", touchMoveEnd:"touchMoveEnd", tap:"tap", doubleTap:"doubleTap", swipeLeft:"swipeLeft", swipeRight:"swipeRight", swipeUp:"swipeUp", swipeDown:"swipeDown", gestureStart:"gestureStart", gestureChange:"gestureChange", gestureEnd:"gestureEnd"};
})(window, window.klass, window.Code.Util);
(function (e, c, a) {
	a.registerNamespace("Code.Util.TouchElement");
	a.TouchElement.TouchElementClass = c({el:null, captureSettings:null, touchStartPoint:null, touchEndPoint:null, touchStartTime:null, doubleTapTimeout:null, touchStartHandler:null, touchMoveHandler:null, touchEndHandler:null, mouseDownHandler:null, mouseMoveHandler:null, mouseUpHandler:null, mouseOutHandler:null, gestureStartHandler:null, gestureChangeHandler:null, gestureEndHandler:null, swipeThreshold:null, swipeTimeThreshold:null, doubleTapSpeed:null, dispose:function () {
		var b;
		this.removeEventHandlers();
		for (b in this) {
			a.objectHasProperty(this, b) && (this[b] = null);
		}
	}, initialize:function (b, d) {
		this.el = b;
		this.captureSettings = {swipe:!1, move:!1, gesture:!1, doubleTap:!1, preventDefaultTouchEvents:!0};
		a.extend(this.captureSettings, d);
		this.swipeThreshold = 50;
		this.doubleTapSpeed = this.swipeTimeThreshold = 250;
		this.touchStartPoint = {x:0, y:0};
		this.touchEndPoint = {x:0, y:0};
	}, addEventHandlers:function () {
		if (a.isNothing(this.touchStartHandler)) {
			this.touchStartHandler = this.onTouchStart.bind(this), this.touchMoveHandler = this.onTouchMove.bind(this), this.touchEndHandler = this.onTouchEnd.bind(this), this.mouseDownHandler = this.onMouseDown.bind(this), this.mouseMoveHandler = this.onMouseMove.bind(this), this.mouseUpHandler = this.onMouseUp.bind(this), this.mouseOutHandler = this.onMouseOut.bind(this), this.gestureStartHandler = this.onGestureStart.bind(this), this.gestureChangeHandler = this.onGestureChange.bind(this), this.gestureEndHandler = this.onGestureEnd.bind(this);
		}
		a.Events.add(this.el, "touchstart", this.touchStartHandler);
		this.captureSettings.move && a.Events.add(this.el, "touchmove", this.touchMoveHandler);
		a.Events.add(this.el, "touchend", this.touchEndHandler);
		a.Events.add(this.el, "mousedown", this.mouseDownHandler);
		a.Browser.isGestureSupported && this.captureSettings.gesture && (a.Events.add(this.el, "gesturestart", this.gestureStartHandler), a.Events.add(this.el, "gesturechange", this.gestureChangeHandler), a.Events.add(this.el, "gestureend", this.gestureEndHandler));
	}, removeEventHandlers:function () {
		a.Events.remove(this.el, "touchstart", this.touchStartHandler);
		this.captureSettings.move && a.Events.remove(this.el, "touchmove", this.touchMoveHandler);
		a.Events.remove(this.el, "touchend", this.touchEndHandler);
		a.Events.remove(this.el, "mousedown", this.mouseDownHandler);
		a.Browser.isGestureSupported && this.captureSettings.gesture && (a.Events.remove(this.el, "gesturestart", this.gestureStartHandler), a.Events.remove(this.el, "gesturechange", this.gestureChangeHandler), a.Events.remove(this.el, "gestureend", this.gestureEndHandler));
	}, getTouchPoint:function (a) {
		return {x:a[0].pageX, y:a[0].pageY};
	}, fireTouchEvent:function (b) {
		var d = 0, f = 0, c = 0, h, d = this.touchEndPoint.x - this.touchStartPoint.x, f = this.touchEndPoint.y - this.touchStartPoint.y, c = Math.sqrt(d * d + f * f);
		if (this.captureSettings.swipe && (h = new Date, h -= this.touchStartTime, h <= this.swipeTimeThreshold)) {
			if (e.Math.abs(d) >= this.swipeThreshold) {
				a.Events.fire(this, {type:a.TouchElement.EventTypes.onTouch, target:this, point:this.touchEndPoint, action:d < 0 ? a.TouchElement.ActionTypes.swipeLeft : a.TouchElement.ActionTypes.swipeRight, targetEl:b.target, currentTargetEl:b.currentTarget});
				return;
			}
			if (e.Math.abs(f) >= this.swipeThreshold) {
				a.Events.fire(this, {type:a.TouchElement.EventTypes.onTouch, target:this, point:this.touchEndPoint, action:f < 0 ? a.TouchElement.ActionTypes.swipeUp : a.TouchElement.ActionTypes.swipeDown, targetEl:b.target, currentTargetEl:b.currentTarget});
				return;
			}
		}
		c > 1 ? a.Events.fire(this, {type:a.TouchElement.EventTypes.onTouch, target:this, action:a.TouchElement.ActionTypes.touchMoveEnd, point:this.touchEndPoint, targetEl:b.target, currentTargetEl:b.currentTarget}) : this.captureSettings.doubleTap ? a.isNothing(this.doubleTapTimeout) ? this.doubleTapTimeout = e.setTimeout(function () {
			this.doubleTapTimeout = null;
			a.Events.fire(this, {type:a.TouchElement.EventTypes.onTouch, target:this, point:this.touchEndPoint, action:a.TouchElement.ActionTypes.tap, targetEl:b.target, currentTargetEl:b.currentTarget});
		}.bind(this), this.doubleTapSpeed) : (e.clearTimeout(this.doubleTapTimeout), this.doubleTapTimeout = null, a.Events.fire(this, {type:a.TouchElement.EventTypes.onTouch, target:this, point:this.touchEndPoint, action:a.TouchElement.ActionTypes.doubleTap, targetEl:b.target, currentTargetEl:b.currentTarget})) : a.Events.fire(this, {type:a.TouchElement.EventTypes.onTouch, target:this, point:this.touchEndPoint, action:a.TouchElement.ActionTypes.tap, targetEl:b.target, currentTargetEl:b.currentTarget});
	}, onTouchStart:function (b) {
		this.captureSettings.preventDefaultTouchEvents && b.preventDefault();
		a.Events.remove(this.el, "mousedown", this.mouseDownHandler);
		var d = a.Events.getTouchEvent(b).touches;
		d.length > 1 && this.captureSettings.gesture ? this.isGesture = !0 : (this.touchStartTime = new Date, this.isGesture = !1, this.touchStartPoint = this.getTouchPoint(d), a.Events.fire(this, {type:a.TouchElement.EventTypes.onTouch, target:this, action:a.TouchElement.ActionTypes.touchStart, point:this.touchStartPoint, targetEl:b.target, currentTargetEl:b.currentTarget}));
	}, onTouchMove:function (b) {
		this.captureSettings.preventDefaultTouchEvents && b.preventDefault();
		if (!this.isGesture || !this.captureSettings.gesture) {
			var d = a.Events.getTouchEvent(b).touches;
			a.Events.fire(this, {type:a.TouchElement.EventTypes.onTouch, target:this, action:a.TouchElement.ActionTypes.touchMove, point:this.getTouchPoint(d), targetEl:b.target, currentTargetEl:b.currentTarget});
		}
	}, onTouchEnd:function (b) {
		if (!this.isGesture || !this.captureSettings.gesture) {
			this.captureSettings.preventDefaultTouchEvents && b.preventDefault();
			var d = a.Events.getTouchEvent(b);
			this.touchEndPoint = this.getTouchPoint(!a.isNothing(d.changedTouches) ? d.changedTouches : d.touches);
			a.Events.fire(this, {type:a.TouchElement.EventTypes.onTouch, target:this, action:a.TouchElement.ActionTypes.touchEnd, point:this.touchEndPoint, targetEl:b.target, currentTargetEl:b.currentTarget});
			this.fireTouchEvent(b);
		}
	}, onMouseDown:function (b) {
		b.preventDefault();
		a.Events.remove(this.el, "touchstart", this.mouseDownHandler);
		a.Events.remove(this.el, "touchmove", this.touchMoveHandler);
		a.Events.remove(this.el, "touchend", this.touchEndHandler);
		this.captureSettings.move && a.Events.add(this.el, "mousemove", this.mouseMoveHandler);
		a.Events.add(this.el, "mouseup", this.mouseUpHandler);
		a.Events.add(this.el, "mouseout", this.mouseOutHandler);
		this.touchStartTime = new Date;
		this.isGesture = !1;
		this.touchStartPoint = a.Events.getMousePosition(b);
		a.Events.fire(this, {type:a.TouchElement.EventTypes.onTouch, target:this, action:a.TouchElement.ActionTypes.touchStart, point:this.touchStartPoint, targetEl:b.target, currentTargetEl:b.currentTarget});
	}, onMouseMove:function (b) {
		b.preventDefault();
		a.Events.fire(this, {type:a.TouchElement.EventTypes.onTouch, target:this, action:a.TouchElement.ActionTypes.touchMove, point:a.Events.getMousePosition(b), targetEl:b.target, currentTargetEl:b.currentTarget});
	}, onMouseUp:function (b) {
		b.preventDefault();
		this.captureSettings.move && a.Events.remove(this.el, "mousemove", this.mouseMoveHandler);
		a.Events.remove(this.el, "mouseup", this.mouseUpHandler);
		a.Events.remove(this.el, "mouseout", this.mouseOutHandler);
		this.touchEndPoint = a.Events.getMousePosition(b);
		a.Events.fire(this, {type:a.TouchElement.EventTypes.onTouch, target:this, action:a.TouchElement.ActionTypes.touchEnd, point:this.touchEndPoint, targetEl:b.target, currentTargetEl:b.currentTarget});
		this.fireTouchEvent(b);
	}, onMouseOut:function (b) {
		var d = b.relatedTarget;
		if (!(this.el === d || a.DOM.isChildOf(d, this.el))) {
			b.preventDefault(), this.captureSettings.move && a.Events.remove(this.el, "mousemove", this.mouseMoveHandler), a.Events.remove(this.el, "mouseup", this.mouseUpHandler), a.Events.remove(this.el, "mouseout", this.mouseOutHandler), this.touchEndPoint = a.Events.getMousePosition(b), a.Events.fire(this, {type:a.TouchElement.EventTypes.onTouch, target:this, action:a.TouchElement.ActionTypes.touchEnd, point:this.touchEndPoint, targetEl:b.target, currentTargetEl:b.currentTarget}), this.fireTouchEvent(b);
		}
	}, onGestureStart:function (b) {
		b.preventDefault();
		var d = a.Events.getTouchEvent(b);
		a.Events.fire(this, {type:a.TouchElement.EventTypes.onTouch, target:this, action:a.TouchElement.ActionTypes.gestureStart, scale:d.scale, rotation:d.rotation, targetEl:b.target, currentTargetEl:b.currentTarget});
	}, onGestureChange:function (b) {
		b.preventDefault();
		var d = a.Events.getTouchEvent(b);
		a.Events.fire(this, {type:a.TouchElement.EventTypes.onTouch, target:this, action:a.TouchElement.ActionTypes.gestureChange, scale:d.scale, rotation:d.rotation, targetEl:b.target, currentTargetEl:b.currentTarget});
	}, onGestureEnd:function (b) {
		b.preventDefault();
		var d = a.Events.getTouchEvent(b);
		a.Events.fire(this, {type:a.TouchElement.EventTypes.onTouch, target:this, action:a.TouchElement.ActionTypes.gestureEnd, scale:d.scale, rotation:d.rotation, targetEl:b.target, currentTargetEl:b.currentTarget});
	}});
})(window, window.klass, window.Code.Util);
(function (e, c, a) {
	a.registerNamespace("Code.PhotoSwipe.Image");
	e.Code.PhotoSwipe.Image.EventTypes = {onLoad:"onLoad", onError:"onError"};
})(window, window.klass, window.Code.Util);
(function (e, c, a) {
	a.registerNamespace("Code.PhotoSwipe.Image");
	var b = e.Code.PhotoSwipe;
	b.Image.ImageClass = c({refObj:null, imageEl:null, src:null, caption:null, metaData:null, imageLoadHandler:null, imageErrorHandler:null, dispose:function () {
		var d;
		this.shrinkImage();
		for (d in this) {
			a.objectHasProperty(this, d) && (this[d] = null);
		}
	}, initialize:function (a, b, c, h) {
		this.refObj = a;
		this.src = this.originalSrc = b;
		this.caption = c;
		this.metaData = h;
		this.imageEl = new e.Image;
		this.imageLoadHandler = this.onImageLoad.bind(this);
		this.imageErrorHandler = this.onImageError.bind(this);
	}, load:function () {
		this.imageEl.originalSrc = a.coalesce(this.imageEl.originalSrc, "");
		this.imageEl.originalSrc === this.src ? this.imageEl.isError ? a.Events.fire(this, {type:b.Image.EventTypes.onError, target:this}) : a.Events.fire(this, {type:b.Image.EventTypes.onLoad, target:this}) : (this.imageEl.isError = !1, this.imageEl.isLoading = !0, this.imageEl.naturalWidth = null, this.imageEl.naturalHeight = null, this.imageEl.isLandscape = !1, this.imageEl.onload = this.imageLoadHandler, this.imageEl.onerror = this.imageErrorHandler, this.imageEl.onabort = this.imageErrorHandler, this.imageEl.originalSrc = this.src, this.imageEl.src = this.src);
	}, shrinkImage:function () {
		if (!a.isNothing(this.imageEl) && this.imageEl.src.indexOf(this.src) > -1) {
			this.imageEl.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=", a.isNothing(this.imageEl.parentNode) || a.DOM.removeChild(this.imageEl, this.imageEl.parentNode);
		}
	}, onImageLoad:function () {
		this.imageEl.onload = null;
		this.imageEl.naturalWidth = a.coalesce(this.imageEl.naturalWidth, this.imageEl.width);
		this.imageEl.naturalHeight = a.coalesce(this.imageEl.naturalHeight, this.imageEl.height);
		this.imageEl.isLandscape = this.imageEl.naturalWidth > this.imageEl.naturalHeight;
		this.imageEl.isLoading = !1;
		a.Events.fire(this, {type:b.Image.EventTypes.onLoad, target:this});
	}, onImageError:function () {
		this.imageEl.onload = null;
		this.imageEl.onerror = null;
		this.imageEl.onabort = null;
		this.imageEl.isLoading = !1;
		this.imageEl.isError = !0;
		a.Events.fire(this, {type:b.Image.EventTypes.onError, target:this});
	}});
})(window, window.klass, window.Code.Util);
(function (e, c, a) {
	a.registerNamespace("Code.PhotoSwipe.Cache");
	e = e.Code.PhotoSwipe;
	e.Cache.Mode = {normal:"normal", aggressive:"aggressive"};
	e.Cache.Functions = {getImageSource:function (a) {
		return a.href;
	}, getImageCaption:function (b) {
		if (b.nodeName === "IMG") {
			return a.DOM.getAttribute(b, "alt");
		}
		var d, f, c;
		d = 0;
		for (f = b.childNodes.length; d < f; d++) {
			if (c = b.childNodes[d], b.childNodes[d].nodeName === "IMG") {
				return a.DOM.getAttribute(c, "alt");
			}
		}
	}, getImageMetaData:function () {
		return {};
	}};
})(window, window.klass, window.Code.Util);
(function (e, c, a) {
	a.registerNamespace("Code.PhotoSwipe.Cache");
	var b = e.Code.PhotoSwipe;
	b.Cache.CacheClass = c({images:null, settings:null, dispose:function () {
		var b, f, c;
		if (!a.isNothing(this.images)) {
			f = 0;
			for (c = this.images.length; f < c; f++) {
				this.images[f].dispose();
			}
			this.images.length = 0;
		}
		for (b in this) {
			a.objectHasProperty(this, b) && (this[b] = null);
		}
	}, initialize:function (a, f) {
		var c, e, j, i, l, k;
		this.settings = f;
		this.images = [];
		c = 0;
		for (e = a.length; c < e; c++) {
			j = a[c], i = this.settings.getImageSource(j), l = this.settings.getImageCaption(j), k = this.settings.getImageMetaData(j), this.images.push(new b.Image.ImageClass(j, i, l, k));
		}
	}, getImages:function (d) {
		var f, c, e = [], j;
		f = 0;
		for (c = d.length; f < c; f++) {
			j = this.images[d[f]];
			if (this.settings.cacheMode === b.Cache.Mode.aggressive) {
				j.cacheDoNotShrink = !0;
			}
			e.push(j);
		}
		if (this.settings.cacheMode === b.Cache.Mode.aggressive) {
			f = 0;
			for (c = this.images.length; f < c; f++) {
				j = this.images[f], a.objectHasProperty(j, "cacheDoNotShrink") ? delete j.cacheDoNotShrink : j.shrinkImage();
			}
		}
		return e;
	}});
})(window, window.klass, window.Code.Util, window.Code.PhotoSwipe.Image);
(function (e, c, a) {
	a.registerNamespace("Code.PhotoSwipe.DocumentOverlay");
	e.Code.PhotoSwipe.DocumentOverlay.CssClasses = {documentOverlay:"ps-document-overlay"};
})(window, window.klass, window.Code.Util);
(function (e, c, a) {
	a.registerNamespace("Code.PhotoSwipe.DocumentOverlay");
	var b = e.Code.PhotoSwipe;
	b.DocumentOverlay.DocumentOverlayClass = c({el:null, settings:null, initialBodyHeight:null, dispose:function () {
		var b;
		a.Animation.stop(this.el);
		a.DOM.removeChild(this.el, this.el.parentNode);
		for (b in this) {
			a.objectHasProperty(this, b) && (this[b] = null);
		}
	}, initialize:function (d) {
		this.settings = d;
		this.el = a.DOM.createElement("div", {"class":b.DocumentOverlay.CssClasses.documentOverlay}, "");
		a.DOM.setStyle(this.el, {display:"block", position:"absolute", left:0, top:0, zIndex:this.settings.zIndex});
		a.DOM.hide(this.el);
		this.settings.target === e ? a.DOM.appendToBody(this.el) : a.DOM.appendChild(this.el, this.settings.target);
		a.Animation.resetTranslate(this.el);
		this.initialBodyHeight = a.DOM.bodyOuterHeight();
	}, resetPosition:function () {
		var b, f, c;
		if (this.settings.target === e) {
			b = a.DOM.windowWidth();
			f = a.DOM.bodyOuterHeight() * 2;
			c = this.settings.jQueryMobile ? a.DOM.windowScrollTop() + "px" : "0px";
			if (f < 1) {
				f = this.initialBodyHeight;
			}
			a.DOM.windowHeight() > f && (f = a.DOM.windowHeight());
		} else {
			b = a.DOM.width(this.settings.target), f = a.DOM.height(this.settings.target), c = "0px";
		}
		a.DOM.setStyle(this.el, {width:b, height:f, top:c});
	}, fadeIn:function (b, f) {
		this.resetPosition();
		a.DOM.setStyle(this.el, "opacity", 0);
		a.DOM.show(this.el);
		a.Animation.fadeIn(this.el, b, f);
	}});
})(window, window.klass, window.Code.Util);
(function (e, c, a) {
	a.registerNamespace("Code.PhotoSwipe.Carousel");
	e = e.Code.PhotoSwipe;
	e.Carousel.EventTypes = {onSlideByEnd:"PhotoSwipeCarouselOnSlideByEnd", onSlideshowStart:"PhotoSwipeCarouselOnSlideshowStart", onSlideshowStop:"PhotoSwipeCarouselOnSlideshowStop"};
	e.Carousel.CssClasses = {carousel:"ps-carousel", content:"ps-carousel-content", item:"ps-carousel-item", itemLoading:"ps-carousel-item-loading", itemError:"ps-carousel-item-error"};
	e.Carousel.SlideByAction = {previous:"previous", current:"current", next:"next"};
})(window, window.klass, window.Code.Util);
(function (e, c, a) {
	a.registerNamespace("Code.PhotoSwipe.Carousel");
	var b = e.Code.PhotoSwipe;
	b.Carousel.CarouselClass = c({el:null, contentEl:null, settings:null, cache:null, slideByEndHandler:null, currentCacheIndex:null, isSliding:null, isSlideshowActive:null, lastSlideByAction:null, touchStartPoint:null, touchStartPosition:null, imageLoadHandler:null, imageErrorHandler:null, slideshowTimeout:null, dispose:function () {
		var d, f, c;
		f = 0;
		for (c = this.cache.images.length; f < c; f++) {
			a.Events.remove(this.cache.images[f], b.Image.EventTypes.onLoad, this.imageLoadHandler), a.Events.remove(this.cache.images[f], b.Image.EventTypes.onError, this.imageErrorHandler);
		}
		this.stopSlideshow();
		a.Animation.stop(this.el);
		a.DOM.removeChild(this.el, this.el.parentNode);
		for (d in this) {
			a.objectHasProperty(this, d) && (this[d] = null);
		}
	}, initialize:function (d, f) {
		var c, h, j;
		this.cache = d;
		this.settings = f;
		this.slideByEndHandler = this.onSlideByEnd.bind(this);
		this.imageLoadHandler = this.onImageLoad.bind(this);
		this.imageErrorHandler = this.onImageError.bind(this);
		this.currentCacheIndex = 0;
		this.isSlideshowActive = this.isSliding = !1;
		if (this.cache.images.length < 3) {
			this.settings.loop = !1;
		}
		this.el = a.DOM.createElement("div", {"class":b.Carousel.CssClasses.carousel}, "");
		a.DOM.setStyle(this.el, {display:"block", position:"absolute", left:0, top:0, overflow:"hidden", zIndex:this.settings.zIndex});
		a.DOM.hide(this.el);
		this.contentEl = a.DOM.createElement("div", {"class":b.Carousel.CssClasses.content}, "");
		a.DOM.setStyle(this.contentEl, {display:"block", position:"absolute", left:0, top:'-25px'});
		a.DOM.appendChild(this.contentEl, this.el);
		h = d.images.length < 3 ? d.images.length : 3;
		for (c = 0; c < h; c++) {
			j = a.DOM.createElement("div", {"class":b.Carousel.CssClasses.item + " " + b.Carousel.CssClasses.item + "-" + c}, ""), a.DOM.setAttribute(j, "style", "float: left;"), a.DOM.setStyle(j, {display:"block", position:"relative", left:0, top:0, overflow:"hidden"}), this.settings.margin > 0 && a.DOM.setStyle(j, {marginRight:this.settings.margin + "px"}), a.DOM.appendChild(j, this.contentEl);
		}
		this.settings.target === e ? a.DOM.appendToBody(this.el) : a.DOM.appendChild(this.el, this.settings.target);
	}, resetPosition:function () {
		var d, f, c, h, j, i;
		this.settings.target === e ? (d = a.DOM.windowWidth(), f = a.DOM.windowHeight(), c = a.DOM.windowScrollTop() + "px") : (d = a.DOM.width(this.settings.target), f = a.DOM.height(this.settings.target), c = "0px");
		h = this.settings.margin > 0 ? d + this.settings.margin : d;
		j = a.DOM.find("." + b.Carousel.CssClasses.item, this.contentEl);
		h *= j.length;
		a.DOM.setStyle(this.el, {top:c, width:d, height:f});
		a.DOM.setStyle(this.contentEl, {width:h, height:f});
		c = 0;
		for (h = j.length; c < h; c++) {
			i = j[c], a.DOM.setStyle(i, {width:d, height:f}), i = a.DOM.find("img", i)[0], a.isNothing(i) || this.resetImagePosition(i);
		}
		this.setContentLeftPosition();
	}, resetImagePosition:function (b) {
		if (!a.isNothing(b)) {
			a.DOM.getAttribute(b, "src");
			var c, e, h, j = a.DOM.width(this.el), i = a.DOM.height(this.el);
			this.settings.imageScaleMethod === "fitNoUpscale" ? (e = b.naturalWidth, h = b.naturalHeight, e > j && (c = j / e, e = Math.round(e * c), h = Math.round(h * c)), h > i && (c = i / h, h = Math.round(h * c), e = Math.round(e * c))) : (c = b.isLandscape ? j / b.naturalWidth : i / b.naturalHeight, e = Math.round(b.naturalWidth * c), h = Math.round(b.naturalHeight * c), this.settings.imageScaleMethod === "zoom" ? (c = 1, h < i ? c = i / h : e < j && (c = j / e), c !== 1 && (e = Math.round(e * c), h = Math.round(h * c))) : this.settings.imageScaleMethod === "fit" && (c = 1, e > j ? c = j / e : h > i && (c = i / h), c !== 1 && (e = Math.round(e * c), h = Math.round(h * c))));
			a.DOM.setStyle(b, {position:"absolute", width:e, height:h, top:Math.round((i - h) / 2) + "px", left:Math.round((j - e) / 2) + "px", display:"block"});
		}
	}, setContentLeftPosition:function () {
		var b, c, g;
		b = this.settings.target === e ? a.DOM.windowWidth() : a.DOM.width(this.settings.target);
		c = this.getItemEls();
		g = 0;
		this.settings.loop ? g = (b + this.settings.margin) * -1 : this.currentCacheIndex === this.cache.images.length - 1 ? g = (c.length - 1) * (b + this.settings.margin) * -1 : this.currentCacheIndex > 0 && (g = (b + this.settings.margin) * -1);
		a.DOM.setStyle(this.contentEl, {left:g + "px"});
	}, show:function (d) {
		this.currentCacheIndex = d;
		this.resetPosition();
		this.setImages(!1);
		a.DOM.show(this.el);
		a.Animation.resetTranslate(this.contentEl);
		var d = this.getItemEls(), c, e;
		c = 0;
		for (e = d.length; c < e; c++) {
			a.Animation.resetTranslate(d[c]);
		}
		a.Events.fire(this, {type:b.Carousel.EventTypes.onSlideByEnd, target:this, action:b.Carousel.SlideByAction.current, cacheIndex:this.currentCacheIndex});
	}, setImages:function (a) {
		var b, c = this.getItemEls();
		b = this.currentCacheIndex + 1;
		var e = this.currentCacheIndex - 1;
		this.settings.loop ? (b > this.cache.images.length - 1 && (b = 0), e < 0 && (e = this.cache.images.length - 1), b = this.cache.getImages([e, this.currentCacheIndex, b]), a || this.addCacheImageToItemEl(b[1], c[1]), this.addCacheImageToItemEl(b[2], c[2]), this.addCacheImageToItemEl(b[0], c[0])) : c.length === 1 ? a || (b = this.cache.getImages([this.currentCacheIndex]), this.addCacheImageToItemEl(b[0], c[0])) : c.length === 2 ? this.currentCacheIndex === 0 ? (b = this.cache.getImages([this.currentCacheIndex, this.currentCacheIndex + 1]), a || this.addCacheImageToItemEl(b[0], c[0]), this.addCacheImageToItemEl(b[1], c[1])) : (b = this.cache.getImages([this.currentCacheIndex - 1, this.currentCacheIndex]), a || this.addCacheImageToItemEl(b[1], c[1]), this.addCacheImageToItemEl(b[0], c[0])) : this.currentCacheIndex === 0 ? (b = this.cache.getImages([this.currentCacheIndex, this.currentCacheIndex + 1, this.currentCacheIndex + 2]), a || this.addCacheImageToItemEl(b[0], c[0]), this.addCacheImageToItemEl(b[1], c[1]), this.addCacheImageToItemEl(b[2], c[2])) : (this.currentCacheIndex === this.cache.images.length - 1 ? (b = this.cache.getImages([this.currentCacheIndex - 2, this.currentCacheIndex - 1, this.currentCacheIndex]), a || this.addCacheImageToItemEl(b[2], c[2]), this.addCacheImageToItemEl(b[1], c[1])) : (b = this.cache.getImages([this.currentCacheIndex - 1, this.currentCacheIndex, this.currentCacheIndex + 1]), a || this.addCacheImageToItemEl(b[1], c[1]), this.addCacheImageToItemEl(b[2], c[2])), this.addCacheImageToItemEl(b[0], c[0]));
	}, addCacheImageToItemEl:function (d, c) {
		a.DOM.removeClass(c, b.Carousel.CssClasses.itemError);
		a.DOM.addClass(c, b.Carousel.CssClasses.itemLoading);
		a.DOM.removeChildren(c);
		a.DOM.setStyle(d.imageEl, {display:"none"});
		a.DOM.appendChild(d.imageEl, c);
		a.Animation.resetTranslate(d.imageEl);
		a.Events.add(d, b.Image.EventTypes.onLoad, this.imageLoadHandler);
		a.Events.add(d, b.Image.EventTypes.onError, this.imageErrorHandler);
		d.load();
	}, slideCarousel:function (d, c, g) {
		if (!this.isSliding) {
			var h, j;
			h = this.settings.target === e ? a.DOM.windowWidth() + this.settings.margin : a.DOM.width(this.settings.target) + this.settings.margin;
			g = a.coalesce(g, this.settings.slideSpeed);
			if (!(e.Math.abs(j) < 1)) {
				switch (c) {
				  case a.TouchElement.ActionTypes.swipeLeft:
					d = h * -1;
					break;
				  case a.TouchElement.ActionTypes.swipeRight:
					d = h;
					break;
				  default:
					j = d.x - this.touchStartPoint.x, d = e.Math.abs(j) > h / 2 ? j > 0 ? h : h * -1 : 0;
				}
				this.lastSlideByAction = d < 0 ? b.Carousel.SlideByAction.next : d > 0 ? b.Carousel.SlideByAction.previous : b.Carousel.SlideByAction.current;
				if (!this.settings.loop && (this.lastSlideByAction === b.Carousel.SlideByAction.previous && this.currentCacheIndex === 0 || this.lastSlideByAction === b.Carousel.SlideByAction.next && this.currentCacheIndex === this.cache.images.length - 1)) {
					d = 0, this.lastSlideByAction = b.Carousel.SlideByAction.current;
				}
				this.isSliding = !0;
				this.doSlideCarousel(d, g);
			}
		}
	}, moveCarousel:function (a) {
		this.isSliding || this.settings.enableDrag && this.doMoveCarousel(a.x - this.touchStartPoint.x);
	}, getItemEls:function () {
		return a.DOM.find("." + b.Carousel.CssClasses.item, this.contentEl);
	}, previous:function () {
		this.stopSlideshow();
		this.slideCarousel({x:0, y:0}, a.TouchElement.ActionTypes.swipeRight, this.settings.nextPreviousSlideSpeed);
	}, next:function () {
		this.stopSlideshow();
		this.slideCarousel({x:0, y:0}, a.TouchElement.ActionTypes.swipeLeft, this.settings.nextPreviousSlideSpeed);
	}, slideshowNext:function () {
		this.slideCarousel({x:0, y:0}, a.TouchElement.ActionTypes.swipeLeft);
	}, startSlideshow:function () {
		this.stopSlideshow();
		this.isSlideshowActive = !0;
		this.slideshowTimeout = e.setTimeout(this.slideshowNext.bind(this), this.settings.slideshowDelay);
		a.Events.fire(this, {type:b.Carousel.EventTypes.onSlideshowStart, target:this});
	}, stopSlideshow:function () {
		if (!a.isNothing(this.slideshowTimeout)) {
			e.clearTimeout(this.slideshowTimeout), this.slideshowTimeout = null, this.isSlideshowActive = !1, a.Events.fire(this, {type:b.Carousel.EventTypes.onSlideshowStop, target:this});
		}
	}, onSlideByEnd:function () {
		if (!a.isNothing(this.isSliding)) {
			var d = this.getItemEls();
			this.isSliding = !1;
			this.lastSlideByAction === b.Carousel.SlideByAction.next ? this.currentCacheIndex += 1 : this.lastSlideByAction === b.Carousel.SlideByAction.previous && (this.currentCacheIndex -= 1);
			if (this.settings.loop) {
				if (this.lastSlideByAction === b.Carousel.SlideByAction.next ? a.DOM.appendChild(d[0], this.contentEl) : this.lastSlideByAction === b.Carousel.SlideByAction.previous && a.DOM.insertBefore(d[d.length - 1], d[0], this.contentEl), this.currentCacheIndex < 0) {
					this.currentCacheIndex = this.cache.images.length - 1;
				} else {
					if (this.currentCacheIndex === this.cache.images.length) {
						this.currentCacheIndex = 0;
					}
				}
			} else {
				this.cache.images.length > 3 && (this.currentCacheIndex > 1 && this.currentCacheIndex < this.cache.images.length - 2 ? this.lastSlideByAction === b.Carousel.SlideByAction.next ? a.DOM.appendChild(d[0], this.contentEl) : this.lastSlideByAction === b.Carousel.SlideByAction.previous && a.DOM.insertBefore(d[d.length - 1], d[0], this.contentEl) : this.currentCacheIndex === 1 ? this.lastSlideByAction === b.Carousel.SlideByAction.previous && a.DOM.insertBefore(d[d.length - 1], d[0], this.contentEl) : this.currentCacheIndex === this.cache.images.length - 2 && this.lastSlideByAction === b.Carousel.SlideByAction.next && a.DOM.appendChild(d[0], this.contentEl));
			}
			this.lastSlideByAction !== b.Carousel.SlideByAction.current && (this.setContentLeftPosition(), this.setImages(!0));
			a.Events.fire(this, {type:b.Carousel.EventTypes.onSlideByEnd, target:this, action:this.lastSlideByAction, cacheIndex:this.currentCacheIndex});
			this.isSlideshowActive && (this.lastSlideByAction !== b.Carousel.SlideByAction.current ? this.startSlideshow() : this.stopSlideshow());
		}
	}, onTouch:function (b, c) {
		this.stopSlideshow();
		switch (b) {
		  case a.TouchElement.ActionTypes.touchStart:
			this.touchStartPoint = c;
			this.touchStartPosition = {x:e.parseInt(a.DOM.getStyle(this.contentEl, "left"), 0), y:e.parseInt(a.DOM.getStyle(this.contentEl, "top"), 0)};
			break;
		  case a.TouchElement.ActionTypes.touchMove:
			this.moveCarousel(c);
			break;
		  case a.TouchElement.ActionTypes.touchMoveEnd:
		  case a.TouchElement.ActionTypes.swipeLeft:
		  case a.TouchElement.ActionTypes.swipeRight:
			this.slideCarousel(c, b);
		}
	}, onImageLoad:function (d) {
		d = d.target;
		a.isNothing(d.imageEl.parentNode) || (a.DOM.removeClass(d.imageEl.parentNode, b.Carousel.CssClasses.itemLoading), this.resetImagePosition(d.imageEl));
		a.Events.remove(d, b.Image.EventTypes.onLoad, this.imageLoadHandler);
		a.Events.remove(d, b.Image.EventTypes.onError, this.imageErrorHandler);
	}, onImageError:function (d) {
		d = d.target;
		a.isNothing(d.imageEl.parentNode) || (a.DOM.removeClass(d.imageEl.parentNode, b.Carousel.CssClasses.itemLoading), a.DOM.addClass(d.imageEl.parentNode, b.Carousel.CssClasses.itemError));
		a.Events.remove(d, b.Image.EventTypes.onLoad, this.imageLoadHandler);
		a.Events.remove(d, b.Image.EventTypes.onError, this.imageErrorHandler);
	}});
})(window, window.klass, window.Code.Util);
(function (e, c, a) {
	a.registerNamespace("Code.PhotoSwipe.Carousel");
	c = e.Code.PhotoSwipe;
	c.Carousel.CarouselClass = c.Carousel.CarouselClass.extend({getStartingPos:function () {
		var b = this.touchStartPosition;
		a.isNothing(b) && (b = {x:e.parseInt(a.DOM.getStyle(this.contentEl, "left"), 0), y:e.parseInt(a.DOM.getStyle(this.contentEl, "top"), 0)});
		return b;
	}, doMoveCarousel:function (b) {
		var d;
		a.Browser.isCSSTransformSupported ? (d = {}, d[a.Animation._transitionPrefix + "Property"] = "all", d[a.Animation._transitionPrefix + "Duration"] = "", d[a.Animation._transitionPrefix + "TimingFunction"] = "", d[a.Animation._transitionPrefix + "Delay"] = "0", d[a.Animation._transformLabel] = a.Browser.is3dSupported ? "translate3d(" + b + "px, 0px, 0px)" : "translate(" + b + "px, 0px)", a.DOM.setStyle(this.contentEl, d)) : a.isNothing(e.jQuery) || e.jQuery(this.contentEl).stop().css("left", this.getStartingPos().x + b + "px");
	}, doSlideCarousel:function (b, d) {
		var c;
		if (d <= 0) {
			this.slideByEndHandler();
		} else {
			if (a.Browser.isCSSTransformSupported) {
				c = a.coalesce(this.contentEl.style.webkitTransform, this.contentEl.style.MozTransform, this.contentEl.style.transform, ""), c.indexOf("translate3d(" + b) === 0 ? this.slideByEndHandler() : c.indexOf("translate(" + b) === 0 ? this.slideByEndHandler() : a.Animation.slideBy(this.contentEl, b, 0, d, this.slideByEndHandler, this.settings.slideTimingFunction);
			} else {
				if (!a.isNothing(e.jQuery)) {
					c = {left:this.getStartingPos().x + b + "px"};
					if (this.settings.animationTimingFunction === "ease-out") {
						this.settings.animationTimingFunction = "easeOutQuad";
					}
					if (a.isNothing(e.jQuery.easing[this.settings.animationTimingFunction])) {
						this.settings.animationTimingFunction = "linear";
					}
					e.jQuery(this.contentEl).animate(c, this.settings.slideSpeed, this.settings.animationTimingFunction, this.slideByEndHandler);
				}
			}
		}
	}});
})(window, window.klass, window.Code.Util, window.Code.PhotoSwipe.TouchElement);
(function (e, c, a) {
	a.registerNamespace("Code.PhotoSwipe.Toolbar");
	var b = e.Code.PhotoSwipe;
	b.Toolbar.CssClasses = {toolbar:"ps-toolbar", toolbarContent:"ps-toolbar-content", toolbarTop:"ps-toolbar-top", caption:"ps-caption", captionBottom:"ps-caption-bottom", captionContent:"ps-caption-content", close:"ps-toolbar-close", play:"ps-toolbar-play", previous:"ps-toolbar-previous", previousDisabled:"ps-toolbar-previous-disabled", next:"ps-toolbar-next", nextDisabled:"ps-toolbar-next-disabled"};
	b.Toolbar.ToolbarAction = {close:"close", play:"play", next:"next", previous:"previous", none:"none"};
	b.Toolbar.EventTypes = {onTap:"PhotoSwipeToolbarOnClick", onBeforeShow:"PhotoSwipeToolbarOnBeforeShow", onShow:"PhotoSwipeToolbarOnShow", onBeforeHide:"PhotoSwipeToolbarOnBeforeHide", onHide:"PhotoSwipeToolbarOnHide"};
	b.Toolbar.getToolbar = function () {
		return "<div class=\"" + b.Toolbar.CssClasses.close + "\"><div class=\"" + b.Toolbar.CssClasses.toolbarContent + "\"></div></div><div class=\"" + b.Toolbar.CssClasses.play + "\"><div class=\"" + b.Toolbar.CssClasses.toolbarContent + "\"></div></div><div class=\"" + b.Toolbar.CssClasses.previous + "\"><div class=\"" + b.Toolbar.CssClasses.toolbarContent + "\"></div></div><div class=\"" + b.Toolbar.CssClasses.next + "\"><div class=\"" + b.Toolbar.CssClasses.toolbarContent + "\"></div></div>";
	};
})(window, window.klass, window.Code.Util);
(function (e, c, a) {
	a.registerNamespace("Code.PhotoSwipe.Toolbar");
	var b = e.Code.PhotoSwipe;
	b.Toolbar.ToolbarClass = c({toolbarEl:null, closeEl:null, playEl:null, previousEl:null, nextEl:null, captionEl:null, captionContentEl:null, currentCaption:null, settings:null, cache:null, timeout:null, isVisible:null, fadeOutHandler:null, touchStartHandler:null, touchMoveHandler:null, clickHandler:null, dispose:function () {
		var b;
		this.clearTimeout();
		this.removeEventHandlers();
		a.Animation.stop(this.toolbarEl);
		a.Animation.stop(this.captionEl);
		a.DOM.removeChild(this.toolbarEl, this.toolbarEl.parentNode);
		a.DOM.removeChild(this.captionEl, this.captionEl.parentNode);
		for (b in this) {
			a.objectHasProperty(this, b) && (this[b] = null);
		}
	}, initialize:function (d, c) {
		var g;
		this.settings = c;
		this.cache = d;
		this.isVisible = !1;
		this.fadeOutHandler = this.onFadeOut.bind(this);
		this.touchStartHandler = this.onTouchStart.bind(this);
		this.touchMoveHandler = this.onTouchMove.bind(this);
		this.clickHandler = this.onClick.bind(this);
		g = b.Toolbar.CssClasses.toolbar;
		this.settings.captionAndToolbarFlipPosition && (g = g + " " + b.Toolbar.CssClasses.toolbarTop);
		this.toolbarEl = a.DOM.createElement("div", {"class":g}, this.settings.getToolbar());
		a.DOM.setStyle(this.toolbarEl, {left:0, position:"absolute", overflow:"hidden", zIndex:this.settings.zIndex});
		this.settings.target === e ? a.DOM.appendToBody(this.toolbarEl) : a.DOM.appendChild(this.toolbarEl, this.settings.target);
		a.DOM.hide(this.toolbarEl);
		this.closeEl = a.DOM.find("." + b.Toolbar.CssClasses.close, this.toolbarEl)[0];
		this.settings.preventHide && !a.isNothing(this.closeEl) && a.DOM.hide(this.closeEl);
		this.playEl = a.DOM.find("." + b.Toolbar.CssClasses.play, this.toolbarEl)[0];
		this.settings.preventSlideshow && !a.isNothing(this.playEl) && a.DOM.hide(this.playEl);
		this.nextEl = a.DOM.find("." + b.Toolbar.CssClasses.next, this.toolbarEl)[0];
		this.previousEl = a.DOM.find("." + b.Toolbar.CssClasses.previous, this.toolbarEl)[0];
		g = b.Toolbar.CssClasses.caption;
		this.settings.captionAndToolbarFlipPosition && (g = g + " " + b.Toolbar.CssClasses.captionBottom);
		this.captionEl = a.DOM.createElement("div", {"class":g}, "");
		a.DOM.setStyle(this.captionEl, {left:0, position:"absolute", overflow:"hidden", zIndex:this.settings.zIndex});
		this.settings.target === e ? a.DOM.appendToBody(this.captionEl) : a.DOM.appendChild(this.captionEl, this.settings.target);
		a.DOM.hide(this.captionEl);
		this.captionContentEl = a.DOM.createElement("div", {"class":b.Toolbar.CssClasses.captionContent}, "");
		a.DOM.appendChild(this.captionContentEl, this.captionEl);
		this.addEventHandlers();
	}, resetPosition:function () {
		var b, c, g;
		this.settings.target === e ? (this.settings.captionAndToolbarFlipPosition ? (c = a.DOM.windowScrollTop(), g = a.DOM.windowScrollTop() + a.DOM.windowHeight() - a.DOM.height(this.captionEl)) : (c = a.DOM.windowScrollTop() + a.DOM.windowHeight() - a.DOM.height(this.toolbarEl), g = a.DOM.windowScrollTop()), b = a.DOM.windowWidth()) : (this.settings.captionAndToolbarFlipPosition ? (c = "0", g = a.DOM.height(this.settings.target) - a.DOM.height(this.captionEl)) : (c = a.DOM.height(this.settings.target) - a.DOM.height(this.toolbarEl), g = 0), b = a.DOM.width(this.settings.target));
		a.DOM.setStyle(this.toolbarEl, {top:c + "px", width:b});
		a.DOM.setStyle(this.captionEl, {top:g + "px", width:b});
	}, toggleVisibility:function (a) {
		this.isVisible ? this.fadeOut() : this.show(a);
	}, show:function (d) {
		a.Animation.stop(this.toolbarEl);
		a.Animation.stop(this.captionEl);
		this.resetPosition();
		this.setToolbarStatus(d);
		a.Events.fire(this, {type:b.Toolbar.EventTypes.onBeforeShow, target:this});
		this.showToolbar();
		this.setCaption(d);
		this.showCaption();
		this.isVisible = !0;
		this.setTimeout();
		a.Events.fire(this, {type:b.Toolbar.EventTypes.onShow, target:this});
	}, setTimeout:function () {
		if (this.settings.captionAndToolbarAutoHideDelay > 0) {
			this.clearTimeout(), this.timeout = e.setTimeout(this.fadeOut.bind(this), this.settings.captionAndToolbarAutoHideDelay);
		}
	}, clearTimeout:function () {
		if (!a.isNothing(this.timeout)) {
			e.clearTimeout(this.timeout), this.timeout = null;
		}
	}, fadeOut:function () {
		this.clearTimeout();
		a.Events.fire(this, {type:b.Toolbar.EventTypes.onBeforeHide, target:this});
		a.Animation.fadeOut(this.toolbarEl, this.settings.fadeOutSpeed);
		a.Animation.fadeOut(this.captionEl, this.settings.fadeOutSpeed, this.fadeOutHandler);
		this.isVisible = !1;
	}, addEventHandlers:function () {
		a.Browser.isTouchSupported && (a.Browser.blackberry || a.Events.add(this.toolbarEl, "touchstart", this.touchStartHandler), a.Events.add(this.toolbarEl, "touchmove", this.touchMoveHandler), a.Events.add(this.captionEl, "touchmove", this.touchMoveHandler));
		a.Events.add(this.toolbarEl, "click", this.clickHandler);
	}, removeEventHandlers:function () {
		a.Browser.isTouchSupported && (a.Browser.blackberry || a.Events.remove(this.toolbarEl, "touchstart", this.touchStartHandler), a.Events.remove(this.toolbarEl, "touchmove", this.touchMoveHandler), a.Events.remove(this.captionEl, "touchmove", this.touchMoveHandler));
		a.Events.remove(this.toolbarEl, "click", this.clickHandler);
	}, handleTap:function (d) {
		this.clearTimeout();
		var c;
		if (d.target === this.nextEl || a.DOM.isChildOf(d.target, this.nextEl)) {
			c = b.Toolbar.ToolbarAction.next;
		} else {
			if (d.target === this.previousEl || a.DOM.isChildOf(d.target, this.previousEl)) {
				c = b.Toolbar.ToolbarAction.previous;
			} else {
				if (d.target === this.closeEl || a.DOM.isChildOf(d.target, this.closeEl)) {
					c = b.Toolbar.ToolbarAction.close;
				} else {
					if (d.target === this.playEl || a.DOM.isChildOf(d.target, this.playEl)) {
						c = b.Toolbar.ToolbarAction.play;
					}
				}
			}
		}
		this.setTimeout();
		if (a.isNothing(c)) {
			c = b.Toolbar.ToolbarAction.none;
		}
		a.Events.fire(this, {type:b.Toolbar.EventTypes.onTap, target:this, action:c, tapTarget:d.target});
	}, setCaption:function (b) {
		a.DOM.removeChildren(this.captionContentEl);
		this.currentCaption = a.coalesce(this.cache.images[b].caption, "\xa0");
		if (a.isObject(this.currentCaption)) {
			a.DOM.appendChild(this.currentCaption, this.captionContentEl);
		} else {
			if (this.currentCaption === "") {
				this.currentCaption = "\xa0";
			}
			a.DOM.appendText(this.currentCaption, this.captionContentEl);
		}
		this.currentCaption = this.currentCaption === "\xa0" ? "" : this.currentCaption;
		this.resetPosition();
	}, showToolbar:function () {
		a.DOM.setStyle(this.toolbarEl, {opacity:this.settings.captionAndToolbarOpacity});
		a.DOM.show(this.toolbarEl);
	}, showCaption:function () {
		(this.currentCaption === "" || this.captionContentEl.childNodes.length < 1) && !this.settings.captionAndToolbarShowEmptyCaptions ? a.DOM.hide(this.captionEl) : (a.DOM.setStyle(this.captionEl, {opacity:this.settings.captionAndToolbarOpacity}), a.DOM.show(this.captionEl));
	}, setToolbarStatus:function (d) {
		this.settings.loop || (a.DOM.removeClass(this.previousEl, b.Toolbar.CssClasses.previousDisabled), a.DOM.removeClass(this.nextEl, b.Toolbar.CssClasses.nextDisabled), d > 0 && d < this.cache.images.length - 1 || (d === 0 && (a.isNothing(this.previousEl) || a.DOM.addClass(this.previousEl, b.Toolbar.CssClasses.previousDisabled)), d === this.cache.images.length - 1 && (a.isNothing(this.nextEl) || a.DOM.addClass(this.nextEl, b.Toolbar.CssClasses.nextDisabled))));
	}, onFadeOut:function () {
		a.DOM.hide(this.toolbarEl);
		a.DOM.hide(this.captionEl);
		a.Events.fire(this, {type:b.Toolbar.EventTypes.onHide, target:this});
	}, onTouchStart:function (b) {
		b.preventDefault();
		a.Events.remove(this.toolbarEl, "click", this.clickHandler);
		this.handleTap(b);
	}, onTouchMove:function (a) {
		a.preventDefault();
	}, onClick:function (a) {
		a.preventDefault();
		this.handleTap(a);
	}});
})(window, window.klass, window.Code.Util);
(function (e, c, a) {
	a.registerNamespace("Code.PhotoSwipe.UILayer");
	e.Code.PhotoSwipe.UILayer.CssClasses = {uiLayer:"ps-uilayer"};
})(window, window.klass, window.Code.Util);
(function (e, c, a) {
	a.registerNamespace("Code.PhotoSwipe.UILayer");
	var b = e.Code.PhotoSwipe;
	b.UILayer.UILayerClass = a.TouchElement.TouchElementClass.extend({el:null, settings:null, dispose:function () {
		var b;
		this.removeEventHandlers();
		a.DOM.removeChild(this.el, this.el.parentNode);
		for (b in this) {
			a.objectHasProperty(this, b) && (this[b] = null);
		}
	}, initialize:function (d) {
		this.settings = d;
		this.el = a.DOM.createElement("div", {"class":b.UILayer.CssClasses.uiLayer}, "");
		a.DOM.setStyle(this.el, {display:"block", position:"absolute", left:0, top:0, overflow:"hidden", zIndex:this.settings.zIndex, opacity:0});
		a.DOM.hide(this.el);
		this.settings.target === e ? a.DOM.appendToBody(this.el) : a.DOM.appendChild(this.el, this.settings.target);
		this.supr(this.el, {swipe:!0, move:!0, gesture:a.Browser.iOS, doubleTap:!0, preventDefaultTouchEvents:this.settings.preventDefaultTouchEvents});
	}, resetPosition:function () {
		this.settings.target === e ? a.DOM.setStyle(this.el, {top:a.DOM.windowScrollTop() + "px", width:a.DOM.windowWidth(), height:a.DOM.windowHeight()}) : a.DOM.setStyle(this.el, {top:"0px", width:a.DOM.width(this.settings.target), height:a.DOM.height(this.settings.target)});
	}, show:function () {
		this.resetPosition();
		a.DOM.show(this.el);
		this.addEventHandlers();
	}, addEventHandlers:function () {
		this.supr();
	}, removeEventHandlers:function () {
		this.supr();
	}});
})(window, window.klass, window.Code.Util);
(function (e, c, a) {
	a.registerNamespace("Code.PhotoSwipe.ZoomPanRotate");
	e = e.Code.PhotoSwipe;
	e.ZoomPanRotate.CssClasses = {zoomPanRotate:"ps-zoom-pan-rotate"};
	e.ZoomPanRotate.EventTypes = {onTransform:"PhotoSwipeZoomPanRotateOnTransform"};
})(window, window.klass, window.Code.Util);
(function (e, c, a) {
	a.registerNamespace("Code.PhotoSwipe.ZoomPanRotate");
	var b = e.Code.PhotoSwipe;
	b.ZoomPanRotate.ZoomPanRotateClass = c({el:null, settings:null, containerEl:null, imageEl:null, transformSettings:null, panStartingPoint:null, transformEl:null, dispose:function () {
		var b;
		a.DOM.removeChild(this.el, this.el.parentNode);
		for (b in this) {
			a.objectHasProperty(this, b) && (this[b] = null);
		}
	}, initialize:function (c, f, g) {
		var h, j, i;
		this.settings = c;
		this.settings.target === e ? (c = document.body, h = a.DOM.windowWidth(), j = a.DOM.windowHeight(), i = a.DOM.windowScrollTop() + "px") : (c = this.settings.target, h = a.DOM.width(c), j = a.DOM.height(c), i = "0px");
		this.imageEl = f.imageEl.cloneNode(!1);
		a.DOM.setStyle(this.imageEl, {zIndex:1});
		this.transformSettings = {startingScale:1, scale:1, startingRotation:0, rotation:0, startingTranslateX:0, startingTranslateY:0, translateX:0, translateY:0};
		this.el = a.DOM.createElement("div", {"class":b.ZoomPanRotate.CssClasses.zoomPanRotate}, "");
		a.DOM.setStyle(this.el, {left:0, top:i, position:"absolute", width:h, height:j, zIndex:this.settings.zIndex, display:"block"});
		a.DOM.insertBefore(this.el, g.el, c);
		a.Browser.iOS ? (this.containerEl = a.DOM.createElement("div", "", ""), a.DOM.setStyle(this.containerEl, {left:0, top:0, width:h, height:j, position:"absolute", zIndex:1}), a.DOM.appendChild(this.imageEl, this.containerEl), a.DOM.appendChild(this.containerEl, this.el), a.Animation.resetTranslate(this.containerEl), a.Animation.resetTranslate(this.imageEl), this.transformEl = this.containerEl) : (a.DOM.appendChild(this.imageEl, this.el), this.transformEl = this.imageEl);
	}, setStartingTranslateFromCurrentTransform:function () {
		var b = a.coalesce(this.transformEl.style.webkitTransform, this.transformEl.style.MozTransform, this.transformEl.style.transform);
		if (!a.isNothing(b) && (b = b.match(/translate\((.*?)\)/), !a.isNothing(b))) {
			b = b[1].split(", "), this.transformSettings.startingTranslateX = e.parseInt(b[0], 10), this.transformSettings.startingTranslateY = e.parseInt(b[1], 10);
		}
	}, getScale:function (a) {
		a *= this.transformSettings.startingScale;
		if (this.settings.minUserZoom !== 0 && a < this.settings.minUserZoom) {
			a = this.settings.minUserZoom;
		} else {
			if (this.settings.maxUserZoom !== 0 && a > this.settings.maxUserZoom) {
				a = this.settings.maxUserZoom;
			}
		}
		return a;
	}, setStartingScaleAndRotation:function (a, b) {
		this.transformSettings.startingScale = this.getScale(a);
		this.transformSettings.startingRotation = (this.transformSettings.startingRotation + b) % 360;
	}, zoomRotate:function (a, b) {
		this.transformSettings.scale = this.getScale(a);
		this.transformSettings.rotation = this.transformSettings.startingRotation + b;
		this.applyTransform();
	}, panStart:function (a) {
		this.setStartingTranslateFromCurrentTransform();
		this.panStartingPoint = {x:a.x, y:a.y};
	}, pan:function (a) {
		var b = (a.y - this.panStartingPoint.y) / this.transformSettings.scale;
		this.transformSettings.translateX = this.transformSettings.startingTranslateX + (a.x - this.panStartingPoint.x) / this.transformSettings.scale;
		this.transformSettings.translateY = this.transformSettings.startingTranslateY + b;
		this.applyTransform();
	}, zoomAndPanToPoint:function (b, c) {
		if (this.settings.target === e) {
			this.panStart({x:a.DOM.windowWidth() / 2, y:a.DOM.windowHeight() / 2});
			var g = (c.y - this.panStartingPoint.y) / this.transformSettings.scale;
			this.transformSettings.translateX = (this.transformSettings.startingTranslateX + (c.x - this.panStartingPoint.x) / this.transformSettings.scale) * -1;
			this.transformSettings.translateY = (this.transformSettings.startingTranslateY + g) * -1;
		}
		this.setStartingScaleAndRotation(b, 0);
		this.transformSettings.scale = this.transformSettings.startingScale;
		this.transformSettings.rotation = 0;
		this.applyTransform();
	}, applyTransform:function () {
		var c = this.transformSettings.rotation % 360, f = e.parseInt(this.transformSettings.translateX, 10), g = e.parseInt(this.transformSettings.translateY, 10), h = "scale(" + this.transformSettings.scale + ") rotate(" + c + "deg) translate(" + f + "px, " + g + "px)";
		a.DOM.setStyle(this.transformEl, {webkitTransform:h, MozTransform:h, msTransform:h, transform:h});
		a.Events.fire(this, {target:this, type:b.ZoomPanRotate.EventTypes.onTransform, scale:this.transformSettings.scale, rotation:this.transformSettings.rotation, rotationDegs:c, translateX:f, translateY:g});
	}});
})(window, window.klass, window.Code.Util);
(function (e, c) {
	c.registerNamespace("Code.PhotoSwipe");
	var a = e.Code.PhotoSwipe;
	a.CssClasses = {buildingBody:"ps-building", activeBody:""};
	a.EventTypes = {onBeforeShow:"PhotoSwipeOnBeforeShow", onShow:"PhotoSwipeOnShow", onBeforeHide:"PhotoSwipeOnBeforeHide", onHide:"PhotoSwipeOnHide", onDisplayImage:"PhotoSwipeOnDisplayImage", onResetPosition:"PhotoSwipeOnResetPosition", onSlideshowStart:"PhotoSwipeOnSlideshowStart", onSlideshowStop:"PhotoSwipeOnSlideshowStop", onTouch:"PhotoSwipeOnTouch", onBeforeCaptionAndToolbarShow:"PhotoSwipeOnBeforeCaptionAndToolbarShow", onCaptionAndToolbarShow:"PhotoSwipeOnCaptionAndToolbarShow", onBeforeCaptionAndToolbarHide:"PhotoSwipeOnBeforeCaptionAndToolbarHide", onCaptionAndToolbarHide:"PhotoSwipeOnCaptionAndToolbarHide", onToolbarTap:"PhotoSwipeOnToolbarTap", onBeforeZoomPanRotateShow:"PhotoSwipeOnBeforeZoomPanRotateShow", onZoomPanRotateShow:"PhotoSwipeOnZoomPanRotateShow", onBeforeZoomPanRotateHide:"PhotoSwipeOnBeforeZoomPanRotateHide", onZoomPanRotateHide:"PhotoSwipeOnZoomPanRotateHide", onZoomPanRotateTransform:"PhotoSwipeOnZoomPanRotateTransform"};
	a.instances = [];
	a.activeInstances = [];
	a.setActivateInstance = function (b) {
		if (c.arrayIndexOf(b.settings.target, a.activeInstances, "target") > -1) {
			throw "Code.PhotoSwipe.activateInstance: Unable to active instance as another instance is already active for this target";
		}
		a.activeInstances.push({target:b.settings.target, instance:b});
	};
	a.unsetActivateInstance = function (b) {
		b = c.arrayIndexOf(b, a.activeInstances, "instance");
		a.activeInstances.splice(b, 1);
	};
	a.attach = function (b, d, e) {
		var g, h;
		g = a.createInstance(b, d, e);
		d = 0;
		for (e = b.length; d < e; d++) {
			if (h = b[d], !c.isNothing(h.nodeType) && h.nodeType === 1) {
				h.__photoSwipeClickHandler = a.onTriggerElementClick.bind(g), c.Events.remove(h, "click", h.__photoSwipeClickHandler), c.Events.add(h, "click", h.__photoSwipeClickHandler);
			}
		}
		return g;
	};
	if (e.jQuery) {
		e.jQuery.fn.photoSwipe = function (b, c) {
			return a.attach(this, b, c);
		};
	}
	a.detatch = function (b) {
		var d, e, g;
		d = 0;
		for (e = b.originalImages.length; d < e; d++) {
			g = b.originalImages[d], !c.isNothing(g.nodeType) && g.nodeType === 1 && (c.Events.remove(g, "click", g.__photoSwipeClickHandler), delete g.__photoSwipeClickHandler);
		}
		a.disposeInstance(b);
	};
	a.createInstance = function (b, d, e) {
		var g;
		if (c.isNothing(b)) {
			throw "Code.PhotoSwipe.attach: No images passed.";
		}
		if (!c.isLikeArray(b)) {
			throw "Code.PhotoSwipe.createInstance: Images must be an array of elements or image urls.";
		}
		if (b.length < 1) {
			throw "Code.PhotoSwipe.createInstance: No images to passed.";
		}
		d = c.coalesce(d, {});
		g = a.getInstance(e);
		if (c.isNothing(g)) {
			g = new a.PhotoSwipeClass(b, d, e), a.instances.push(g);
		} else {
			throw "Code.PhotoSwipe.createInstance: Instance with id \"" + e + " already exists.\"";
		}
		return g;
	};
	a.disposeInstance = function (b) {
		var c = a.getInstanceIndex(b);
		if (c < 0) {
			throw "Code.PhotoSwipe.disposeInstance: Unable to find instance to dispose.";
		}
		b.dispose();
		a.instances.splice(c, 1);
	};
	a.onTriggerElementClick = function (a) {
		a.preventDefault();
		this.show(a.currentTarget);
	};
	a.getInstance = function (b) {
		var c, e, g;
		c = 0;
		for (e = a.instances.length; c < e; c++) {
			if (g = a.instances[c], g.id === b) {
				return g;
			}
		}
		return null;
	};
	a.getInstanceIndex = function (b) {
		var c, e, g = -1;
		c = 0;
		for (e = a.instances.length; c < e; c++) {
			if (a.instances[c] === b) {
				g = c;
				break;
			}
		}
		return g;
	};
})(window, window.Code.Util);
(function (e, c, a, b, d, f, g, h, j) {
	a.registerNamespace("Code.PhotoSwipe");
	var i = e.Code.PhotoSwipe;
	i.PhotoSwipeClass = c({id:null, settings:null, isBackEventSupported:null, backButtonClicked:null, currentIndex:null, originalImages:null, mouseWheelStartTime:null, windowDimensions:null, cache:null, documentOverlay:null, carousel:null, uiLayer:null, toolbar:null, zoomPanRotate:null, windowOrientationChangeHandler:null, windowScrollHandler:null, windowHashChangeHandler:null, keyDownHandler:null, windowOrientationEventName:null, uiLayerTouchHandler:null, carouselSlideByEndHandler:null, carouselSlideshowStartHandler:null, carouselSlideshowStopHandler:null, toolbarTapHandler:null, toolbarBeforeShowHandler:null, toolbarShowHandler:null, toolbarBeforeHideHandler:null, toolbarHideHandler:null, mouseWheelHandler:null, zoomPanRotateTransformHandler:null, _isResettingPosition:null, _uiWebViewResetPositionTimeout:null, dispose:function () {
		var b;
		a.Events.remove(this, i.EventTypes.onBeforeShow);
		a.Events.remove(this, i.EventTypes.onShow);
		a.Events.remove(this, i.EventTypes.onBeforeHide);
		a.Events.remove(this, i.EventTypes.onHide);
		a.Events.remove(this, i.EventTypes.onDisplayImage);
		a.Events.remove(this, i.EventTypes.onResetPosition);
		a.Events.remove(this, i.EventTypes.onSlideshowStart);
		a.Events.remove(this, i.EventTypes.onSlideshowStop);
		a.Events.remove(this, i.EventTypes.onTouch);
		a.Events.remove(this, i.EventTypes.onBeforeCaptionAndToolbarShow);
		a.Events.remove(this, i.EventTypes.onCaptionAndToolbarShow);
		a.Events.remove(this, i.EventTypes.onBeforeCaptionAndToolbarHide);
		a.Events.remove(this, i.EventTypes.onCaptionAndToolbarHide);
		a.Events.remove(this, i.EventTypes.onZoomPanRotateTransform);
		this.removeEventHandlers();
		a.isNothing(this.documentOverlay) || this.documentOverlay.dispose();
		a.isNothing(this.carousel) || this.carousel.dispose();
		a.isNothing(this.uiLayer) || this.uiLayer.dispose();
		a.isNothing(this.toolbar) || this.toolbar.dispose();
		this.destroyZoomPanRotate();
		a.isNothing(this.cache) || this.cache.dispose();
		for (b in this) {
			a.objectHasProperty(this, b) && (this[b] = null);
		}
	}, initialize:function (c, d, f) {
		this.id = a.isNothing(f) ? "PhotoSwipe" + (new Date).getTime().toString() : f;
		this.originalImages = c;
		//if (a.Browser.android && !a.Browser.firefox && e.navigator.userAgent.match(/Android[\/\s](\d+.\d+)/).toString().replace(/^.*\,/, "") >= 2.1) {
			this.isBackEventSupported = !0;
		//}
		if (!this.isBackEventSupported) {
			this.isBackEventSupported = a.objectHasProperty(e, "onhashchange");
		}
		this.settings = {fadeInSpeed:250, fadeOutSpeed:250, preventHide:!1, preventSlideshow:!1, zIndex:1000, backButtonHideEnabled:!0, enableKeyboard:!0, enableMouseWheel:!0, mouseWheelSpeed:350, autoStartSlideshow:!1, jQueryMobile:!a.isNothing(e.jQuery) && !a.isNothing(e.jQuery.mobile), jQueryMobileDialogHash:"&ui-state=dialog", enableUIWebViewRepositionTimeout:!1, uiWebViewResetPositionDelay:500, target:e, preventDefaultTouchEvents:!0, loop:!0, slideSpeed:250, nextPreviousSlideSpeed:0, enableDrag:!0, swipeThreshold:50, swipeTimeThreshold:250, slideTimingFunction:"ease-out", slideshowDelay:3000, doubleTapSpeed:250, margin:20, imageScaleMethod:"fit", captionAndToolbarHide:!1, captionAndToolbarFlipPosition:!1, captionAndToolbarAutoHideDelay:5000, captionAndToolbarOpacity:0.8, captionAndToolbarShowEmptyCaptions:!0, getToolbar:i.Toolbar.getToolbar, allowUserZoom:!0, allowRotationOnUserZoom:!1, maxUserZoom:5, minUserZoom:0.5, doubleTapZoomLevel:2.5, getImageSource:i.Cache.Functions.getImageSource, getImageCaption:i.Cache.Functions.getImageCaption, getImageMetaData:i.Cache.Functions.getImageMetaData, cacheMode:i.Cache.Mode.normal};
		a.extend(this.settings, d);
		this.settings.target !== e && (d = a.DOM.getStyle(this.settings.target, "position"), (d !== "relative" || d !== "absolute") && a.DOM.setStyle(this.settings.target, "position", "relative"));
		if (this.settings.target !== e) {
			this.isBackEventSupported = !1, this.settings.backButtonHideEnabled = !1;
		} else {
			if (this.settings.preventHide) {
				this.settings.backButtonHideEnabled = !1;
			}
		}
		this.cache = new b.CacheClass(c, this.settings);
	}, show:function (b) {
		var c, d;
		this.backButtonClicked = this._isResettingPosition = !1;
		if (a.isNumber(b)) {
			this.currentIndex = b;
		} else {
			this.currentIndex = -1;
			c = 0;
			for (d = this.originalImages.length; c < d; c++) {
				if (this.originalImages[c] === b) {
					this.currentIndex = c;
					break;
				}
			}
		}
		if (this.currentIndex < 0 || this.currentIndex > this.originalImages.length - 1) {
			throw "Code.PhotoSwipe.PhotoSwipeClass.show: Starting index out of range";
		}
		this.isAlreadyGettingPage = this.getWindowDimensions();
		i.setActivateInstance(this);
		this.windowDimensions = this.getWindowDimensions();
		this.settings.target === e ? a.DOM.addClass(e.document.body, i.CssClasses.buildingBody) : a.DOM.addClass(this.settings.target, i.CssClasses.buildingBody);
		this.createComponents();
		a.Events.fire(this, {type:i.EventTypes.onBeforeShow, target:this});
		this.documentOverlay.fadeIn(this.settings.fadeInSpeed, this.onDocumentOverlayFadeIn.bind(this));
	}, getWindowDimensions:function () {
		return {width:a.DOM.windowWidth(), height:a.DOM.windowHeight()};
	}, createComponents:function () {
		this.documentOverlay = new d.DocumentOverlayClass(this.settings);
		this.carousel = new f.CarouselClass(this.cache, this.settings);
		this.uiLayer = new h.UILayerClass(this.settings);
		if (!this.settings.captionAndToolbarHide) {
			this.toolbar = new g.ToolbarClass(this.cache, this.settings);
		}
	}, resetPosition:function () {
		if (!this._isResettingPosition) {
			var b = this.getWindowDimensions();
			if (a.isNothing(this.windowDimensions) || !(b.width === this.windowDimensions.width && b.height === this.windowDimensions.height)) {
				this._isResettingPosition = !0, this.windowDimensions = b, this.destroyZoomPanRotate(), this.documentOverlay.resetPosition(), this.carousel.resetPosition(), a.isNothing(this.toolbar) || this.toolbar.resetPosition(), this.uiLayer.resetPosition(), this._isResettingPosition = !1, a.Events.fire(this, {type:i.EventTypes.onResetPosition, target:this});
			}
		}
	}, addEventHandler:function (b, c) {
		a.Events.add(this, b, c);
	}, addEventHandlers:function () {
		if (a.isNothing(this.windowOrientationChangeHandler)) {
			this.windowOrientationChangeHandler = this.onWindowOrientationChange.bind(this), this.windowScrollHandler = this.onWindowScroll.bind(this), this.keyDownHandler = this.onKeyDown.bind(this), this.windowHashChangeHandler = this.onWindowHashChange.bind(this), this.uiLayerTouchHandler = this.onUILayerTouch.bind(this), this.carouselSlideByEndHandler = this.onCarouselSlideByEnd.bind(this), this.carouselSlideshowStartHandler = this.onCarouselSlideshowStart.bind(this), this.carouselSlideshowStopHandler = this.onCarouselSlideshowStop.bind(this), this.toolbarTapHandler = this.onToolbarTap.bind(this), this.toolbarBeforeShowHandler = this.onToolbarBeforeShow.bind(this), this.toolbarShowHandler = this.onToolbarShow.bind(this), this.toolbarBeforeHideHandler = this.onToolbarBeforeHide.bind(this), this.toolbarHideHandler = this.onToolbarHide.bind(this), this.mouseWheelHandler = this.onMouseWheel.bind(this), this.zoomPanRotateTransformHandler = this.onZoomPanRotateTransform.bind(this);
		}
		a.Browser.android ? this.orientationEventName = "resize" : a.Browser.iOS && !a.Browser.safari ? a.Events.add(e.document.body, "orientationchange", this.windowOrientationChangeHandler) : this.orientationEventName = !a.isNothing(e.onorientationchange) ? "orientationchange" : "resize";
		a.isNothing(this.orientationEventName) || a.Events.add(e, this.orientationEventName, this.windowOrientationChangeHandler);
		this.settings.target === e && a.Events.add(e, "scroll", this.windowScrollHandler);
		this.settings.enableKeyboard && a.Events.add(e.document, "keydown", this.keyDownHandler);
		if (this.isBackEventSupported && this.settings.backButtonHideEnabled) {
			this.windowHashChangeHandler = this.onWindowHashChange.bind(this), this.settings.jQueryMobile ? e.location.hash = this.settings.jQueryMobileDialogHash : (this.currentHistoryHashValue = "PhotoSwipe" + (new Date).getTime().toString(), e.location.hash = this.currentHistoryHashValue), a.Events.add(e, "hashchange", this.windowHashChangeHandler);
		}
		this.settings.enableMouseWheel && a.Events.add(e, "mousewheel", this.mouseWheelHandler);
		a.Events.add(this.uiLayer, a.TouchElement.EventTypes.onTouch, this.uiLayerTouchHandler);
		a.Events.add(this.carousel, f.EventTypes.onSlideByEnd, this.carouselSlideByEndHandler);
		a.Events.add(this.carousel, f.EventTypes.onSlideshowStart, this.carouselSlideshowStartHandler);
		a.Events.add(this.carousel, f.EventTypes.onSlideshowStop, this.carouselSlideshowStopHandler);
		a.isNothing(this.toolbar) || (a.Events.add(this.toolbar, g.EventTypes.onTap, this.toolbarTapHandler), a.Events.add(this.toolbar, g.EventTypes.onBeforeShow, this.toolbarBeforeShowHandler), a.Events.add(this.toolbar, g.EventTypes.onShow, this.toolbarShowHandler), a.Events.add(this.toolbar, g.EventTypes.onBeforeHide, this.toolbarBeforeHideHandler), a.Events.add(this.toolbar, g.EventTypes.onHide, this.toolbarHideHandler));
	}, removeEventHandlers:function () {
		a.Browser.iOS && !a.Browser.safari && a.Events.remove(e.document.body, "orientationchange", this.windowOrientationChangeHandler);
		a.isNothing(this.orientationEventName) || a.Events.remove(e, this.orientationEventName, this.windowOrientationChangeHandler);
		a.Events.remove(e, "scroll", this.windowScrollHandler);
		this.settings.enableKeyboard && a.Events.remove(e.document, "keydown", this.keyDownHandler);
		this.isBackEventSupported && this.settings.backButtonHideEnabled && a.Events.remove(e, "hashchange", this.windowHashChangeHandler);
		this.settings.enableMouseWheel && a.Events.remove(e, "mousewheel", this.mouseWheelHandler);
		a.isNothing(this.uiLayer) || a.Events.remove(this.uiLayer, a.TouchElement.EventTypes.onTouch, this.uiLayerTouchHandler);
		a.isNothing(this.toolbar) || (a.Events.remove(this.carousel, f.EventTypes.onSlideByEnd, this.carouselSlideByEndHandler), a.Events.remove(this.carousel, f.EventTypes.onSlideshowStart, this.carouselSlideshowStartHandler), a.Events.remove(this.carousel, f.EventTypes.onSlideshowStop, this.carouselSlideshowStopHandler));
		a.isNothing(this.toolbar) || (a.Events.remove(this.toolbar, g.EventTypes.onTap, this.toolbarTapHandler), a.Events.remove(this.toolbar, g.EventTypes.onBeforeShow, this.toolbarBeforeShowHandler), a.Events.remove(this.toolbar, g.EventTypes.onShow, this.toolbarShowHandler), a.Events.remove(this.toolbar, g.EventTypes.onBeforeHide, this.toolbarBeforeHideHandler), a.Events.remove(this.toolbar, g.EventTypes.onHide, this.toolbarHideHandler));
	}, hide:function () {
		if (!this.settings.preventHide) {
			if (a.isNothing(this.documentOverlay)) {
				throw "Code.PhotoSwipe.PhotoSwipeClass.hide: PhotoSwipe instance is already hidden";
			}
			if (a.isNothing(this.hiding)) {
				this.clearUIWebViewResetPositionTimeout();
				this.destroyZoomPanRotate();
				this.removeEventHandlers();
				a.Events.fire(this, {type:i.EventTypes.onBeforeHide, target:this});
				this.uiLayer.dispose();
				this.uiLayer = null;
				if (!a.isNothing(this.toolbar)) {
					this.toolbar.dispose(), this.toolbar = null;
				}
				this.carousel.dispose();
				this.carousel = null;
				a.DOM.removeClass(e.document.body, i.CssClasses.activeBody);
				this.documentOverlay.dispose();
				this.documentOverlay = null;
				this._isResettingPosition = !1;
				i.unsetActivateInstance(this);
				a.Events.fire(this, {type:i.EventTypes.onHide, target:this});
				this.goBackInHistory();
			}
		}
	}, goBackInHistory:function () {
		this.isBackEventSupported && this.settings.backButtonHideEnabled && (this.backButtonClicked || e.history.back());
	}, play:function () {
		!this.isZoomActive() && !this.settings.preventSlideshow && !a.isNothing(this.carousel) && (!a.isNothing(this.toolbar) && this.toolbar.isVisible && this.toolbar.fadeOut(), this.carousel.startSlideshow());
	}, stop:function () {
		this.isZoomActive() || a.isNothing(this.carousel) || this.carousel.stopSlideshow();
	}, previous:function () {
		this.isZoomActive() || a.isNothing(this.carousel) || this.carousel.previous();
	}, next:function () {
		this.isZoomActive() || a.isNothing(this.carousel) || this.carousel.next();
	}, toggleToolbar:function () {
		this.isZoomActive() || a.isNothing(this.toolbar) || this.toolbar.toggleVisibility(this.currentIndex);
	}, fadeOutToolbarIfVisible:function () {
		!a.isNothing(this.toolbar) && this.toolbar.isVisible && this.settings.captionAndToolbarAutoHideDelay > 0 && this.toolbar.fadeOut();
	}, createZoomPanRotate:function () {
		this.stop();
		if (this.canUserZoom() && !this.isZoomActive()) {
			a.Events.fire(this, i.EventTypes.onBeforeZoomPanRotateShow), this.zoomPanRotate = new j.ZoomPanRotateClass(this.settings, this.cache.images[this.currentIndex], this.uiLayer), this.uiLayer.captureSettings.preventDefaultTouchEvents = !0, a.Events.add(this.zoomPanRotate, i.ZoomPanRotate.EventTypes.onTransform, this.zoomPanRotateTransformHandler), a.Events.fire(this, i.EventTypes.onZoomPanRotateShow), !a.isNothing(this.toolbar) && this.toolbar.isVisible && this.toolbar.fadeOut();
		}
	}, destroyZoomPanRotate:function () {
		if (!a.isNothing(this.zoomPanRotate)) {
			a.Events.fire(this, i.EventTypes.onBeforeZoomPanRotateHide), a.Events.remove(this.zoomPanRotate, i.ZoomPanRotate.EventTypes.onTransform, this.zoomPanRotateTransformHandler), this.zoomPanRotate.dispose(), this.zoomPanRotate = null, this.uiLayer.captureSettings.preventDefaultTouchEvents = this.settings.preventDefaultTouchEvents, a.Events.fire(this, i.EventTypes.onZoomPanRotateHide);
		}
	}, canUserZoom:function () {
		var b;
		if (a.Browser.msie) {
			if (b = document.createElement("div"), a.isNothing(b.style.msTransform)) {
				return !1;
			}
		} else {
			if (!a.Browser.isCSSTransformSupported) {
				return !1;
			}
		}
		if (!this.settings.allowUserZoom) {
			return !1;
		}
		if (this.carousel.isSliding) {
			return !1;
		}
		b = this.cache.images[this.currentIndex];
		if (a.isNothing(b)) {
			return !1;
		}
		if (b.isLoading) {
			return !1;
		}
		return !0;
	}, isZoomActive:function () {
		return !a.isNothing(this.zoomPanRotate);
	}, getCurrentImage:function () {
		return this.cache.images[this.currentIndex];
	}, onDocumentOverlayFadeIn:function () {
		e.setTimeout(function () {
			var b = this.settings.target === e ? e.document.body : this.settings.target;
			a.DOM.removeClass(b, i.CssClasses.buildingBody);
			a.DOM.addClass(b, i.CssClasses.activeBody);
			this.addEventHandlers();
			this.carousel.show(this.currentIndex);
			this.uiLayer.show();
			this.settings.autoStartSlideshow ? this.play() : a.isNothing(this.toolbar) || this.toolbar.show(this.currentIndex);
			a.Events.fire(this, {type:i.EventTypes.onShow, target:this});
			this.setUIWebViewResetPositionTimeout();
		}.bind(this), 250);
	}, setUIWebViewResetPositionTimeout:function () {
		if (this.settings.enableUIWebViewRepositionTimeout && a.Browser.iOS && !a.Browser.safari) {
			a.isNothing(this._uiWebViewResetPositionTimeout) || e.clearTimeout(this._uiWebViewResetPositionTimeout), this._uiWebViewResetPositionTimeout = e.setTimeout(function () {
				this.resetPosition();
				this.setUIWebViewResetPositionTimeout();
			}.bind(this), this.settings.uiWebViewResetPositionDelay);
		}
	}, clearUIWebViewResetPositionTimeout:function () {
		a.isNothing(this._uiWebViewResetPositionTimeout) || e.clearTimeout(this._uiWebViewResetPositionTimeout);
	}, onWindowScroll:function () {
		this.resetPosition();
	}, onWindowOrientationChange:function () {
		this.resetPosition();
	}, onWindowHashChange:function () {
		if (e.location.hash !== "#" + (this.settings.jQueryMobile ? this.settings.jQueryMobileDialogHash : this.currentHistoryHashValue)) {
			this.backButtonClicked = !0, this.hide();
		}
	}, onKeyDown:function (a) {
		a.keyCode === 37 ? (a.preventDefault(), this.previous()) : a.keyCode === 39 ? (a.preventDefault(), this.next()) : a.keyCode === 38 || a.keyCode === 40 ? a.preventDefault() : a.keyCode === 27 ? (a.preventDefault(), this.hide()) : a.keyCode === 32 ? (this.settings.hideToolbar ? this.hide() : this.toggleToolbar(), a.preventDefault()) : a.keyCode === 13 && (a.preventDefault(), this.play());
	}, onUILayerTouch:function (b) {
		if (this.isZoomActive()) {
			switch (b.action) {
			  case a.TouchElement.ActionTypes.gestureChange:
				this.zoomPanRotate.zoomRotate(b.scale, this.settings.allowRotationOnUserZoom ? b.rotation : 0);
				break;
			  case a.TouchElement.ActionTypes.gestureEnd:
				this.zoomPanRotate.setStartingScaleAndRotation(b.scale, this.settings.allowRotationOnUserZoom ? b.rotation : 0);
				break;
			  case a.TouchElement.ActionTypes.touchStart:
				this.zoomPanRotate.panStart(b.point);
				break;
			  case a.TouchElement.ActionTypes.touchMove:
				this.zoomPanRotate.pan(b.point);
				break;
			  case a.TouchElement.ActionTypes.doubleTap:
				this.destroyZoomPanRotate();
				this.toggleToolbar();
				break;
			  case a.TouchElement.ActionTypes.swipeLeft:
				this.destroyZoomPanRotate();
				this.next();
				this.toggleToolbar();
				break;
			  case a.TouchElement.ActionTypes.swipeRight:
				this.destroyZoomPanRotate(), this.previous(), this.toggleToolbar();
			}
		} else {
			switch (b.action) {
			  case a.TouchElement.ActionTypes.touchMove:
			  case a.TouchElement.ActionTypes.swipeLeft:
			  case a.TouchElement.ActionTypes.swipeRight:
				this.fadeOutToolbarIfVisible();
				this.carousel.onTouch(b.action, b.point);
				break;
			  case a.TouchElement.ActionTypes.touchStart:
			  case a.TouchElement.ActionTypes.touchMoveEnd:
				this.carousel.onTouch(b.action, b.point);
				break;
			  case a.TouchElement.ActionTypes.tap:
				this.toggleToolbar();
				break;
			  case a.TouchElement.ActionTypes.doubleTap:
				this.settings.target === e && (b.point.x -= a.DOM.windowScrollLeft(), b.point.y -= a.DOM.windowScrollTop());
				var c = this.cache.images[this.currentIndex].imageEl, d = e.parseInt(a.DOM.getStyle(c, "top"), 10), f = e.parseInt(a.DOM.getStyle(c, "left"), 10), g = f + a.DOM.width(c), c = d + a.DOM.height(c);
				if (b.point.x < f) {
					b.point.x = f;
				} else {
					if (b.point.x > g) {
						b.point.x = g;
					}
				}
				if (b.point.y < d) {
					b.point.y = d;
				} else {
					if (b.point.y > c) {
						b.point.y = c;
					}
				}
				this.createZoomPanRotate();
				this.isZoomActive() && this.zoomPanRotate.zoomAndPanToPoint(this.settings.doubleTapZoomLevel, b.point);
				break;
			  case a.TouchElement.ActionTypes.gestureStart:
				this.createZoomPanRotate();
			}
		}
		a.Events.fire(this, {type:i.EventTypes.onTouch, target:this, point:b.point, action:b.action});
	}, onCarouselSlideByEnd:function (b) {
		this.currentIndex = b.cacheIndex;
		//                    视频          全景       航拍       全景（老）            直播
		var $allButton = $('.vedio-icon, .icon-360, .icon-hp, #play_button_fullView, .xfl, #play_button');
		$allButton.css('z-index', '1100');
		if($('#img_'+this.currentIndex+' a').attr('vt') != undefined){
			// 视频
			$('#video_play_time').html($('#img_'+this.currentIndex+' a').attr('vp'));
			$('#video_time_len').html($('#img_'+this.currentIndex+' a').attr('vt'));

			$allButton.hide();
			$('.vedio-icon').attr('href','javascript:gotovideo(\''+$('#img_'+this.currentIndex+' a').attr('vid')+'\')').show();
			//视频标签显示
			$('.js_videoTitle').html($('#img_'+this.currentIndex+' a').attr('vtittle'));
			$('.js_videoTitle').parent().show();
		}else if($('#img_'+this.currentIndex+' a').attr('qid')) {
			// 全景看房
			$allButton.hide();
			$('.icon-360').attr('href','javascript:gotofullView(\''+$('#img_'+this.currentIndex+' a').attr('qid')+'\')').show();
		}else if ($('#img_'+this.currentIndex+' a').attr('xfl')) {
			// 直播添加标签
			$allButton.hide();
			$('#play_button').attr('href', $('div.xfl a').attr('href')).show();
			$('.xfl').show();
			$('.live-icon').css('top', ($(window).height() * 0.28 - 10) + 'px').on('click', function () {
				window.location.href =  $('.xfl a').attr('href')
			});
		}else if ($('#img_'+this.currentIndex+' a').attr('hpid')) {
			// 航拍
			$allButton.hide();
			$('.icon-hp').attr('href',$('#img_'+this.currentIndex+' a').attr('data-href')).show();
		} else {
			$allButton.hide();
			$('.js_videoTitle').parent().hide();
		}

		var imgtypesize = 0;
        $('#scroller a').each(function () {
            imgtypesize += 1;
        });
		for(var j=0;j<imgtypesize;j++){
			var ing_num = $('#item_'+j).attr('num').split("_");
			var begin = parseInt(ing_num[0]);
			var end = parseInt(ing_num[1]);
			if(this.currentIndex >= begin && this.currentIndex < end){
				$('#item_'+j).addClass('active');
			}else{
				$('#item_'+j).removeClass('active');
			}
		}
		var $btnZx = $('.btn-zx');
		// 户型图
        if ($('.active').html() == '户型图') {
			if($btnZx.length){
				$btnZx.hide();
			}
            if ($('#img_'+this.currentIndex+' a').attr('alt').indexOf('㎡') == -1) {
                // 改变右边小分数
                var fenZi = $('#img_'+this.currentIndex+' a').attr('alt').split('图')[1].split('/')[0];
                var fenMu = $('#img_'+this.currentIndex+' a').attr('alt').split('图')[1].split('/')[1];
                $('.flor').html('<span class=\"f14\">' + fenZi + '</span> / ' + fenMu);
                // 改变左边
                $('.flol').html($('#img_'+this.currentIndex+' a').attr('alt').split('图')[0] + '图');
            } else {
                var fenZi = $('#img_'+this.currentIndex+' a').attr('alt').split('㎡ ')[1].split('/')[0];
                var fenMu = $('#img_'+this.currentIndex+' a').attr('alt').split('㎡ ')[1].split('/')[1];
                // 右下角小分数
                $('.flor').html('<span class=\"f14\">' + fenZi + '</span> / ' + fenMu);
                // 左下角
                $('.flol').html($('#img_'+this.currentIndex+' a').attr('alt').split('㎡ ')[0] + '㎡（建筑面积）');
            }
        } else {
			if($('.active').html() == '装修案例' && $btnZx.length){
				$btnZx.show();
			}else{
				$btnZx.hide();
			}
            // 右下角小分数
            var picNum = $('#img_'+this.currentIndex+' a').attr('alt').replace(/[^\d\/]/g, '').split('/');
            $('.flor').html('<span class=\"f14\">' + picNum[0] + '</span> / ' + picNum[1]);
            // 左下角
            var picType = $('.active').html();
            $('.flol').html(picType);
        }

		a.isNothing(this.toolbar) || (this.toolbar.setCaption(this.currentIndex), this.toolbar.setToolbarStatus(this.currentIndex));
		a.Events.fire(this, {type:i.EventTypes.onDisplayImage, target:this, action:b.action, index:b.cacheIndex});
	}, onToolbarTap:function (b) {
		switch (b.action) {
		  case g.ToolbarAction.next:
			this.next();
			break;
		  case g.ToolbarAction.previous:
			this.previous();
			break;
		  case g.ToolbarAction.close:
			this.hide();
			break;
		  case g.ToolbarAction.play:
			this.play();
		}
		a.Events.fire(this, {type:i.EventTypes.onToolbarTap, target:this, toolbarAction:b.action, tapTarget:b.tapTarget});
	}, onMouseWheel:function (b) {
		var c = a.Events.getWheelDelta(b);
		if (!(b.timeStamp - (this.mouseWheelStartTime || 0) < this.settings.mouseWheelSpeed)) {
			this.mouseWheelStartTime = b.timeStamp, this.settings.invertMouseWheel && (c *= -1), c < 0 ? this.next() : c > 0 && this.previous();
		}
	}, onCarouselSlideshowStart:function () {
		a.Events.fire(this, {type:i.EventTypes.onSlideshowStart, target:this});
	}, onCarouselSlideshowStop:function () {
		a.Events.fire(this, {type:i.EventTypes.onSlideshowStop, target:this});
	}, onToolbarBeforeShow:function () {
		a.Events.fire(this, {type:i.EventTypes.onBeforeCaptionAndToolbarShow, target:this});
	}, onToolbarShow:function () {
		a.Events.fire(this, {type:i.EventTypes.onCaptionAndToolbarShow, target:this});
	}, onToolbarBeforeHide:function () {
		a.Events.fire(this, {type:i.EventTypes.onBeforeCaptionAndToolbarHide, target:this});
	}, onToolbarHide:function () {
		a.Events.fire(this, {type:i.EventTypes.onCaptionAndToolbarHide, target:this});
	}, onZoomPanRotateTransform:function (b) {
		a.Events.fire(this, {target:this, type:i.EventTypes.onZoomPanRotateTransform, scale:b.scale, rotation:b.rotation, rotationDegs:b.rotationDegs, translateX:b.translateX, translateY:b.translateY});
	},slideCarousel:function (b) {
		var c, d;
		this.backButtonClicked = this._isResettingPosition = !1;
		if (a.isNumber(b)) {
			this.currentIndex = b;
		} else {
			this.currentIndex = -1;
			c = 0;
			for (d = this.originalImages.length; c < d; c++) {
				if (this.originalImages[c] === b) {
					this.currentIndex = c;
					break;
				}
			}
		}
		if (this.currentIndex < 0 || this.currentIndex > this.originalImages.length - 1) {
			throw "Code.PhotoSwipe.PhotoSwipeClass.show: Starting index out of range";
		}
		//this.isAlreadyGettingPage = this.getWindowDimensions();
		//i.setActivateInstance(this);
		//this.windowDimensions = this.getWindowDimensions();
		//this.settings.target === e ? a.DOM.addClass(e.document.body, i.CssClasses.buildingBody) : a.DOM.addClass(this.settings.target, i.CssClasses.buildingBody);
		//a.Events.fire(this, {type:i.EventTypes.onBeforeShow, target:this});
		this.documentOverlay.fadeIn(this.settings.fadeInSpeed, this.onDocumentOverlayFadeIn.bind(this));
	}});
})(window, window.klass, window.Code.Util, window.Code.PhotoSwipe.Cache, window.Code.PhotoSwipe.DocumentOverlay, window.Code.PhotoSwipe.Carousel, window.Code.PhotoSwipe.Toolbar, window.Code.PhotoSwipe.UILayer, window.Code.PhotoSwipe.ZoomPanRotate);

