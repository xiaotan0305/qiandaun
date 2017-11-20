/*根据宽度设定文字*/

	(function (doc, win) {
	var docEl = doc.documentElement,
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function () {
			var clientWidth = docEl.clientWidth;
			if (!clientWidth) return;
			docEl.style.fontSize = 20 * (clientWidth / 320) + 'px';
		};
		if (!doc.addEventListener) return;
			win.addEventListener(resizeEvt, recalc, false);
			doc.addEventListener('DOMContentLoaded', recalc, false);
	})(document, window);
	/*offsetHeight必须在onload或近似的处理下尺寸才正确*/
	function setmaskH(){
		var offsetHeight =  document.documentElement.offsetHeight;
		console.log(offsetHeight);
		var guessmask = document.querySelector(".guessmask");
		if(!guessmask)return;
		guessmask.style.height = offsetHeight + "px";
	}
	window.onload = function(){
		setmaskH();
	};

