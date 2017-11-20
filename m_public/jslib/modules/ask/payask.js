/**
 * Created by lina on 2017/7/12.
 */
define('modules/ask/payask',['iscroll/2.0.0/iscroll-lite','floatAlert/1.0.0/floatAlert'],function(require,exports,module){
    'use strict';
    module.exports = function(){
        var scrollCtrl = require('iscroll/2.0.0/iscroll-lite');
        var vars = seajs.data.vars;
        var $ulList = $('#ulList');
        var $txtArae = $('.ipt-text');
        var liLen,ulWidth;
        var param = {
            answerUserId: '',
            cityname: vars.cityname,
            title: '',
            askPrice: ''
        };
        if(vars.expertId){
            param.answerUserId = vars.expertId;
            param.askPrice = vars.expertPrice;
        }
        // 设置ul的宽度
        function setUlWidth(){
            liLen =  $ulList.find('li').length;
            ulWidth = liLen * 255 +　15;
            $ulList.css('width',ulWidth + 'px');
            setTimeout(function(){
                scrollObj.refresh();
            },100)

        }

        var $askChtr = $('.askChtr');
        var $payAskBtn = $('.payAskBtn');
        var $freeAskBtn = $('.freeAskBtn');
        // tab切换
        $('.askTab').on('click','a',function(){
            var $ele = $(this);
            var index = $ele.index();
            $ele.addClass('cur').siblings().removeClass('cur');
            if(index === 0){
                $ulList.show();
                $askChtr.show();
                $payAskBtn.show();
                $freeAskBtn.hide();
                if ($txtArae.val() === '' || $txtArae.val() === '免费问大家：向百万经纪人和网友提问') {
                    $txtArae.val('向房天下问答专家提问，获取更加权威的解答');
                }
                $('.drag-content').hide();
            }else if(index === 1){
                $ulList.hide();
                $askChtr.hide();
                $payAskBtn.hide();
                $freeAskBtn.show();
                if ($txtArae.val() === '' || $txtArae.val() === '向房天下问答专家提问，获取更加权威的解答') {
                    $txtArae.val('免费问大家：向百万经纪人和网友提问');
                }
                $('.drag-content').show();
                //引用验证码
                require.async('https://static.soufunimg.com/common_m/m_recaptcha/js/app.js', function(){
                    /*验证码初始化*/
                    (function(window, $) {
                        // 调用验证控件
                        window.fCheck.init({
                            container: '.drag-content',
                            url: vars.askSite + '?c=ask&a=ajaxCodeInit',
                            callback: function() {
                                // 验证成功后的回调
                            }
                        });
                    })(this, jQuery);
                });
            }
        });
        var ajaxFlag = true;
        var docWidth = $(document).width();
        var page = 2;
        var totalPage = parseInt(vars.totalPage);
        var $loadBtn = $('.gray-b');
        if($loadBtn.length){
            page = 1;
            var ulHtml = '<div class="askPiclistA" id="expertList" style="overflow: hidden;display: none">'
            + '<ul id="ulList" style="height: 110px;">'
            + '</ul></div>';
            $('#resultCon').prepend(ulHtml);
            $ulList = $('#ulList');
            $.ajax({
                url: vars.askSite + '?c=ask&a=ajaxGetPayAskExpertList',
                data: {
                    reload: 'reload'
                },
                success: function (data) {
                    totalPage = parseInt(data);
                }
            });
            $loadBtn.on('click',function(){
                $('.askChtr').show();
                $('#expertList').show();
                getList();
                $loadBtn.hide();
            });
        }
        if(!vars.expertId && $('#expertList').length){
            setUlWidth();
            var scrollObj = new scrollCtrl('#expertList',{
                scrollX:true,
                scrollY:false

            });
        }
        // 获取专家列表
        function getList(){
            if(ajaxFlag){
                ajaxFlag = false;
                $.ajax({
                    url: vars.askSite + '?c=ask&a=ajaxGetPayAskExpertList',
                    data:{
                        page: page,
                        city: vars.cityname

                    },
                    success:function(data){
                        ajaxFlag = true;
                        if(data){
                            if(page === totalPage){
                                ajaxFlag = false;
                            }
                            if(page < totalPage) {
                                page += 1;
                            }
                            $('#ulList').append(data);
                            setUlWidth();

                        }
                    },
                    error:function(err){
                        ajaxFlag = true;
                    }
                })
            }

        }
        var scrollX;
        if(scrollObj && !vars.erpertId){
            scrollObj.on('scrollEnd',function(){
                if(scrollX === -(this.x)){
                    scrollObj.refresh();
                    return false;
                }
                scrollX = -this.x;
                if(parseInt(ulWidth - docWidth) === scrollX){
                    if(totalPage >= page){
                        getList();
                    }

                }
            });
        }
        var $txt;
        $ulList.on('click','li',function(){
            var $ele = $(this);
            $ele.siblings().removeClass('cur');
            $txtArae.blur();
            if($ele.hasClass('cur')){
                $ele.removeClass('cur');
                $askChtr.text('请选择一位专家');
                param.answerUserId = '';
                param.askPrice = '';
                $payAskBtn.text('支付并提问');
            }else{
                $ele.addClass('cur');
                $txt = $ele.find('.text');
                $askChtr.text('已选专家：' + $txt.text());
                param.answerUserId = $txt.attr('data-id');
                param.askPrice = $ele.find('p').text().slice(1);
                $payAskBtn.text('支付¥' + param.askPrice + '并提问');
            }
            check();
        });
        // 模拟placeholder
        $txtArae.on('focus',function(e){
            if($txtArae.val() === '向房天下问答专家提问，获取更加权威的解答' || $txtArae.val() === '免费问大家：向百万经纪人和网友提问'){
                $txtArae.val('');
            }
            e.stopPropagation();
        }).on('blur',function(e){
            if(!$txtArae.val().length){
                if ($ulList.is(":hidden")) {
                    $txtArae.val('免费问大家：向百万经纪人和网友提问');
                } else {
                    $txtArae.val('向房天下问答专家提问，获取更加权威的解答');
                }
            }
            e.stopPropagation();
        });
        function check(){
                if(param.title && param.answerUserId){
                    $payAskBtn.addClass('active');
                }else{
                    $payAskBtn.removeClass('active');
                }
        }
        var thisLen,$this;
        var $textLen = $('#textLen');
        if ($txtArae.val().trim() !== '向房天下问答专家提问，获取更加权威的解答' && $txtArae.val().trim() !== '免费问大家：向百万经纪人和网友提问') {
            $textLen.text($txtArae.val().trim().length + '/150');
        }
        $txtArae.on('input',function(){
            $this = $(this);
            thisLen = $this.val().trim().length;
            if(thisLen && thisLen <= 150){
                param.title = $this.val();
                $textLen.text(thisLen + '/150');
            }else{
                $textLen.text('0/150');
                param.title = '';
            }
            if($payAskBtn.is(':visible')){
                check();
            }
            if(thisLen){
                $freeAskBtn.addClass('active');
            }else{
                $freeAskBtn.removeClass('active');
            }
        });
 
        // 付费支付提交(提交成功跳到付费的问答详情页-由后台跳转)
        $payAskBtn.on('click',function(){
            if(!$(this).hasClass('active')){
                return false;
            }
            if (!checkTextAreaLen()) {
                return false;
            }
            $.ajax({
                url:vars.askSite + '?c=ask&a=ajaxPayPostAsk',
                data: param,
                success:function(data){
                    if(data.code){
                        errorMessage(data.message);
                    } else {
                        $('body').append(data);
                        setTimeout(function(){
                            $('#submit').submit();
                        },0)
                    }
                }
            })
        });

        // 免费提问提交(提交成功跳到免费的问答详情页)
        $freeAskBtn.on('click',function(){
            // 判断是否操作了验证组件。
            if (window.fCheck.config.result === null){
                errorMessage('您尚未完成滚动条验证');
                return false;
            }
            var coderesult = window.fCheck.config.result;
            if(!$(this).hasClass('active')){
                return false;
            }
            if (!checkTextAreaLen()) {
                return false;
            }
            $.ajax({
                url: vars.askSite + '?c=ask&a=postAsk' + '&title='  + param.title + '&source=payAsk'+'&challenge='+coderesult.fc_challenge+'&validate='+coderesult.fc_validate,
                success:function(data){
                  if (data.Info === '100') {
                      window.location.href = vars.askSite + 'ask_' + data.askid + '.html';
                  } else {
                      errorMessage(data.message);
					  // 重新初始化
					  window.fCheck.reinit();
                  }
                }
            })
        });
        /**
         * 检查提问文本域的内容长度5-150
         * @returns {boolean}
         */
        function checkTextAreaLen(){
            var $textAreaLen = $txtArae.val().trim().length;
            if ($textAreaLen < 6) {
                errorMessage('问题字数太少了吧');
                return false;
            } else if ($textAreaLen > 150) {
                errorMessage('问题字数太多了吧');
                return false;
            }
            return true;
        }

        /**
         * 提示错误信息
         * @param str
         */
        function errorMessage(str){
            var $str = str;
            $('#prompt').show();
            $('#promptContent').text($str);
            setTimeout(function () {
                $('#prompt').hide();
            }, 2000);
        }
    }
});
