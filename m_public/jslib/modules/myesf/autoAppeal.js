/**
 * Created by lina on 2016/12/30.
 * 完善信息页编辑图片
 */
define('modules/myesf/autoAppeal', function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        var $ = require('jquery');
        //身份证号验证
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        //身份证号
        var linkman = $('#linkman');
        //姓名
        var linkname = $('#linkname');
        //申诉按钮
        var submit = $('#submit');
        //toast提示内容
        var toast = $('#sendFloat');
        //手持身份证照片
        var handident = $('#handident');
        //身份证正面照
        var identPro = $('#identPro');
        //身份证反面照片
        var identCon = $('#identCon');
        //房产证照片
        var property = $('#property');
        //城市
        var city = vars.city;
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
                    fatherTemp: '<div></div>',
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
                    }
                });
            });
        }
        // 上传手持身份证图片，1张
        imgUpload('#handident', 1);
        // 上传身份证正面图片，1张
        imgUpload('#identPro',1);
        // 上传身份证反面图片，1张
        imgUpload('#identCon',1);
        // 上传房产证，1张
        imgUpload('#property',1);

        // 防止两次点击
        var aFlag = false;
        //点击申诉按钮
        submit.on('click', function () {
            if (aFlag) {
                return;
            }
            aFlag = true;
            //身份证号验证
            if(reg.test(linkman.val()) === false) {
                aFlag = false
                showMsg('请正确填写身份证号码');
                return false;
            }
            //手持身份证证号验证
            var handimg = handident.find('img').attr('src');
            if (!handimg) {
                aFlag = false
                showMsg('请添加手持身份证图');
                return false;
            }
            //身份证正面验证
            var proimg = identPro.find('img').attr('src');
            if (!proimg) {
                aFlag = false
                showMsg('请添加身份证正面图');
                return false;
            }
            //身份证反面验证
            var conimg = identCon.find('img').attr('src');
            if (!conimg) {
                aFlag = false
                showMsg('请添加身份证反面图');
                return false;
            }
            //姓名
            var name = linkname.val();
            if (!name) {
                aFlag = false
                showMsg('请正确填写房产证持有人姓名');
                return false;
            }
            //房产证图
            var fczimg = property.find('img').attr('src');
            if (!fczimg) {
                aFlag = false
                showMsg('请添加房源信息图');
                return false;
            }
            var params = {};
            // 身份证号
            params.linkman = linkman.val();
            // 手持身份证照
            params.handimg = handimg;
            // 身份证正面
            params.proimg = proimg;
            // 身份证反面
            params.conimg = conimg;
            // 房产证照片
            params.fczimg = fczimg;
            //姓名
            params.linkname = linkname.val();
            $.post(vars.mySite + '?c=myesf&a=ajaxAutoAppeal', params, function (data) {
                if (data && data.code === '100') {
                    toast.children().text('申诉成功，请重新发布房源');
                    toast.show();
                    setTimeout(function () {
                        toast.hide();
                    }, 4000);
                    window.location.href = vars.mySite + '?c=myesf&a=delegateAndResale&city=' + city;
                } else {
                    toast.children().text('申诉失败，请使用搜房帮发布房源');
                    toast.show();
                    setTimeout(function () {
                        toast.hide();
                    }, 4000);
                    window.location.href = vars.mySite + '?c=mycenter&a=sellFangList&city=' + city;
                }
                aFlag = false;
            });
        });
        //toast提示
        function showMsg(text){
            toast.children().text(text);
            toast.show();
            setTimeout(function () {
                toast.hide();
            }, 3000);
        }
    };
});

