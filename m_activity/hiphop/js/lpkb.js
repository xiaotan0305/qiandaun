$(function () {
	var openType = $('#openType').val()||'isWap';
	//分享
	$('.share_icon').on('click', function () {
		if (openType === 'isWap') {
			$('#shareTwo').show();
		} else if (openType === 'isApp') {
			$('#shareOne').show();
		}
	});
	$('.share-s2').on('click', function () {
		$('.share-s2').hide();
	});


	   function setCookie(name, value) {
		   var curDate = new Date();
			//当前时间戳
			var curTamp = curDate.getTime();
			//当日凌晨的时间戳,减去一毫秒是为了防止后续得到的时间不会达到00:00:00的状态
			var curWeeHours = new Date(curDate.toLocaleDateString()).getTime() - 1000;
			//当日已经过去的时间（毫秒）
			var passedTamp = curTamp - curWeeHours;
			//当日剩余时间
			var leftTamp = 24 * 60 * 60 * 1000 - passedTamp;
			var leftTime = new Date();
			leftTime.setTime(leftTamp + curTamp);
	        document.cookie = name + '=' + encodeURIComponent(value) + '; path=/; expires=' + leftTime.toGMTString();
	    }

   function getCookie(name) {
        var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
        if (arr = document.cookie.match(reg)) {
            var str;
            try {
                str = decodeURIComponent(arr[2]);
            } catch (e) {
                str = unescape(arr[2]);
            }
            return str;
        }
        return '';
    }
// 获取参数的方法
	function GetQueryString(name) {
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'),
			r = window.location.search.substr(1).match(reg);
		if (r != null)return unescape(r[2]);
		return null;
	}
 //列表切换
	$('#navTab').on('click', 'a', function () {
		var $this = $(this);
		if (!$this.hasClass('active')) {
			$('.top_a_kbb a').removeClass('active');
			$this.addClass('active');
			var pd = '',
				typename = $(this).text(),
				url = location.protocol + '//' + location.host + '/hiphop.hd?m=lpkbType&city=' + GetQueryString('city') + '&type=' + encodeURIComponent(encodeURIComponent(typename));
			$.get(url, function (data) {
				if (data == '' || data == null) {
					//不做处理
				} else {
					var lpList = data.lpList;
						
				
					if (lpList.length > 0) {
						pd += '<ul class="kbb">';
						 $.each(lpList, function(index,item) {
							 pd += '<li>' +
								
								'<span class="number fl">' + (index+1) + '</span>' +
								'<span class="lp_name fl">' + item.title + '</span>' +
								'<span class="lp_score fl">' + item.zongfen + '&nbsp;分</span>' +
								'<a href="//m.fang.com/xf/'+GetQueryString('city')+'/'+item.newcode+'/dianping.htm" class="lp_dpbtn fl">我要点评</a>'+
								'</li>';
						 });
						 pd += '</ul>';
					}
					$('.bang_tab_con').empty().append(pd);
				}
			});
		}
	});
	   var guide = $('#guide'),
       dataNum = guide.attr('data-num') | 0;
   if (dataNum > 1) {
       new Swiper('#guide', {
           speed: 800,
           autoplay: 3000,
           loop: true,
           height:1.1,
           direction: 'vertical'
       });
   }
});