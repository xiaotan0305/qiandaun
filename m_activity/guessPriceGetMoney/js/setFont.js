/*���ݿ���趨����*/

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
	/*offsetHeight������onload����ƵĴ����³ߴ����ȷ*/
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

