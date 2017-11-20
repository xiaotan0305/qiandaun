/**
 * Created by lina on 2017/4/14.
 * 经纪人上传图片点评列内容页
 */
define('modules/esfhd/xqCommentImport',function(require){
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;

    // 输入字数限制
    function limit(obj){
        var txtLen = obj.val().length;
        if(txtLen >= 401){
            obj.val(obj.val().slice(0,400));
            obj.parents('.editarea').next().text('您还可以输入0个字');
            return false
        }
        var leftNum = 400 - txtLen;
        obj.parents('.editarea').next().text('您还可以输入'+ leftNum + '个字');
    }
    // 输入评论，字数限制
    $('.editbox').on('input',function(){
        var $ele = $(this);
        limit($ele);
    });
    /**
     * 上传图片函数
     * @param id 上传图片容器的id
     * @param length 最多上传图片的数量
     */
    function imgUpload(id, length) {
        require.async(['imageUpload/1.0.0/imageUpload_myzf'], function (ImageUpload) {
            new ImageUpload({
                container: id,
                maxLength: length,
                fatherTemp: '<dl class="append-img maT15"></dl>',
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

                }
            });
        });
    }
    var $msgObj = $('#sendFloat');
    var $msg = $('#sendText');
    function displayLose(keywords){
        $msg.text(keywords);
        $msgObj.fadeIn();
        setTimeout(function(){
            $msgObj.fadeOut();
        },2000)
    }

    imgUpload('#appendImg',8);
    var $editBox = $('.editbox');
    // 小区优点
    var $vantage = $editBox.eq(0);
    // 小区缺点
    var $demerit = $editBox.eq(1);
    function check(){
        if(!$vantage.val().trim().length){
            displayLose('请填写小区优点');
            return false;
        }else if($vantage.val().trim().length < 20){
            displayLose('小区优点最少填写20字');
            return false;
        }else if($vantage.val().trim().length > 400){
            displayLose('小区优点多填写400字');
            return false;
        }else if(!$demerit.val().trim().length){
            displayLose('请填写小区缺点');
            return false;
        }else if($demerit.val().trim().length < 20){
            displayLose('小区缺点最少填写20字');
            return false;
        }else if($demerit.val().trim().length > 400){
            displayLose('小区缺点最多填写400字');
            return false;
        }else{
            return true;
        }
    }
    var url = vars.esfSite + '?c=esfhd&a=xqCommentSubmit';
    var canComit = true;
    var param = {};
    var $appendImg = $('#appendImg');
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
    $('.pdX12').on('click',function(){
        if(!check()){
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
        param.advantage = $vantage.val().trim();
        param.demerit = $demerit.val().trim();
        param.pic_url = getImg();
        param.newcode = vars.newcode;
        param.agentId = vars.agentId;
        console.log(param);
        if(canComit){
            canComit = false;
            $.ajax({
                url:url,
                type:'POST',
                data:param,
                success:function(data){
                    if(data.rescode === '100'){
                        window.location.href = vars.esfSite + '?c=esfhd&a=xqSubSuccess&city=bj&agentId=' + vars.agentId + '&projCode=' + vars.newcode + '&where=xqComment';
                    }else{
                        alert(data.resmsg);
                    }
                    canComit = true
                },
                error:function(){
                    canComit = true;
                }
            })
        }


    })
});
