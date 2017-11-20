/**
 * @author liuxinlu@fang.com  搜房帮特价房活动相关功能
 */
define('modules/esfhd/TjfInfo', ['imageUpload/1.0.0/imageUpload_esfhd','upload/1.0.0/upload'],  function (require) {
    'use strict';
        // jquery对象
        var $ = require('jquery'),
        // 页面数据
            vars = seajs.data.vars,
            // 搜房帮房源id
            houseId = $('#houseId'),
            // 楼栋号
            buildingId = $('#buildingId'),
            // 单元号
            unitId = $('#unitId'),
            // 房号
            roomId = $('#roomId'),
            // 业主联系电话
            tel = $('#ownerPhone'),
            // 业主委托书
            proxy = '',
            // 房源实勘视频
            houseViedeo ='',
            telExp = /^1[34578]{1}[0-9]{9}$/,
            // 图片上传组件
            imageUpload = require('imageUpload/1.0.0/imageUpload_esfhd'),
            // 提交房源信息按钮
            subBtn = $('#submit'),
            // ajax 标识
            ajaxFlag,
            // 是否经纪人电话标识
            isAgent = false,
            // 是否验证过
            isVerify = false,
            // 视频地址
            videoUrl,
            // 上传进度
            progress = $('#progress'),

            // 重新上传按钮
            reUploadBtn = $('.barNote'),
            // 视频上传按钮
            uploadBtn = $('.add_vedio');

        // 上传图片处理 start
        var $showpicId = $('#uploadPic');
        // 参数对象
        var params = {};
        // 图片上传 ,只传一张图片
        var imgupload;
        imgupload = new imageUpload({
                container: '#uploadPic',
                maxLength: 10,
                inputTemp: '<input type="file" accept="image/*" multiple="multiple" class="upload-input">',
                url: '?c=esfhd&a=ajaxTJFUploadImg&city=' + vars.city
            });

        var uploadNetPic;
        uploadNetPic= new imageUpload({
            container: '#uploadNetPic',
            maxLength: 10,
            inputTemp: '<input type="file" accept="image/*" multiple="multiple" class="netupload-input">',
            inputBtn: '#netPicUpload',
            url: '?c=esfhd&a=ajaxTJFUploadImg&city=' + vars.city
        });
        // 视频上传
        var uploaderObj = new upload({
            url: 'https://videou.3g.fang.com/upload/video?city=jjr.house',
            onSuccess: function (file, result,url) {
                $.ajax({
                    url:url,
                    success:function(result) {
                        // 上传失败
                        if (result.indexOf('error') > -1) {
                            fail();
                            alert('视频上传失败');
                        } else {
                            uploadBtn.hide();
                            progress.show();
                            progress.find('.barLenth').width('100%');
                            progress.find('.barPercent').text('100%');
                            reUploadBtn.show();
                            var videoArr = result.split(',');
                            videoUrl = videoArr[4];
                        }
                    }
                });
            },
            onProgress: function (n) {
                uploadBtn.hide();
                progress.show();
                if (n > 98) {
                    n = 99;
                }
                progress.find('.barLenth').width(n + '%');
                progress.find('.barPercent').text(n+ '%');
            },
            filter: function (files) {
                // 文件大于500M则不允许上传
                if (files.size > 512000000) {
                    alert('文件内容太大，请上传0-500M是视频文件');
                    return false;
                }
                return files;
            },
            onFailure: function () {
                alert('视频上传失败');
                fail();
            }
        });
        var fail = function() {
            progress.find('.barLenth').width('0%');
            progress.find('.barPercent').text('0%');
            progress.hide();
            reUploadBtn.hide();
            videoUrl = '';
            uploadBtn.show();
        };
        // 点击重新上传视频按钮，则重新显示视频图片
        reUploadBtn.on('click',fail);

    tel.on('input',function(){
        var telVal = tel.val().trim();
        if (!telVal) {
            tel.parent().next().hide();
            isAgent = false;
        }
    });
    tel.blur(function(){
        verifyTel();
    });
    // 验证经纪人电话
    var verifyTel = function() {
        var telVal = tel.val().trim();
        tel.parent().next().hide();
        isAgent = false;
        if (telVal && telExp.test(telVal)) {
            $.ajax({
                url: vars.esfSite + '?c=esfhd&a=checkAgent',
                data: {
                    city: vars.city,
                    ownerPhone: telVal
                },
                success: function (data) {
                    isVerify = true;
                    if (data && parseInt(data) === 1) {
                        isAgent = true;
                        tel.parent().next().show();
                        return false;
                    } else {
                        isAgent = false;
                        tel.parent().next().hide();
                    }

                }
            });
        }
    };
    /**
     * 验证函数,验证必填参数，搜房帮房源Id,楼栋号，单元号，房间号，手机号
     */
    var verify = function () {
        var houseVal = houseId.val().trim();
        if (!houseVal) {
            alert('请输入搜房帮房源ID');
            return false;
        }
        params.houseId = houseVal;

        var buildingVal = buildingId.val().trim();
        if (!buildingVal) {
            alert('请输入楼栋号');
            return false;
        }
        params.buildingId = buildingVal;

        var unitVal = unitId.val().trim();
        if (!unitVal) {
            alert('请输入单元号');
            return false;
        }
        params.unitId = unitVal;
        var roomVal =roomId.val().trim();
        if (!roomVal) {
            alert('请输入房间号');
            return false;
        }
        params.roomId = roomVal;
        if (vars.city != 'tj') {
            // 手机和视频至少填写一项
            var telVal = tel.val().trim();
            if (!telVal && !videoUrl) {
                alert('请输入业主联系方式');
                return false;
            }
            if (telVal && !telExp.test(telVal)) {
                alert('请输入正确手机号');
                return false;
            }
            params.ownerPhone = telVal;
        } else {
            //天津：业主委托书， 房源实勘视频，房源所在经纪公司内网截图三项中必须选择一项
            var wtImgUrl = imgupload.imgsArray.imgurl;
            var netImgUrl = uploadNetPic.imgsArray.imgurl;
            if (!videoUrl && !wtImgUrl && !netImgUrl) {
                alert('请至少上传一种材料');
                return false;
            }
        }
        return true;
    };
         // 房源信息提交
        subBtn.on('click', function() {
            var verifyRes = verify();
            if (verifyRes && !isAgent) {
                    // 获取图片数据

                    //业主委托书
                    if (imgupload.imgsArray.imgurl) {
                        params.imgUrl = imgupload.imgsArray.imgurl;
                    }
                    if (imgupload.imgsArray.fileName) {
                        params.imgName = imgupload.imgsArray.fileName;
                    }
                    //内网截图
                    if (uploadNetPic.imgsArray.imgurl) {
                        params.netImgUrl = uploadNetPic.imgsArray.imgurl;
                    }
                    //if (uploadNetPic.imgsArray.fileName) {
                //    params.netImgName = uploadNetPic.imgsArray.fileName;
                //}

                    // 添加视频连接
                    if (videoUrl) {
                        params.videoUrl = videoUrl;
                    }
                    if (ajaxFlag) {
                        ajaxFlag.abort();
                    }
                    ajaxFlag = $.ajax({
                        url: vars.esfSite + '?c=esfhd&a=submitTjfInfo',
                        method: "POST",
                        data: params,
                        success: function (data) {
                            if (data.message) {
                                alert(data.message);
                            }
                        }
                    });
            }
        });
});