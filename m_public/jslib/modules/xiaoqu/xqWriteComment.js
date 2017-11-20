/**
 * Created by lina on 2017/4/19.
 * 小区点评页面,写点评，上传图片
 */
define('modules/xiaoqu/xqWriteComment',function(require,exports,module){
    module.exports = function(){
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var $msgObj = $('#sendFloat');
        var $msg = $('#sendText');
        function show(keywords){
            $msg.text(keywords);
            $msgObj.fadeIn();
            setTimeout(function(){
                $msgObj.fadeOut();
            },2000)
        }
        // 输入字数限制
        function limit(obj){
            var txtLen = obj.val().length;
            if(txtLen >= 501){
                obj.val(obj.val().slice(0,500));
                show('最多输入500个字');
                obj.next().text('还可输入0个字');
                return false;
            }
            leftLen = 500 - txtLen;
            obj.next().text('还可输入' + leftLen + '个字');
        }
        var $content = $('.tradepj_text1');
        // 输入评论，字数限制
        $content.on('input',function(){
            var $ele = $(this);
            limit($ele);
        });
        function imgUpload(id, length) {
            require.async(['imageUpload/1.0.0/imageUpload_myzf'], function (ImageUpload) {
                new ImageUpload({
                    container: id,
                    maxLength: length,
                    fatherTemp: '<dl></dl>',
                    sonTemp: '<dd class="moreAdd"></dd>',
                    // 添加图片按钮模版
                    inputTemp: '<input type="file" name="pic0" accept="image/*" class="upload-input" multiple="multiple">',
                    // input的容器样式
                    inputClass: 'add',
                    // 删除图片按钮模版
                    delBtnTemp: '<a class="close"></a>',
                    loadingGif: vars.public + 'images/loading.gif',
                    url: vars.esfSite + '?c=esfhd&a=ajaxUploadImg&city=' + vars.city,
                    numChangeCallback: function () {
                            var imgLen = $(id).find('img').length || 0;
                        if(imgLen === 8){
                            $(id).next().hide();
                        }else{
                            $(id).next().text('您还可以上传' + (length - imgLen) + '张图片').show();
                        }

                    }
                });
            });
        }
        imgUpload('#appendImg',8);
        var $appendImg = $('#appendImg');
        var canComit = true;
        function getImg(){
            var imgUrl;
            var arr = [];
            var i = 0;
            var imgObj = $appendImg.find('img');
            if(imgObj.length){
                for(;i<imgObj.length;i++){
                    arr.push(imgObj.eq(i).attr('src'));
                }
                imgUrl = arr.join(',');
            }
            return imgUrl;
        }
        var param = {};

        function getLocation()
        {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            }
        }
        function showPosition(position){
            param.coordx = position.coords.latitude.toFixed(2);
            param.coordy = position.coords.longitude.toFixed(2);

        }

        var url = vars.xiaoquSite + '?c=xiaoqu&a=ajaxXqComment';

        // 点击提交按钮
        $('.btn-dp').on('click',function(){
            if(!$content.val()){
                show('请输入文字，完成点评');
                return false;
            }else if( $content.val().length < 10){
                show('最少输入10个字');
                return false;
            }
            var $imgs = $appendImg.find('img');
            if ($imgs.length) {
                $imgs.each(function () {
                    var $this = $(this);
                    if ($this.attr('src').match('loading')) {
                        alert('图片上传中，请您耐心等待');
                        canComit = false;
                        return false;
                    }else{
                        canComit = true;
                    }
                });
            }
            getLocation();
            // 城市
            param.city = vars.city;
            // 点评内容
            param.content = encodeURIComponent($content.val().trim());
            // 图片地址
            param.pic_url = getImg();
            param.newcode = vars.newcode;
            if($('input:radio:checked').val() === '匿名网友'){
                param.anonymous = 1;
            }
            param.editor_type = $('input:radio:checked').val();
            if(canComit){
                $.ajax({
                    url:url,
                    data:param,
                    success:function(data){
                        if(data && data.rescode && data.rescode === '100'){
                            show('提交成功');
                            setTimeout(function(){
                                window.location.href = vars.xiaoquSite + '?a=xqCommentSuc&city=' + vars.city+ '&projCode=' + vars.newcode;
                            },2000)
                        }else{
                            show(data.resmsg);
                        }
                    },
                    error:function(){
                        show('提交失败，请稍后重试');
                    }
                })
            }

        })
    }
});