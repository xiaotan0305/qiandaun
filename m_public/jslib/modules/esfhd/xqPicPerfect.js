/**
 * Created by lina on 2017/3/3.
 * @author lina 数字社区改版 2017/4/13
 * 上传图片页
 */
define('modules/esfhd/xqPicPerfect', function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        var $ = require('jquery');
        var param = {
            agentId: vars.agentId || '',
            agentUserId: vars.agentUserId || '',
            agentName: vars.agentName || '',
            projCode: vars.projCode || '',
            managerName: vars.managerName || ''
        };
        var nameArr = ['doorImg', 'appearImg', 'plantImg', 'toolImg'];
        var $upLoad = $('.arr-btn');
        var $float = $('.floatBox');
        // 点击浮层的任意位置，关闭提示框
        $float.on('click',function(){
            $(this).hide();
        });

        /**
         * 初始化已经上传的图片
         * @param data 已经存在的图片的信息
         * @returns {string} 拼接好的html
         */
        function initialImg(data){
            var len = data.length;
            var i = 0;
            var htmlObj = '';
            var claName,status,src,picId;
           for(;i<len;i++){
               var thisData = data[i];
               claName = thisData.class;
               status = thisData.statue;
               src = thisData.url;
               if(thisData.picid){
                   picId = thisData.picid;
               }
               htmlObj += '<dd>'
               + '<img src="' + src + '"><span class="'+ claName + '" picId = "' + picId + '">' + status + '</span>'
               + '</dd>'
           }
            return htmlObj;
        }

        /**
         * 上传图片函数
         * @param id 上传图片容器的id
         * @param length 最多上传图片的数量
         */
        function imgUpload(id, length,data) {
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
                        var arr = [];
                        var index = $(id).parents('.maT15').index() - 1;
                        var $uploadImg = $('.moreAdd');
                        if($uploadImg.find('img')){
                            $upLoad.removeClass('no');
                        }else{
                            $upLoad.addClass('no');
                        }
                        // 存储改变后的地址
                        $(id).find('.moreAdd').each(function () {
                            var $ele = $(this).find('img');
                            arr.push($ele.attr('src'));
                        });
                        // 显示或者隐藏上传图片的按钮
                        if ($(id).find('img').length === length) {
                            $(id).find('.add').hide();
                        } else {
                            $(id).find('.add').show();
                        }
                        param[nameArr[index]] = arr.join(',');
                    }
                });
                if(data){
                    if(data.length >= length){
                        $(id).find('.add').hide();
                    }
                    $(id).find('dl').prepend(initialImg(data));
                    if($(id).find('.s3').length){
                        var agentId = vars.agentId;
                        if(localStorage && !(localStorage.getItem(agentId))){
                            $float.show();
                            localStorage.setItem(agentId,true);
                        }
                        $(id).find('.s3').on('click',function(){
                            var that = $(this);
                            var url = vars.esfSite + '?c=esfhd&a=ajaxDelUnapprovedPic&projCode='+vars.projCode+'&picId='+ that.attr('picId') + '&managerName=' + vars.managerName;
                            $.ajax({
                                url:url,
                                type:'GET',
                                success:function(data){
                                    if(data.result === '100'){
                                        that.parent('dd').detach();
                                        var imgCon = that.parent('.append-img').find('img');
                                        if(imgCon && imgCon.length < length){
                                            $(id).find('.add').show();
                                        }
                                    }else{
                                        alert(data);
                                    }
                                }
                            })
                        });
                    }
                    $(id).find('img').on('error',function () {
                        $(this).addClass('defaultImg');
                    });
                }
            });
        }
        /**
         * 信息提示浮层
         */
        var sendFloatId = $('#alertBox');
        var sendTextId = $('.alert-txt');
        var alertBtn = $('#alert-btn');

        /**
         * 信息提示函数
         * @param keywords 要提示的信息
         */
        function show(keywords) {
            sendFloatId.show();
            sendTextId.html(keywords);
        }
        var backUrl;
        if(vars.agentType === 'DS'){
            backUrl = vars.esfSite + '?c=esfhd&a=xqRecommend&agentType=DS&city=' + vars.city + '&agentId=' + vars.agentId;
        }
        var reload = false;
        alertBtn.off('click').on('click', function () {
            sendFloatId.hide();
            if (sendTextId.text() === '图片已提交成功，审核通过后会立刻通知您') {
                setTimeout(function () {
                    window.location.href = backUrl;
                }, 1000);
            }
            if(reload){
                reload = false;
                window.location.href = window.location.href;
            }
            sendTextId.html('');
        });
        var doorData = JSON.parse(vars.doorImg);
        var appraenData = JSON.parse(vars.appearImg);
        var plantData = JSON.parse(vars.plantImg);
        var toolData = JSON.parse(vars.toolImg);
        // 上传小区大门图片，1张
        imgUpload('#doorCon', 1,doorData);
        // 上传楼盘外观图片，5张
        imgUpload('#appraenCon',5,appraenData);
        // 上传环境绿化图片，5张
        imgUpload('#plantCon',5,plantData);
        // 上传配套设施图片，4张
        imgUpload('#toolCon', 4,toolData);
        var url = vars.esfSite + '?c=esfhd&a=submitXqPic&city=' + vars.city;
        var canAjax = true;
        var canComit = true;
        // 点击提交按钮
        $upLoad.on('click', function () {
            var $uploadImg = $('.moreAdd');
            var $imgs = $uploadImg.find('img');
            if ($imgs.length) {
                $imgs.each(function () {
                    var $this = $(this);
                    if ($this.attr('src').match('loading')) {
                        show('图片上传中，请您耐心等待');
                        canComit = false;
                        return false;
                    }else{
                        canComit = true;
                    }
                });
            }
            if (!canComit) {
                return false;
            }
            if (!param.doorImg && !param.appearImg && !param.plantImg && !param.toolImg) {
                show('请添加所要提交的图片');
                return false;
            }
            if(vars.agentType === 'DS'){
                param.agentType = 'DS';
            }
            if (canAjax) {
                canAjax = false;
                $.ajax({
                    url: url,
                    data: param,
                    type: 'POST',
                    success: function (data) {
                        if (data.item.status === '100') {
                            if(vars.agentType !== 'DS'){
                                window.location.href = vars.esfSite + '?c=esfhd&a=xqSubSuccess&city='+ vars.city +'&agentId='+ vars.agentId +'&projCode='+ vars.projCode+'&where=xqPicPerfect';
                            }else{
                                show('图片已提交成功，审核通过后会立刻通知您');
                            }


                        } else if (data.item.status === '111') {
                            show(data.item.message);
                            reload = true;
                        } else {
                            show(data.item.message);
                        }
                        canAjax = true;
                    },
                    error: function () {
                        show('网络错误，请您刷新重试');
                        canAjax = true;
                    }
                });
            }
        });
    };
});