/**
 * 新房楼栋信息页
 * by WeiRF 20151224
 * 20160122 WeiRF   第二期需求开发
 * 20160217 WeiRF 添加纠错功能
 */
define('modules/xf/xfLoudongInfo',
    ['jquery','util/util','swipe/3.10/swiper','hammer/2.0.4/hammer_change','iscroll/2.0.0/iscroll-lite','slideFilterBox/1.0.0/slideFilterBox'],
    function (require) {
        'use strict';
        var $ = require('jquery');
        var Util = require('util/util');
        var vars = seajs.data.vars;
        var Swiper = require('swipe/3.10/swiper');
        var IScroll = require('slideFilterBox/1.0.0/slideFilterBox');

        var submitLock = true;
        // 登录的cooike
        var sfut = Util.getCookie('sfut');
        // 登录后获取用户名，手机号和用户ID
        var username,telephone;
        function getInfo(data) {
            username = data.username || '';
            telephone = data.mobilephone || '';
        }
        // 调用ajax获取登陆用户信息
        if (sfut) {
            vars.getSfutInfo(getInfo);
        }
        // 纠错填写
        var $loudongOut = $('.loudong-out');
        var $maskFixed = $('.sf-maskFixed');
        // 纠错按钮class
        var $correct = $('.icon-err');
        // 纠错输入框
        var $textarea = $('textarea');
        // 外框ID
        var $outBorder = $('#outBorder');
        // 楼栋ID
        var $louDong = $('#louDong');
        // 图片ID
        var $image = $('#LDimage');
        // 标签DIV
        var $LDInfoShow = $('#LDInfoShow');
        // 楼栋图标
        var $LDInfos = $LDInfoShow.find('span');
        // 详细信息ID
        var $detailInfo = $('#detailInfo');
        // 滑动绑定标签
        var $swiperContainer = $('.swiper-container');
        // 禁用掉touchmove事件
        function preventDefault(e) {
            e.preventDefault();
        }
        document.addEventListener('touchmove', preventDefault);
        var initText = $textarea.val().trim();
        var correctFlag = false;
        var firstCenter = true;
        // 移动DIV的left和top值
        var LDLeft, LDTop;
        // 初始化时的宽度和高度
        var initWidth,initHeight;
        // 移动的边界线
        var minLeft, maxLeft, minTop, maxTop;

        // 缩放和放大时的宽度和高度
        var scaleWidth;
        var scaleHeight;
        // 图像的偏移
        var scaleLeft;
        var scaleTop;
        // 图标信息的位置
        var LDInfosLeft = [];
        var LDInfosTop = [];
        // 楼盘数据
        var buildingDatas = [];
        // 最小放大倍数
        var maxMagnification = 3;
        // 楼盘标签偏差
        var offset = {
            left: 18,
            top: 21
        };
        // 初始化标签数据
        var dataInit = [];
        // 标签的xy坐标
        var data = [];
        // 初始化相关宽度和高度
        changeInit(false);
        for (var i = 0, len = $LDInfos.length; i < len; i++) {
            var buildingData = $LDInfos.eq(i).data();
            buildingDatas.push(buildingData);
            var loupan = {
                x: buildingData.x,
                y: buildingData.y
            };
            data.push(loupan);
            dataInit.push(loupan);
        }
        // 楼盘标签偏移初始化
        for (var i = 0, len = $LDInfos.length; i < len; i++){
            $LDInfos.eq(i).css({left: data[i].x - offset.left, top: data[i].y - offset.top});
        }
        // 如果没有选中标签，默认选中第一个
        if (!$LDInfos.hasClass('cur')) {
            $LDInfos.eq(0).addClass('cur').css({'z-index': 1});
        }
       // 图片换成大图的SRC
        $image.attr('src',$image.attr('data-href'));
        // $image.load(function(){
        //    $LDInfoShow.show();
        // });
        $LDInfoShow.show();
        // 初始化图片偏移量
        $louDong.css({left: 0,top: 0});
        // 初始化hammer
        var hammerLD = new Hammer($louDong[0]);
        // 开始移动
        hammerLD.on('panstart', function () {
            LDLeft = Number($louDong.css('left').replace('px',''));
            LDTop = Number($louDong.css('top').replace('px',''));
        });
        // 移动过程
        hammerLD.on('panmove', function (e) {
            var leftTop = judgeBorder(LDLeft + e.deltaX, LDTop + e.deltaY);
            $louDong.css({left: leftTop.left, top: leftTop.top});
        });
        hammerLD.add(new Hammer.Pinch());
        // 缩放开始
        hammerLD.on('pinchstart',function () {
            // 清空原来的left和top数据
            LDInfosLeft = [];
            LDInfosTop = [];
            scaleWidth = $image.width();
            scaleHeight = $image.height();
            scaleLeft = Number($louDong.css('left').replace('px',''));
            scaleTop = Number($louDong.css('top').replace('px',''));
            for (var i = 0, len = data.length; i < len; i++) {
                LDInfosLeft.push(data[i].x);
                LDInfosTop.push(data[i].y);
            }
        });
        // 多点触控之缩小功能
        hammerLD.on('pinchin', function (e) {
            if ($image.width() > initWidth && $image.height() > initHeight) {
                scaleEvent(e);
            }
        });
        // 多点触控之放大功能
        hammerLD.on('pinchout', function (e) {
            if ($image.width() < initWidth * maxMagnification && $image.height() < initHeight * maxMagnification) {
                scaleEvent(e);
            }
        });
        // 缩放结束
        hammerLD.on('pinchend', function () {
            // 改变移动的最小left和top
            minLeft = $outBorder.width() - $image.width();
            minTop = $outBorder.height() - $image.height();
        });
        // 楼盘图标点击事件
        hammerLD.on('tap', function (e) {
            var Doc = e.target.tagName.toUpperCase();
            var $target = $(e.target);
            if (Doc === 'I' || Doc === 'EM' || Doc === 'SPAN') {
                if (Doc === 'I' || Doc === 'EM') {
                    // 获取当前点击的span标签
                    $target = $target.parent();
                }
                var index = Number($target.attr('data-index'));
                // 如果是纠错状态
                if (correctFlag) {
                    // 解决iPhone手机上不能编辑问题
                    compatible(true);
                    var docSpan = $LDInfoShow.find('span.edit');
                    if ($target.hasClass('edit')) {
                        oldInfo(index,docSpan);
                        if (Doc === 'I') {
                            $maskFixed.removeClass('none');
                            $target.find('em').attr('contenteditable',false);
                            $target.find('em').blur();
                        }
                    } else {
                        docSpan.find('em').attr('contenteditable',false);
                        newInfo(docSpan.index(),docSpan);
                        $textarea.val(initText).addClass('ts');
                    }
                    swiperChange(index);
                    // 存储当前节点的信息
                    oldInfo(index,$LDInfoShow.find('span.edit'));
                    // 显示正确的纠错信息
                    textareaShow(index);
                } else {
                    // 如果不是纠错状态
                    var slideIndex = $swiperContainer.find('.swiper-slide-active').attr('data-swiper-slide-index');
                    swiperChange(index);
                    callRewrite(index,slideIndex,true);
                }
            };
        });
        // 设置宽度
        $detailInfo.width($(window).width());
        var mySwiper = new Swiper('.swiper-container', {
            loop: true,
            // 显示中间的图标
            initialSlide: 0,
            onSlideChangeEnd: function () {
                SlideChange(false);
            }
        });

        /*
        * 改变横竖屏或初始化时调用，判断是否在中间
        */
        function SlideChange(flag) {
            var $active = $swiperContainer.find('.swiper-slide-active');
            var index = Number($active.attr('data-index'));
            var slideIndex = Number($active.attr('data-swiper-slide-index'));
            swiperChange(index);
            callRewrite(index,slideIndex,flag);
        }

        /*
         *缩放时的变化
         */
        function scaleEvent(e) {
            var scale = e.scale.toFixed(2);
            var imageWidth = scaleWidth * scale,imageHeight = scaleHeight * scale;
            // 不能小于原始图片的宽高
            if (imageWidth > initWidth && imageHeight > initHeight) {
                // 图像缩放
                $image.css({width: scaleWidth * scale,height: scaleHeight * scale});
                minLeft = $outBorder.width() - $image.width();
                minTop = $outBorder.height() - $image.height();

                var left = scaleLeft * scale + (1 - scale) * $outBorder.width() / 2;
                var top = scaleTop * scale + (1 - scale) * $outBorder.height() / 2;
                var leftTop = judgeBorder(left,top);
                $louDong.css({left: leftTop.left,top: leftTop.top});
                for (var i = 0, len = $LDInfos.length; i < len; i++) {
                    $LDInfos.eq(i).css({left: LDInfosLeft[i] * scale - offset.left,top: LDInfosTop[i] * scale - offset.top});
                }
                // 重新定位楼栋标签的值
                for (var i = 0, len = $LDInfos.length; i < len; i++) {
                    data[i].x = Number($LDInfos.eq(i).css('left').replace('px','')) + offset.left;
                    data[i].y = Number($LDInfos.eq(i).css('top').replace('px','')) + offset.top;
                }
            }
        }

        /*
         *判断是否为边界
         */
        function judgeBorder(left,top) {
            var option = {};
            option.left = left > maxLeft ? maxLeft : (left < minLeft ? minLeft : left);
            option.top = Math.max(Math.min(top, maxTop),minTop);// top > maxTop ? maxTop : (top < minTop ? minTop : top);
            return option;
        }

        /*
         *在可视区域的左边
         */
        function leftofbegin(element, container,offsetFrame,firstCenter) {
            var offsetLeft = container.offset().left - (element.offset().left);
            if (offsetLeft > 0 || firstCenter) {
                var left = Number(offsetFrame.css('left').replace('px',''));
                // 偏移到中间的位置
                var center = container.width() / 2 - 65;
                var option = judgeBorder(left + offsetLeft + center, Number(offsetFrame.css('left').replace('px','')));
                setTimeout(function () {
                    offsetFrame.css({left: option.left});
                },0);
            }
        }

        /*
         *在可视区域的右边
         */
        function rightoffold(element, container,offsetFrame,firstCenter) {
            var offsetRight = container.offset().left + container.width() - (element.offset().left + element.width());
            if (offsetRight < 0 || firstCenter) {
                var left = Number(offsetFrame.css('left').replace('px',''));
                // 偏移到中间的位置
                var center = container.width() / 2 - 65;
                var option = judgeBorder(left + offsetRight - center, Number(offsetFrame.css('left').replace('px','')));
                setTimeout(function () {
                    offsetFrame.css({left: option.left});
                },0);
            }
        }

        /*
         *在可视区域的上边
         */
        function abovethetop(element, container, offsetFrame,firstCenter) {
            var offsetTop = container.offset().top - (element.offset().top);
            if (offsetTop > 0 || firstCenter) {
                var top = Number(offsetFrame.css('top').replace('px',''));
                // 偏移到中间的位置
                var center = container.height() / 2 - 12;
                var option = judgeBorder(Number(offsetFrame.css('left').replace('px','')),top + offsetTop + center);
                setTimeout(function () {
                    offsetFrame.css({top: option.top});
                },0);
            }
        }

        /*
         *在可视区域的下边
         */
        function belowthefold(element, container, offsetFrame,firstCenter) {
            var offsetBelow = container.offset().top + container.height() - (element.offset().top + element.height());
            if (offsetBelow < 0 || firstCenter) {
                var top = Number(offsetFrame.css('top').replace('px',''));
                // 偏移到中间的位置
                var center = container.height() / 2 - 12;
                var option = judgeBorder(Number(offsetFrame.css('top').replace('px','')),top + offsetBelow - center);
                setTimeout(function () {
                    offsetFrame.css({top: option.top});
                },0);
            }
            var fold = container.offset().top + container.height();
            return element.offset().top - fold;
        }

        /*
         *初始化或者更改横竖屏时重新设置宽高
         */
        function changeInit(flag) {
            initWidth = $image.width();
            initHeight = $image.height();
            var borderHeight = $(window).height() - $('header').height() - $detailInfo.height();
            borderHeight = borderHeight < initHeight ? borderHeight : initHeight;
            // 设置图片的外框高度
            $outBorder.height(borderHeight);
            // 设置边界
            minLeft = $outBorder.width() - $image.width();
            maxLeft = 0;
            minTop = $outBorder.height() - $image.height();
            maxTop = 0;
            // 设置宽度
            if (flag) {
                var width = $(window).width();
                if (window.orientation === 180 || window.orientation === 0) {
                    width = width > $(window).height() ? $(window).height() : width;
                }
                if (window.orientation === 90 || window.orientation === -90) {
                    width = width < $(window).height() ? $(window).height() : width;
                }
                // 初始化图片偏移量
                $louDong.css({left: 0,top: 0});
                $detailInfo.width(width);
                mySwiper.onResize();
                SlideChange();
            }
        }

        /*
         *滑动改变
         */
        function swiperChange(index) {
            // 是否为纠错标志
            var classFlag = correctFlag ? 'edit' : 'cur';
            // 清除选中项
            $LDInfos.removeClass(classFlag).css({'z-index': 0});
            // 添加当前标签为选中标签
            $LDInfos.eq(index).addClass(classFlag).css({'z-index': 1});
            leftofbegin($LDInfos.eq(index),$outBorder,$louDong,firstCenter);
            rightoffold($LDInfos.eq(index),$outBorder,$louDong,firstCenter);
            abovethetop($LDInfos.eq(index),$outBorder,$louDong,firstCenter);
            belowthefold($LDInfos.eq(index),$outBorder,$louDong,firstCenter);
            // 纠错状态
            if (sfut &&　correctFlag) {
                $LDInfos.eq(index).find('em').attr('contenteditable',true);
                $LDInfos.eq(index).find('i').show();
            }
            // 设置为 false,证明不是第一次调用了
            firstCenter = false;
        }

        /*
         *根据当前index调用rewrite
         */
        function callRewrite(index,slideIndex,click) {
            if (click) {
                rewrite(index,slideIndex);
            }
            if (buildingDatas.length > 1) {
                if (index === buildingDatas.length - 1) {
                    rewrite(index - 1,(slideIndex + 2) % 3);
                    rewrite(0,(slideIndex + 1) % 3);
                } else if (index === 0) {
                    rewrite(buildingDatas.length - 1,(slideIndex + 2) % 3);
                    rewrite(index + 1,(slideIndex + 1) % 3);
                } else {
                    rewrite(index - 1,(slideIndex + 2) % 3);
                    rewrite(index + 1,(slideIndex + 1) % 3);
                }
            }
        }

        /*
         *重写滑动内容
         */
        function rewrite(index,slideIndex) {
            var $objectiveDivs = $swiperContainer.find('dd[data-swiper-slide-index=' + slideIndex +']');
            var objectiveData = buildingDatas[index];
            for (var divIndex in $objectiveDivs) {
                var $objectiveDiv = $objectiveDivs.eq(divIndex);
                var $span = $objectiveDiv.find('span');
                // 设置data-index
                $objectiveDiv.attr('data-index',index);
                // 写入数据
                $objectiveDiv.find('h2').html(objectiveData.name);
                $objectiveDiv.find('a').attr('href',objectiveData.href);
                $span.eq(0).html('').html(objectiveData.opentime);
                $span.eq(1).html('').html(objectiveData.roomtime);

                $span.eq(2).html(objectiveData.unitnum + (objectiveData.unitnum == '更新中' ? '' : '单元'));
                $span.eq(3).html(objectiveData.elevatorhu);
                $span.eq(4).html(objectiveData.layernum + (objectiveData.layernum == '更新中' ? '' : '层'));
                $span.eq(5).html(objectiveData.sellfyuannum);
            }
        }
        window.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', function () {
             // changeInit(true);
        }, false);

        var $headerOut = $('#headerOut');
        var $headerIcon = $('.header-out');
        var length = $headerOut.find('li').length;
        // 当超过4期时，增加滑动
        var maxNumber = 4;
        // 45为li的高度
        var liHeight = 45;
        if (length > maxNumber) {
            $headerOut.css({
                overflow: 'hidden',
            });
        }
        // 更多沙盘图
        $('.icon-opt').on('click',function () {
            if ($headerIcon.is(':hidden')) {
                $headerIcon.show();
                IScroll.refresh('#headerOut');
            } else {
                $headerIcon.hide();
            }
        });

        // 存储纠错信息
        var correctionDatas = [];

        /*
        *选中要纠错时存储信息
         */
        function oldInfo(index,element) {
            var initData = {};
            var i = 0,len = correctionDatas.length;
            var flag = true;
            for (; i < len; i++) {
                if (correctionDatas[i].dongid === buildingDatas[index].dongid) {
                    flag = false;
                }
            }
            if (flag) {
                initData.index = index;
                initData.dongid = buildingDatas[index].dongid;
                initData.oldDongname = element.find('em').html();
                initData.oldSalestatus = element.find('i').html();
                initData.newDongname = element.find('em').html();
                initData.newSalestatus = element.find('i').html();
                initData.content = initText;
                correctionDatas.push(initData);
            }
        }

        /*
         *纠错更改后存储信息
         */
        function newInfo(index,element) {
            var newDongname = element.find('em').html();
            var newSalestatus = element.find('i').html();
            var i = 0;
            var len = correctionDatas.length;
            for (; i < len; i++) {
                // 是否已经纠错过，并且相对于原始数据有改动
                if (correctionDatas[i].dongid ===  buildingDatas[index].dongid) {
                    correctionDatas[i].newDongname = newDongname;
                    correctionDatas[i].newSalestatus = newSalestatus;
                    correctionDatas[i].content = $textarea.val().trim();
                }
            }
        }

        /*
        *纠错textarea显示正确的信息
         */
        function textareaShow(index) {
            var i = 0,len = correctionDatas.length;
            for (;i < len; i++) {
                if (index === correctionDatas[i].index) {
                    $textarea.val(correctionDatas[i].content);
                    if (correctionDatas[i].content !== initText) {
                        $textarea.removeClass('ts');
                    } else {
                        $textarea.addClass('ts');
                    }
                }
            }
        }

        /*
        *更改成纠错的样式
         */
        function correctStart(correctSpan) {
            if (sfut) {
                correctSpan.addClass('edit').removeClass('cur');
                correctSpan.find('i').show();
                correctSpan.find('em').attr('contenteditable',true);
                $loudongOut.removeClass('none');
                $detailInfo.addClass('none');
                $textarea.val(initText).addClass('ts');
            }
        }

        /*
         *更改成非纠错的样式
         */
        function correctEnd(correctSpan,flag) {
            var i = 0,len = correctionDatas.length;
            var correctionSpan;
            // 纠错标志
            correctFlag = false;
            correctSpan.addClass('cur').removeClass('edit');
            correctSpan.find('em').attr('contenteditable',false);
            $loudongOut.addClass('none');
            $detailInfo.removeClass('none');
            if (flag) {
                for (; i < len; i++) {
                    // 修改数据使得下面详细信息与修改后的信息对应
                    buildingDatas[correctionDatas[i].index].name = correctionDatas[i].newDongname;
                }
                // 根据新数据刷新
                SlideChange(true);
            } else {
                for (; i < len; i++) {
                    correctionSpan = $LDInfos.eq(correctionDatas[i].index);
                    correctionSpan.find('em').html(correctionDatas[i].oldDongname);
                    correctionSpan.find('i').html(correctionDatas[i].oldSalestatus);
                }
            }
            // 清空数据
            correctionDatas = [];
            compatible(false);
        }

        /*
         * 纠错信息整合
         */
        function correctInfos() {
            var infos = [];
            var i = 0, len = correctionDatas.length;
            var sptData = $headerOut.find('li.active').data() || '';
            for (; i < len; i++) {
                if (correctionDatas[i].newDongname !== correctionDatas[i].oldDongname || correctionDatas[i].newSalestatus !== correctionDatas[i].oldSalestatus) {
                    var info = {};
                    info.newcode = sptData.newcode;
                    info.dongid = correctionDatas[i].dongid;
                    info.username = username;
                    info.telephone = telephone;
                    info.map_name = encodeURIComponent(sptData.mapname);
                    info.sandmap_id = sptData.sandmapid;
                    info.old_dongname = encodeURIComponent(correctionDatas[i].oldDongname);
                    info.new_dongname = encodeURIComponent(correctionDatas[i].newDongname);
                    info.old_salestatus = encodeURIComponent(correctionDatas[i].oldSalestatus);
                    info.new_salestatus = encodeURIComponent(correctionDatas[i].newSalestatus);
                    info.content = correctionDatas[i].content === initText ? '': encodeURIComponent(correctionDatas[i].content);
                    infos.push(info);
                }
            }
            return infos;
        }

        $correct.on('click',function () {
            var correctSpan;
            correctFlag = ! correctFlag;
            if (correctFlag) {
                if (sfut && username) {
                    correctSpan = $LDInfoShow.find('span.cur');
                    correctStart(correctSpan);
                    var index = Number(correctSpan.attr('data-index'));
                    oldInfo(index,correctSpan);
                } else {
                    alert('请先登录后再纠错');
                    correctFlag = ! correctFlag;
                    var href = window.location.href;
                    window.location.href = location.protocol + '//m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(href);
                    // window.location.href = '/user.d?m=userloginpage&city=' + vars.paramcity + '&mstype=login&burl=' + href;
                }
            } else {
                correctSpan = $LDInfoShow.find('span.edit');
                correctEnd(correctSpan,false);
            }
        });
        // 取消按钮
        $maskFixed.on('click','.cancel',function () {
            $maskFixed.addClass('none');
            var $target = $LDInfoShow.find('span.edit');
            $target.find('em').attr('contenteditable',true);
        });
        $maskFixed.on('click','li',function () {
            var value = $(this).html();
            $LDInfoShow.find('span.edit i').html(value);
            $maskFixed.addClass('none');
            var $target = $LDInfoShow.find('span.edit');
            $target.find('em').attr('contenteditable',true);
        });
        // 点错了按钮
        $('.mistake').on('click',function () {
            var correctSpan = $LDInfoShow.find('span.edit');
            correctEnd(correctSpan,false);
        });
        // 点击输入框时的判断
        $textarea.on('click',function () {
            if ($(this).hasClass('ts')) {
                $(this).val('').removeClass('ts');
            }
        });
        // 确认提交
        $('.submit').on('click',function () {
            var docSpan = $LDInfoShow.find('span.edit');
            // 把当前修改的内容存入
            newInfo(docSpan.index(),docSpan);
            var submitInfos = correctInfos();
            if (submitInfos.length > 0) {
                if (submitLock) {
                    submitLock = false;
                    $('#submit').css({color: '#aaaaaa'});
                    $.ajax({
                        url: '/xf.d',
                        data: {
                            m: 'xfLoudongCorrect',
                            city: vars.paramcity ,
                            data: JSON.stringify(submitInfos)
                        },
                        success: function (data) {
                            if (parseInt(data.root.result) === 100) {
                                var correctSpan = $LDInfoShow.find('span.edit');
                                correctEnd(correctSpan,true);
                                alert('感谢您的反馈，小编会第1时间确认并纠正');
                            } else {
                                alert('接口在休息，请稍后再提交');
                            }
                            submitLock = true;
                            $('#submit').css({color: '#ff6666'});
                        },
                        error: function () {
                            alert('接口在休息，请稍后再提交');
                            submitLock = true;
                            $('#submit').css({color: '#ff6666'});
                        }
                    });
                }
            } else {
                alert('请先纠错再提交');
            }
        });
        var initStyle = '';

        function compatible(flag) {
            var left = $louDong.css('left');
            var top = $louDong.css('top');
            var UA = window.navigator.userAgent.toLowerCase();
            if (UA.indexOf('iphone') !== -1 || UA.indexOf('ios') !== -1) {
                if (!initStyle) {
                    initStyle = $louDong.attr('style');
                }
                if (flag) {
                    $louDong.attr('style','');
                    $louDong.css({left: left,top: top});
                } else if (initStyle) {
                    $louDong.attr('style',initStyle);
                    $louDong.css({left: left,top: top});
                }
            }
        }

        // 添加字数限制
        $LDInfos.find('em').on('input',function () {
            var value = $(this).html().trim();
            if (value.length > 10) {
                $(this).html(value.substr(0,10));
                moveEnd(this);
            }
        });

        /**
         * 光标移到最后函数
         * @param obj 编辑框原生对象
         */
        function moveEnd(obj) {
            obj.focus();
            var sel = null,
                len = obj.innerText.length;
            if (document.createRange) {
                // 高级浏览器
                sel = window.getSelection();
                var range = document.createRange();
                range.selectNodeContents(obj);
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);
            }else {
                // IE低版本
                sel = document.selection.createRange();
                sel.moveStart('character', len);
                sel.collapse();
                sel.select();
            }
        }
        var UA = window.navigator.userAgent.toLowerCase();
        if (UA.indexOf('android') !== -1) {
            var $window = $(window),
                $main = $('.ldBox'),
                winH = $window.height();
            var $input = $LDInfoShow.find('em');
            var focusFlag = false;
            var textareaFlag = false;
            if (/mx/g.test(UA)) {
                winH += 45;
            }
            $input.on('focus', function () {
                focusFlag = true;
            });
            $input.on('blur', function () {
                focusFlag = false;
            });
            $textarea.on('focus', function () {
                focusFlag = true;
                textareaFlag = true;
            });
            $textarea.on('blur', function () {
                focusFlag = false;
                textareaFlag = false;
            });
            window.onresize = function () {
                if (correctFlag) {
                    if (!textareaFlag && $window.height() < winH) {
                        $loudongOut.addClass('none');
                    } else {
                        $loudongOut.removeClass('none');
                    }
                    if (focusFlag) {
                        $main.css('top', ($window.height() - winH).toString() + 'px');
                    } else {
                        $main.css('top', '0px');
                    }
                }
            };
        }

        // 筛选收起
        $('.shaixuan').on('click', function () {
            var $this = $(this);
            // 展开筛选
            if ($this.hasClass('cur')) {
                $this.removeClass('cur');
                $('.shaixuanul').show();
                this.id = 'wapshapan_B02_02';
            } else {
                // 收起筛选
                $this.addClass('cur');
                $('.shaixuanul').hide();
                this.id = 'wapshapan_B02_01';
            }
        });

        // 按销售状态筛选楼栋
        var result;
        $('.loudongTab span').on('click', function () {
            var $this = $(this);
            // 勾选该项
            if (!$this.parent().hasClass('cur')) {
                $this.parent().addClass('cur');
            } else {
                // 取消勾选该项
                $this.parent().removeClass('cur');
            }
            result = '';
            $('.shaixuanul .cur span').each(function () {
                switch($(this).attr('class')) {
                    case 'zs':
                        result += '.z-sale,';
                        break;
                    case 'ds':
                        result += '.d-sale,';
                        break;
                    case 'sw':
                        result += '.w-sale,';
                        break;
                }
            });
            result = result.substring(0, result.length - 1);
            $('#LDInfoShow span').hide();
            $(result).show();
            var slideIndex = $swiperContainer.find('.swiper-slide-active').attr('data-swiper-slide-index');
            var a = $(result).eq(0).attr('data-index')? Number($(result).eq(0).attr('data-index')) : 0;
            swiperChange(a);
            callRewrite(a, slideIndex, true);
        });
    });
