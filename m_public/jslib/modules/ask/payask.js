/**
 * Created by hanxiao on 2017/11/2.
 */
define('modules/ask/payask',['lazyload/1.9.1/lazyload', 'loadMore/1.0.2/loadMore'],function(require,exports,module){
    'use strict';
    module.exports = function(){
        var vars = seajs.data.vars;
        var $ = require('jquery');
        require('lazyload/1.9.1/lazyload');
        $('img').lazyload();
        var loadMore = require('loadMore/1.0.2/loadMore');
        loadMore({
            url: vars.askSite + '?c=ask&a=ajaxGetPayAskExpertList',
            total: vars.total,
            pagesize: 10,
            pageNumber: 10,
            moreBtnID: '.moreList',
            loadPromptID: '.moreList',
            contentID: '.payzjlistUl',
            loadAgoTxt: '<a>查看更多</a>',
            loadingTxt: '<a>加载中...</a>',
            loadedTxt: '<a>没有更多了</a>',
            firstDragFlag: false
        });

        /**
         * 点击专家列表，切换到专家列表，隐藏免费提问
         */
        $('#payAskBtn').on('click', function(){
            $(this).addClass('cur').siblings().removeClass('cur');
            // 专家列表
            $('.payzjlist').show();
            // 专家列表加载更多按钮
            $('.moreList').show();
            // 专家列表下方的专家聚合
            $('.allBox').show();
            //加载失败显示的加载失败页面
            if (!$('.askexpertno').is(":visible")) {
                $('.askexpertno').show();
            }
            //免费提问的textarea
            $('.askBox-area').hide();
            //免费提问按钮
            $('.ask-btn').hide();
        });

        /**
         * 点击免费提问，显示免费提问，隐藏专家列表页
         */
        $('#freeAskBtn').on('click', function(){
            $(this).addClass('cur').siblings().removeClass('cur');
            $('.payzjlist').hide();
            $('.moreList').hide();
            $('.allBox').hide();
            if ($('.askexpertno').is(":visible")) {
                $('.askexpertno').hide();
            }
            //免费提问的textarea
            $('.askBox-area').show();
            //免费提问按钮
            $('.ask-btn').show();
        });
        var $this, thisLen;
        var $txtArea = $('#txtArea');
        var $textLen = $('.num');
        var $freeAskBtn = $('.freeAskBtn');
        /**
         * 免费提问输入文本长度检验 6-50
         */
        $txtArea.on('input',function(){
            $this = $(this);
            thisLen = $this.val().trim().length;
            if(thisLen && thisLen <= 50){
                $textLen.text(thisLen + '/50');
            }else{
                $textLen.text('0/50');
            }
        });

        var $bc = $('#bc');
        // 免费提问提交(提交成功跳到免费的问答详情页)
        $freeAskBtn.on('click',function(){
            if (!checkTextAreaLen()) {
                return false;
            }
            var $title = $txtArea.val().trim();

            if ($title === '') {
                errorMessage('问题不可为空');
                return false;
            }
            var bc = $bc.val().trim();
            if (bc.length > 500){
                PromptExecution('补充说明不能多于500字');
                return false;
            }
            $.ajax({
                url: vars.askSite + '?c=ask&a=ajaxSubmitProblem' + '&title='+ $title + '&bc=' + bc,
                success:function(data){
                    if (data.code === '100') {
                        errorMessage('提问成功');
                        window.location.href = vars.askSite + 'ask_' + data.askid + '.html';
                    } else {
                        errorMessage(data.message);
                    }
                }
            })
        });
        /**
         * 检查提问文本域的内容长度5-150
         * @returns {boolean}
         */
        function checkTextAreaLen(){
            var $textAreaLen = $txtArea.val().trim().length;
            if ($textAreaLen === 0) {
                errorMessage('请输入您的问题');
                return false;
            }else if ($textAreaLen < 6) {
                errorMessage('问题最少6个字哦');
                return false;
            } else if ($textAreaLen > 150) {
                errorMessage('问题最多150个字哦');
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
