/**
 * Created by lina on 2016/12/30.
 * 完善信息页编辑图片
 */
define('modules/myesf/editImg', function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // 图片上传
        // 缓存图片上传的显示容器
        var $myesfAddPic = $('#myesfAddPic');
        var vars = seajs.data.vars;
        // 是否保存
        var isSave = true;
        // 结果数组
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
                    var len = $myesfAddPic.find('img').length;
                    if (len) {
                        // 有图片的时候上传200积分的提示框隐藏
                        $('.explain').hide();
                        // 图片的数量大于等于10张的时候隐藏上传图片的按钮
                        if (len >= 10) {
                            $('.add').hide();
                        } else {
                            $('.add').show();
                        }
                    } else {
                        // 没有图片的时候显示送200积分的提示框
                        $('.explain').show();
                    }
                    isSave = false;
                }
            });
            // 初始化已经上传的图片
            if (vars.localStorage.getItem('imgUrls')) {
                var html = '';
                // 跟完善信息页的图片数量同步
                var imgUrlArry = vars.localStorage.getItem('imgUrls').split(',');
                vars.localStorage.removeItem('imgUrls');
                var imgUrlArryLen = imgUrlArry.length;
                // 循环生成已存在图片的html
                for (var i = 0; i < imgUrlArryLen; i++) {
                    html += '<dd><img width="61" class="imgClass" style="" src="' + imgUrlArry[i] + '"><a class="del"></a></dd>';
                }
                // 设置定时100毫秒，保证图片上传的插件已经就绪
                setTimeout(function () {
                    $myesfAddPic.find('dl').prepend(html);
                    $myesfAddPic.find('.explain').hide();
                    // 如果有10张图片的话隐藏上传
                    var len = $myesfAddPic.find('img').length;
                    if (len >= 10) {
                        $('.add').hide();
                    } else {
                        $('.add').show();
                    }
                    getImgUrls();
                }, 100);
                $myesfAddPic.find('img').on('error', function () {
                    $(this).addClass('defaultImg');
                });
            }
            // 点击图片上的删除按钮
            $myesfAddPic.on('click', '.del', function () {
                // 提示用户是否删除图片
                if (confirm('确定要删除图片吗?')) {
                    $(this).parent().remove();
                }
                // 当图片的数量小于10才显示上传图片的按钮
                if ($myesfAddPic.find('img').length < 10) {
                    $myesfAddPic.find('.add').show();
                }
                // 没有图片的时候显示送200积分的框
                if ($myesfAddPic.find('dd').length === 1) {
                    $myesfAddPic.find('.explain').show();
                } else {
                    $myesfAddPic.find('.explain').hide();
                }
                isSave = false;
            });
        });
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
        var imgUrls;
        /**
         * 获得图片地址的方法
         * @returns 获得所有图片的地址
         */
        function getImgUrls() {
            imgUrls = [];
            var $img = $('.imgClass');
            $img.each(function () {
                if ($myesfAddPic.length) {
                    imgUrls.push($(this).attr('src'));
                } else {
                    imgUrls = vars.passPhoto.split(',');
                    console.log(imgUrls.length);
                }
            });
        }
        // 点击左上角的回退按钮
        var $floatAlert = $('.floatAlert');
        $('.back').on('click', function () {
            vars.localStorage.setItem('imgUrls', imgUrls);
            // 没有保存显示提示未保存的弹框
            if (!isSave) {
                $floatAlert.eq(0).show();
                unable();
            } else {
                window.location.href = vars.mySite + '?c=myesf&a=publishAppend&city=' + vars.city + '&houseId='
                    + vars.houseId + '&indexId=' + vars.indexId;
            }
        });
        // 点击弹框的取消按钮
        $('#cancel').on('click', function () {
            $floatAlert.hide();
            enable();
        });
        // 点击删除审核未通过的照片
        var $floatAlert2 = $floatAlert.eq(1);
        $('#noPassPic').on('click', '.close', function () {
            $floatAlert2.show();
            unable();

        });
        $floatAlert2.find('a').on('click', function () {
            if ($(this).index() === 0) {
                $('.noPassPic').hide();
            }
            $floatAlert2.hide();
        });
        // 点击保存按钮
        var $save = $('#save');
        // 防止多次点击发送多个ajax
        var subFlag = true;
        // 点击保存按钮
        $save.on('click', function () {
            getImgUrls();
            vars.localStorage.setItem('imgUrls', imgUrls);
            isSave = true;
            subFlag = false;
            imgUrls = [];
            var len = $myesfAddPic.find('img').length;
            var url = vars.mySite + '?c=myesf&a=ajaxdelegateEdit';
            var canSave = true;
            if (len) {
                $myesfAddPic.find('img').each(function () {
                    var $ele = $(this);
                    if($ele.attr('src').match('loading')){
                        alert('图片上传中，请耐心等待');
                        canSave = false;
                        return false;
                    }else{
                        canSave = true;
                    }
                    imgUrls.push($(this).attr('src'));
                });
            }
            if (imgUrls.length) {
                imgUrls = imgUrls.join();
            } else {
                imgUrls = '';
            }
            var param = {
                // 房源描述
                description: vars.description,
                // 房源的图片
                imgs: imgUrls,
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
            if (!param.price) {
                alert('网络错误，请刷新重试');
                return false;
            }
            if(canSave){
                $.ajax({
                    url: url,
                    type: 'post',
                    data: param,
                    success: function (data) {
                        if (data.result === '1') {
                            alert(data.message);
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
        });
    };
});

