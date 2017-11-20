/**
 * @author lipengkun@fang.com  APP小区点评抽奖活动相关功能
 */
define('modules/esfhd/xqWriteComment', ['imageUpload/1.0.0/imageUpload_myzf', 'upload/1.0.0/upload', 'floatAlert/1.0.0/floatAlert', 'swipe/3.10/swiper'],  function (require,exports,module) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var Swiper = require('swipe/3.10/swiper');
    //****弹框蒙层对象插件****

    var floatAlert = require('floatAlert/1.0.0/floatAlert');
    var option = {type: '1'};//弹框插件样式选项
    var floatObj = new floatAlert(option);

    //****头图跳转****
    $('#imgjump').click(function(){
        var jump = $('#imgjump').attr('data-href');
        window.location.href = jump;
    });

    //****选择联想小区****
    // 选择小区search
    if ($('#CFJ_searchtext').length > 0) {
        require.async('search/esfhd/xiaoquSearch', function (xiaoquSearch) {
            var XiaoquSearch = new xiaoquSearch();
            XiaoquSearch.init();
        });
    }


    //****滚动条****
    var mySwiper = new Swiper('#scrollobj', {
        autoplay: 2000,//可选选项，自动滑动
        loop:true,
        autoplayDisableOnInteraction : false,
        observer:true,
        observeParents:true,
    });
    //mySwiper.update();

    //****点评内容****
    var content = $('#content');
    var words = $('#words');

    function showords(obj) {
        var length = obj.val().length;
        if (obj.val().length < 30) {
            var count1 = 30 - length;
            words.text('您还需要输入' + count1 + '字');
        } else if (obj.val().length < 500) {
            var count2 = 500 - length;
            words.text('您还能输入' + count2 + '字');
        }
    }
    showords(content);
    content.on('input', function(){
        showords($(this));
    });



    //****上传图片****
    //图片上传对象
    var imgupload, imgurls;
    require.async(['imageUpload/1.0.0/imageUpload_myzf'], function (ImageUpload) {
        imgupload = new ImageUpload({
            sonTemp: '<dd></dd>',
            fatherTemp: '<dl class="clearfix img_list"></dl>',
            // 图片显示模版
            imgTemp: '<img width="60" class="imgClass">',
            // 删除图片按钮模版
            delBtnTemp: '<a class="close"></a>',
            // loading样式
            loadingGif: vars.public + 'images/loading.gif',
            // 添加图片按钮模版
            inputTemp: '<input type="file" name="pic0" id="pic0" accept="image/*" class="upload-input" multiple="">',
            // 图片容器
            container: '#imgcon',
            // input的容器样式
            inputClass: 'photonew',
            imgCountId: '',
            // 上传图片地址
            url: vars.esfSite + '?c=esfhd&a=ajaxUploadImg&city=' + vars.city,
            // 最多上传图片
            maxLength: 5,
            // 额外上传按钮，例如论坛中点击图片
            richInputBtn: '',
            // 已上传图片地址，用作编辑时，目前是以：'图片名1,图片地址1;图片名2,图片地址2' 这种形式拼接
            imgsUrl: '',
            // 数量改变时执行的回调
            numChangeCallback: function (count) {
                //if (count === 0) {
                //    $showpicId.css('display', 'block').find('dl').addClass('wi80');
                //}
            }
        });
    });
    //**获取上传图片路径**
    function getImgUrlFileName() {
        var imgsArray = imgupload.imgsArray;
        var arr = [], titleImg;
        if (imgsArray) {
            for (var i = 0; i < imgsArray.length; i++) {
                arr.push(imgsArray[i].imgurl);
            }
            if (imgsArray[0]) {
                titleImg = imgsArray[0].imgurl;
            } else {
                titleImg = '';
            }
        }
        return [titleImg, arr.join(',')];
    }

    //****身份选择****
    $('.list_lei li').click(function () {
        $(this).find('i').addClass('on');
        $(this).siblings('.list_lei li').find('i').removeClass('on');
    });

    //****获取参数****
    //参数数组
    var param = {};
    //获取经纬度
    function showPosition(position) {
        param.coordx = position.coords.latitude.toFixed(2);
        param.coordy = position.coords.longitude.toFixed(2);
    }
    //获取当前位置
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        }
    }

    //****点击提交按钮****
    $('.btn_tj').on('click', function () {
        if (content.val().length < 30) {
            floatObj.showMsg('最少要30个字哦，再说两句吧', 2000);
            return false;
        }
        if (vars.newcode === '0') {
            floatObj.showMsg('请先选择小区', 2000);
            return false;
        }
        // 城市
        param.city = vars.city;
        // 点评内容
        param.content = encodeURIComponent(content.val().trim());
        // 图片地址
        param.pic_url = getImgUrlFileName()[1];
        // 来源类型
        param.type = vars.appos;
        // 小区id
        param.newcode = vars.newcode;
        //用户类型
        $('.list_lei li').each(function(){
            if ($(this).find('i').hasClass('on')) {
                param.editor_type = $(this).attr('value');
                if ($(this).hasClass('mar_no') && $(this).attr('value') === '匿名网友') {
                    param.anonymous = 1;
                }
            }
        });
        //获取当前地理位置
        getLocation();
        //提交接口
        $.ajax({
            url: vars.esfSite + '?c=esfhd&a=ajaxSubXqComment',
            data: param,
            success: function (data) {
                if (data.errcode === '100') {
                    floatObj.showMsg(data.errmsg, 2000);
                    window.location.href = vars.esfSite + '?c=esfhd&a=xqCommentSuc&city=' + vars.city + '&newcode=' + vars.newcode + '&comid=' + data.comid;
                } else {
                    floatObj.showMsg(data.errmsg, 2000);
                }
            },
            error: function () {
                floatObj.showMsg('提交失败，请稍后重试', 2000);
            }
        });
    });


    //****签到抽奖****
    $('.hasdp').click(function(){
        var projcode = $(this).attr('data-newcode');
        var signParam = {
            newcode : projcode,
        };
        //提交接口
        $.ajax({
            url: vars.esfSite + '?c=esfhd&a=ajaxXqdpSignIn',
            data: signParam,
            success: function (data) {
                if (data.errcode === '100') {
                    floatObj.showMsg(data.errmsg, 2000);
                    window.location.href = vars.mainSite + 'huodongAC.d?m=newWheelLottery&class=NewWheelLotteryHc&lotteryId=101601&channel=newhouse' + '&city=' +vars.city + '&projCode=' + projcode;
                } else {
                    floatObj.showMsg(data.errmsg, 2000);
                }
            },
            error: function () {
                floatObj.showMsg('网络错误，请稍后重试', 2000);
            }
        });
    });
});