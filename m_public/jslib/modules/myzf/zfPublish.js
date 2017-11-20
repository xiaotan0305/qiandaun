/**
 * 我的租房合租类
 * by liuxinlu 20160126 添加用户行为统计信息
 * modified zdl 20160128 ui改版
 */
define('modules/myzf/zfPublish', ['jquery', 'verifycode/1.0.0/verifycode', 'modules/zf/yhxw', 'slideFilterBox/1.0.0/slideFilterBox',
        'dateAndTimeSelect/1.1.0/dateAndTimeSelect'],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            // jquery 对象
            var $ = require('jquery');
            var yhxw = require('modules/zf/yhxw');
            // 发送验证码插件
            var verifycode = require('verifycode/1.0.0/verifycode');
            // 滑动筛选框插件++++++++++++++++++++
            var slideFilterBox = require('slideFilterBox/1.0.0/slideFilterBox');
            var $doc = $(document);
            var mysfut;
            // 当前页面标识(用户用户行为统计)
            var pageId,
                vars = seajs.data.vars,
            // 输入小区名称联想出来的数据内容
                dContent = $('#search_completev1'),
            // 商圈对应的span
                dComarea = $('#comareaManual'),
            // 区域对应的sapn
                districtManual = $('#districtManual'),
                messagecodeManual = $('#messagecodeManual');
            var login = parseInt(vars.authenticated);
           
            $('input[type=hidden]').each(function (index, element) {
                vars[$(this).attr('id')] = element.value;
            });
            // 发布的租房类型  分为整租合租
            var rentType = vars.renttype;
            if (vars.edit === '1') {
                pageId = 'muchelprentrevise';
            } else {
                pageId = rentType === '整租' ? 'mzfreleasezz' : 'mzfreleasehz';
            }
            // 统计用户浏览动作
            yhxw({type: 0, pageId: pageId, curChannel: 'myzf'});


            // +++++++++++++++++++

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

            /**
             * 显示隐藏提示浮层函数
             * @param time 控制几秒消失
             * @param keywords 提示信息
             * @param url 隐藏浮层时的跳转链接
             */
            function displayLose(time, keywords, url) {
                $('#sendText').text(keywords).show();
                $sendFloat.show();
                setTimeout(function () {
                    $sendFloat.hide();
                    if (url) {
                        window.location.href = url;
                    }
                }, time);
            }


            function parsevalue(Projcode, Projname, Address, Purpose, District, Comarea) {
                // 设置小区名称的iput框中的数据
                $('#projnameManual').val(Projname);
                // 隐藏联想出来的列表li
                dContent.hide();
                // 设置projcode的值
                $('#projcode').val(Projcode);
                // 设置地址菜单的值
                $('#addressManual').val(Address);
                // 将Purpose数据出入该值对应的hidden input
                $('#purposeManual').val(Purpose);
                // 区域对应的input
                var districtObj = districtManual;
                districtObj.val(District);
                if (!districtObj.val() && District) {
                    districtObj.val(District.replace(/\u533a$/, ''));
                }
                if (Comarea !== '') $('#comarea').val(Comarea);
            }

            /**
             * 发送验证码之前先验证数据是否都已填写
             * @return true or false
             */

            function verify() {
                var param = {};
                //  获取input框中的手机号
                param.mobilecode = $mobilecodeManualId.val().trim();
                // 获取小区名称input框的值
                param.projname = $('#projnameManual').val();
                // 合租方式!!!!!!!!!!!!!!合租中才有主卧,次卧之类
                param.rentway = $('#shareType').text();
                // 获取区域选择的数据
                param.district = districtManual.text() || districtManual.val();
                // 获取商圈选择的数据 该数据在大城市中有  小城市中没有
                param.comarea = $('#comareaManual').text().trim();
                // 获取地址input框中的数据
                param.address = $('#addressManual').val();
                // 租房类型合租或者整租
                param.renttype = rentType;
                // 获取建筑面积input框中的数据
                param.buildingarea = $('#buildingareaManual').val();
                // 获取租金
                param.price = $('#priceManual').val();
                // 物业类型,后台向前台传的
                param.purpose = $('#purposeManual').val();
                // 标题
                param.title = $('#titleManual').val();
                // 描述
                param.description = $('#descriptionManual').val();
                // 楼层-第X层
                param.floor = $('#floorManual').val();
                // 楼层-共X层
                param.totlefloor = $('#totlefloorManual').val();

                // +++++选填信息
                // 户型-室-厅-卫
                var huxing = $.trim($('#huxing').text());
                // 合租性别,只有合租有
                // param.rentgender = $('#sexLimit').text();
                // 朝向
                param.forward = $('#direction').text();
                // 支付方式,月付等等
                param.payinfo = $('#payWay').text();
                // 装修
                param.fitment = $('#decoration').text();
                // 小区id
                param.projcode = $('#projcode').val();


                // 联系人
                param.contactperson = $('#contactpersonManual').val();
                // 性别
                param.gender = $('#selectGender ').find('a.active').text();

                // 用户输入验证
                if (param.projname === '') {
                    displayLose(2000, '请输入小区名称');
                    return false;
                } else if ($('#huxing').text().trim() === '请选择') {
                    displayLose(2000, '请选择户型');
                    return false;
                } else if (param.rentType === '合租' && param.rentway === '请选择') {
                    displayLose(2000, '请选择合租类型');
                    return false;
                } else if (param.district === '' || param.district === '请选择区域') {
                    displayLose(2000, '请选择区域');
                    return false;
                } else if (vars.citybs === 'b' && (param.comarea === '' || param.comarea === '请选择商圈')) {
                    displayLose(2000, '请选择商圈');
                    return false;
                } else if (param.address === '') {
                    displayLose(2000, '地址不能为空');
                    return false;
                } else if (vars.citybs === 's' && (param.purpose === '' || param.purpose === null)) {
                    displayLose(2000, '请选择物业类型');
                    return false;
                } else if (param.buildingarea === '') {
                    displayLose(2000, '面积不能为空');
                    return false;
                } else if (param.price === '') {
                    displayLose(2000, '租金不能为空');
                    return false;
                } else if (param.title === '') {
                    displayLose(2000, '标题不能为空');
                    return false;
                } else if (parseInt(param.floor) > parseInt(param.totlefloor)) {
                    displayLose(2000, '楼层不能大于总楼层');
                    return false;
                } else if (param.contactperson === '') {
                    displayLose(2000, '联系人不能为空');
                    return false;
                } else if (param.mobilecode === '') {
                    displayLose(2000, '请输入手机号');
                    return false;
                } else if (!/^1[34578]{1}[0-9]{9}$/.test(param.mobilecode)) {
                    displayLose(2000, '请输入正确格式的手机号');
                    return false;
                } else if (param.description === '') {
                    displayLose(2000, '请输入房源描述');
                    return false;
                } else if (param.floor === '' || param.totlefloor === '') {
                    displayLose(2000, '楼层不能为空');
                    return false;
                } else {
                    return true;
                }
            }

            //  由编辑状态进入时 初始化数据
            $(function () {
                if (vars.edit === '1') {
                    if (vars.equitment.length > 0) {
                        var txt = '';
                        // 初始化配套设施的选择
                        $('#equitmentManual').find('a').each(function () {
                            var me = $(this);
                            txt = me.text();
                            if (vars.equitment.indexOf(txt + ',') > -1) {
                                me.addClass('active');
                            }
                        });
                    }
                    // 朝向span中显示的值
                    $('#forwardManual').val(vars.forward);
                    // 装修span中对应的内容
                    $('#fitmentManual').val(vars.fitment);
                    // 支付方式span中对应的内容
                    $('#payinfoManual').val(vars.payinfo);
                    // 区域span中对应的数据
                    districtManual.val(vars.district);
                    if (vars.citybs === 's') {
                        $('#begintimeManual').val(vars.begintime);
                    }
                }
            });

            // 上传图片处理 start
            var $showpicId = $('#show_pic');

            // 图片上传
            var imgupload;
            require.async(['imageUpload/1.0.0/imageUpload_oldzf'], function (ImageUpload) {
                imgupload = new ImageUpload({
                    richInputBtn: '',
                    container: '#show_pic',
                    maxLength: 6,
                    url: '?c=myesf&a=ajaxUploadImg&city=' + vars.city,
                    imgCountId: '',
                    numChangeCallback: function (count) {
                        if (count === 0) {
                            $showpicId.css('display', 'block').find('dl').addClass('wi80');
                        }
                    }
                });
                if ($showpicId.find('dd').length < 2) {
                    $showpicId.css('display', 'block').find('dl').addClass('wi80');
                }
                $showpicId.on('change', function () {
                    if ($showpicId.find('dd').length < 1) {
                        $showpicId.find('dl').addClass('wi80');
                    } else {
                        $showpicId.find('dl').removeClass('wi80');
                    }
                });
                // $showpicId.find('dl').addClass('wi80');
            });

            // 所有的通过底部浮层下拉列表选择替代用户的输入start
            // +++++++++++++++++++++++++++++++
            // 当楼盘联想没有读出数据时 显示区域选择按钮 给区域选择按钮添加点击事件
            districtManual.on('click', function () {
                // 如果是从编辑页面进入 则不让用户修改区域商圈信息
                if (vars.edit === '1') {
                    return false;
                }
                // 显示区域选择下拉列表
                $('#areaDrap').show();
                // 给区域选择列表添加滑动筛选功能
                slideFilterBox.refresh('#areaDrapCon');
                // 区域滑动列表显示时禁止页面滑动
                unable();
            });


            //  给区域选择列表添加点击事件
            $('#areaDrap').on('click', 'li', function () {
                // 每次点击区域选择列表li时 更新商圈显示span中的内容
                dComarea.text('请选择商圈');
                var $that = $(this);
                // 获取用户选中的区域名称
                var selectedValue = $that.text().trim();
                // 将用户选择的区域写入到对应的显示div中
                districtManual.text(selectedValue);
                // 隐藏区域选择下拉列表
                $('#areaDrap').hide();


                //  当用户没有从联想接口获取到小区名称的数据时 根据用户选择的区域值 动态的获取对应的商圈
                // 并将对应于区域的商圈列表数据写入到对应的商圈选择下拉列表中
                var disId = $that.attr('dis_id');
                var param = {c: 'myzf', a: 'ajaxGetComarea', dis_id: disId};
                var str = '';
                $.get(vars.mySite, param, function (data) {
                    if (data) {
                        for (var i = 0; i < data.length; i++) {
                            str += '<li value="' + data[i].name + '">' + data[i].name + '</li>';
                        }
                    }
                    // 将选择的区域名称对应的商圈列表数据写入到商圈选择下拉列表中
                    $('#districtDrapLi').html(str);
                }, 'json');
                // 隐藏区域选择下拉列表隐藏时 允许页面滑动
                enable();
            });


            // 当楼盘联想没有读出数据时 显示商圈选择按钮 给商圈选择按钮添加点击事件
            dComarea.on('click', function () {
                // 如果是从编辑页面进入 则不让用户修改区域商圈信息
                if (vars.edit === '1') {
                    return false;
                }
                // 显示商圈下拉选择列表
                $('#districtDrap').show();
                // 给商圈选择列表添加滑动筛选功能
                slideFilterBox.refresh('#districtDrapCon');
                // 将商圈选择列表滚动到顶部
                slideFilterBox.to('#districtDrapCon', 0);
                // 商圈选择下拉列表显示时 禁止页面滑动
                unable();
            });


            // 给商圈选择列表添加点击事件
            $('#districtDrap').on('click', 'li', function () {
                var $that = $(this);
                // 获取选中的商圈名称
                var selectedValue = $that.text().trim();
                // 将选择的商圈名称写入到对应的显示div
                dComarea.text(selectedValue);
                // 隐藏商圈选择下拉列表
                $('#districtDrap').hide();
                // 商圈选择下拉表隐藏时 允许页面滑动
                enable();
            });

            $('.cancel').on('click', function () {
                $('.sf-maskFixed').hide();
                enable();
            });

            // 选填项处理 start
            // 户型选择列表处理start
            // huxingValue 用于保存选择户型数据
            var huxingValue = '';


            // 给户型选择按钮添加点击事件
            $('#huxing').on('click', function () {
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
                $('#huxing').text(huxingValue);
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
                $('#huxing').text(huxingValue);
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
                $('#huxing').text(huxingValue);
                $('#huxingWeiDrap').hide();
                // slideFilterBox.refresh('#huxingWeiDrapCon');
                enable();
            });

            // 给合租类型 朝向 支付方式 装修添加点击事件
            $('#shareType,#direction,#payWay,#decoration').on('click', function () {
                var ele = $(this).attr('id');
                var eleConId = ele + 'Drap';
                $('#' + eleConId).show();
                slideFilterBox.refresh('#' + eleConId + 'Con');
                slideFilterBox.to('#' + eleConId + 'Con', 0);
                unable();
            });
            // 给合住类型 朝向 支付方式 装修下拉列表添加点击事件
            $('#shareTypeDrap,#directionDrap,#payWayDrap,#decorationDrap').on('click', 'li', function () {
                var $that = $(this);
                var conId = $that.closest('.sf-maskFixed').attr('id');
                var spanId = conId.replace('Drap', '');
                var thisVal = $that.text();
                $('#' + spanId).text(thisVal);
                $('#' + conId).hide();
                enable();
            });

            // 所有的通过底部浮层下拉列表选择替代用户的输入end

            //  对页面中inpur框的处理 start

            // 控制租金、楼层、总楼层输入的合法性


            // 取消非数字的输入
            $('#roomManual,#floorManual,#totlefloorManual,#priceManual').on('keyup', function () {
                var me = $(this);
                if (me.val().indexOf(0) === 0) {
                    me.val('');
                }
                me.val(me.val().replace(/[\D]/g, ''));
            });
            // 面积判断
            // 控制面积input输入框的输入
            $('#buildingareaManual').on('input', function () {
                var reg = /[^\d\.]/g;
                var me = $(this), val = me.val();
                me.val(val.replace(reg, ''));
                // 把输入的数据进行截取
                if (val.indexOf(0) === 0) {
                    me.val('');
                }
            }).on('blur', function () {
                var $that = $(this);
                var areaTest = /^[0-9]{1,4}(\.[0-9]{0,2}|)$/;
                if (!areaTest.test($that.val()) && $that.val() !== '') {
                    displayLose(3000, '请输入正确格式的面积！');
                    $that.val('');
                }
            });

            // 用户性别的选择
            $('.radioBox').on('click', 'a', function () {
                $('.radioBox').find('a').removeClass('active');
                $(this).addClass('active');
            });

            // 对页面input框的处理结束 end


            // +++++++++++++++++++
            var ajaxFlag = 0;
            // 小区名称输入框输入数据时的处理操作
            $('#projnameManual').on('keyup', function () {
                // 如果再次调用时前一个ajax在执行，终止此次ajax的执行
                if (ajaxFlag) {
                    ajaxFlag.abort();
                    ajaxFlag = 0;
                }
                var value = $(this).val();
                // 获取所小区名称input框中数据
                var district = districtManual.val();
                // 用来存取商圈span中的值
                var comarea = '';
                if (dComarea.length > 0) comarea = dComarea.val();
                // 如果没有输入数据
                if (value.length === 0) {
                    // 清空之前联想的数据  否则每隔1秒 根据楼盘输入框的值 请求联想一次
                    dContent.html('');
                } else {
                    var param = {c: 'myzf', a: 'ajaxGetProjList', q: value};
                    var arr = [];
                    ajaxFlag = $.get(vars.mySite, param, function (data) {
                        // dContent.html(data);
                        // +++++++++++++++
                        // 将联想到小区名称列表 写入到对应的显示小区列表的div中
                        $(data).each(function () {
                            arr.push($(this).text());
                        });

                       
                        dContent.html(data);
                        // 输入小区名称联想接口返回了数据时
                        if (data.length > 0) {
                            // 当输入的词在联想词当中时隐藏区域商圈地址div
                            
                            // 如果输入词不在联想词中，提示请选择区域，商圈
                            $('#noLouPan').show();
                            $('#districtManual').text('请选择区域');
                            $('#comareaManual').text('请选择商圈');
                            $('#addressManual').val('');
                            // 显示联想出来的小区名称列表li
                            dContent.show();
                        } else {
                            // 将数据存起来写入到页面的input hidden中
                            parsevalue('', value, '', '住宅', district, comarea);
                            // 当输入的数据没有联想到小区时 显示需要填写的区域、商圈、地址div
                            $('#noLouPan').show();
                            // 隐藏联想小区名称列表li
                            dContent.hide();
                            // 如果输入词不在联想词中，提示请选择区域，商圈
                            $('#districtManual').text('请选择区域');
                            $('#comareaManual').text('请选择商圈');
                            $('#addressManual').val('');
                        }
                    }, 'json');
                    // value表示小区input输入框中的数据 district表示区域span标签中的数据 comarea 表示商圈span中对应的数据
                }
            });


            /* 2015-10-29 修复选择区域获取不到商圈bug  start */
            // ++++++++++++++++++++++++++++给小区联想出来的小区列表添加点击事件
            dContent.on('click', 'li.pad10', function () {
                $('#noLouPan').hide();
                $(this).hide();
                // 取出联想到的li中的data-fan中的数据 用！！分割为数组
                var arr = $(this).attr('data_fun').split('!!');
                // 楼盘联想有数据时则对应的区域、商圈、地址都应该从联想到的楼盘带出
                // 带出的区域数据
                var tmpDistrict = arr[arr.length - 2].replace(/\'|\'/g, '');
                // 连带出的商圈数据
                var tmpComarea = arr[arr.length - 1].replace(/\'|\'|\)/g, '');
                // 获取连带出的商圈选中的下拉列表数据
                // +++++++++++++++++++++++++++++将该联想对应的区域显示在区域div中
                districtManual.text(tmpDistrict);
                dComarea.text(tmpComarea);
                // 获取选中的区域
                var comareaOption = $('#districtManual').find('li[value=' + tmpDistrict + ']');
                if (vars.citybs === 'b') {
                    // 获取对应选中的区域ID
                    var disId = comareaOption.attr('dis_id');
                    var param = {c: 'myzf', a: 'ajaxGetComarea', dis_id: disId};
                    // ajax获取对应的商圈信息
                    $.get(vars.mySite, param, function (data) {
                        var str = '';
                        if (data) {
                            for (var i = 0; i < data.length; i++) {
                                str += '<li value="' + data[i].name + '">' + data[i].name + '</li>';
                            }
                        }
                        // 将对应的商圈选项列表写入到商圈选择下拉列表中
                        // $('#comareaManual').html(str).val(tmpComarea);
                        // ++++++++++++++++
                        $('#districtDrapLi').html(str).val(tmpComarea);
                    }, 'json');
                }
                var dataStr = $(this).attr('data_fun');
                var data = dataStr.split('!!');
                parsevalue(data[0], data[1], data[2], data[3], data[4], data[5]);
            });
            // 2015-10-29 修复选择区域获取不到商圈bug  end


            // 给配套设施下的a标签添加点击事件 实现配套设施的选择
            $('#equitmentManual').on('click', 'a', function () {
                $(this).toggleClass('active');
            });

            // 完善信息div的隐藏显示切换
            $('#all_message').on('click', function () {
                $('#allmessages_zz').toggleClass('none');
            });
            // 判断是否选中推荐400电话
            if ($('#isuse400tel').val() === '1') {
                $('#isuse400tel').attr('checked', true);
            }

            // 增加日期选择功能，lina 20161109
            var DateAndTimeSelect = require('dateAndTimeSelect/1.1.0/dateAndTimeSelect');
            var year = new Date().getFullYear();
            var lastYear = year + 5;
            var options = {
                // 特殊类型
                type: 'jiaju',
                // 年份限制
                yearRange: year + '-' + lastYear,
                // 单个选项的css高度，用于后面的位置计算
                singleLiHeight: 34,
                // 默认显示的日期
                defaultTime: new Date().getTime()
            };
            var dtSelect = new DateAndTimeSelect(options);
            // 点击选择入住时间
            $('#begintime').on('click', function () {
                dtSelect.show('dtSelect.setting.SELET_TYPE_DATE');
            });
            $('#isuse400tel').on('click', function () {
                if ($(this).attr('checked') === 'checked') {
                    // 如果是选中的再次点击取消选中
                    $(this).attr('checked', false);
                    $('#isuse400tel').val('0');
                } else {
                    $(this).attr('checked', true);
                    $('#isuse400tel').val('1');
                }
            });


            // 控制验证码发送成功后要60秒后才可以从新发送
            // 手机输入框
            var $mobilecodeManualId = $('#mobilecodeManual');
            // 倒计时秒数
            var timeCount = 60;
            // 发送验证码按钮
            var $sendVerifyCode = $('#sendVerifyCode');
            // 点击获取语音验证码
            var timeCountV = 60;
            // 防止多次请求发送语音验证码
            var sendFlag = true;
            // 发送语音验证码按钮
            var $sendVoice = $('#sendVoice');
            // 计时器变量
            var timer1, timer2;
            // 点击发送验证码成功时的回调函数
            function countDown() {
                // 将手机输入框设置不可编辑
                $mobilecodeManualId.attr('disabled', 'disabled');
                // 发送语音验证码按钮置为灰色
                $sendVoice.addClass('gray-b');
                // 发送验证码按钮置为灰色
                $sendVerifyCode.addClass('noClick');
                // 显示发送语音验证码按钮
                $('#voicebox').show();
                // 60s倒计时
                timer1 = setInterval(function () {
                    timeCount--;
                    $sendVerifyCode.text('重新发送(' + timeCount + ')');
                    if (timeCount === -1) {
                        // 清除定时器
                        clearInterval(timer1);
                        // 将手机输入框设置可编辑
                        $mobilecodeManualId.attr('disabled', false);
                        // 倒计时结束的时候把发送验证码的文本修改为重新获取
                        $sendVerifyCode.text('重新获取');
                        // 将发送语音验证码按钮设置为红色可点击状态
                        $sendVoice.removeClass('gray-b');
                        $sendVoice.addClass('red-f6');
                        // 将发送验证码按钮设置为红色可点击状态
                        $sendVerifyCode.removeClass('noClick');
                        timeCount = 60;
                    }
                }, 1000);
            }

            // 点击获取验证码
            $sendVerifyCode.on('click', function () {
                var yanzheng = verify();
                if (!yanzheng) {
                    return false;
                }
                var phone = $('#mobilecodeManual').val();
                if ($(this).hasClass('noClick')) {
                    return false;
                }
                $('#voicebox').show();
                // 调用发送验证码接口getPhoneVerifyCode  param 手机号吗 发送成功的回掉函数 发送失败的回掉函数
                // verifycode.sendVerifyCodeAnswer 验证码验证接口
                verifycode.getPhoneVerifyCode(phone, countDown, function () {
                    // 获取验证码失败 回掉此函 把获取验证码按钮置为可用
                    // displayLose(2000,'验证码发送失败！');
                    return false;
                });
            });
            //判断房源数是否为0，如果为0则进行手机验证码发送
            if (parseInt(vars.houseCount) === 0) {
                $('#messageCodeDl').show();
                $sendVerifyCode.show();
            }
            // 手机号、验证码输入
            var oldPhone = $mobilecodeManualId.val();
            $mobilecodeManualId.on('input', function () {
                var me = $(this), messageCodeDl = $('#messageCodeDl'), sendVerifyCode = $sendVerifyCode;
                me.val(me.val().substring(0, 11).replace(/[\D]/g, ''));
                if (oldPhone !== me.val()) {
                    vars.authenticated = 0;
                    messageCodeDl.show();
                    sendVerifyCode.show();
                } else if (oldPhone !== '' && oldPhone === me.val() && parseInt(vars.houseCount) > 0) {
                    vars.authenticated = 1;
                    messageCodeDl.hide();
                    sendVerifyCode.hide();
                }
            });
            messagecodeManual.on('input', function () {
                var me = $(this);
                me.val(me.val().substring(0, 4).replace(/[\D]/g, ''));
            });


            // 语音验证码计时方法
            function countDownVoice() {
                // 设置电话输入框倒计时内不可编辑
                $mobilecodeManualId.attr('disabled', 'disabled');
                // 发送验证码按钮置为灰色
                $sendVerifyCode.addClass('noClick');
                // 语音验证码按钮置为灰
                $sendVoice.removeClass('red-f6');
                $sendVoice.addClass('gray-b');
                // 语音验证码计时开始
                timer2 = setInterval(function () {
                    timeCountV--;
                    $sendVoice.text('语音验证码(' + timeCountV + 's)');
                    if (timeCountV === -1) {
                        // 清除计时器
                        clearInterval(timer2);
                        // 设置电话输入框倒计时内可编辑
                        $mobilecodeManualId.attr('disabled', false);
                        // 设置计时结束后文字
                        $sendVoice.text('语音验证码');
                        // 设置计时结束后语音验证码按钮置为红
                        $sendVoice.removeClass('gray-b');
                        $sendVoice.addClass('red-f6');
                        // 发送验证码按钮置为红色
                        $sendVerifyCode.removeClass('noClick');
                        timeCountV = 60;
                    }
                }, 1000);
            }

            // 点击发送语音验证码
            $sendVoice.on('click', function () {
                var yanzheng = verify();
                if (!yanzheng) {
                    return false;
                }
                var phone = $mobilecodeManualId.val();
                if (!$sendVoice.hasClass('red-f6')) {
                    return false;
                }
                if (!sendFlag) {
                    return false;
                }
                if (/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i.test(phone)) {
                    // 防止连续点击bug lipengkun@fang.com
                    sendFlag = false;
                    $.ajax({
                        url: 'https://passport.fang.com/passport/Mloginsendmsm.api',
                        type: 'Post',
                        dataType: 'json',
                        async: false,
                        xhrFields: {
                            withCredentials: true
                        },
                        crossDomain: true,
                        data: {
                            MobilePhone: phone, Operatetype: '0', Service: 'soufun-wap-wap', Sendvoice: '1'
                        },
                        error: function () {
                            displayLose(2000, '服务器开小差了，请重试！');
                            // 语音验证码按钮限制重置
                            sendFlag = true;
                        },
                        success: function (data) {
                            if (data.Message === 'Success') {
                                countDownVoice();
                            } else if (data.IsSent) {
                                displayLose(2000, data.Tip);
                            }
                            // 语音验证码按钮限制重置
                            sendFlag = true;
                        }
                    });
                } else {
                    displayLose(2000, '请输入正确格式的手机号码！');
                }
            });

            // 获取配套设施
            function getEquitement(arr) {
                var arr1 = [];
                for (var i = 0; i < arr.length; i++) {
                    arr1.push(arr[i].innerHTML + ',');
                }
                return arr1.join('');
            }

            // 获取上传图片路径
            function getImgUrlFileName() {
                var imgsArray = imgupload.imgsArray;
                var arr = [], titleImg;
                if (imgsArray) {
                    for (var i = 0; i < imgsArray.length; i++) {
                        arr.push(imgsArray[i].imgurl + ',' + imgsArray[i].fileName);
                    }
                    if (imgsArray[0]) {
                        titleImg = imgsArray[0].imgurl;
                    } else {
                        titleImg = '';
                    }
                }
                return [titleImg, arr.join(';')];
            }


            // 判断输入内容中是否含有极限词
            $('#projnameManual,#addressManual,#titleManual,#descriptionManual').on('change', function () {
                $.get(vars.mySite + '?c=myzf&a=ajaxCheckLimitWords&words=' + encodeURIComponent($(this).val()), function (data) {
                    if (data === '1') {
                        displayLose(2000, '您输入的内容中包含违禁词，录入时会自动过滤');
                    }
                });
            });

            // 提交发布
            // 防止连续提交
            var subFlag = true;
            $('.btn-pay').on('click', function () {
                var yanzheng = verify();
                if (!yanzheng) {
                    return false;
                }
                var beginTime = $('#begintime');
                var roomIn = '';
                if (beginTime.html() !== '随时入住') {
                    roomIn = beginTime.html();
                }
                if (!subFlag) {
                    return false;
                }
                subFlag = false;
                var verifySuccess = function () {
                    var param = {c: 'myzf', a: 'postRentInfo', city: vars.city};
                    // 获取入住时间
                    param.begintime = roomIn;
                    // 获取房子id
                    param.houseid = $('#houseid').val();
                    //  获取input框中的手机号
                    param.mobilecode = $mobilecodeManualId.val().trim();
                    // 获取小区名称input框的值
                    param.projname = $('#projnameManual').val();
                    // 合租方式!!!!!!!!!!!!!!合租中才有主卧,次卧之类
                    param.rentway = $('#shareType').text();
                    // 获取区域选择的数据
                    param.district = districtManual.text() || districtManual.val();
                    // 获取商圈选择的数据 该数据在大城市中有  小城市中没有
                    param.comarea = $('#comareaManual').text().trim();
                    // 获取地址input框中的数据
                    param.address = $('#addressManual').val();
                    // 租房类型(span)合租或者整租
                    param.renttype = rentType;
                    // 获取建筑面积input框中的数据
                    param.buildingarea = $('#buildingareaManual').val();
                    // 获取租金
                    param.price = $('#priceManual').val();
                    // 获取用户选中的配套设施
                    param.equitment = getEquitement($('#equitmentManual .active'));
                    // 物业类型,后台向前台传的
                    param.purpose = $('#purposeManual').val();
                    // 标题图片++++++++++
                    param.titleimage = getImgUrlFileName()[0];
                    
                    // 上传图片路径++++++++++++++
                    param.shineiimg = getImgUrlFileName()[1];
                    // 编辑页面(input)
                    param.edit = $('#edit').val();
                    // 标题
                    param.title = $('#titleManual').val();
                    // 描述
                    param.description = $('#descriptionManual').val();
                    // 楼层-第X层
                    param.floor = $('#floorManual').val();
                    // 楼层-共X层
                    param.totlefloor = $('#totlefloorManual').val();

                    // +++++选填信息
                    // 户型-室-厅-卫
                    var huxing = $.trim($('#huxing').text());
                    param.room = huxing.substr(0, 1);
                    param.hall = huxing.substr(2, 1);
                    param.toilet = huxing.substr(4, 1);
                    // 合租性别,只有合租有
                    // param.rentgender = $('#sexLimit').text();
                    // 朝向
                    param.forward = $('#direction').text();
                    // 支付方式,月付等等
                    param.payinfo = $('#payWay').text();
                    // 装修
                    param.fitment = $('#decoration').text();
                    // 小区id
                    param.projcode = $('#projcode').val();
                    // 绑定400电话
                    param.isuse400tel = $('#isuse400tel').val();
                    // 楼栋号
                    param.unitblock = $('#blockManual').val();
                    // 房号
                    param.UnitHall = $('#newhallManual').val();
                    // 联系人
                    param.contactperson = $('#contactpersonManual').val();
                    // 性别
                    param.gender = $('#selectGender ').find('a.active').text();
                    // 表示验证通过
                    param.authenticated = '1';
                    // sfut
                    param.telSfut = mysfut;
                    var currentUrl = window.location.href;
                    var refUrl = document.referrer;
                    var sucurl = vars.mySite + '?c=myzf&a=publishSuccess' + '&city=' + vars.city + '&Mobile=' + vars.Mobile;
                    if (currentUrl.lastIndexOf('baidu-waptc') !== -1 || refUrl.lastIndexOf('baidu-waptc') !== -1) {
                        param['baidu-waptc'] = '';
                        sucurl += '&baidu-waptc';
                    }
                    // 统计合租整租
                    // 47表示发布合租行为 32表示发布整租行为
                    var yhxwType = 47;
                    if (rentType === '整租') {
                        yhxwType = 32;
                    }
                    // vars.edit === '1'表示从个人中心的编辑进入修改
                    if (vars.edit === '1') {
                        yhxwType = 111;
                    }
                    // type 用户动作，pageId当前页面标识，curChannel 当前平道，params,当前参数数组
                    yhxw({type: yhxwType, pageId: pageId, curChannel: 'myzf', params: param});
                    $.post(vars.mySite, param, function (data) {
                        if (data.result === '100') {
                            sucurl += '&houseid=' + data.houseid + '&comarea=' + param.comarea + '&district=' + param.district
                                + '&projname=' + param.projname + '&renttype' + param.renttype + '&price=' + param.price +
                                '&buildingarea=' + param.buildingarea + '&titleimage=' + param.titleimage;
                            // 0913 lipengkun@fang.com 添加运营统计参数
                            if (vars.channel) {
                                sucurl += '&channel=' + vars.channel;
                            }
                            // 1113 lipengkun@fang.com 添加活动标志
                            if (vars.src_from === 'zffxh5sjf') {
                                sucurl += '&src_from=zffxh5sjf';
                            }
                            displayLose(3000, '发布成功', sucurl);
                        } else if (data.message) {
                            displayLose(3000, data.message, '');
                        } else if (data === '') {
                            displayLose(3000, '网络错误,请稍候再试', '');
                        }
                    }, 'json').always(function () {
                        subFlag = true;
                    });
                };
                var verifyError = function () {
                    subFlag = true;
                    displayLose(2000, '短信验证码验证失败,请尝试重新发送');
                };

                if (parseInt(vars.authenticated) && ($mobilecodeManualId.val() === vars.Mobile) && parseInt(vars.houseCount) > 0) {
                    // 已经登录了,不用再验证验证码
                    verifySuccess();
                } else {
                    if (!messagecodeManual.val()) {
                        displayLose(2000, '请输入正确的短信验证码');
                        return false;
                    }
                    verifycode.sendVerifyCodeAnswer($mobilecodeManualId.val(), messagecodeManual.val(), function (sfut) {
                            mysfut = sfut;
                            verifySuccess();
                        }
                        , verifyError, login);
                }
            });
        };
    });
