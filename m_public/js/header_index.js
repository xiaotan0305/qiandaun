/* Zepto v1.1.4 - zepto event ajax form ie - zeptojs.com/license */
var Zepto=function(){function L(t){return null==t?String(t):j[S.call(t)]||"object"}function Z(t){return"function"==L(t)}function $(t){return null!=t&&t==t.window}function _(t){return null!=t&&t.nodeType==t.DOCUMENT_NODE}function D(t){return"object"==L(t)}function R(t){return D(t)&&!$(t)&&Object.getPrototypeOf(t)==Object.prototype}function M(t){return"number"==typeof t.length}function k(t){return s.call(t,function(t){return null!=t})}function z(t){return t.length>0?n.fn.concat.apply([],t):t}function F(t){return t.replace(/::/g,"/").replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").replace(/_/g,"-").toLowerCase()}function q(t){return t in f?f[t]:f[t]=new RegExp("(^|\\s)"+t+"(\\s|$)")}function H(t,e){return"number"!=typeof e||c[F(t)]?e:e+"px"}function I(t){var e,n;return u[t]||(e=a.createElement(t),a.body.appendChild(e),n=getComputedStyle(e,"").getPropertyValue("display"),e.parentNode.removeChild(e),"none"==n&&(n="block"),u[t]=n),u[t]}function V(t){return"children"in t?o.call(t.children):n.map(t.childNodes,function(t){return 1==t.nodeType?t:void 0})}function B(n,i,r){for(e in i)r&&(R(i[e])||A(i[e]))?(R(i[e])&&!R(n[e])&&(n[e]={}),A(i[e])&&!A(n[e])&&(n[e]=[]),B(n[e],i[e],r)):i[e]!==t&&(n[e]=i[e])}function U(t,e){return null==e?n(t):n(t).filter(e)}function J(t,e,n,i){return Z(e)?e.call(t,n,i):e}function X(t,e,n){null==n?t.removeAttribute(e):t.setAttribute(e,n)}function W(e,n){var i=e.className,r=i&&i.baseVal!==t;return n===t?r?i.baseVal:i:void(r?i.baseVal=n:e.className=n)}function Y(t){var e;try{return t?"true"==t||("false"==t?!1:"null"==t?null:/^0/.test(t)||isNaN(e=Number(t))?/^[\[\{]/.test(t)?n.parseJSON(t):t:e):t}catch(i){return t}}function G(t,e){e(t);for(var n=0,i=t.childNodes.length;i>n;n++)G(t.childNodes[n],e)}var t,e,n,i,C,N,r=[],o=r.slice,s=r.filter,a=window.document,u={},f={},c={"column-count":1,columns:1,"font-weight":1,"line-height":1,opacity:1,"z-index":1,zoom:1},l=/^\s*<(\w+|!)[^>]*>/,h=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,p=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,d=/^(?:body|html)$/i,m=/([A-Z])/g,g=["val","css","html","text","data","width","height","offset"],v=["after","prepend","before","append"],y=a.createElement("table"),x=a.createElement("tr"),b={tr:a.createElement("tbody"),tbody:y,thead:y,tfoot:y,td:x,th:x,"*":a.createElement("div")},w=/complete|loaded|interactive/,E=/^[\w-]*$/,j={},S=j.toString,T={},O=a.createElement("div"),P={tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},A=Array.isArray||function(t){return t instanceof Array};return T.matches=function(t,e){if(!e||!t||1!==t.nodeType)return!1;var n=t.webkitMatchesSelector||t.mozMatchesSelector||t.oMatchesSelector||t.matchesSelector;if(n)return n.call(t,e);var i,r=t.parentNode,o=!r;return o&&(r=O).appendChild(t),i=~T.qsa(r,e).indexOf(t),o&&O.removeChild(t),i},C=function(t){return t.replace(/-+(.)?/g,function(t,e){return e?e.toUpperCase():""})},N=function(t){return s.call(t,function(e,n){return t.indexOf(e)==n})},T.fragment=function(e,i,r){var s,u,f;return h.test(e)&&(s=n(a.createElement(RegExp.$1))),s||(e.replace&&(e=e.replace(p,"<$1></$2>")),i===t&&(i=l.test(e)&&RegExp.$1),i in b||(i="*"),f=b[i],f.innerHTML=""+e,s=n.each(o.call(f.childNodes),function(){f.removeChild(this)})),R(r)&&(u=n(s),n.each(r,function(t,e){g.indexOf(t)>-1?u[t](e):u.attr(t,e)})),s},T.Z=function(t,e){return t=t||[],t.__proto__=n.fn,t.selector=e||"",t},T.isZ=function(t){return t instanceof T.Z},T.init=function(e,i){var r;if(!e)return T.Z();if("string"==typeof e)if(e=e.trim(),"<"==e[0]&&l.test(e))r=T.fragment(e,RegExp.$1,i),e=null;else{if(i!==t)return n(i).find(e);r=T.qsa(a,e)}else{if(Z(e))return n(a).ready(e);if(T.isZ(e))return e;if(A(e))r=k(e);else if(D(e))r=[e],e=null;else if(l.test(e))r=T.fragment(e.trim(),RegExp.$1,i),e=null;else{if(i!==t)return n(i).find(e);r=T.qsa(a,e)}}return T.Z(r,e)},n=function(t,e){return T.init(t,e)},n.extend=function(t){var e,n=o.call(arguments,1);return"boolean"==typeof t&&(e=t,t=n.shift()),n.forEach(function(n){B(t,n,e)}),t},T.qsa=function(t,e){var n,i="#"==e[0],r=!i&&"."==e[0],s=i||r?e.slice(1):e,a=E.test(s);return _(t)&&a&&i?(n=t.getElementById(s))?[n]:[]:1!==t.nodeType&&9!==t.nodeType?[]:o.call(a&&!i?r?t.getElementsByClassName(s):t.getElementsByTagName(e):t.querySelectorAll(e))},n.contains=a.documentElement.contains?function(t,e){return t!==e&&t.contains(e)}:function(t,e){for(;e&&(e=e.parentNode);)if(e===t)return!0;return!1},n.type=L,n.isFunction=Z,n.isWindow=$,n.isArray=A,n.isPlainObject=R,n.isEmptyObject=function(t){var e;for(e in t)return!1;return!0},n.inArray=function(t,e,n){return r.indexOf.call(e,t,n)},n.camelCase=C,n.trim=function(t){return null==t?"":String.prototype.trim.call(t)},n.uuid=0,n.support={},n.expr={},n.map=function(t,e){var n,r,o,i=[];if(M(t))for(r=0;r<t.length;r++)n=e(t[r],r),null!=n&&i.push(n);else for(o in t)n=e(t[o],o),null!=n&&i.push(n);return z(i)},n.each=function(t,e){var n,i;if(M(t)){for(n=0;n<t.length;n++)if(e.call(t[n],n,t[n])===!1)return t}else for(i in t)if(e.call(t[i],i,t[i])===!1)return t;return t},n.grep=function(t,e){return s.call(t,e)},window.JSON&&(n.parseJSON=JSON.parse),n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(t,e){j["[object "+e+"]"]=e.toLowerCase()}),n.fn={forEach:r.forEach,reduce:r.reduce,push:r.push,sort:r.sort,indexOf:r.indexOf,concat:r.concat,map:function(t){return n(n.map(this,function(e,n){return t.call(e,n,e)}))},slice:function(){return n(o.apply(this,arguments))},ready:function(t){return w.test(a.readyState)&&a.body?t(n):a.addEventListener("DOMContentLoaded",function(){t(n)},!1),this},get:function(e){return e===t?o.call(this):this[e>=0?e:e+this.length]},toArray:function(){return this.get()},size:function(){return this.length},remove:function(){return this.each(function(){null!=this.parentNode&&this.parentNode.removeChild(this)})},each:function(t){return r.every.call(this,function(e,n){return t.call(e,n,e)!==!1}),this},filter:function(t){return Z(t)?this.not(this.not(t)):n(s.call(this,function(e){return T.matches(e,t)}))},add:function(t,e){return n(N(this.concat(n(t,e))))},is:function(t){return this.length>0&&T.matches(this[0],t)},not:function(e){var i=[];if(Z(e)&&e.call!==t)this.each(function(t){e.call(this,t)||i.push(this)});else{var r="string"==typeof e?this.filter(e):M(e)&&Z(e.item)?o.call(e):n(e);this.forEach(function(t){r.indexOf(t)<0&&i.push(t)})}return n(i)},has:function(t){return this.filter(function(){return D(t)?n.contains(this,t):n(this).find(t).size()})},eq:function(t){return-1===t?this.slice(t):this.slice(t,+t+1)},first:function(){var t=this[0];return t&&!D(t)?t:n(t)},last:function(){var t=this[this.length-1];return t&&!D(t)?t:n(t)},find:function(t){var e,i=this;return e=t?"object"==typeof t?n(t).filter(function(){var t=this;return r.some.call(i,function(e){return n.contains(e,t)})}):1==this.length?n(T.qsa(this[0],t)):this.map(function(){return T.qsa(this,t)}):[]},closest:function(t,e){var i=this[0],r=!1;for("object"==typeof t&&(r=n(t));i&&!(r?r.indexOf(i)>=0:T.matches(i,t));)i=i!==e&&!_(i)&&i.parentNode;return n(i)},parents:function(t){for(var e=[],i=this;i.length>0;)i=n.map(i,function(t){return(t=t.parentNode)&&!_(t)&&e.indexOf(t)<0?(e.push(t),t):void 0});return U(e,t)},parent:function(t){return U(N(this.pluck("parentNode")),t)},children:function(t){return U(this.map(function(){return V(this)}),t)},contents:function(){return this.map(function(){return o.call(this.childNodes)})},siblings:function(t){return U(this.map(function(t,e){return s.call(V(e.parentNode),function(t){return t!==e})}),t)},empty:function(){return this.each(function(){this.innerHTML=""})},pluck:function(t){return n.map(this,function(e){return e[t]})},show:function(){return this.each(function(){"none"==this.style.display&&(this.style.display=""),"none"==getComputedStyle(this,"").getPropertyValue("display")&&(this.style.display=I(this.nodeName))})},replaceWith:function(t){return this.before(t).remove()},wrap:function(t){var e=Z(t);if(this[0]&&!e)var i=n(t).get(0),r=i.parentNode||this.length>1;return this.each(function(o){n(this).wrapAll(e?t.call(this,o):r?i.cloneNode(!0):i)})},wrapAll:function(t){if(this[0]){n(this[0]).before(t=n(t));for(var e;(e=t.children()).length;)t=e.first();n(t).append(this)}return this},wrapInner:function(t){var e=Z(t);return this.each(function(i){var r=n(this),o=r.contents(),s=e?t.call(this,i):t;o.length?o.wrapAll(s):r.append(s)})},unwrap:function(){return this.parent().each(function(){n(this).replaceWith(n(this).children())}),this},clone:function(){return this.map(function(){return this.cloneNode(!0)})},hide:function(){return this.css("display","none")},toggle:function(e){return this.each(function(){var i=n(this);(e===t?"none"==i.css("display"):e)?i.show():i.hide()})},prev:function(t){return n(this.pluck("previousElementSibling")).filter(t||"*")},next:function(t){return n(this.pluck("nextElementSibling")).filter(t||"*")},html:function(t){return 0 in arguments?this.each(function(e){var i=this.innerHTML;n(this).empty().append(J(this,t,e,i))}):0 in this?this[0].innerHTML:null},text:function(t){return 0 in arguments?this.each(function(e){var n=J(this,t,e,this.textContent);this.textContent=null==n?"":""+n}):0 in this?this[0].textContent:null},attr:function(n,i){var r;return"string"!=typeof n||1 in arguments?this.each(function(t){if(1===this.nodeType)if(D(n))for(e in n)X(this,e,n[e]);else X(this,n,J(this,i,t,this.getAttribute(n)))}):this.length&&1===this[0].nodeType?!(r=this[0].getAttribute(n))&&n in this[0]?this[0][n]:r:t},removeAttr:function(t){return this.each(function(){1===this.nodeType&&X(this,t)})},prop:function(t,e){return t=P[t]||t,1 in arguments?this.each(function(n){this[t]=J(this,e,n,this[t])}):this[0]&&this[0][t]},data:function(e,n){var i="data-"+e.replace(m,"-$1").toLowerCase(),r=1 in arguments?this.attr(i,n):this.attr(i);return null!==r?Y(r):t},val:function(t){return 0 in arguments?this.each(function(e){this.value=J(this,t,e,this.value)}):this[0]&&(this[0].multiple?n(this[0]).find("option").filter(function(){return this.selected}).pluck("value"):this[0].value)},offset:function(t){if(t)return this.each(function(e){var i=n(this),r=J(this,t,e,i.offset()),o=i.offsetParent().offset(),s={top:r.top-o.top,left:r.left-o.left};"static"==i.css("position")&&(s.position="relative"),i.css(s)});if(!this.length)return null;var e=this[0].getBoundingClientRect();return{left:e.left+window.pageXOffset,top:e.top+window.pageYOffset,width:Math.round(e.width),height:Math.round(e.height)}},css:function(t,i){if(arguments.length<2){var r=this[0],o=getComputedStyle(r,"");if(!r)return;if("string"==typeof t)return r.style[C(t)]||o.getPropertyValue(t);if(A(t)){var s={};return n.each(A(t)?t:[t],function(t,e){s[e]=r.style[C(e)]||o.getPropertyValue(e)}),s}}var a="";if("string"==L(t))i||0===i?a=F(t)+":"+H(t,i):this.each(function(){this.style.removeProperty(F(t))});else for(e in t)t[e]||0===t[e]?a+=F(e)+":"+H(e,t[e])+";":this.each(function(){this.style.removeProperty(F(e))});return this.each(function(){this.style.cssText+=";"+a})},index:function(t){return t?this.indexOf(n(t)[0]):this.parent().children().indexOf(this[0])},hasClass:function(t){return t?r.some.call(this,function(t){return this.test(W(t))},q(t)):!1},addClass:function(t){return t?this.each(function(e){i=[];var r=W(this),o=J(this,t,e,r);o.split(/\s+/g).forEach(function(t){n(this).hasClass(t)||i.push(t)},this),i.length&&W(this,r+(r?" ":"")+i.join(" "))}):this},removeClass:function(e){return this.each(function(n){return e===t?W(this,""):(i=W(this),J(this,e,n,i).split(/\s+/g).forEach(function(t){i=i.replace(q(t)," ")}),void W(this,i.trim()))})},toggleClass:function(e,i){return e?this.each(function(r){var o=n(this),s=J(this,e,r,W(this));s.split(/\s+/g).forEach(function(e){(i===t?!o.hasClass(e):i)?o.addClass(e):o.removeClass(e)})}):this},scrollTop:function(e){if(this.length){var n="scrollTop"in this[0];return e===t?n?this[0].scrollTop:this[0].pageYOffset:this.each(n?function(){this.scrollTop=e}:function(){this.scrollTo(this.scrollX,e)})}},scrollLeft:function(e){if(this.length){var n="scrollLeft"in this[0];return e===t?n?this[0].scrollLeft:this[0].pageXOffset:this.each(n?function(){this.scrollLeft=e}:function(){this.scrollTo(e,this.scrollY)})}},position:function(){if(this.length){var t=this[0],e=this.offsetParent(),i=this.offset(),r=d.test(e[0].nodeName)?{top:0,left:0}:e.offset();return i.top-=parseFloat(n(t).css("margin-top"))||0,i.left-=parseFloat(n(t).css("margin-left"))||0,r.top+=parseFloat(n(e[0]).css("border-top-width"))||0,r.left+=parseFloat(n(e[0]).css("border-left-width"))||0,{top:i.top-r.top,left:i.left-r.left}}},offsetParent:function(){return this.map(function(){for(var t=this.offsetParent||a.body;t&&!d.test(t.nodeName)&&"static"==n(t).css("position");)t=t.offsetParent;return t})}},n.fn.detach=n.fn.remove,["width","height"].forEach(function(e){var i=e.replace(/./,function(t){return t[0].toUpperCase()});n.fn[e]=function(r){var o,s=this[0];return r===t?$(s)?s["inner"+i]:_(s)?s.documentElement["scroll"+i]:(o=this.offset())&&o[e]:this.each(function(t){s=n(this),s.css(e,J(this,r,t,s[e]()))})}}),v.forEach(function(t,e){var i=e%2;n.fn[t]=function(){var t,o,r=n.map(arguments,function(e){return t=L(e),"object"==t||"array"==t||null==e?e:T.fragment(e)}),s=this.length>1;return r.length<1?this:this.each(function(t,u){o=i?u:u.parentNode,u=0==e?u.nextSibling:1==e?u.firstChild:2==e?u:null;var f=n.contains(a.documentElement,o);r.forEach(function(t){if(s)t=t.cloneNode(!0);else if(!o)return n(t).remove();o.insertBefore(t,u),f&&G(t,function(t){null==t.nodeName||"SCRIPT"!==t.nodeName.toUpperCase()||t.type&&"text/javascript"!==t.type||t.src||window.eval.call(window,t.innerHTML)})})})},n.fn[i?t+"To":"insert"+(e?"Before":"After")]=function(e){return n(e)[t](this),this}}),T.Z.prototype=n.fn,T.uniq=N,T.deserializeValue=Y,n.zepto=T,n}();window.Zepto=Zepto,void 0===window.$&&(window.$=Zepto),function(t){function l(t){return t._zid||(t._zid=e++)}function h(t,e,n,i){if(e=p(e),e.ns)var r=d(e.ns);return(s[l(t)]||[]).filter(function(t){return!(!t||e.e&&t.e!=e.e||e.ns&&!r.test(t.ns)||n&&l(t.fn)!==l(n)||i&&t.sel!=i)})}function p(t){var e=(""+t).split(".");return{e:e[0],ns:e.slice(1).sort().join(" ")}}function d(t){return new RegExp("(?:^| )"+t.replace(" "," .* ?")+"(?: |$)")}function m(t,e){return t.del&&!u&&t.e in f||!!e}function g(t){return c[t]||u&&f[t]||t}function v(e,i,r,o,a,u,f){var h=l(e),d=s[h]||(s[h]=[]);i.split(/\s/).forEach(function(i){if("ready"==i)return t(document).ready(r);var s=p(i);s.fn=r,s.sel=a,s.e in c&&(r=function(e){var n=e.relatedTarget;return!n||n!==this&&!t.contains(this,n)?s.fn.apply(this,arguments):void 0}),s.del=u;var l=u||r;s.proxy=function(t){if(t=j(t),!t.isImmediatePropagationStopped()){t.data=o;var i=l.apply(e,t._args==n?[t]:[t].concat(t._args));return i===!1&&(t.preventDefault(),t.stopPropagation()),i}},s.i=d.length,d.push(s),"addEventListener"in e&&e.addEventListener(g(s.e),s.proxy,m(s,f))})}function y(t,e,n,i,r){var o=l(t);(e||"").split(/\s/).forEach(function(e){h(t,e,n,i).forEach(function(e){delete s[o][e.i],"removeEventListener"in t&&t.removeEventListener(g(e.e),e.proxy,m(e,r))})})}function j(e,i){return(i||!e.isDefaultPrevented)&&(i||(i=e),t.each(E,function(t,n){var r=i[t];e[t]=function(){return this[n]=x,r&&r.apply(i,arguments)},e[n]=b}),(i.defaultPrevented!==n?i.defaultPrevented:"returnValue"in i?i.returnValue===!1:i.getPreventDefault&&i.getPreventDefault())&&(e.isDefaultPrevented=x)),e}function S(t){var e,i={originalEvent:t};for(e in t)w.test(e)||t[e]===n||(i[e]=t[e]);return j(i,t)}var n,e=1,i=Array.prototype.slice,r=t.isFunction,o=function(t){return"string"==typeof t},s={},a={},u="onfocusin"in window,f={focus:"focusin",blur:"focusout"},c={mouseenter:"mouseover",mouseleave:"mouseout"};a.click=a.mousedown=a.mouseup=a.mousemove="MouseEvents",t.event={add:v,remove:y},t.proxy=function(e,n){var s=2 in arguments&&i.call(arguments,2);if(r(e)){var a=function(){return e.apply(n,s?s.concat(i.call(arguments)):arguments)};return a._zid=l(e),a}if(o(n))return s?(s.unshift(e[n],e),t.proxy.apply(null,s)):t.proxy(e[n],e);throw new TypeError("expected function")},t.fn.bind=function(t,e,n){return this.on(t,e,n)},t.fn.unbind=function(t,e){return this.off(t,e)},t.fn.one=function(t,e,n,i){return this.on(t,e,n,i,1)};var x=function(){return!0},b=function(){return!1},w=/^([A-Z]|returnValue$|layer[XY]$)/,E={preventDefault:"isDefaultPrevented",stopImmediatePropagation:"isImmediatePropagationStopped",stopPropagation:"isPropagationStopped"};t.fn.delegate=function(t,e,n){return this.on(e,t,n)},t.fn.undelegate=function(t,e,n){return this.off(e,t,n)},t.fn.live=function(e,n){return t(document.body).delegate(this.selector,e,n),this},t.fn.die=function(e,n){return t(document.body).undelegate(this.selector,e,n),this},t.fn.on=function(e,s,a,u,f){var c,l,h=this;return e&&!o(e)?(t.each(e,function(t,e){h.on(t,s,a,e,f)}),h):(o(s)||r(u)||u===!1||(u=a,a=s,s=n),(r(a)||a===!1)&&(u=a,a=n),u===!1&&(u=b),h.each(function(n,r){f&&(c=function(t){return y(r,t.type,u),u.apply(this,arguments)}),s&&(l=function(e){var n,o=t(e.target).closest(s,r).get(0);return o&&o!==r?(n=t.extend(S(e),{currentTarget:o,liveFired:r}),(c||u).apply(o,[n].concat(i.call(arguments,1)))):void 0}),v(r,e,u,a,s,l||c)}))},t.fn.off=function(e,i,s){var a=this;return e&&!o(e)?(t.each(e,function(t,e){a.off(t,i,e)}),a):(o(i)||r(s)||s===!1||(s=i,i=n),s===!1&&(s=b),a.each(function(){y(this,e,s,i)}))},t.fn.trigger=function(e,n){return e=o(e)||t.isPlainObject(e)?t.Event(e):j(e),e._args=n,this.each(function(){"dispatchEvent"in this?this.dispatchEvent(e):t(this).triggerHandler(e,n)})},t.fn.triggerHandler=function(e,n){var i,r;return this.each(function(s,a){i=S(o(e)?t.Event(e):e),i._args=n,i.target=a,t.each(h(a,e.type||e),function(t,e){return r=e.proxy(i),i.isImmediatePropagationStopped()?!1:void 0})}),r},"focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function(e){t.fn[e]=function(t){return t?this.bind(e,t):this.trigger(e)}}),["focus","blur"].forEach(function(e){t.fn[e]=function(t){return t?this.bind(e,t):this.each(function(){try{this[e]()}catch(t){}}),this}}),t.Event=function(t,e){o(t)||(e=t,t=e.type);var n=document.createEvent(a[t]||"Events"),i=!0;if(e)for(var r in e)"bubbles"==r?i=!!e[r]:n[r]=e[r];return n.initEvent(t,i,!0),j(n)}}(Zepto),function(t){function l(e,n,i){var r=t.Event(n);return t(e).trigger(r,i),!r.isDefaultPrevented()}function h(t,e,i,r){return t.global?l(e||n,i,r):void 0}function p(e){e.global&&0===t.active++&&h(e,null,"ajaxStart")}function d(e){e.global&&!--t.active&&h(e,null,"ajaxStop")}function m(t,e){var n=e.context;return e.beforeSend.call(n,t,e)===!1||h(e,n,"ajaxBeforeSend",[t,e])===!1?!1:void h(e,n,"ajaxSend",[t,e])}function g(t,e,n,i){var r=n.context,o="success";n.success.call(r,t,o,e),i&&i.resolveWith(r,[t,o,e]),h(n,r,"ajaxSuccess",[e,n,t]),y(o,e,n)}function v(t,e,n,i,r){var o=i.context;i.error.call(o,n,e,t),r&&r.rejectWith(o,[n,e,t]),h(i,o,"ajaxError",[n,i,t||e]),y(e,n,i)}function y(t,e,n){var i=n.context;n.complete.call(i,e,t),h(n,i,"ajaxComplete",[e,n]),d(n)}function x(){}function b(t){return t&&(t=t.split(";",2)[0]),t&&(t==f?"html":t==u?"json":s.test(t)?"script":a.test(t)&&"xml")||"text"}function w(t,e){return""==e?t:(t+"&"+e).replace(/[&?]{1,2}/,"?")}function E(e){e.processData&&e.data&&"string"!=t.type(e.data)&&(e.data=t.param(e.data,e.traditional)),!e.data||e.type&&"GET"!=e.type.toUpperCase()||(e.url=w(e.url,e.data),e.data=void 0)}function j(e,n,i,r){return t.isFunction(n)&&(r=i,i=n,n=void 0),t.isFunction(i)||(r=i,i=void 0),{url:e,data:n,success:i,dataType:r}}function T(e,n,i,r){var o,s=t.isArray(n),a=t.isPlainObject(n);t.each(n,function(n,u){o=t.type(u),r&&(n=i?r:r+"["+(a||"object"==o||"array"==o?n:"")+"]"),!r&&s?e.add(u.name,u.value):"array"==o||!i&&"object"==o?T(e,u,i,n):e.add(n,u)})}var i,r,e=0,n=window.document,o=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,s=/^(?:text|application)\/javascript/i,a=/^(?:text|application)\/xml/i,u="application/json",f="text/html",c=/^\s*$/;t.active=0,t.ajaxJSONP=function(i,r){if(!("type"in i))return t.ajax(i);var f,h,o=i.jsonpCallback,s=(t.isFunction(o)?o():o)||"jsonp"+ ++e,a=n.createElement("script"),u=window[s],c=function(e){t(a).triggerHandler("error",e||"abort")},l={abort:c};return r&&r.promise(l),t(a).on("load error",function(e,n){clearTimeout(h),t(a).off().remove(),"error"!=e.type&&f?g(f[0],l,i,r):v(null,n||"error",l,i,r),window[s]=u,f&&t.isFunction(u)&&u(f[0]),u=f=void 0}),m(l,i)===!1?(c("abort"),l):(window[s]=function(){f=arguments},a.src=i.url.replace(/\?(.+)=\?/,"?$1="+s),n.head.appendChild(a),i.timeout>0&&(h=setTimeout(function(){c("timeout")},i.timeout)),l)},t.ajaxSettings={type:"GET",beforeSend:x,success:x,error:x,complete:x,context:null,global:!0,xhr:function(){return new window.XMLHttpRequest},accepts:{script:"text/javascript, application/javascript, application/x-javascript",json:u,xml:"application/xml, text/xml",html:f,text:"text/plain"},crossDomain:!1,timeout:0,processData:!0,cache:!0},t.ajax=function(e){var n=t.extend({},e||{}),o=t.Deferred&&t.Deferred();for(i in t.ajaxSettings)void 0===n[i]&&(n[i]=t.ajaxSettings[i]);p(n),n.crossDomain||(n.crossDomain=/^([\w-]+:)?\/\/([^\/]+)/.test(n.url)&&RegExp.$2!=window.location.host),n.url||(n.url=window.location.toString()),E(n);var s=n.dataType,a=/\?.+=\?/.test(n.url);if(a&&(s="jsonp"),n.cache!==!1&&(e&&e.cache===!0||"script"!=s&&"jsonp"!=s)||(n.url=w(n.url,"_="+Date.now())),"jsonp"==s)return a||(n.url=w(n.url,n.jsonp?n.jsonp+"=?":n.jsonp===!1?"":"callback=?")),t.ajaxJSONP(n,o);var j,u=n.accepts[s],f={},l=function(t,e){f[t.toLowerCase()]=[t,e]},h=/^([\w-]+:)\/\//.test(n.url)?RegExp.$1:window.location.protocol,d=n.xhr(),y=d.setRequestHeader;if(o&&o.promise(d),n.crossDomain||l("X-Requested-With","XMLHttpRequest"),l("Accept",u||"*/*"),(u=n.mimeType||u)&&(u.indexOf(",")>-1&&(u=u.split(",",2)[0]),d.overrideMimeType&&d.overrideMimeType(u)),(n.contentType||n.contentType!==!1&&n.data&&"GET"!=n.type.toUpperCase())&&l("Content-Type",n.contentType||"application/x-www-form-urlencoded"),n.headers)for(r in n.headers)l(r,n.headers[r]);if(d.setRequestHeader=l,d.onreadystatechange=function(){if(4==d.readyState){d.onreadystatechange=x,clearTimeout(j);var e,i=!1;if(d.status>=200&&d.status<300||304==d.status||0==d.status&&"file:"==h){s=s||b(n.mimeType||d.getResponseHeader("content-type")),e=d.responseText;try{"script"==s?(1,eval)(e):"xml"==s?e=d.responseXML:"json"==s&&(e=c.test(e)?null:t.parseJSON(e))}catch(r){i=r}i?v(i,"parsererror",d,n,o):g(e,d,n,o)}else v(d.statusText||null,d.status?"error":"abort",d,n,o)}},m(d,n)===!1)return d.abort(),v(null,"abort",d,n,o),d;if(n.xhrFields)for(r in n.xhrFields)d[r]=n.xhrFields[r];var S="async"in n?n.async:!0;d.open(n.type,n.url,S,n.username,n.password);for(r in f)y.apply(d,f[r]);return n.timeout>0&&(j=setTimeout(function(){d.onreadystatechange=x,d.abort(),v(null,"timeout",d,n,o)},n.timeout)),d.send(n.data?n.data:null),d},t.get=function(){return t.ajax(j.apply(null,arguments))},t.post=function(){var e=j.apply(null,arguments);return e.type="POST",t.ajax(e)},t.getJSON=function(){var e=j.apply(null,arguments);return e.dataType="json",t.ajax(e)},t.fn.load=function(e,n,i){if(!this.length)return this;var a,r=this,s=e.split(/\s/),u=j(e,n,i),f=u.success;return s.length>1&&(u.url=s[0],a=s[1]),u.success=function(e){r.html(a?t("<div>").html(e.replace(o,"")).find(a):e),f&&f.apply(r,arguments)},t.ajax(u),this};var S=encodeURIComponent;t.param=function(t,e){var n=[];return n.add=function(t,e){this.push(S(t)+"="+S(e))},T(n,t,e),n.join("&").replace(/%20/g,"+")}}(Zepto),function(t){t.fn.serializeArray=function(){var n,e=[];return t([].slice.call(this.get(0).elements)).each(function(){n=t(this);var i=n.attr("type");"fieldset"!=this.nodeName.toLowerCase()&&!this.disabled&&"submit"!=i&&"reset"!=i&&"button"!=i&&("radio"!=i&&"checkbox"!=i||this.checked)&&e.push({name:n.attr("name"),value:n.val()})}),e},t.fn.serialize=function(){var t=[];return this.serializeArray().forEach(function(e){t.push(encodeURIComponent(e.name)+"="+encodeURIComponent(e.value))}),t.join("&")},t.fn.submit=function(e){if(e)this.bind("submit",e);else if(this.length){var n=t.Event("submit");this.eq(0).trigger(n),n.isDefaultPrevented()||this.get(0).submit()}return this}}(Zepto),function(t){"__proto__"in{}||t.extend(t.zepto,{Z:function(e,n){return e=e||[],t.extend(e,t.fn),e.selector=n||"",e.__Z=!0,e},isZ:function(e){return"array"===t.type(e)&&"__Z"in e}});try{getComputedStyle(void 0)}catch(e){var n=getComputedStyle;window.getComputedStyle=function(t){try{return n(t)}catch(e){return null}}}}(Zepto);
!function(t){function n(n){return n=t(n),!(!n.width()&&!n.height())&&"none"!==n.css("display")}function e(t,n){t=t.replace(/=#\]/g,'="#"]');var e,i,r=u.exec(t);if(r&&r[2]in s&&(e=s[r[2]],i=r[3],t=r[1],i)){var o=Number(i);i=isNaN(o)?i.replace(/^["']|["']$/g,""):o}return n(t,e,i)}var i=t.zepto,r=i.qsa,o=i.matches,s=t.expr[":"]={visible:function(){return n(this)?this:void 0},hidden:function(){return n(this)?void 0:this},selected:function(){return this.selected?this:void 0},checked:function(){return this.checked?this:void 0},parent:function(){return this.parentNode},first:function(t){return 0===t?this:void 0},last:function(t,n){return t===n.length-1?this:void 0},eq:function(t,n,e){return t===e?this:void 0},contains:function(n,e,i){return t(this).text().indexOf(i)>-1?this:void 0},has:function(t,n,e){return i.qsa(this,e).length?this:void 0}},u=new RegExp("(.*):(\\w+)(?:\\(([^)]+)\\))?$\\s*"),c=/^\s*>/,h="Zepto"+ +new Date;i.qsa=function(n,o){return e(o,function(e,s,u){try{var a;!e&&s?e="*":c.test(e)&&(a=t(n).addClass(h),e="."+h+" "+e);var f=r(n,e)}catch(d){throw console.error("error performing selector: %o",o),d}finally{a&&a.removeClass(h)}return s?i.uniq(t.map(f,function(t,n){return s.call(t,n,f,u)})):f})},i.matches=function(t,n){return e(n,function(n,e,i){return!(n&&!o(t,n)||e&&e.call(t,null,i)!==t)})}}(Zepto);
!function(win, lib) {
    "use strict";
    var $ = win.$,config=lib.channelsConfig,channelIndex=0,cIndex=0,channels = config.channels||["xf","esf","zf","jiaju","pinggu","news","bbs","ask"],channel = config.currentChannel||"",
        active=!1,i=0,len = channels.length;
    for(;i<len;i++){
        if(channels[i] == channel){
            cIndex = channelIndex = i,active=!0;
            break;
        }
    }
    active==!1 && 0<=$.inArray("pinggu",channels) && (cIndex = channelIndex = 4);
    if(channelIndex>4){//调整为正确顺序
        channels.splice(channelIndex,1),channels.splice(4,0,channel);
        cIndex = 4;
    }
    lib.smartbanner = {channel:channel,cIndex:cIndex,channelIndex:channelIndex,channels:channels,active:active,cityNS:{}};
}(window, window.lib || (window.lib = {})),function(win, lib) {
    "use strict";
    var $ = win.$,ba = lib.smartbanner,channel=ba.channel,cIndex=ba.cIndex,channelIndex=ba.channelIndex,channels=ba.channels,
        nav = $("div.tabNav"),navChild = nav.children("div"),nav1 = navChild.eq(0),nav2 = navChild.eq(1),
        navList1 = nav1.children("a"),navList2 = nav2.find("a"),
        bar = $("div.search0620"),
        q = bar.find("input#S_searchtext"),
        channelList = {"xf":["新房",'楼盘名/地名/开发商'],"esf":["二手房",'楼盘名/地段名'],"zf":["租房",'楼盘名/地段名'],"jiaju":["家居",'搜索您小区的案例'],"pinggu":["查房价",'请输入小区名称'],"news":["资讯",'请输入关键字'],"bbs":["论坛",'楼盘名/小区名/论坛名'],"ask":["问答",'请输入您的问题']},
        channelName = [],
        channelUrl=[],
        channelNote = [];

    $.each(channels,function(index,element){
        channelName.push(channelList[element][0]);
        channelNote.push(channelList[element][1]);
    })
    function setLink(){
        var obj={},a=[];
        navList1.add(navList2).each(function(index,element){
            var ele = $(element),key = ele.text().replace(/(^\s+)|(\s+$)/g, "");
            key && (obj[key] = ele.attr("href"));
        })
        $.each(channelName,function(index,element){
            a.push(obj[element]);
        })
        return a;
    }
    if(channels.length<8){
        channelUrl =setLink();
        navList1.eq(4).attr("href", channelUrl[4]).text(channelName[4]);
        channels.length<8 && (nav2.find("li").eq(2).remove(),navList2 = nav2.find("a"));
        navList2.each(function(index,element){
            var ele = $(element),idx = index+5;
            ele.attr("href", channelUrl[idx]).text(channelName[idx]);
        });
    }
    q.attr("placeholder",channelNote[cIndex]);
    $.each({nav:nav,bar:bar,q:q,channelName:channelName,channelNote:channelNote,moreBtn:navList1.eq(5),nav1:nav1,nav2:nav2},function(key,value){
        lib.smartbanner[key] = value;
    });
}(window, window.lib || (window.lib = {}));
!function(win, lib) {
    var c = win.localStorage;
    try {
        c && c.setItem("testPrivateModel", !1)
    } catch (d) {
        c = null
    }
    lib.localStorage = c;
}(window, window.lib || (window.lib = {})),function(win, lib) {
    "use strict";
    var $ = win.$,ba = lib.smartbanner,nav=ba.nav,bar=ba.bar,q=ba.q,channel=ba.channel,cIndex=ba.cIndex,channels=ba.channels,channelName=ba.channelName,channelNote=ba.channelNote,
        channelType, t,text = channelName[cIndex],
        offBtn = bar.find("a.off"),submitBtn = bar.find("a.btn"),sPop = !1;
    q.val()!="" && offBtn.show();
    //弹出搜索浮层处理
    var sel = $('<div class="sel"><span></span></div>'),clearHisText = "清除历史记录",ssText = "搜索",closeText = "关闭",
        snav_template = '<header><div class="hLeft"><a href="javascript:;" class="back"></a></div>'
            +	'<div class="hCenter"><a href="javascript:;"><span>'+text+ssText+'</span></a></div>'
            +	'<div class="hIcon"></div></header>',
        snav = $(snav_template),
        searList = $('<div class="searList"><ul></ul></div>'),searListUl = searList.find("ul"),
        clearBtn = $('<div class="clearBtn"><a href="#">'+clearHisText+'</a></div>'),
        header = $("header#cdheader"),showItem = sel.find("span").attr("id","showSelection"),
        selection_template = '<ul class="drop"></ul>',
        itemHtml = createTypeDnHtml(),
        selection,selectItem,isFirst=!0,hisList,hisLocalStorage="hisLocal",history=!0,mainBody ;
    ba.header = header;
    showItem.text(text),bar.find("div.ipt").before(sel);
    q.attr("autocomplete", "off").on("input", initInput).on("click",function(){
        if(sPop == !1){
            if(!mainBody){
                mainBody = $(document.body).children("div").filter(function(index){
                    return t=$(this),t.is(":visible") && (!(t.hasClass("tabNav")||t.hasClass("search0620")));
                });
            }
            nav.hide(),header.hide().after(snav),sPop = !sPop;
            searListUl.empty();
            var b = $(this).val()||"";
            if(""!=b)b = b.replace(/(^\s+)|(\s+$)/g, "");
            (0 == b.length)?getHistory():getList(b);
            if(isFirst){
                addListener(),isFirst = !isFirst;
            }
            mainBody&&mainBody.hide();
            //如果是bbs需要获取南北方
            channel == "bbs" && undefined === ba.cityNS[lib.city] && getNS();
        }
    });
    offBtn.on("click",function(){
        q.val(""),offBtn.hide();
        sPop == !0 && getHistory();
    });
    submitBtn.on("click",function(){
        search ();
    })
    //
    function getNS() {
        $.get(lib.bbsSite+"/?c=bbs&a=ajaxGetCityNSByName&r="+Math.random(),function(o){ba.cityNS[lib.city]=o;ba.changeNS==!0 && q.val().length>0 && getList(q.val());});
        return !0;
    }
    function initInput(a) {
        var b, a = a || window.event;
        if (b = $(this).val().replace(/(^\s+)|(\s+$)/g, ""), !b.length)
            return getHistory(),offBtn.is(":visible") && offBtn.hide(), void 0;
        if (13 != a.keyCode && 32 != a.keyCode) {
            !offBtn.is(":visible") && offBtn.show();
            return getList(b), void 0;
        }
    }
    function getList(a) {
        var type = channelType!=undefined?channelType:cIndex, site = channels[type];
        undefined === ba.keyWordTipUrls && (ba.keyWordTipUrls = {});
        if(undefined === ba.keyWordTipUrls[type]){
            if(0<=$.inArray(site,["zf"]))  site = "esf";
            else if(site == "news")  return;
            if(site == "bbs"){
                ba.keyWordTipUrls[type] = lib[site+"Site"]+"?c="+site+"&a=ajaxGetKeySearch&ns="+ba.cityNS[lib.city];
            }
            else if(site == "xf"){
                ba.keyWordTipUrls[type] = lib["mainSite"]+"xf.d?m=getMapByKeyWordNew";
            }
            else
            {
                ba.keyWordTipUrls[type] = lib[site+"Site"]+"?c="+site+"&a=ajaxGetSearchTip";
                site == "esf" && (ba.keyWordTipUrls[type]+="&orderby=esfcount");
            }
        }
        //新房，二手房，须二次 encodeURIComponent 编码
        (site == "xf"||site == "") && (a = encodeURIComponent(a));
        $.get(ba.keyWordTipUrls[type],{city:lib.city,q:a},function(data) {
            if(!data)data = "[]"
            var l = eval("("+data+")"),s;
            searListUl.empty();
            if($.isArray(l) && l.length>0 && (s = pack(l)).length>1){
                searListUl.append(s),history = !1,clearBtn.find("a").html(closeText),bar.after(clearBtn),bar.after(searList);
            }else{
                closeList();
            }
        })
    }
    function getHistory() {
        hisList = eval(null!=lib.localStorage&&win.localStorage.getItem(hisLocalStorage) || []);
        searListUl.empty();
        var s;
       // hisList = ["国美第一城","我爱我家"]
        if($.isArray(hisList) && hisList.length>0 && (s = pack(hisList)).length>1){
            searListUl.append(s),history = !0,clearBtn.find("a").html(clearHisText),bar.after(clearBtn),bar.after(searList);
        }else{
            closeList();
        }
    }
    function clearHistory() {
        null!=lib.localStorage && win.localStorage.removeItem(hisLocalStorage);
        hisList = [],closeList();
    }
    function closeList() {
        searListUl.empty(),searList.add(clearBtn).detach();
    }
    function pack(a) {
        var i=0, j=0,len= a.length,b=[],_t='<li><a href="javascript:;">xx</a></li>';
        for(;i< len;i++){
            String(a[i]).length>0 && (j++,b.push(_t.replace("xx",a[i])));
            if(j>9)break;
        }
        return b.join("");
    }
    function createTypeDnHtml() {
        var i,len, b=[],_t='<li><input id="{id}" name="channelType" class="se" type="radio" value="{index}">{text}</li>',
            idP = new RegExp("{id}","g"),indexP = new RegExp("{index}","g"),textP = new RegExp("{text}","g");
        if((len = channels.length)>0){
            for(i=0;i< len;i++){
                b.push(_t.replace(idP,channels[i]).replace(indexP,i).replace(textP,channelName[i]));
            }
        }
        return b.join("");
    }
    //绑定事件
    snav.find("a.back").on("click",function(){
        if(sPop == !0){
            nav.show(),snav.detach(),header.show(),sPop = !sPop;
            searList.detach(),clearBtn.detach();
            mainBody && mainBody.show();
        }
    });
    showItem.on("click",function(){
        if(!selection){
            selection = $(selection_template),selectItem = $(itemHtml).prependTo(selection),selectItem.find("input").eq(channelType!=undefined?channelType:cIndex).prop("checked",true);
            sel.append(selection),ba.selection = selection;
            selectItem.on("click",function(){
                var self = $(this).children("input");
                if( self.val() != channelType){
                    selectItem.find("input").prop("checked",false),
                        channelType = self.prop("checked",true).val(),q.attr("placeholder",channelNote[channelType]);
                    showItem.text(channelName[channelType]),snav.find("div.hCenter>a>span").text(channelName[channelType]+ssText),selection.hide();
                    ba.changeNS=!1;
                    channelName[channelType] == "bbs" && undefined === ba.cityNS[lib.city] && (ba.changeNS=!0,getNS());
                    ba.changeNS!=!0 && q.val().length>0 && getList(q.val());
                }
            })
        }
        selection.show();
    });


    function addListener(){
        searListUl.on("click","a",function(){
            q.val($(this).text());
            setTimeout(function(){search ();},500);
        });
        clearBtn.on("click","a",function(){
            history?clearHistory():closeList();
        });
    }
    function search (){
        var type = channelType!=undefined?channelType:cIndex;
        var keyword = q.val();
        var b = keyword.replace(/(^\s+)|(\s+$)/g, "");
        if (b.length>0 && null!=lib.localStorage){
            hisList = eval(win.localStorage.getItem(hisLocalStorage) || []);
            0<=$.inArray(keyword,hisList) || hisList.unshift(keyword),hisList.length>10 && hisList.splice(10,1),win.localStorage.setItem(hisLocalStorage,"['"+hisList.join("','")+"']");
        }
        var url = "",typeIndex = channels[type];
        switch (typeIndex)
        {
            case "xf":
                url = lib.mainSite+"search.d?m=search&type=0&keyword=";
                break;
            case "esf":
                url = lib.esfSite+"?c=esf&a=index&keyword=";
                break;
            case "zf":
                url = lib.zfSite+"?c=zf&a=index&keyword=";
                break;
            case "jiaju":
                url = lib.jiajuSite+"?c=jiaju&a=zxbj&q=";
                break;
            case "news":
                url = lib.newsSite+"?c=news&a=search&q=";
                break;
            case "bbs":
                url = lib.bbsSite+"?c=bbs&a=search&q=";
                break;
            case "ask":
                url = lib.askSite+"?c=ask&a=search&keyword=";
                break;
            case "pinggu":
                url = lib.pingguSite+"?c=pinggu&a=list&keyword=";
                break;
            default :
                break;
        }
        window.location = url+(type==0?keyword:encodeURIComponent(keyword))+"&city="+lib.city+"&r="+Math.random();
    }
}(window, window.lib || (window.lib = {})),function(win, lib) {
    "use strict";
    var $ = win.$,ba = lib.smartbanner,bar=ba.bar,moreBtn=ba.moreBtn,
        header=ba.header,nav1=ba.nav1,nav2=ba.nav2;
    //显示/隐藏nav2
    moreBtn.on("click",function(){
        nav2.toggle();
    });
    function hnav2 (e){
        var target = $(e.target);
        nav2.is(":visible") && (!(nav1.find(target).length>0||nav2.find(target).length>0)) && nav2.hide();
    }
    function hideSelection(e){
        ba.selection && ba.selection.is(":visible") && e.target.id != "showSelection" && ba.selection.hide();
    }
    $(document).on({"click touchmove touchend":hnav2}).on("click",hideSelection);
    //end 显示/隐藏nav2
    var navFlayer,navFlayer1,navFlayer2,smsNum,userName,iconavBtn,ad,top;
    iconavBtn = header.find("a.ico-nav").on("click",function(){
        navFlayer || (navFlayer = $("div#navShadow,div#nav"),navFlayer1= navFlayer.eq(0).on("click",function(){navFlayer.hide(),iconavBtn.get(0).appendChild(smsNum.get(0))}),navFlayer2= navFlayer.eq(1),smsNum = $(this).children(".sms-num"),ad = $("#ad"),ad.length>0&&(top=$(this).offset().top+51,navFlayer.css("top",top+"px")));
        navFlayer2.is(":visible")?(navFlayer.hide(),iconavBtn.get(0).appendChild(smsNum.get(0))):(navFlayer.show(),undefined===userName&&$.get(lib.mainSite+"public/?c=public&a=ajaxUserInfo",function(o){userName="",o!= !1 && undefined!=o.username && $("div#nav div.mt10 div.nav-tit a").text(userName=o.username)}),iconavBtn.get(0).removeChild(smsNum.get(0)));
    });
    header.find("a.ico-fb").on("click",function(){
        window.location = "/fabuType.jsp?city="+lib.city+"&type="+ba.channel;
    });
}(window, window.lib || (window.lib = {}))