/**
 * 自主审核页
 */
define('modules/my/publishExamine', ['jquery', 'iscroll/2.0.0/iscroll-lite'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        var IScroll = require('iscroll/2.0.0/iscroll-lite');
        var $ = require('jquery');
        // 包裹层id
        var evaluate = $('#evaluate');
        // 弹框浮层
        var selectDiv = $('#selectDiv');
        // 弹框浮层元素ul
        var selectDivUl = selectDiv.find('ul');
        // 记录点击id
        var type = '';
        // 加载更多选项id
        var obj = {};
        var poper = $('.sf-bdmenu .con section');


        // 上传小区大门图片，1张
        imgUpload('#propertyimg', 1);

        // 提示信息函数
        function displayMsg(msg) {
            var $msg = $('.tz-box2');
            $('#sendText').text(msg);
            $msg.fadeIn();
            showDiv();
            setTimeout(function () {
                $msg.fadeOut();
                closeDiv();
            }, 2000);
        };

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
                        var index = $(id).parents('.maT15').index() - 1;
                        var $uploadImg = $('.moreAdd');
                        
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



        // 禁止事件默认行为
        function preventDefault(e) {
            // @20151229 blue 删除多余代码
            e.preventDefault();
        }

        /**
         * 阻止页面滑动
         */
        function showDiv() {
            document.addEventListener('touchmove', preventDefault);
        }

        /**
         * 恢复页面滑动
         */
        function closeDiv() {
            document.removeEventListener('touchmove', preventDefault);
        }

        //城市房屋产权
        var cityproperty = JSON.parse(vars.property);
        //初始化弹框显示默认值

        /**
         * 初始化弹框内容
         */
        function initBox() {
            selectDivUl.html('');
            var liStr = '';
            switch (type) {
                case 'property':
                    if (cityproperty) {
                         for (var i = 0; i < cityproperty.length; i++) {
                            liStr += '<li>' + cityproperty[i] + '</li>';
                         }
                    }
                    $('#sftitle').text('请选择产权类型');
                    break;
                case 'time':
                    liStr += '<li>两年以下</li><li>两年到五年</li><li>五年以上</li>';
                    $('#sftitle').text('请选择房本持有时间');
                    break;
                case 'only':
                    liStr += '<li>是</li><li>否</li>';
                    $('#sftitle').text('请选择是否唯一');
                    break;
            }
            selectDivUl.append(liStr);
            selectDiv.show();
        }

        //解决穿透事件
        var clickFlag = true;

        // 点击标签弹出选择框事件
        var scroll;
        $('.select').on('click', function () {

            var id = $(this).attr('id');
            var num;

            if (id) {
                type = id;
                if (obj[type]) {
                    selectDivUl.html(obj[type]);
                    selectDiv.show();
                    num = selectDiv.find('li.activeS').index();
                } else {
                    initBox();
                }
                showDiv();
                if (!scroll) {
                    scroll = new IScroll(poper[0], {
                        bindToWrapper: true, scrollY: true, scrollX: false, preventDefault: false
                    });
                }
                scroll.refresh();
                if (num) {
                    // 45:每个li的高度,202:选择框的高度
                    var total = poper.find('ul li').length;
                    var tail = total * 45 - 202;
                    // 所有选项的总高度超过可视高度时滚动
                    if (tail > 0) {
                        // 滚动到底部后不可再向上滚动
                        if ((total - num) * 45 > 202) {
                            scroll.scrollTo(0, -(num - 1) * 45);
                        } else {
                            scroll.scrollTo(0, -tail);
                        }
                    }
                } else {
                    scroll.scrollTo(0, 0);
                }
            }
        });
        // 点击弹框选项事件,选择内容填充到对应的标签
        selectDivUl.on('click', 'li', function () {
            var $that = $(this);

            clickFlag = false;

            $('#' + type).html('<em>' + $that.text() + '</em>');
            evaluate.find('.' + type).addClass('sele');
            $that.addClass('activeS').siblings().removeClass('activeS');
            obj[type] = selectDivUl.html();
            selectDiv.hide();
            closeDiv();

            $('#propertyimg').find('input').attr('disabled', 'disabled');

            //解决穿透问题
            setTimeout(function () {
                clickFlag = true;
                $('#propertyimg').find('input').removeAttr('disabled');
            }, 500);

        });
        // 点击弹框取消事件
        selectDiv.find('.cancel').on('click', function () {
            selectDiv.hide();
            closeDiv();
        });

        //ajax标志
        var ajaxFlag = 0;

        //点击提交
        $('.btn-payN').on('click', function(){

            if (clickFlag) {
                // 内容为空提示信息
                if ($('#property').text() === '') {
                    displayMsg("产权类型不能为空");
                    return;
                } else if ($('#time').text() === '') {
                    displayMsg("房本持有时间不能为空");
                    return;
                } else if ($('#only').text() === '') {
                    displayMsg("是否唯一不能为空");
                    return;
                } else if ($('#linkman').val() === '') {
                    displayMsg("姓名不能为空");
                    return;
                } else if ($('.imgClass').length === 0) {
                    displayMsg("请上传图片");
                    return;
                } else if ($('.imgClass').attr('src') === '//js.mm.test.fang.com/m_public/images/loading.gif') {
                    displayMsg("正在上传图片");
                    return;
                }

                //将内容转换为接口数据
                var time = '';
                if ($('#time').text() === '两年以下') {
                    time = 1;
                } else if ($('#time').text() === '两年到五年') {
                    time = 2;
                } else {
                    time = 3;
                }
                var unique = '';
                if ($('#only').text() === '是') {
                    unique = 1;
                } else {
                    unique = 0;
                }

                var param = {
                    city: vars.city,
                    indexId: vars.indexId,
                    propertyType: $('#property').text(),
                    isFiveYear: time,
                    isUniqueHouse: unique,
                    name: $('#linkman').val(),
                    imgurl: $('.imgClass').attr('src'),
                };
                var url = vars.mySite + '?c=my&a=ajaxExamineCommit';

                // 如果再次调用时前一个ajax在执行，终止此次ajax的执行
                if (ajaxFlag) {
                    ajaxFlag.abort();
                }
                
                ajaxFlag = $.ajax({
                    url: url,
                    data: param,
                    success: function(data) {

                        if (data.ReviewResult === '1') {
                            displayMsg("房源审核通过，稍后将在前台展示”");
                            
                        } else if (data.ReviewResult === '2') {
                            displayMsg("您的房源无法审核通过");
                        } else if (data.ReviewResult === '3') {
                            displayMsg("您的房源已流转人工审核，稍后客服将会处理");
                        } else if (data.ReviewResult === '0' || data.ReviewResult === '4') {
                            displayMsg("房源审核失败，稍后客服将会联系您重新核实信息");
                        }
                        setTimeout(function () {
                            window.location = vars.mySite + '?c=mycenter&a=sellFangList&city=' + vars.city;
                        }, 3000);
                    }
                });
            }
            

        });

    };
});