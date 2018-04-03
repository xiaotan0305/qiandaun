
/**
 * 查“房价”测“身价”
 * loupeiye@fang.com
 */
define('modules/pinggu/predValHD', ['jquery', 'html2canvas/1.0.0/html2canvas', 'weixin/2.0.0/weixinshare'], function (require, exports, module) {
    'use strict';
    module.exports = function (option) {
        // jquery库
        var $ = require('jquery');
        require('html2canvas/1.0.0/html2canvas');
        // 页面传入的参数
        var vars = seajs.data.vars;
        var $chooseCity = $('.city').children('input'),
            $chooseArea = $('.area').children('input'),
            $btn = $('.btn'),
            $close = $('.close'),
            $tips = $('.tips'),
            $city = '';
        function getPic(event) {
            // event.preventDefault();
            html2canvas(document.getElementById('pic'), {
                allowTaint: true,
                logging: true
            }).then(function(canvas){
                canvas.id = "mycanvas";
                //document.body.appendChild(canvas);
                //生成base64图片数据
                var dataUrl = canvas.toDataURL();
                var newImg = new Image();
                newImg.src =  dataUrl;
                newImg.onload = function(){
                    $('.card').find('img').attr('src',dataUrl);
                    $('.card').show();
                    $tips.hide();
                }
            }).catch(function(err){
               console.log(err);
            });
        }
        // 选择性别
        $(".role").on('click','li',function(){
            var $this = $(this);
            $this.find('input').addClass('checked');
            $this.siblings().find('input').removeClass('checked');
        })
        var ajaxflag = true;
        // 点击选择城市
        $chooseCity.on('input', function(e){
            var that = $(this);
            var ev = e || window.event;
            if(ajaxflag && ev.target.value){
                ajaxflag = false;
                $.ajax({
                    url: vars.pingguSite + '?c=pinggu&a=ajaxGetCityList&keyword=' + ev.target.value,
                    success: function(data) {
                        if (data) {
                            if (data.indexOf('<li') > -1) {
                                that.next('ul').html(data);
                                that.next('ul').css('display', 'block');
                            } else {
                                that.next('ul').css('display', 'none');
                                $city = data;
                                vars.city = data;
                            }
                        } else {
                            that.next('ul').css('display', 'none');
                        }
                    },
                    complete:function(){
                        ajaxflag = true;
                    }
                });
            } else if (!ev.target.value) {
                that.next('ul').css('display', 'none')
                $city = '';
                vars.city = '';
            }
        });

        // 选择城市
        $chooseCity.next('ul').on('click', 'li', function() {
            var that = $(this);
            $city = that.attr('data-encity');
            vars.city = $city;
            $chooseCity.val(that.text());
            $chooseCity.next('ul').css('display', 'none');
        });
        var xqflag = true;
        // 点击选择小区
        $chooseArea.on('input', function(){
            var that = $(this),
            inputValue = that.val();
            if(xqflag && inputValue && $city){
                xqflag = false;
                $.ajax({
                    url: vars.pingguSite + '?c=pinggu&a=ajaxGetSearchTip&flag=1&q=' + inputValue + '&city=' + vars.city,
                    success: function(data) {
                        if (data && $.trim(inputValue) !== '') {
                            var dataArr = typeof data === 'string' ? JSON.parse(data) : data;
                            var html = '';
                            if ($.isArray(dataArr) && dataArr.length > 0) {
                                for (var i = 0; i < dataArr.length; i++) {
                                    html += '<li data-projCode=' + dataArr[i].newcode + '>' + dataArr[i].name + '</li>';
                                }
                                that.next('ul').html(html);
                                that.next('ul').css('display', 'block');
                            }
                        } else {
                            that.next('ul').css('display', 'none');
                        }
                    },
                    complete:function(){
                        xqflag = true;
                    }
                });
            } else if (!inputValue) {
                that.next('ul').css('display', 'none');
                vars.projCode = '';
            }
        });

        // 选择小区
        $chooseArea.next('ul').on('click', 'li', function() {
            var that = $(this);
            vars.projCode = that.attr('data-projCode');
            $chooseArea.val(that.text());
            $chooseArea.next('ul').css('display', 'none');
        });
        // var videoContainer = $('.video-container');
        // var video = document.querySelector('.video');
        // video.addEventListener('ended',function(){
        //     alert(1);
        //     videoContainer.hide();
        //      $('.card').show();
        // })
        // video.onended = function(){
        //     alert('1');
        //      videoContainer.hide();
        //      $('.card').show();
        //      //getPic();
        // }

        // 生成身份
        var clickBtn = false;
        $btn.on('click', function() {
            var sex = $(".checked").val() || '女';
            if(!$city){
                showTips('city.png');
                return false;
            }else if(!vars.projCode){
                showTips('area.png');
                return false;
            }
            // 防止多次点击
            if (clickBtn) {
                return false;
            }
            showTips('icon0316.png');
            clickBtn = true;
            $.ajax({
                url: vars.pingguSite + '?c=pinggu&a=ajaxGenerResult&city=' + vars.city,
                data:{sex:sex, projCode: vars.projCode},
                success: function(data) {
                    if (data) {
                        $('.video-container').before(data);
                        $('.con').css('display', 'none');
                        $('.list').css('display', 'block');
                        // 生成截图
                        getPic();
   //                      // 显示视频层
   //                      videoContainer.show();
   //                      // 播放video
   //                      video.play();
   //                      setTimeout(function(){
   //                          video.parse();
   //                          videoContainer.hide();
   //                          $('.card').show();
   //                      },5000)
                    } else {
                        showTips('other.png');
                    }
                    clickBtn = false;
                }
            });
        });

        // 提示层关闭按钮
        $close.on('click', function(){
            $tips.hide();
        });

        // 提示显示
        function showTips(imgName) {
            $tips.find('.tishi').attr('src', vars.activity + 'predValHD/images/' + imgName)
            $tips.find('.tishi').removeClass('hide');
            $tips.css('display', 'block');
        }

        // 微信分享，调用微信分享的插件
        var Weixin = require('weixin/2.0.0/weixinshare');
        var wx = new Weixin({
            debug: false,
            shareTitle: vars.shareTitle,
            // 副标题
            descContent: vars.shareDescription,
            lineLink: location.href,
            imgUrl: vars.shareImage,
            swapTitle: false
        });
    }
});