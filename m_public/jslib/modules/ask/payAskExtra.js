/**
 * Created by hanxiao on 2017/11/2.
 */
define('modules/ask/payAskExtra',['photoswipe/4.0.7/photoswipe', 'photoswipe/4.0.7/photoswipe-ui-default.min', 'lazyload/1.9.1/lazyload'],function(require,exports,module){
    'use strict';
    module.exports = function(){
        var vars = seajs.data.vars;
        var $ = require('jquery');

        var $payAskBtn = $('#payAskBtn');
        var $txtArea = $('#textarea');
        // 付费支付提交(提交成功跳到付费的问答详情页-由后台跳转)
        $payAskBtn.on('click',function(){
            if (!checkTextAreaLen()) {
                return false;
            }
            var $city = $('#cityBox').text().trim();
            if ($city === '请选择提问的城市') {
                errorMessage('请选择提问的城市');
                return false;
            }
            var $title = $txtArea.val().trim();

            //获取上传图片的地址
            var imgStr = [];
            var str = '';
            if ($('.tdpic').length) {
                $('.tdpic').find('img').each(function(data){
                    imgStr.push($(this).attr('original'));
                });
                str = imgStr.join(',');
            }
            //从房产圈跳转到的付费提问页地址里增加参数from=fcq
            if (vars.from) {
                var from = vars.from;
            } else {
                var from = '';
            }
            $.ajax({
                url:vars.askSite + '?c=ask&a=ajaxPayPostAsk',
                data : {
                    title : $title,
                    answerUserId : vars.expertId,
                    askPrice : vars.price,
                    cityname : $city,
                    imgStr : str,
                    from : from,
                },
                success:function(data){
                    if(data.code){
                        errorMessage(data.message);
                    } else {
                        window.localStorage.removeItem('title');
                        $('body').append(data);
                        setTimeout(function(){
                            $('#submit').submit();
                        },0)
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
            } else if ($textAreaLen < 6) {
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
            $('#float').show();
            $('#promptContent').text($str);
        }
        // 点击弹层上的我知道了隐藏弹层
        $('#close').on('click', function(){
            $('#float').hide();
        });
        /**
         * 免费提问输入文本长度检验 6-150
         */
        var $this, thisLen;
        var $textLen = $('.num');
        $txtArea.on('input',function(){
            $this = $(this);
            thisLen = $this.val().trim().length;
            if(thisLen && thisLen <= 150){
                $textLen.text(thisLen + '/150');
            }else{
                $textLen.text('0/150');
            }
            window.localStorage.setItem("title", $txtArea.val().trim());
        });

        if (window.localStorage.getItem('title')) {
            var $str = window.localStorage.getItem('title');
            $txtArea.val($str);
            $textLen.text($str.length + '/150');
        }

        //统计上传成功次数
        var count = 0;
        var imgupload = null;
        // 图片上传
        require.async(['imageUpload/1.0.0/imageUpload_postask'], function (ImageUpload) {
            imgupload = new ImageUpload({
                uploadBtn : '#uploadImg',
                loadingImg : vars.upLoading,
                url: vars.askSite + '?c=ask&a=ajaxUploadImg',
                onSuccess : function (fileObj, data) {
                    count++;
                    data = JSON.parse(data);
                    $('.uploadpic').find('.tdpic').eq(count - 1).html('<img class="lazyload" style="width:38px;height:38px" original="' + data.original + '"src="'+ data.url + '" /><a class="close"></a>');
                },
            });
        });

        //删除图片
        $('.uploadpic').on('click', 'a', function(){
            var that = $(this);
            if (confirm('\u786e\u5b9a\u8981\u5220\u9664\u6b64\u56fe\u7247\u5417\u003f')) {
                that.parent().remove();
                count--;
            }
        });

        //控制最多只能传三张图
        $('#uploadImg').on('click', function(){
            var $city = $('#cityBox').text().trim();
            if ($city === '请选择提问的城市') {
                errorMessage('请选择提问的城市');
                return false;
            }
            if (count >= 3) {
                errorMessage('最多可上传三张图片');
                return false;
            }
        });
        var thisIndex = 0;
        function getUrl(obj,index,arr,url){
            var ele = obj[index];
            var src = $(ele).attr('original');
            var img = new Image();
            img.src = src;
            if(url === src){
                thisIndex = index;
            }
            img.addEventListener('load',function(){
                index += 1;
                arr.unshift({src: src, w: img.naturalWidth, h: img.naturalHeight});
                if (index < obj.length) {
                    getUrl(obj,index,arr,url);
                } else {
                    var pswpElement = $('.pswp')[0];
                    var options = {
                        history: false,
                        focus: false,
                        index: thisIndex,
                        escKey: true
                    };
                    var gallery = new window.PhotoSwipe(pswpElement, window.PhotoSwipeUI_Default, arr, options);
                    gallery.init();
                }
            },false);
        }
        // 单击内容中的图片，显示原图
        require.async(['photoswipe/4.0.7/photoswipe', 'photoswipe/4.0.7/photoswipe-ui-default.min'], function () {
            $('.uploadpic').on('click', 'img', function () {
                $(document).scrollTop(44);
                var url = $(this).attr('original');
                var imgStrs = $('.uploadpic').find('img');
                var slides = [];
                // 点击缩放大图浏览
                if (imgStrs.length > 0) {
                    getUrl(imgStrs,0,slides,url);
                }
            });
        });
    }
});
