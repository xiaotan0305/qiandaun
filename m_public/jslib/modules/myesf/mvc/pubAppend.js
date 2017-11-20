/**
 * 我的二手房完善信息页vue
 * Created by lina on 2017/3/27.
 */
define('modules/myesf/mvc/pubAppend', ['jquery', 'modules/myesf/mvc/component', 'upload/1.0.0/upload', 'smsLogin/smsLogin'],
    function (require, exports, module) {

        'use strict';
        module.exports = function () {
            require('modules/myesf/mvc/component');
            var vars = seajs.data.vars;
            var $ = require('jquery');
            var ua = navigator.userAgent.toLowerCase();
            var iphone = ua.match('iphone');
            var android = ua.match('android');
            Vue.component('content', {
                template: '<section class="pdX14 pdY20 yzent">'
                + '<span class="wticon-dws" v-show="!editShow"></span>'
                + '<div class="yzenttit" v-show="!editShow">上传图片</div>'
                + '<div class="yzenttit" v-show="editShow">'
                + '<a href="javascript:void(0);" style="color:#83868f;" id="revise" @click="editImg">'
                + '<span class="arr-r" >修改</span>'
                + '</a>'
                + '上传图片</div>'
                + '<div class="yzentinfo mt14 gray-b">上传图片房源展示机会增加50%哦</div>'
                + '<dl v-if="passPhoto">'
                + '<dd v-for="item in passPhoto">'
                + '<img class="imgClass" src="{{item}}" >'
                + '</dd>'
                + '</dl>'
                + '<upload-img v-else></upload-img>'
                + '</section>'
                + '<section class="pdX14 pdY20 yzent">'
                + '<span class="wticon-dws" v-if="!haveVedio"></span>'
                + '<div class="yzenttit">拍摄房源视频</div>'
                + '<div class="yzentinfo mt14 gray-b">上传视频房源展示机会增加哦</div>'
                + '<dl class="mt14">'
                + '<dd class="mar0 no2" id="imgContainer"></dd>'
                + '<div class="explaina"><i class="jt"></i>1.手机视频不超过30M<br>2.拍摄时缓慢移动，尽量拍摄每个房间，同时说明房间用途。</div>'
                + '</dl></section>'
                + '<div class="space8"></div>'
                + '<section class="pdX14 pdY20 yzent" >'
                + '<span class="wticon-dws" v-if="!desCon"></span>'
                + '<div class="yzenttit">房源自评</div>'
                + '<div class="yzentinfo mt14 gray-b">您的点评将被购房者阅读，点评越详细，房源排名越靠前</div>'
                + '<div class="mt14 dparea">'
                + '<textarea name="" cols="" v-on:input="desIpt" rows="" v-model="desCon" maxlength="500" class="area-text h90 " placeholder="写点您房源的卖点吧！例如装修情况、小区环境等等"></textarea>'
                + '<div class="yzentnum">{{zsTip}}</div></div></section>'
                + '<div class="space8"></div>'
                + '<section class="pdX14 pdY20 yzent">'
                + '<div class="yzenttit">'
                + '<a href="javascript:void(0)" style="color:#83868f;">'
                + '<span class="arr-r" v-on:click="editInfo" id="editBtn" >修改</span>'
                + '</a>房源信息</div>'
                + '<div class="pdY10">'
                + '<ul class="flextable">'
                + '<li v-if="room && hall && toilet"><span>户型：</span><p>{{room}}室{{hall}}厅{{toilet}}卫</p></li>'
                + '<li v-if="area"><span>面积：</span><p>{{area}}㎡</p></li>'
                + '<li v-if="floor"><span>楼层：</span><p>{{floor}}/{{totalFloor}}层</p></li>'
                + '<li v-if="forward"><span>朝向：</span><p>{{forward}}</p></li>'
                + '<li v-if="price"><span>价格：</span><p>{{price}}万</p></li>'
                + '<li v-if="name"><span>姓名：</span><p>{{name}}</p></li>'
                + '</ul></div>'
                + '</section>'
                + '<p class="pdX14 pdYb20"><a href="javascript:void(0)" @click="submit" class="btn-pay mar0">提 交</a></p>'
                + '<no-save v-show="nosaveShow"></no-save>',
                data: function () {
                    if (vars.passPhoto) {
                        var arr = vars.passPhoto.split(',');
                        if (arr.length >= 4) {
                            arr.length = 4;
                        }
                    }
                    return {
                        // 户型室
                        room: vars.room || '',
                        // 户型厅
                        hall: vars.hall || '',
                        // 户型卫
                        toilet: vars.toilet || '',
                        // 楼层
                        floor: vars.floor || '',
                        totalFloor: vars.totalfloor || '',
                        // 朝向
                        forward: vars.forward || '',
                        // 姓名
                        name: vars.linkman || '',
                        // 面积
                        area: vars.area || '',
                        // 房源点评
                        desCon: vars.description || '',
                        // 价格
                        price: vars.price || '',
                        // 编辑页地址
                        editUrl: vars.editUrl,
                        // 已经上传的图片
                        passPhoto: arr || '',
                        editShow: vars.passPhoto,
                        // 已经输入的字数提示
                        zsTip: vars.description ? vars.description.length + '/500' : '0/500',
                        // 编辑未保存弹框
                        nosaveShow: false,
                        isSave: false,
                        // 是否有视频
                        haveVedio: vars.HouseVideoUrl || '',
                        // 视频封面
                        videoPhoto: '',
                        // 视频地址
                        videoUrl: '',
                        editFlag: '',
                        imgFlag: ''
                    };
                },
                methods: {
                    preventDef: function (e) {
                        e.preventDefault();
                    },
                    // 阻止页面滚动
                    unable: function () {
                        var that = this;
                        document.addEventListener('touchmove', that.preventDef);
                    },
                    // 允许页面滚动
                    enable: function () {
                        var that = this;
                        document.removeEventListener('touchmove', that.preventDef);
                    },
                    setHis: function (name, value) {
                        if (vars.localStorage) {
                            vars.localStorage.setItem(name, value);
                        }
                    },
                    getHis: function (name) {
                        if (vars.localStorage) {
                            return vars.localStorage.getItem(name);
                        }
                    },
                    getUploadImg: function () {
                        var imgUrlStr;
                        var imgUrlArry = [];
                        var $myesfAddPic = $('#myesfAddPic');
                        if ($myesfAddPic.find('img').length) {
                            $myesfAddPic.find('img').each(function () {
                                imgUrlArry.push($(this).attr('src'));
                            });
                            imgUrlStr = imgUrlArry.join(',');
                        } else if (vars.passPhoto) {
                            imgUrlStr = vars.passPhoto;
                        } else {
                            imgUrlStr = '';
                        }
                        return imgUrlStr;
                    },
                    // 输入房源点评
                    desIpt: function () {
                        var that = this;
                        var len = that.desCon.length;
                        that.zsTip = len + '/500';
                    },
                    // 点击图片修改按钮
                    editImg: function () {
                        var that = this;
                        var imgUrl = that.getUploadImg();
                        var indexId = vars.indexId;
                        var houseId = vars.houseId;
                        that.setHis('myesfUpload' + indexId + houseId, imgUrl);
                        if (that.desCon !== vars.description || that.videoPhoto !== vars.VideoCoverPhoto) {
                            that.nosaveShow = true;
                            that.imgFlag = true;
                        }else{
                            window.location.href = vars.mySite + '?c=myesf&a=editImg&city=' + vars.city + '&houseid='+ houseId + '&indexId=' + indexId;
                        }
                    },
                    editInfo: function () {
                        var that = this;
                        if (that.desCon !== vars.description || that.videoPhoto !== vars.VideoCoverPhoto) {
                            that.nosaveShow = true;
                            that.editFlag = true;
                        }else{
                            window.location.href = vars.editUrl;

                        }
                    },
                    // 点击提交
                    submit: function () {
                        var that = this;
                        var $myesfAddPic = $('#myesfAddPic');
                        var $imgs = $myesfAddPic.find('img');
                        if ($myesfAddPic.length && $imgs.length && $imgs.attr('src').match('loading')) {
                            alert('图片上传中，请耐心等待');
                            return false;
                        }
                        var url = vars.mySite + '?c=myesf&a=ajaxdelegateEdit';
                        var param = {
                            // 房源描述
                            description: that.desCon,
                            // 房源的图片
                            imgs: that.getUploadImg(),
                            city: vars.city,
                            price: vars.price,
                            room: vars.room,
                            hall: vars.hall,
                            toilet: vars.toilet,
                            area: vars.area,
                            block: vars.block,
                            UnitNumber: vars.UnitNumber,
                            roomNumber: vars.roomNumber,
                            callTime: vars.callTime,
                            floor: vars.floor,
                            totalfloor: vars.totalfloor,
                            forward: vars.forward,
                            rawid: vars.rawid,
                            linkman: vars.linkman,
                            houseId: vars.houseId,
                            indexId: vars.indexId,
                            delegateid: vars.delegateid
                        };
                        if (that.videoPhoto) {
                            param.videoPhoto = that.videoPhoto;
                            param.videoUrl = that.videoUrl;
                        }
                        $.ajax({
                            type: 'post',
                            url: url,
                            data: param,
                            success: function (data) {
                                if (data.result === '1') {
                                    alert(data.message);
                                    // 提交完后的跳转地址
                                    window.location.href = vars.mySite + '?c=mycenter&a=sellFangList&city=' + vars.city;
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
                    var $back = $('.back');
                    var $myesfAddPic = $('#myesfAddPic');
                    var oldDes = that.desCon;
                    // 点击左上角的回退按钮
                    $back.on('click', function () {
                        // 没有保存显示提示未保存的弹框
                        // 一种情况是修改了图片，另一种是修改了房源点评
                        if (oldDes !== that.desCon || (!vars.passPhoto && $myesfAddPic.find('img').length) || that.videoPhoto !== vars.VideoCoverPhoto) {
                            that.nosaveShow = true;
                            that.unable();
                        } else {
                            $(this).attr('href', 'javascript:history.back(-1)');
                        }
                    });
                    function getGUID() {
                        var i = 0;
                        var result = "";
                        var pattern = "0123456789abcdef";
                        for (; i < 24; i++) {
                            result += pattern.charAt(Math.round(Math.random() * 15));
                        }
                        var time = new Date().getTime();
                        result += ("00000000" + time.toString(16).toLocaleLowerCase()).substr(-8);
                        return result;
                    }

                    var guiId = getGUID();
                    // 上传视频提示框
                    var formVideo = $('#formVideo');
                    var explaina = $('.explaina');
                    var $imgcontainer = $('#imgContainer');
                    if(android && ua.match('qqbrowser')){
                        var iptHtml = '<form id="formVideo" name="videoForm" method="post" enctype="multipart/form-data">'
                            + '<input  type="file" name="file" capture="camaorder" accept="video/mp4" class="upload-input" id="upload_video"></form>';
                    }else{
                        var iptHtml = '<form id="formVideo" name="videoForm" method="post" enctype="multipart/form-data">'
                            + '<input  type="file" name="file"  accept="video/mp4" class="upload-input" id="upload_video"></form>';
                    }
                    $imgcontainer.html(iptHtml);
                    if (vars.VideoCoverPhoto) {
                        var imgHtml = '<img width="61" class="imgClass imgObj" alt="图片加载失败"src="' + vars.VideoCoverPhoto + '" /><a href="javascript:void(0)" class="close delete imgObj"></a>';
                        $imgcontainer.html(imgHtml);
                        explaina.hide();
                        that.videoPhoto = vars.VideoCoverPhoto;
                        that.videoUrl = vars.HouseVideoUrl;
                    }

                    $(document).off('click').on('click', '.delete', function () {
                        if (confirm('确定要删除此视频吗')) {
                            $('.imgObj').remove();
                            that.videoPhoto = '';
                            that.videoUrl = '';
                            $imgcontainer.html(iptHtml);
                            explaina.show();
                            that.haveVedio = false;
                            guiId = getGUID();
                            uploadV();
                        }
                    });
                    var ajaxFlag = true;

                    function uploadV() {
                        $.ajax({
                            url: vars.mainSite + 'main.d?m=authToken',
                            dataType: 'text',
                            success: function (data) {
                                new upload({
                                    url: 'https://videou.3g.fang.com/upload/video?i=' + guiId + '&city=ds.house&uid=' + vars.uid + '&t=' + data,
                                    onSuccess: function () {
                                        if (ajaxFlag) {
                                            ajaxFlag = false;
                                            setTimeout(function () {
                                                var url = 'https://videou.3g.fang.com/upload/video?i=' + guiId + '&mp4=true';
                                                $.ajax({
                                                    url: url,
                                                    success: function (data) {
                                                        if (data) {
                                                            ajaxFlag = true;
                                                            // 上传失败
                                                            if (data.indexOf('error') > -1) {
                                                                if(android){
                                                                    if(ua.match('ucbrowser')){
                                                                        alert('该浏览器不支持录制上传，您可以选择本地文件上传');
                                                                    }
                                                                }
                                                                if(iphone){
                                                                    if(ua.match('ucbrowser')){
                                                                        alert('该浏览器不支持选择文件上传，您可以录制视频上传');
                                                                    }
                                                                }
                                                                $('#imgVideo').remove();
                                                                $imgcontainer.html(iptHtml);
                                                                explaina.show();
                                                                return false;
                                                            } else {
                                                                var dataArr = data.split(',');
                                                                if(parseInt(dataArr[2]) < 1){
                                                                    alert('视频播放时间不能少于1秒');
                                                                    $('#imgVideo').remove();
                                                                    $imgcontainer.html(iptHtml);
                                                                    explaina.show();
                                                                    return false;
                                                                }
                                                                that.haveVedio = true;
                                                                $('#imgVideo').remove();
                                                                that.videoPhoto = dataArr[5];
                                                                that.videoUrl = dataArr[8];
                                                                var imgHtml = '<img class="imgObj" width="61" class="imgClass" alt="图片加载失败"src="' + dataArr[5] + '" /><a href="javascript:void(0)" class="close delete imgObj"></a>';
                                                                $imgcontainer.html(imgHtml);
                                                                explaina.hide();
                                                            }
                                                        }

                                                    },
                                                    error: function (err) {
                                                        alert(err);
                                                    }
                                                });
                                            }, 100);
                                        }
                                    },
                                    onProgress: function () {
                                        if (!$('#imgVideo').length) {
                                            var loadingUrl = vars.public + 'images/loading.gif';
                                            var imgHtml = '<img id="imgVideo" class="imgObj" width="61" class="imgClass" alt="图片加载失败"src="' + loadingUrl + '" />';
                                            $imgcontainer.html(imgHtml);
                                            $('#formVideo').remove();
                                            explaina.hide();
                                        }
                                    },
                                    filter: function (files) {
                                        // 文件大于30M则不允许上传
                                        if (files.size > 30000000) {
                                            alert('请上传30M以下的视频文件');
                                            $('#formVideo').remove();
                                            $imgcontainer.html(iptHtml);
                                            return false;
                                        } else if (files.length > 1) {
                                            alert('最多上传一个视频');
                                            return false;
                                        }
                                        return files;
                                    },
                                    onFailure: function () {
                                        $('#imgVideo').remove();
                                        $imgcontainer.html(iptHtml);
                                        explaina.show();
                                        alert('视频上传失败');
                                    }
                                });
                            }
                        });
                    }
                    uploadV();
                    if(iphone && ua.match('qqbrowser')){
                        $(document).on('click','#upload_video',function(){
                            alert('该浏览器暂不支持视频上传，请用Safari浏览器进行上传');
                            return false;
                        });
                    }

                }
            });
            new Vue({
                el: 'body'
            });
        };
    });
