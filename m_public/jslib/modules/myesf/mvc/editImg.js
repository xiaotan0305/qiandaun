/**
 * 我的二手房图片编辑页面
 * @author lina
 */
define('modules/myesf/mvc/editImg', ['jquery', 'modules/myesf/mvc/component', 'smsLogin/smsLogin'],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            require('modules/myesf/mvc/component');
            var vars = seajs.data.vars;
            var $ = require('jquery');
            Vue.component('content',{
                template:'<section class="pdX14 pdYb20 yzent mt5">'
                + '<section class="pdX14 pdYb20 yzent mt5">'
                + '<upload-img></upload-img>'
                + '</section>'
                + '<div class="space8"></div>'
                + '<section v-if="noPassPhoto" class="pdX14 pdY20 yzent noPassPic" id="noPassPic">'
                + '<div class="yzenttit">以下图片不符合要求,审核未通过</div>'
                + '<dl class="mt5">'
                + '<dd v-for="item in noPassPhoto"><a class="close" v-on:click="deletNopass($index)"></a><img src="{{item}}" ></dd>'
                + '</dl>'
                + '</section>'
                + '<div v-show="noPassPhoto" class="submitbox a01 noPassPic">'
                + '<ul>'
                + '<li class="f12">您的房源照片可能有如下问题，请重新上传</li>'
                + '<li class="f11 mt8">1、图片是手机截屏，非正常拍摄照片</li>'
                + '<li class="f11">2、房源照片出现不相关的水印</li>'
                + '<li class="f11">3、房源照片中出现人像等与房间不相关的内容</li>'
                + '<li class="f11">4、房源照片比例不对，请尽量上传横向拍摄的照片，展示效果会更好</li>'
                + '</ul>'
                + '</div>'
                + '<p class="pdX14 pdYb20"><a href="javascript:void(0)" class="btn-pay mar0" @click="submit">保 存</a></p>'
                + '<div class="floatAlert" v-show="floatShow" :value="deletIndex">'
                + '<div class="alert" >'
                + '<div class="cont">'
                + '<p class="center pdY10 f16">'
                + '您确定要删除审核未通过的照片吗？'
                + '</p></div><div class="btns flexbox">'
                + '<a href="javascript:void(0);" @click="sureDelet">确定</a>'
                + '<a href="javascript:void(0);" @click="cancelDelet">取消</a>'
                + '</div></div></div>'
                + '<div class="floatAlert" v-show="backShow">'
                + '<div class="alert" >'
                + '<div class="cont">'
                + '<p class="center pdY10 f16">'
                + '编辑未保存,确定放弃保存？'
                + '</p></div><div class="btns flexbox">'
                + '<a href="{{backUrl}}">确定</a>'
                + '<a href="javascript:void(0);" @click="cancelBack">取消</a>'
                + '</div></div></div>',
                data: function () {
                    return {
                        // 已经上传的图片
                        passPhoto:vars.passPhoto ? vars.passPhoto.split(',') : '',
                        floatShow:false,
                        deletIndex:'',
                        // 审核未通过的图片
                        noPassPhoto:vars.noPassPhoto ? vars.noPassPhoto.split(',') : '',
                        // 回退地址
                        backUrl: vars.backUrl,
                        // 回退弹框
                        backShow:false
                    };
                },
                methods: {
                    setHis: function (name,value) {
                        if(vars.localStorage) {
                            vars.localStorage.setItem(name,value);
                        }
                    },
                    getUploadImg: function () {
                        var imgUrlStr;
                        var imgUrlArry = [];
                        var $myesfAddPic = $('#myesfAddPic');
                        $myesfAddPic.find('img').each(function () {
                            imgUrlArry.push($(this).attr('src'));
                        });
                        imgUrlStr = imgUrlArry.join(',');
                        return imgUrlStr;
                    },
                    deletNopass: function (index) {
                        this.floatShow = true;
                        this.deletIndex = index;

                    },
                    sureDelet: function () {
                        console.log(this.deletIndex);
                        this.passPhoto.splice(this.deletIndex,this.deletIndex + 1);
                        this.floatShow = false;
                    },
                    cancelDelet: function () {
                        this.floatShow = false;
                    },
                    cancelBack: function () {
                        this.backShow = false;
                    },
                    submit: function () {
                        var that = this;
                        var $myesfAddPic = $('#myesfAddPic');
                        var $imgs = $myesfAddPic.find('img');
                        if($myesfAddPic.length && $imgs.length && $imgs.attr('src').match('loading')){
                            alert('图片上传中，请耐心等待');
                            return false;
                        }
                        var url = vars.mySite + '?c=myesf&a=ajaxdelegateEdit';
                        that.passPhoto = that.getUploadImg();
                        var param = {
                            // 房源描述
                            description: vars.description,
                            // 房源的图片
                            imgs: that.passPhoto,
                            price: vars.price,
                            city: vars.city,
                            room: vars.room,
                            hall: vars.hall,
                            toilet: vars.toliet,
                            area: vars.area,
                            block: vars.block,
                            UnitNumber: vars.UnitNumber,
                            roomNumber: vars.roomNumber,
                            floor: vars.floor,
                            totalfloor: vars.totalfloor,
                            forward: vars.forward,
                            rawid: vars.rawid,
                            callTime: vars.callTime,
                            linkman: vars.linkman,
                            houseId: vars.houseId,
                            indexId: vars.indexId,
                            delegateid: vars.delegateid
                        };
                        if(vars.VideoCoverPhoto){
                            param.videoPhoto = vars.VideoCoverPhoto;
                            param.videoUrl = vars.HouseVideoUrl;
                        }
                        $.ajax({
                            url: url,
                            type: 'post',
                            data: param,
                            success: function (data) {
                                if (data.result === '1') {
                                    alert(data.message);
                                    if(vars.localStorage.getItem('myesfUpload') + vars.indexId + vars.houseId){
                                        vars.localStorage.removeItem('myesfUpload'  + vars.indexId + vars.houseId);
                                    }
                                    // 提交完后的跳转地址
                                    window.location.href = '/my/?c=myesf&a=publishAppend&city=' + vars.city + '&indexId=' + vars.indexId + '&houseid=' + vars.houseId;
                                } else if (data.message) {
                                    alert(data.message);
                                } else {
                                    alert(data);
                                }
                            }
                        });
                    }
                },
                ready: function () {
                    var that = this;
                    var $myesfAddPic = $('#myesfAddPic');
                    var $imgs = $myesfAddPic.find('img');
                    var imgLen = $imgs.length;
                    $('.back').on('click',function () {
                        if($myesfAddPic.length && imgLen && imgLen !== $myesfAddPic.find('img').length) {
                            that.backShow = true;
                        }else{
                            window.location.href = vars.backUrl;
                        }
                    });
                }
            });
            new Vue({
                el:'body'
            });
        };
    });
