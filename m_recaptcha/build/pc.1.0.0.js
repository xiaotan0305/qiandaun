!function(e,n){function t(e){this.target=o(e)}function o(e){function t(){H=!1,N=0,W={},V=[],X=[],a(),s(),o(),I=B.width()-B.handler.width()}function o(){W.initTime=g.now(),W.ua=g.getUA(),W.tags=g.getTags(),W.offsetTop=B.offset().top,W.size=g.getSize(B)}function a(){B.html(U)}function s(){B.handler=B.find(".drag-handler"),B.dragBg=B.find(".drag-bg"),B.text=B.find(".drag-text"),B.loading=B.find(".loading"),B.handler.off().on("mousedown",function(e){e.originalEvent.preventDefault(),l(e)}),B.doc.off("mousemove.fc mouseup.fc").on("mousemove.fc",function(e){e.originalEvent.preventDefault(),u(e)}).on("mouseup.fc",function(e){e.originalEvent.preventDefault(),y(e)})}function l(e){H=!0;var n=e.originalEvent;D=n.pageX-parseInt(B.handler.css("left"),10),Y=e.target.tagName;g.now();T({x:n.pageX,y:n.pageY,t:g.now(),e:"mousedown"})}function u(e){if(H){var n=e.originalEvent,t=n.pageX-D,o=g.now();T({x:n.pageX,y:n.pageY,t:o,e:"mousemove"}),t>0&&t<=I?(B.handler.css({left:t}),B.dragBg.css({width:t})):t>I&&(T({x:n.pageX,y:n.pageY,t:o,e:"mouseup"}),b(),H=!1)}}function y(e){H=!1,e.originalEvent.pageX-D<I&&(V=[],B.handler.animate({left:0},300),B.dragBg.animate({width:0},300))}function T(e){H&&V.push(e)}function w(){clearTimeout(m),B.dragBg.removeClass("fail"),B.handler.removeClass("verifyicon-fail").addClass("verifyicon-ok"),B.loading.css("display","none"),B.text.text("\u9a8c\u8bc1\u901a\u8fc7").css("color","#fff"),k(),v.onSuccess()}function x(){B.dragBg.addClass("fail"),B.handler.addClass("verifyicon-fail"),B.loading.css("display","none"),B.text.text("\u9a8c\u8bc1\u5931\u8d25").css("color","#fff"),j(),v.onError()}function b(){B.handler.css({left:"auto",right:0}),B.text.text(""),B.loading.show(),B.dragBg.css("width",B.width()-B.handler.width()),P(),C()}function C(){var e=i(V);g.jsonp(f,[f.apiserver],f.path.codeDrag,{start:V[0].t,end:V[V.length-1].t,i:E.compress(d()),t:c(e),gt:f.gt,challenge:f.challenge},function(e){"100"===e.code?(v.validate=e.validate,w()):e.text?(v.text=e.text,x()):S()})}function L(e){X.push(e)}function S(){try{B.imgVerify.find(".loading").hide(),B.imgVerify.find(".mask-tip").show()}catch(e){}setTimeout(function(){t()},2e3),v.onError()}function A(e){return n(R).css({left:e.offsetX-10,top:e.offsetY-10}).appendTo(B.imgVerify)}function k(){B.find(".img-verify").css("display","none")}function j(){B.imgVerify=B.find(".slide-verify").append(h.getImgTpl()).find(".img-verify"),B.text.text("\u8bf7\u70b9\u51fb\u56fe\u7247\u4e2d\u7684\u300c"+v.text+"\u300d");var e=B.imgVerify.find("img");B.imgVerify.show(),e.attr("src",e.data("url")).on("click",function(e){A(e),L({t:g.now(),x:e.offsetX,y:e.offsetY,e:"click"}),N++,v.text="",M()})}function M(){N===f.clickLimit&&(B.imgVerify.find(".v-mask").show().find(".loading").show(),O())}function P(){B.handler.off("mousedown"),B.doc.off("mousemove mouseup")}function O(){g.jsonp(f,[f.apiserver],f.path.codeImgVerfied,{x:X[0].x,y:X[0].y,challenge:f.challenge,gt:f.gt},function(e){"100"===e.code?(v.validate=e.validate,w()):S()})}f=e._extend(p);var D,I,B=n("<div></div>"),H=!1,N=0,W={},V=[],X=[],U='<div class="slide-verify"><div class="drag-bg"></div><div class="drag-text">\u62d6\u52a8\u6ed1\u5757\u9a8c\u8bc1</div><div class="loading"><div></div><div></div></div><div class="drag-handler verifyicon verifyicon-arrow center-icon"></div></div>',R='<div class="verifyicon verifyicon-click click-icon center-icon"></div>',Y="";return B.doc=n(document),g.loadStyleFile(f.protocol+f.static_servers+f.url.css,function(){t(),r(f)},function(){console.error("slideVerify - CSS\u6587\u4ef6\u52a0\u8f7d\u5931\u8d25")}),B}function r(e,n){clearTimeout(m),m=setTimeout(function(){g.jsonp(e,[e.apiserver],e.path.reset,{gt:e.gt,challenge:e.challenge},function(n){"100"===n.code?(e.challenge=n.challenge,r(e)):r(e,1e3)})},n||12e5)}function i(e){var n=0,t=0,o=0,r=0,i=0,c=[];if(e.length<=0)return[];for(var s=e.length,l=s<T?0:s-T;l<s;l+=1){var u=e[l],d=u.e;"scroll"===d?c.push([d,[u.x-o,u.y-r],a(i?u.t-i:0)],o=u.x,r=u.y,i=u.t):["mousedown","mousemove","mouseup"].indexOf(d)>-1?(c.push([d,[u.x-n,u.y-t],a(i?u.t-i:0)]),n=u.x,t=u.y,i=u.t):["blur","focus","unload"].indexOf(d)>-1&&(c.push([d,a(i?u.x-i:0)]),i=u.x)}return c}function a(e){return"number"!=typeof e?e:e>32767?e=32767:e<-32767?e=-32767:Math.round(e)}function c(n){function t(n){for(var t="",o=n.length/6,r=0;r<o;r+=1)t+=l.charAt(e.parseInt(n.slice(6*r,6*(r+1)),2));return t}function o(e,n){for(var t=e.toString(2),o="",r=t.length+1;r<=n;r+=1)o+="0";return t=o+t}function r(e,n){for(var t=[],o=0,r=e.length;o<r;o+=1)t.push(n(e[o]));return t}function i(e,n){var t=[];return r(e,function(e){n(e)&&t.push(e)}),t}function a(e){for(var n=(e=r(e,function(e){return e>32767?32767:e<-32767?-32767:e})).length,t=0,o=[];t<n;){for(var i=1,a=e[t],c=Math.abs(a);!(t+i>=n)&&e[t+i]===a&&!(c>=127||i>=127);)i+=1;i>1?o.push((a<0?49152:32768)|i<<7|c):o.push(a),t+=i}return o}function c(e,n){return 0===e?0:Math.log(e)/Math.log(n)}function s(e,n){var t,s=a(e),l=[],u=[];r(s,function(e){var n=Math.ceil(c(Math.abs(e)+1,16));0===n&&(n=1),l.push(o(n-1,2)),u.push(o(Math.abs(e),4*n))});var d=l.join(""),f=u.join("");return t=n?r(i(s,function(e){return 0!=e&&e>>15!=1}),function(e){return e<0?"1":"0"}).join(""):"",o(32768|s.length,16)+d+f+t}var l="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-:@~*,.()[]/|",u={mousemove:0,mousedown:1,mouseup:2,scroll:3,focus:4,blur:5,unload:6,unknown:7},d=function(e){for(var n=[],t=e.length,r=0;r<t;){for(var i=e[r],a=0;!(a>=16);){var c=r+a+1;if(c>=t)break;if(e[c]!==i)break;a+=1}r=r+1+a;var s=u[i];0!=a?(n.push(8|s),n.push(a-1)):n.push(s)}for(var l=o(32768|t,16),d="",f=0,g=n.length;f<g;f+=1)d+=o(n[f],4);return l+d};return function(e){for(var n=[],r=[],i=[],a=[],c=0,l=e.length;c<l;c+=1){var u=e[c],f=u.length;n.push(u[0]),r.push(2===f?u[1]:u[2]),3===f&&(i.push(Math.round(u[1][0])),a.push(Math.round(u[1][1])))}var g=d(n)+s(r,!1)+s(i,!0)+s(a,!0),h=g.length;return h%6!=0&&(g+=o(0,6-h%6)),t(g)}(n)}function s(){return["textLength","HTMLLength","documentMode"].concat(this.Bd).concat(["screenLeft","screenTop","screenAvailLeft","screenAvailTop","innerWidth","innerHeight","outerWidth","outerHeight","browserLanguage","browserLanguages","systemLanguage","devicePixelRatio","colorDepth","userAgent","cookieEnabled","netEnabled","screenWidth","screenHeight","screenAvailWidth","screenAvailHeight","localStorageEnabled","sessionStorageEnabled","indexedDBEnabled","CPUClass","platform","doNotTrack","timezone","canvas2DFP","canvas3DFP","plugins","maxTouchPoints","flashEnabled","javaEnabled","hardwareConcurrency","jsFonts","timestamp","performanceTiming"])}function l(){var n=e,t=n.screen,o=n.document,r=n.navigator,i=o.documentElement,a=(o.body.nodeType,{}),c=["A","ARTICLE","ASIDE","AUDIO","BASE","BUTTON","CANVAS","CODE","IFRAME","IMG","INPUT","LABEL","LINK","NAV","OBJECT","OL","PICTURE","PRE","SECTION","SELECT","SOURCE","SPAN","STYLE","TABLE","TEXTAREA","VIDEO"],s=document.body.nodeType,l=function(e){if(e){var n=e.nodeType,t=e.nodeName.toUpperCase();n===s&&c.indexOf(t)>-1&&(a[t]?a[t]+=1:a[t]=1);for(var o=e.childNodes,r=0,i=o.length;r<i;r++)l(o[r])}};l(o);var d=i.textContent||i.innerText;a.textLength=d.length;var f=i.innerHTML;return a.HTMLLength=f.length,a.documentMode=o.documentMode||o.compatMode,a.browserLanguage=r.language||r.userLanguage,a.browserLanguages=r.languages&&r.languages.join(","),a.systemLanguage=n.systemLanguage,a.devicePixelRatio=n.devicePixelRatio,a.colorDepth=t.colorDepth,a.userAgent=r.userAgent,a.cookieEnabled=r.cookieEnabled?1:0,a.netEnabled=r.onLine?1:0,a.innerWidth=n.innerWidth,a.innerHeight=n.innerHeight,a.outerWidth=n.outerWidth,a.outerHeight=n.outerHeight,a.screenWidth=t.width,a.screenHeight=t.height,a.screenAvailWidth=t.availWidth,a.screenAvailHeight=t.availHeight,a.screenLeft=t.left||n.screenLeft,a.screenTop=t.top||n.screenTop,a.screenAvailLeft=t.availLeft,a.screenAvailTop=t.availTop,a.localStorageEnabled=n.localStorage?1:0,a.sessionStorageEnabled=n.sessionStorage?1:0,a.indexedDBEnabled=n.indexedDB?1:0,a.CPUClass=r.cpuClass,a.platform=r.platform,a.doNotTrack=r.doNotTrack?1:0,a.timezone=(new Date).getTimezoneOffset()/60,a.plugins=function(){if(!r.plugins)return w;for(var e=[],n=0,t=r.plugins.length;n<t;n+=1){var o=r.plugins[n];e.push(o.name.replace(/\s/g,"")),e.push(o.filename.replace(/\s/g,""))}return e.join(",")}(),a.maxTouchPoints=u(r.maxTouchPoints)?u(r.msMaxTouchPoints)?0:r.msMaxTouchPoints:r.maxTouchPoints,a.flashEnabled=u(n.swfobject)?w:jzd(n.swfobject.hasFlashPlayerVersion("9.0.0")),a.javaEnabled=function(){try{return u(r.javaEnabled)?w:jzd(r.javaEnabled())}catch(e){return w}}(),a.hardwareConcurrency=r.hardwareConcurrency,a}function u(e){return void 0===e}function d(){var n=e,t=this,o=l();o.performanceTiming=function(){if(u(n.performance))return t.wd;var e,o,r=n.performance.timing,i=["navigationStart","redirectStart","redirectEnd","fetchStart","domainLookupStart","domainLookupEnd","connectStart","connectEnd","requestStart","responseStart"],a=["responseEnd","unloadEventStart","unloadEventEnd","domLoading","domInteractive","domContentLoadedEventStart","domContentLoadedEventEnd","domComplete","loadEventStart","loadEventEnd","msFirstPaint"],c=[];for(e=1,o=i.length;e<o;e+=1){var s=r[i[e]];if(0===s)c.push(t.wd);else for(var l=e-1;l>=0;l-=1){var d=r[i[l]];if(0!==d){c.push(s-d);break}}}var f=r[i[i.length-1]];for(e=0,o=a.length;e<o;e+=1){var g=r[a[e]];0===g||u(g)?c.push(t.wd):c.push(g-f)}return c.join(",")}(),o.timestamp=(new Date).getTime();var r=[];return s().map(function(e){var n=o[e];r.push(void 0==n?-1:n)}),encodeURIComponent(r.join("!!"))}var f,g={now:function(){return(new Date).getTime()},getUA:function(){return e.navigator.userAgent},getSize:function(e){return{width:e.width(),height:e.height()}},getTags:function(){for(var e=document.getElementsByTagName("*"),n=[],t=0,o=e.length;t<o;t++)n.push(e[t].tagName.toLowerCase());return n},isNum:function(e){return"number"==typeof e},getPageX:function(e){return g.isNum(e.pageX)?e.pageX:(e.originalEvent.changedTouches&&e.originalEvent.changedTouches[0]).pageX},getPageY:function(e){return g.isNum(e.pageY)?e.pageY:(e.originalEvent.changedTouches&&e.originalEvent.changedTouches[0]).pageY},getScrollLeft:function(n,t){return n?e.pageXOffset:t?document.documentElement.scrollLeft:document.body.scrollLeft},getScrollTop:function(n,t){return n?e.pageXOffset:t?document.documentElement.scrollTop:document.body.scrollTop},loadStyleFile:function(e,n,t){var o=document.createElement("link");o.type="text/css",o.rel="stylesheet",o.href=e,o.onload=function(){n&&n()},o.onerror=function(){t&&t()},document.getElementsByTagName("head")[0].appendChild(o)},jsonp:function(n,t,o,r,i){var a="fangcheck_"+(parseInt(1e4*Math.random())+(new Date).valueOf());e[a]=function(n){i(n),e[a]=void 0;try{delete e[a]}catch(e){}},r.callback=a,n.load(n.protocol,t,o,r,function(e){e&&console.log(e)})}},h={getClickBg:function(){return f.protocol+f.apiserver+"?c=index&a=createImg&width="+f.imgWidth+"&height="+f.imgHeight+"&challenge="+f.challenge+"&_="+g.now()},getImgTpl:function(){return'<div class="img-verify" style="width:'+f.imgWidth+";height:"+f.imgHeight+';"><div class="v-mask"><span class="mask-tip"><i class="verifyicon verifyicon-fail"></i><b>\u9a8c\u8bc1\u5931\u8d25</b></span><div class="loading"><div></div><div></div></div></div><img class="click-bg" style="width:'+f.imgWidth+";height:"+f.imgHeight+';" src="'+h.getClickBg()+'"></div>'}},p={clickLimit:1,url:{clickBg:"",css:"/common_m/m_recaptcha/css/fc.min.css"},path:{codeDrag:"/?c=index&a=codeDrag",codeImgVerfied:"/?c=index&a=codeImgVerfied",reset:"/?c=index&a=reset"},imgWidth:0,imgHeight:200},v={};t.prototype={appendTo:function(e){this.target.appendTo(e.html("")),f.imgWidth||(f.imgWidth=e.width()),f.imgHeight||(f.imgHeight=200)},onSuccess:function(e){v.onSuccess=e},onError:function(e){v.onError=e},getValidate:function(){return{fc_gt:f.gt,fc_challenge:f.challenge,fc_validate:v.validate}}};var m=0;e.Fangcheck=t;var y=String.fromCharCode,E={compress:function(e){return E.baseCompress(e,16,function(e){return E.toChart16(y(e))})},baseCompress:function(e,n,t){if(null===e)return"";var o,r,i,a={},c={},s="",l="",u="",d=2,f=3,g=2,h=[],p=0,v=0;for(i=0;i<e.length;i+=1)if(s=e.charAt(i),Object.prototype.hasOwnProperty.call(a,s)||(a[s]=f++,c[s]=!0),l=u+s,Object.prototype.hasOwnProperty.call(a,l))u=l;else{if(Object.prototype.hasOwnProperty.call(c,u)){if(u.charCodeAt(0)<256){for(o=0;o<g;o++)p<<=1,v==n-1?(v=0,h.push(t(p)),p=0):v++;for(r=u.charCodeAt(0),o=0;o<8;o++)p=p<<1|1&r,v==n-1?(v=0,h.push(t(p)),p=0):v++,r>>=1}else{for(r=1,o=0;o<g;o++)p=p<<1|r,v==n-1?(v=0,h.push(t(p)),p=0):v++,r=0;for(r=u.charCodeAt(0),o=0;o<16;o++)p=p<<1|1&r,v==n-1?(v=0,h.push(t(p)),p=0):v++,r>>=1}0==--d&&(d=Math.pow(2,g),g++),delete c[u]}else for(r=a[u],o=0;o<g;o++)p=p<<1|1&r,v==n-1?(v=0,h.push(t(p)),p=0):v++,r>>=1;0==--d&&(d=Math.pow(2,g),g++),a[l]=f++,u=String(s)}if(""!==u){if(Object.prototype.hasOwnProperty.call(c,u)){if(u.charCodeAt(0)<256){for(o=0;o<g;o++)p<<=1,v==n-1?(v=0,h.push(t(p)),p=0):v++;for(r=u.charCodeAt(0),o=0;o<8;o++)p=p<<1|1&r,v==n-1?(v=0,h.push(t(p)),p=0):v++,r>>=1}else{for(r=1,o=0;o<g;o++)p=p<<1|r,v==n-1?(v=0,h.push(t(p)),p=0):v++,r=0;for(r=u.charCodeAt(0),o=0;o<16;o++)p=p<<1|1&r,v==n-1?(v=0,h.push(t(p)),p=0):v++,r>>=1}0==--d&&(d=Math.pow(2,g),g++),delete c[u]}else for(r=a[u],o=0;o<g;o++)p=p<<1|1&r,v==n-1?(v=0,h.push(t(p)),p=0):v++,r>>=1;0==--d&&(d=Math.pow(2,g),g++)}for(r=2,o=0;o<g;o++)p=p<<1|1&r,v==n-1?(v=0,h.push(t(p)),p=0):v++,r>>=1;for(;;){if(p<<=1,v==n-1){h.push(t(p));break}v++}return h.join("")},toChart16:function(e){for(var n="",t=e.length,o=0;o<t;o++){var r=e.charCodeAt(o).toString(16),i=r.length;if(i<4){for(var a=4-i,c="",s=0;s<a;s++)c+="0";r=c+r}else i>4&&console.log("More than four",r);n+=r}return n}},T=300,w=-1}(this,jQuery);