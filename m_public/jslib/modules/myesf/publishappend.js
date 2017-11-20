/**二手房房源发布改版
 *@author lina 20160930
 */
define('modules/myesf/publishappend', ['jquery', 'modules/esf/yhxw'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var yhxw = require('modules/esf/yhxw');
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });
        var pageId = 'muchelpsellrevise';
        // 统计用户浏览行为
        yhxw({type: 0, pageId: pageId, curChannel: 'myesf'});
        // 图片上传
        // 缓存图片上传的显示容器
        var $myesfAddPic = $('#myesfAddPic');
        var $title = $('.wticon-dws').eq(0);
        var $yzent = $('.yzent').eq(0);
        var $yzentit = $yzent.find('.yzenttit');
        var $yzenttit0 = $yzentit.eq(0);
        var $yzenttit1 = $yzentit.eq(1);

        function hideShow() {
            if ($myesfAddPic.find('img').length || !$myesfAddPic.length) {
                $title.hide();
                $yzenttit0.hide();
                $yzenttit1.show();
            } else {
                $title.show();
                $yzenttit0.show();
                $yzenttit1.hide();
            }
        }

        $myesfAddPic.show();
        require.async(['imageUpload/1.0.0/imageUpload_myzf'], function (ImageUpload) {
            $myesfAddPic.find('.add').hide();
            new ImageUpload({
                container: '#myesfAddPic',
                maxLength: 10,
                fatherTemp: '<dl class="mt14"><div class="explain" style="position:absolute;left:30%">上传2张照片以上，得200积分</div></dl>',
                sonTemp: '<dd ></dd>',
                // 添加图片按钮模版
                inputTemp: '<input type="file" name="pic0" id="pic0" accept="image/*" class="upload-input" multiple>',
                // input的容器样式
                inputClass: 'add',
                // 删除图片按钮模版
                delBtnTemp: '<a class="close"></a>',
                loadingGif: vars.public + 'images/loading.gif',
                url: '?c=myesf&a=ajaxUploadImg&city=' + vars.city,
                numChangeCallback: function () {
                    if ($myesfAddPic.find('dd').length === 1) {
                        $myesfAddPic.find('.explain').show();
                    } else {
                        $myesfAddPic.find('.explain').hide();
                    }
                    var len = $myesfAddPic.find('img').length;
                    if (len === 10) {
                        $('.add').hide();
                    } else {
                        $('.add').show();
                    }
                    hideShow();
                }
            });
            // 初始化已经上传的图片
            if($myesfAddPic.length){
                var imgUrlArry;
                var html = '';
                if (vars.localStorage.getItem('imgUrls')) {
                    imgUrlArry = vars.localStorage.getItem('imgUrls').split(',');
                    vars.localStorage.removeItem('imgUrls');
                }
                if(imgUrlArry){
                    var imgUrlArryLen = imgUrlArry.length;
                    // 循环生成已上传图片的html
                    for (var i = 0; i < imgUrlArryLen; i++) {
                        html += '<dd><img width="61" class="imgClass" style="" src="' + imgUrlArry[i] + '"><a class="close"></a></dd>';
                    }
                    setTimeout(function () {
                        $myesfAddPic.find('dl').prepend(html);
                        $myesfAddPic.find('.explain').hide();
                        var len = $myesfAddPic.find('img').length;
                        if (len >= 10) {
                            $('.add').hide();
                        } else {
                            $('.add').show();
                        }
                        hideShow();
                    }, 200);
                    $myesfAddPic.find('img').on('error', function () {
                        $(this).addClass('defaultImg');
                    });
                }
                $myesfAddPic.find('.add').on('click', function () {
                    isSave = false;
                });
                // 点击图片上的删除按钮
                $myesfAddPic.on('click', '.close', function () {
                    if (confirm('确定要删除图片吗?')) {
                        $(this).parent().remove();
                    }
                    // 图片数量小于10的时候显示上传图片的按钮
                    if ($myesfAddPic.find('img').length < 10) {
                        $myesfAddPic.find('.add').show();
                    }
                    // 如果没有图片时，显示上传200积分的提示框
                    if ($myesfAddPic.find('dd').length === 1) {
                        $myesfAddPic.find('.explain').show();
                    } else {
                        $myesfAddPic.find('.explain').hide();
                    }
                    hideShow();
                });
            }
        });
        var imgUrls;
        var canSave = true;
        /**
         * 获得图片地址的方法
         * @returns 获得所有图片的地址
         */
        function getImgUrls() {
            imgUrls = [];
            var $img = $('.imgClass');
            $img.each(function () {
                if ($myesfAddPic.length) {
                    var $ele = $(this);
                    if($ele.attr('src').match('loading')){
                        alert('图片上传中，请耐心等待');
                        canSave = false;
                        return false;
                    }else{
                        canSave = true;
                    }
                    imgUrls.push($(this).attr('src'));
                } else {
                    imgUrls = vars.passPhoto.split(',');
                }
            });
        }

        // 点击图片旁边的修改按钮
        $('#revise').on('click', function () {
            getImgUrls();
            if(canSave){
                vars.localStorage.setItem('imgUrls', imgUrls);
                window.location.href = vars.mySite + '?c=myesf&a=editImg&city=' + vars.city + '&houseid='+ vars.houseId + '&indexId=' + vars.indexId;
            }
        });
        var isSave = true;

        function preventDefault(e) {
            e.preventDefault();
        }

        /**
         * 手指滑动时阻止浏览器默认事件(阻止页面滚动）
         */
        function unable() {
            document.addEventListener('touchmove', preventDefault);
        }

        /**
         * 手指滑动恢复浏览器默认事件（恢复滚动
         */
        function enable() {
            document.removeEventListener('touchmove', preventDefault);
        }

        // 点击左上角的回退按钮
        var $floatAlert = $('.floatAlert');
        $('.back').on('click', function () {
            // 没有保存显示提示未保存的弹框
            if (!isSave) {
                $floatAlert.eq(0).show();
                unable();
            } else {
                $(this).attr('href', 'javascript:history.back(-1)');
            }
        });
        // 点击弹框的取消按钮
        $('#cancel').on('click', function () {
            $floatAlert.hide();
            enable();
        });
        // 房源点评获得焦点事件
        var remark = $('#remark');
        remark.on('focus', function () {
            isSave = false;
        });
        var len;
        var $yzentnum = $('.yzentnum');
        $yzentnum.html(remark.val().trim().length + '/500');
        remark.on('input', function () {
            len = remark.val().trim().length;
            if (len <= 500) {
                $yzentnum.html(len + '/500');
            }
        });
        // 点击提交按钮
        var submitInfo = $('.btn-pay');
        submitInfo.on('click', function () {
            isSave = true;
            var url = vars.mySite + '?c=myesf&a=ajaxdelegateEdit';
            getImgUrls();
            if (imgUrls.length) {
                imgUrls = imgUrls.join();
            } else {
                imgUrls = '';
            }
            var param = {
                // 房源描述
                description: remark.val().trim(),
                // 房源的图片
                imgs: imgUrls,
                city: vars.city,
                price: vars.price,
                room: vars.room,
                hall: vars.hall,
                toilet: vars.toliet,
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
            if (!param.price) {
                alert('网络错误，请刷新重试');
                return false;
            }
            if(canSave){
                $.ajax({
                    type: 'post',
                    url: url,
                    data: param,
                    success: function (data) {
                        if (data.result === '1') {
                            alert(data.message);
                            // 提交完后的跳转地址
                            window.location.href = '/my/?c=mycenter&a=sellFangList&city=' + vars.city;
                        } else if (data.message) {
                            alert(data.message);
                        } else {
                            alert(data);
                        }
                    }
                });
            }
        });
    };
});
