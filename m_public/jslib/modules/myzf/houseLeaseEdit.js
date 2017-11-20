/**
 * 我的租房房源信息编辑页面
 * by zdl 20160714 租房ui改版
 */
define('modules/myzf/houseLeaseEdit',['jquery','slideFilterBox/1.0.0/slideFilterBox'],function (require,exports,module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        var $ = require('jquery');
        var slideFilterBox = require('slideFilterBox/1.0.0/slideFilterBox');
        var $doc = $(document);

        /**
         * 为了方便解绑事件，声明一个阻止页面默认事件的函数
         * @param e
         */
        function pdEvent(e) {
            e.preventDefault();
        }

        /**
         * 禁止页面滑动
         */
        function unable() {
            $doc.on('touchmove', pdEvent);
        }

        /**
         * 允许页面滑动
         */
        function enable() {
            $doc.off('touchmove', pdEvent);
        }

        // 浮层提示控制
        var $sendFloat = $('#sendFloat');
        function displayLose(time, keywords, url) {
            $('#sendText').text(keywords);
            $sendFloat.show();
            setTimeout(function () {
                $sendFloat.hide();
                if (url) {
                    window.location.href = url;
                }
            },time);
        }
        // 初始化配套设施
        var $equitmentManual = $('#equitmentManual');
        if (decodeURIComponent(vars.equitment).length > 0) {
            var txt = '';
            // 初始化配套设施的选择
            $equitmentManual.find('a').each(function () {
                var me = $(this);
                txt = me.text();
                if (decodeURIComponent(vars.equitment).indexOf(txt) > -1) {
                    me.addClass('active');
                }
            });
        }

        // 图片上传
        // 缓存图片上传的显示容器
        var $myzfAddPic = $('#myzfAddPic');
        require.async(['imageUpload/1.0.0/imageUpload_myzf'], function (ImageUpload) {
            new ImageUpload({
                richInputBtn: '#uploadPic',
                container: '#myzfAddPic',
                maxLength: 10,
                loadingGif: vars.public + 'images/loading.gif',
                url: '?c=myesf&a=ajaxUploadImg&city=' + vars.city,
                numChangeCallback: function () {
                    if ($('.cver').length === 0 && $myzfAddPic.find('img').length) {
                        // 第一张图片默认设置为封面图
                        $myzfAddPic.find('img').eq(0).addClass('cover');
                        $myzfAddPic.find('dd').eq(0).append('<div class="cver">封面</div>');
                    }
                    // 如果该区域的图片超出了10张 隐藏上传按钮
                    if ($myzfAddPic.find('img').length >= 10) {
                        $myzfAddPic.find('.add').hide();
                    } else {
                        $myzfAddPic.find('.add').show();
                    }
                }
            });
            // 初始化已经上传的图片
            if (vars.shineiimg !== '') {
                var html = '';
                var imgUrlArry = vars.shineiimg.split(',');
                var imgUrlArryLen = imgUrlArry.length;
                for (var i = 0; i < imgUrlArryLen; i++) {
                    if (imgUrlArry[i] === vars.titleimg) {
                        html += '<dd><img width="61" class="imgClass cover" style="" src="' + imgUrlArry[i]
                            + '"><a class="del"></a><div class="cver">封面</div></dd>';
                    } else {
                        html += '<dd><img width="61" class="imgClass" style="" src="' + imgUrlArry[i] + '"><a class="del"></a></dd>';
                    }
                }
                $myzfAddPic.find('dl').prepend(html);
                $myzfAddPic.find('img').on('error',function () {
                    $(this).addClass('defaultImg');
                });
            }

            $('.del').on('click',function () {
                if (confirm('\u786e\u5b9a\u8981\u5220\u9664\u6b64\u56fe\u7247\u5417\u003f')) {
                    $(this).parent().remove();
                }
                if ($myzfAddPic.find('img').length < 10) {
                    $myzfAddPic.find('.add').show();
                }
                if ($('.cver').length === 0 && $myzfAddPic.find('img').length) {
                    // 第一张图片默认设置为封面图
                    $myzfAddPic.find('img').eq(0).addClass('cover');
                    $myzfAddPic.find('dd').eq(0).append('<div class="cver">封面</div>');
                }
            });
        });

        // 点击上传图片设置封面
        $myzfAddPic.on('click','.imgClass',function () {
            // 去除之前的封面图
            $('.cver').remove();
            $('.imgClass').removeClass('cover');
            // 把当前点击的图片设为封面图
            $(this).addClass('cover');
            $(this).parent().append('<div class="cver">封面</div>');
        });

        // 点击上传图片浮层的回退按钮
        $('#photoBack,#confirm').on('click', function () {
            // 显示发布页二主页面
            var coverImgSrc;
            coverImgSrc = $('img.cover').attr('src');
            var html;
            $('.main').show();
            // 显示该页面的头部
            $('.header').eq(0).show();
            // 隐藏图片上传浮沉
            $('.photoMain').hide();
            // 判断如果上传了封面图 显示该封面图
            if ($('.cver').length && !$('.rental-mode').length) {
                $('.zu-photo').find('p').remove();
                $('.zu-photo').removeClass('zu-photo').addClass('rental-mode').addClass('relative').addClass('bb8');
                // <a class="zu_eidt"><i></i></a> rental-mode relative bb8
                html = '<img id="coverImg" src="' + coverImgSrc + '">';
                $('.rental-mode').append(html);
                $('.rental-mode').find('a').removeClass('picAdd').addClass('zu_eidt');
                $('#uploadPic').wrap('<i></i>');
                // 显示额外的图片按钮
                $('#uploadPic').hide();
            }
            // 不存在封面图时编辑页的上传图片界面还原
            if (!$('.cver').length && $('.rental-mode').length) {
                $('#coverImg').remove();
                $('.rental-mode img').remove();
                $('.rental-mode ').removeClass('rental-mode').removeClass('relative').removeClass('bb8').addClass('zu-photo');
                $('.zu-photo').find('a').removeClass('zu_eidt').addClass('picAdd');
                $('.zu-photo').append('<p class="f14 gray-5">有照片的房子电话量会提高50%</p>');
                // 显示额外的图片上传按钮
                $('#uploadPic').show();
            }
            if ($('.rental-mode img').length) {
                $('.rental-mode img').attr('src',coverImgSrc);
            }
        });


        // 给编辑按钮添加点击事件 编辑按钮存在时说明用户已经传过了图片
        $('.main').on('click','.zu_eidt',function () {
            // 隐藏编辑页面显示上传图片浮沉
            $('.main').hide();
            $('.header').eq(0).hide();
            $('.photoMain').show();
            if ($myzfAddPic.find('img').length === 10) {
                $myzfAddPic.find('.add').hide();
            }
        });

        // 房源信息和更多信息模块的显示隐藏切换
        var arrowStatus = $('#basicInfo,#moreInfo');
        arrowStatus.on('click',function () {
            // 获取对应的模块内容id
            var conId = $(this).attr('id') + 'Drap';
            $('#' + conId).toggle();
            arrowStatus.toggleClass('arr-u');
        });

        // 下拉浮层滑动列表显示操作
        $('#shareType,#shareNumber').on('click', function () {
            var eleId = $(this).attr('id');
            var eleDrapId = eleId + 'Drap';
            $('#' + eleDrapId).show();
            slideFilterBox.refresh('#' + eleDrapId + 'Con');
            slideFilterBox.to('#' + eleDrapId + 'Con', 0);
            unable();
        });

        // 下拉浮层数据选择
        $('#shareTypeDrapCon,#shareNumberDrap').on('click', 'li', function () {
            // 用于找到选中的数据显示的位置
            var reg = /DrapCon/;
            var $that = $(this);
            // 获取浮层元素id
            var targetFatherEleId = $that.parent().parent().attr('id');
            // 用户选中的值
            var sleectedVal = $that.text();
            //  选择数据显示在什么位置的元素id
            var showValEleId = targetFatherEleId.replace(reg, '');
            //  把用户选中的值填入对应的位置
            $('#' + showValEleId).text(sleectedVal);
            // 隐藏下拉浮沉
            $('.sf-maskFixed').hide();
            // 允许页面滑动
            enable();
        });

        // 选填项处理 start
        // 户型选择列表处理start
        // huxingValue 用于保存选择户型数据
        var huxingValue = '';
        var $huxing = $('#huxing');

        // 给户型选择按钮添加点击事件
        $huxing.on('click', function () {
            // 将选择的户型数据清空
            huxingValue = '';
            $('#huxingShiText').text('请选择户型');
            // 显示户型选择列表下的 室列表选项
            $('#huxingShiDrap').show();
            // 给户型选择列表下的 室列表添加滑动筛选功能
            slideFilterBox.refresh('#huxingShiDrapCon');
            slideFilterBox.to('#huxingShiDrapCon', 0);
            unable();
        });


        // 给户型选择对应的室选择下拉列表添加点击事件
        $('#huxingShiDrap').on('click', 'li', function () {
            var $that = $(this);
            huxingValue += $that.text();
            $('#huxingTingText').text(huxingValue);
            $huxing.text(huxingValue);
            // 当点击对应的室列表选项后 隐藏室选项下拉列表
            $('#huxingShiDrap').hide();
            //  显示之后需要继续选择的厅下拉选择列表
            $('#huxingTingDrap').show();
            //  给户型选项的厅下拉列表内容添加滑动筛选功能
            slideFilterBox.refresh('#huxingTingDrapCon');
            slideFilterBox.to('#huxingTingDrapCon', 0);
            unable();
        });


        // 给户型选择下的厅选择下拉列表添加点击事件
        $('#huxingTingDrap').on('click', 'li', function () {
            var $that = $(this);
            huxingValue += $that.text();
            $('#huxingWeiText').text(huxingValue);
            $huxing.text(huxingValue);
            //  当点击了厅下拉列表中的内容时 隐藏厅下拉选项列表
            $('#huxingTingDrap').hide();
            // 显示卫下拉选项列表
            $('#huxingWeiDrap').show();
            // 给居室选择的卫选择下拉选择的内容添加滑动筛选功能
            slideFilterBox.refresh('#huxingWeiDrapCon');
            slideFilterBox.to('#huxingWeiDrapCon', 0);
            unable();
        });


        // 给户型选择下的卫选择下拉列表添加点击事件
        $('#huxingWeiDrap').on('click', 'li', function () {
            var $that = $(this);
            huxingValue += $that.text();
            // $('#huxingWeiText').text(huxingValue);
            // 将户型选择的对应的室、厅、卫数据 写入到户型显示的span中
            $huxing.text(huxingValue);
            $('#huxingWeiDrap').hide();
            // slideFilterBox.refresh('#huxingWeiDrapCon');
            enable();
        });


        // 取消非数字的输入
        $('#totlefloorManual,#priceManual').on('keyup', function () {
            var me = $(this);
            if (me.val().indexOf(0) === 0) {
                me.val('');
            }
            me.val(me.val().replace(/[\D]/g, ''));
        });

        $('#floorManual').on('input', function () {
            var $that = $(this);
            var val = $that.val();
            var replaceVal = val.replace('/[^\d\-]/g','');
            $that.val(replaceVal);
            // 限制用户只能输入-2到99之间的数字
            if (isNaN(replaceVal) && replaceVal !== '-' || replaceVal < -2) {
                $that.val('');
                displayLose(3000, '请输入-2-99之间的数字！');
            }
        });

        // 控制面积input输入框的输入
        $('#buildingareaManual').on('input', function () {
            var reg = /[^\d\.]/g;
            var me = $(this), val = me.val();
            me.val(val.replace(reg,''));
            // 把输入的数据进行截取
            if (val.indexOf(0) === 0) {
                me.val('');
            }
        }).on('blur',function () {
            var $that = $(this);
            var areaTest = /^[0-9]{1,4}(\.[0-9]{0,2}|)$/;
            if (!areaTest.test($that.val()) &&　$that.val() !== '') {
                displayLose(3000,'请输入正确格式的面积！');
                $that.val('');
            }
        });

        // 给配套设施下的a标签添加点击事件 实现配套设施的选择
        $equitmentManual.on('click', 'a', function () {
            $(this).toggleClass('active');
        });

        // 点击浮层取消按钮隐藏浮层
        $('.cancel').on('click',function () {
            $('.sf-maskFixed').hide();
            enable();
        });

        // 下拉浮层滑动列表显示操作
        $('#direction,#decoration,#payWay,#genderLimit').on('click',function () {
            // 获取点击的元素的id
            var eleId = $(this).attr('id');
            // 更具获取的元素id拼接出对应的下拉浮沉元素id
            var eleDrapId = eleId + 'Drap';
            // 显示对应的浮沉元素
            $('#' + eleDrapId).show();
            // 浮沉下拉列表添加滚动
            slideFilterBox.refresh('#' + eleDrapId + 'Con');
            slideFilterBox.to('#' + eleDrapId + 'Con', 0);
            // 禁止页面滑动
            unable();
        });

        // 下拉浮层数据选择
        $('#directionDrapCon,#decorationDrapCon,#payWayDrapCon,#genderLimitDrap').on('click','li',function () {
            // 用于找到选中的数据显示的位置
            var reg = /DrapCon/;
            var $that = $(this);
            // 获取浮层元素id
            var targetFatherEleId = $that.parent().parent().attr('id');
            // 用户选中的值
            var sleectedVal = $that.text();
            //  选择数据显示在什么位置的元素id
            var showValEleId = targetFatherEleId.replace(reg,'');
            //  把用户选中的值填入对应的位置
            $('#' + showValEleId).text(sleectedVal);
            // 隐藏下拉浮沉
            $('.sf-maskFixed').hide();
            // 允许页面滑动
            enable();
        });

        // 获取配套设施
        function getEquitement(arr) {
            var arr1 = [];
            var arrStr;
            for (var i = 0; i < arr.length; i++) {
                arr1.push(arr[i].innerHTML + ',');
            }
            arrStr = arr1.join('');
            return arrStr.substr(0,arrStr.length - 1);
        }


        function getUploadImg() {
            var imgUrlArry = [];
            var imgUrlStr;
            $myzfAddPic.find('img').each(function () {
                imgUrlArry.push($(this).attr('src'));
            });
            imgUrlStr = imgUrlArry.join(',');
            return imgUrlStr;
        }
        var $floatAlert = $('.floatAlert');
        $floatAlert.on('click','a',function () {
            var $that = $(this);
            $floatAlert.hide();
            // return表示点击了否
            if ($that.attr('id') === 'return') {
                // 点击了否  跳转到完善房屋信息页面
                window.location.href = vars.mySite + '?c=myzf&a=houseLeaseSuc&setTop=0&from=edit';
            }
        });

        // 编辑修改发布
        var submitFlag = false;

        // 提示框 是和否的弹框点击事件
        $('.tz-btn').on('click','input',function () {
            var $that = $(this);
            var clickEleId = $that.attr('id');
            // 如果点击了是
            if (clickEleId === 'improve') {
                // 点击是 继续填写信息
                $('#prompt').hide();
            } else {
                // 点击否 跳到房屋信息完善页面
                window.location.href = vars.mySite + '?c=myzf&a=houseLeaseSuc&setTop=0&from=edit';
            }
        });

        $('#submit').on('click',function () {
            if (submitFlag) {
                return false;
            }
            // 户型
            var param = {};
            if (vars.renttype === '合租') {
                // 类型
                param.rentway = $('#shareType').text();
                // 几户合租
                param.roomcount = $('#shareNumber').text();
            }
            if (vars.renttype === '整租') {
                var huxing = $.trim($huxing.text());
                param.room = huxing.substr(0, 1);
                param.hall = huxing.substr(2, 1);
                param.toilet = huxing.substr(4, 1);
            }
            // 租金
            param.price = $('#priceManual').val();
            // 建筑面积
            param.buildingarea = $('#buildingareaManual').val();
            // 楼层
            param.floor = $('#floorManual').val();
            // 总楼层
            param.totlefloor = $('#totlefloorManual').val();
            // 配套设施
            param.equitment = getEquitement($('#equitmentManual .active'));
            // 房源描述
            param.description = $('#descriptionManual').val();
            // 获取封面图的连接地址
            param.titleimage = param.titleimg = encodeURIComponent($('img.cover').attr('src'));
            // 获取全部上传图片的连接地址全部图片
            // param.allImg = getUploadImg();
            // 除封面图以外的其它图片地址
            param.shineiimg = encodeURIComponent(getUploadImg());
            var directionVal = $('#direction').text();
            var decorationVal = $('#decoration').text();
            var payWayVal = $('#payWay').text();
            var genderLimitVal = $('#genderLimit').text();
            // 楼栋
            param.block = $('#blockManual').val();
            // 单元号
            param.unitnumber = $('#unitnumberManual').val();
            // 门牌号
            param.newhall = $('#newhall').val();
            // 朝向
            param.forward = directionVal !== '请选择' ? directionVal : '';
            // 装修程度
            param.fitment = decorationVal !== '请选择' ? decorationVal : '';
            // 支付方式
            param.payinfo = payWayVal !== '请选择' ? payWayVal : '';
            // 性别限制
            param.rentgender = genderLimitVal !== '请选择' ? genderLimitVal : '';
            // 房源id
            param.houseid = vars.houseid;
            // 手机号
            param.mobilecode = vars.mobilecode;
            // 整租&合租
            param.renttype = vars.renttype;

            // 验证类型
            if (vars.renttype === '合租' && param.rentway === '请选择') {
                displayLose(2000,'合租类型不能为空');
                return false;
            } else if (vars.renttype === '合租' && param.roomcount === '请选择') {
                // 验证几户合租
                displayLose(2000,'几户合租不能为空');
                return false;
            } else if (vars.renttype === '整租' && $huxing.text().trim() === '请选择') {
                // 验证户型
                displayLose(2000,'户型不能为空');
                return false;
            } else if (param.price === '') {
                // 租金验证
                displayLose(2000,'租金不能为空');
                return false;
            } else if (param.buildingarea === '') {
                // 建筑面积验证
                displayLose(2000,'建筑面积不能为空');
                return false;
            } else if (param.Floor === '') {
                // 楼层验证
                displayLose(2000,'楼层不能为空');
                return false;
            } else if (param.totlefloor === '') {
                // 总楼层验证
                displayLose(2000,'总楼层不能为空');
                return false;
            } else if (parseInt(param.totlefloor) < parseInt(param.floor)) {
                // 总楼层必须大于楼层判断
                displayLose(2000, '总楼层不能小于楼层');
                return false;
            } else if (param.description === '') {
                // 房源描述验证
                displayLose(2000,'房源描述不能为空');
                return false;
            }
            var url;
            // 是否重租标志，重租走旧版发布接口
            if (vars.edit === '2') {
                // 标志位，后台需要
                param.edit = vars.edit;
                // 小区名字
                param.projname = vars.projname;
                // 地址
                param.address = vars.address;
                // 标题
                param.title = vars.title;
                // 联系人
                param.contactperson = vars.contactperson;
                // 物业类型
                param.purpose = vars.purpose;
                // 租赁方式
                param.renttype = vars.renttype;
                // 区域
                param.district = vars.district;
                // 商圈
                param.comarea = vars.comarea;
                url = vars.mySite + '?c=myzf&a=postRentInfo';
            } else {
                url = vars.mySite + '?c=myzf&a=submitHouseLeaseEditInfo';
            }
            $.ajax({
                // ajax请求的链接地址
                url: url,
                // 请求发送的数据
                data: param,
                // 返回的数据类型
                dataType: 'json',
                // 提交数据的方式
                type: 'POST',
                // 取消异步请求
                async: false,
                // 请求成功的回调
                success: function (data) {
                    if (data) {
                        if (data.result === '100') {
                            submitFlag = true;
                            var sucurl = vars.mySite + '?c=myzf&a=publishSuccess' + '&city=' + vars.city + '&Mobile=' + vars.Mobile
                                + '&houseid=' + data.houseid + '&comarea=' + param.comarea + '&district=' + param.district + '&projname='
                                + param.projname + '&renttype' + param.renttype;
                            displayLose(2000, '发布成功', sucurl);
                        } else if (data.errcode === '100') {
                            submitFlag = true;
                            if (data.setTop === '1') {
                                // 满足置顶条件 所有项（区分整租合租）都填写了 跳转置顶成功页面
                                if (param.block !== '' && param.unitnumber !== '' && param.newhall !== '' && param.forward !== '' && param.fitment !== ''
                                    && param.payinfo !== '') {
                                    // 对于合租 置顶成功的话还要判断 合租性别不为空
                                    if (vars.renttype === '整租' || param.rentgender !== '') {
                                        window.location.href = vars.mySite + '?c=myzf&a=houseLeaseSuc&setTop=1&from=edit';
                                    } else {
                                        // 弹出更多信息提示框
                                        $('#prompt').show();
                                    }
                                } else {
                                    // 弹出更多信息提示框
                                    $('#prompt').show();
                                }
                            } else {
                                window.location.href = vars.mySite + '?c=myzf&a=houseLeaseSuc&setTop=0&from=edit';
                            }
                        } else if (data.relocate) {
                            displayLose(2000, data.errmsg, data.relocate);
                        } else {
                            displayLose(2000, data.errmsg);
                        }
                    } else {
                        displayLose(2000, '网络错误,请稍候再试');
                    }
                }
            });
        });
    };
});
