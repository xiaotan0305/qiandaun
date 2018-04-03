/**
 * Created by lina on 2016/12/30.
 * 完善信息页编辑图片
 */
define('modules/zfhd/houseAllowance', function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        var $ = require('jquery');
        // 热combo所需的数组
        var preLoad = [];
        //身份证号验证
        var reg = /(^\d{11}$)/;
        //申诉按钮
        var submit = $('#submit');
        //toast提示内容
        var toast = $('#sendFloat');
        //租客身份证
        var cusIdentify = $('#cusIdentify');
        //房东身份证
        var hostIdentify = $('#hostIdentify');
        //租房合同
        var contract = $('#contract');
        //房产证照片
        var property = $('#property');
        //城市
        var city = vars.city;

        //点击提示关闭
        $('.zu-top-tips').find('.close').on('click', function(){
            $('.zu-top-tips').hide();
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
        imgUpload('#cusIdentify', 1);
        // 上传身份证正面图片，1张
        imgUpload('#hostIdentify',1);
        // 上传身份证反面图片，1张
        imgUpload('#contract',1);
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
            //手机号验证
            if(reg.test($('#linkphone').val()) === false) {
                aFlag = false
                showMsg('请正确填写手机号');
                return false;
            }
            //租客身份证正面图片
            var RenterIdCardUrl = cusIdentify.find('img').attr('src');
            if (!RenterIdCardUrl) {
                aFlag = false
                showMsg('请添加租客身份证正面图片');
                return false;
            }
            //房东身份证正面图片
            var OwnerIdCardUrl = hostIdentify.find('img').attr('src');
            if (!OwnerIdCardUrl) {
                aFlag = false
                showMsg('请添加房东身份证正面图片');
                return false;
            }
            //合同正面图片
            var RentContractUrl = contract.find('img').attr('src');
            if (!RentContractUrl) {
                aFlag = false
                showMsg('请添加合同正面图片');
                return false;
            }
            //房产证正面图片
            var HouseCardUrl = property.find('img').attr('src');
            if (!HouseCardUrl) {
                aFlag = false
                showMsg('请添加房产证正面图片');
                return false;
            }
            var linkphone = $('#linkphone');
            var params = {};
            // 身份证号
            params.linkphone = linkphone.val();
            // 手持身份证照
            params.RenterIdCardUrl = RenterIdCardUrl;
            // 身份证正面
            params.OwnerIdCardUrl = OwnerIdCardUrl;
            // 身份证反面
            params.RentContractUrl = RentContractUrl;
            // 房产证照片
            params.HouseCardUrl = HouseCardUrl;
            // 房源id
            params.houseid = vars.houseid;
            $.post(vars.zfSite + '?c=zfhd&a=submitAllowanceData&city=' + vars.city, params, function (data) {
                if (data && data.errcode === '100') {
                    showMsg(data.errmsg);
                    window.location.href = vars.mySite + '?c=myzf&city=' + city;
                } else {
                    showMsg(data.errmsg);
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
        preLoad.push('navflayer/navflayer_new2');
        // 预加载所需js
        require.async(preLoad);
    };
});

