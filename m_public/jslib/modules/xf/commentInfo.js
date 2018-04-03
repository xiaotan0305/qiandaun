define('modules/xf/commentInfo', ['jquery', 'superShare/1.0.1/superShare','modules/xf/IcoStar', 'weixin/2.0.0/weixinshare','util/util'], function (require) {
	'use strict';
	var $ = require('jquery');
	var vars = seajs.data.vars;
	var Util = require('util/util');
	var sfut = Util.getCookie('sfut');

	var IcoStar = require('modules/xf/IcoStar');
	
	
	// 登录后获取用户名，手机号和用户ID
    var username, userphone, userid;

    function getInfo(data) {
        username = data.username || '';
        userphone = data.mobilephone || '';
        userid = data.userid || '';
    }

    // 调用ajax获取登陆用户信息
    if (sfut) {
        vars.getSfutInfo(getInfo);
    }
	
	// 分享功能(新)
	var SuperShare = require('superShare/1.0.1/superShare');
	var config = {
		// 分享内容的title
		title: vars.shareTitle,
		// 分享时的图标
		image: vars.shareImg || '',
		// 分享内容的详细描述
		desc: vars.shareContent,
		// 分享的链接地址
		url: location.href,
		// 分享的内容来源
		from: 'xf'
	};
	var superShare = new SuperShare(config);

	// 微信分享功能
	var wx = require('weixin/2.0.0/weixinshare');
	var weixin = new wx({
		shareTitle: vars.shareTitle,
		descContent: vars.shareContent,
		imgUrl: vars.shareImg || '',
		lineLink: location.href
	});
	
	// 控制星星亮
    var icoStarObj = new IcoStar('.ico-star');
	
	/*
	* 检查是否登录
	*/
	function checkLogin() {
		var href = encodeURIComponent(window.location.href);
		if (!userid) {
			alert('请登录后操作！');
			window.location.href =  'https://m.fang.com/passport/login.aspx?burl=' + href;
			return false;
		}
		return true;
	}
	
	
	
	
	 // 点赞、回复、更多
        $('.zan').on('click', function () {
            var $this = $(this);
            if (checkLogin()) {
                // 点赞
				
				var tid = vars.id;
				var $span = $this.find('span');
				var agreeNum = $span.text();
				var fid = '';
				if ($this.hasClass('z')) {
					$.post('/xf.d?m=makeZan',
						{
							newcode: vars.newcode,
							city: vars.city,
							tid: tid,
							fid: fid,
							guid: userid
						},
						function (data) {
							if (data) {
								if (data.root.result === '100') {
									$span.text(agreeNum * 1 + 1);
									// 添加点赞的class
									$this.removeClass('z');
									$this.addClass('z1');
								} else {
									alert(data.root.message);
								}
							}
						});
				} else {
					alert('亲，您已经点过了~');
				}
                
            }
        });
		
		//查看更多回复
		// 总条数
		var totalnum = parseInt(vars.hfcount) || 0;
		// 总页数
		var totalPage = Math.ceil(totalnum/5);
		// 当前页码
		var nowPage = 2;
		
		$('.ck_more_dp').on('click',function(){
			if(totalPage >= nowPage){
				$('.dp_reply_list li:lt(' + nowPage*5 + ')').show();
				nowPage++;
				if(nowPage>totalPage){
					$('.ck_more_dp').hide();
				}
			}
		});
		
		
		$('.pinglun , .write_dp_input ').on('click',function(){
			if(checkLogin()){
				$('.main').hide();
				$('.dpdetail_tan').show();
				
				$('.dpqx_aera>textarea').focus();
			}
		});
		
		$('.cancle').on('click',function(){
			$('.dpdetail_tan').hide();
			$('.main').show();
		});
		
		$('.dpqx_aera>textarea').on('input change',function(){
			if ($(this).val()) {
                $('.fsbtn').addClass('active');
            } else {
                $('.fsbtn').removeClass('active');
            }
		});
		
		
	
		// 点击发表按钮
        $('.fsbtn').on('click', function () {
            var $this = $(this);
            var content = checkContent($('.dpqx_aera>textarea'));
			$.post('/xf.d?m=makeHf',
				{
					newcode: vars.newcode,
					city: vars.city,
					userid: userid,
					username: encodeURIComponent(username),
					content: encodeURIComponent(content),
					tid: vars.id,
					fid: ''
				},
				function (data) {
					if (data) {						
						if (data.root.result === '100') {
							$('.fs_suc').show();
							setTimeout(function(){
								window.location.href = window.location.href;
							},2000);
						} else {
							alert(data.root.message);
						}
					}
				});
        });
		
		/*
        *检测发表的内容
         */
        function checkContent(a) {
            var content = a.val().trim();
            if (!content) {
                alert('回复内容不能为空');
                return false;
            }else if (content.length > 40) {
                alert('回复内容不能超过40字');
                return false;
            } else {
                return content;
            }
        }
		
		$('.comment-dp-xfother').on('click', function(){
			window.location.href = $(this).attr('data-href');
		});
		
		
		$('.comment-head').on('click', function(){
			if(vars.anonymous != '1'){
				var zanuserid = (userid===undefined?'':userid);
				var tiaozhuan = '/xf.d?m=getSomeCommentList&userid='+vars.pluserid+'&type=&zanuserid='+zanuserid+'&page=1&pagesize=10&imei=1';
				
				window.location.href = tiaozhuan;
			}
		});
		
		
		// 统计行为 --------------end
	    require.async('//clickm.fang.com/click/new/clickm.js', function () {
	        Clickstat.eventAdd(window, 'load', function () {
	                Clickstat.batchEvent('waplpdpdetail_', '');
	        });
	    });
  
	 
	 
	
	
	
	 
});
