/**
 * 租房写字楼发布 步骤2
 * by lina 201601215 租房ui改版
 */
define('modules/myzf/officeLeaseStepTwo', ['jquery', 'verifycode/1.0.0/verifycode', 'slideFilterBox/1.0.0/slideFilterBox', 'dateAndTimeSelect/1.1.0/dateAndTimeSelect'],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            // 存放全局变量 seajs中相关的配置数据
            var vars = seajs.data.vars;
            // 引入jquery
            var $ = require('jquery');
            //var slideFilterBox = require('slideFilterBox/1.0.0/slideFilterBox');
            var $doc = $(document);
            // 发送验证码插件
            var verifycode = require('verifycode/1.0.0/verifycode');
            // 滑动筛选框插件
            var slideFilterBox = require('slideFilterBox/1.0.0/slideFilterBox');
            // 输入小区名称联想出来的数据内容
            var dContent = $('#search_completev1');
            // 商圈对应的span
            var dComarea = $('#comareaManual');
            // 区域对应的sapn
            var districtManual = $('#districtManual');

            var messagecodeManual = $('#messagecodeManual');
            //sfut
            var mysfut;
            var zfhc;
            var sendFlag = true;
            var submitFlag = true;
            //手机格式验证
            var telExp = /^1[34578]{1}[0-9]{9}$/;
            var badTelExp = /^17[01]{1}[0-9]{8}$/;
            //点击穿透
            var canClick = true;

            //获取cookie
            var inputCookie = {};
            if (vars.edit === '0') {
                inputCookie = getCookie('inputCookieXzl');
                if (inputCookie) {
                    inputCookie = JSON.parse(inputCookie);
                } else {
                    inputCookie = {};
                }
            }
            if (vars.localStorage && vars.edit === '0') {
                var descriptionTemp = decodeURIComponent(window.localStorage.getItem('descriptionXzl'));
                var descriptionTime = window.localStorage.getItem('descriptionTimeXzl');
                var currentTime = Date.parse(new Date());
                var limitTime = 0.5 * 60 * 60 * 1000;
                if (descriptionTemp !== 'null' && currentTime - descriptionTime < limitTime) {
                    $('#descriptionManual').val(descriptionTemp);
                }
            }
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

            //写cookies
            function setCookie(name, value) {
                //var Days = 1;
                var exp = new Date();
                exp.setTime(exp.getTime() + 0.5 * 60 * 60 * 1000);
                document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + exp.toGMTString() + "; path=/";
            }

            function getCookie(name) {
                var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
                if (arr = document.cookie.match(reg)) {
                    return decodeURIComponent(arr[2]);
                } else {
                    return null;
                }
            }

            function transCookie(value) {
                if (vars.edit === '0') {
                    value = JSON.stringify(value); //可以将json对象转换成json对符串 
                    setCookie('inputCookieXzl', value);
                }
            }
            /**
             *input提示框穿透  
             */

             function enClick() {
                setTimeout(function () {
                    canClick = true;
                    $('.noinput').attr('disabled',false);
                    if (vars.edit === '1') {
                        $('#addressManual').attr('disabled',true);
                    }
                },300);
             }

            if (vars.edit === '0' || vars.edit === '2') {
                $('#projnameManual,#addressManual').attr('disabled', false);
            }
            if (vars.edit === '1' || vars.edit === '2') {
                $('.area-display').show();
                $('.price-display').show();
                if (vars.edit === '1') {
                    $('#noLouPan').show();
                }
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
            
                //写入cookie
                inputCookie.projname = Projname;
                inputCookie.projcode = Projcode;
                inputCookie.address =  Address;
                inputCookie.purpose = Purpose;
                inputCookie.district = District;
                inputCookie.comarea = Comarea;
                transCookie(inputCookie);
            }

            // +++++++++++++++++++
            // 展示房源列表
            var ajaxFlag = 0;
            var $noLouPan = $('#noLouPan');
            // 小区名称输入框输入数据时的处理操作
            $('#projnameManual').on('input', function () {
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
                // 清空之前联想的数据  否则每隔1秒 根据楼盘输入框的值 请求联想一次
                dContent.html('');
                districtManual.html('请选择区域');
                dComarea.html('请选择商圈');
                $('#addressManual').val('');
                if (value.length !== 0) {
                    var param = {c: 'myzf', a: 'ajaxGetProjList', q: value, purpose: '写字楼'};
                    ajaxFlag = $.get(vars.mySite, param, function (data) {
                        // dContent.html(data);
                        // +++++++++++++++
                        // 将联想到小区名称列表 写入到对应的显示小区列表的div中
                        dContent.html(data);
                        // 输入小区名称联想接口返回了数据时
                        if (data.length > 0) {
                            // 当输入的数据可以联想到小区时 隐藏需要填写的区域、商圈、地址div
                            $noLouPan.show();
                            // 显示联想出来的小区名称列表li
                            dContent.show();
                        } else {
                            // 将数据存起来写入到页面的input hidden中
                            parsevalue('', value, '', '写字楼', district, comarea);
                            // 当输入的数据没有联想到小区时 显示需要填写的区域、商圈、地址div
                            $noLouPan.show();
                            // 隐藏联想小区名称列表li
                            dContent.hide();
                        }
                    }, 'json');
                    // value表示小区input输入框中的数据 district表示区域span标签中的数据 comarea 表示商圈span中对应的数据
                }
            });

            // ++++++++++++++++++++++++++++给小区联想出来的小区列表添加点击事件
            dContent.on('click', 'li.pad10', function () {
                $noLouPan.hide();
                // $(this).hide();
                // 取出联想到的li中的data-fan中的数据 用！！分割为数组
                var arr = $(this).attr('data_fun').split('!!');
                dContent.html('').hide();
                // 楼盘联想有数据时则对应的区域、商圈、地址都应该从联想到的楼盘带出
                // 带出的区域数据
                var tmpDistrict = arr[arr.length - 2].replace(/\'|\'/g, '');
                // 连带出的商圈数据
                var tmpComarea = arr[arr.length - 1].replace(/\'|\'|\)/g, '');
                // 获取连带出的商圈选中的下拉列表数据
                // +++++++++++++++++++++++++++++将该联想对应的区域显示在区域div中
                if (tmpDistrict !== '') {
                    districtManual.text(tmpDistrict);
                } else {
                    $noLouPan.show();
                }
                if (tmpComarea !== '') {
                    dComarea.text(tmpComarea);
                } else {
                    $noLouPan.show();
                }
                // 获取选中的区域
                var comareaOption = $('#districtManualDrapCon').find('li[value=' + tmpDistrict + ']');
                // 获取对应选中的区域ID
                var disId = comareaOption.attr('dis_id');
                var param = {c: 'myzf', a: 'ajaxGetComarea', dis_id: disId, purpose: '写字楼'};
                // ajax获取对应的商圈信息
                $.get(vars.mySite, param, function (data) {
                    var str = '';
                    if (data) {
                        var i;
                        var len = data.length;
                        for (i = 0; i < len; i++) {
                            str += '<li value="' + data[i].name + '">' + data[i].name + '</li>';
                        }
                    }
                    $('#comareaManualDrapLi').html(str).val(tmpComarea);
                }, 'json');
                var dataStr = $(this).attr('data_fun');
                var data = dataStr.split('!!');
                parsevalue(data[0], data[1], data[2], data[3], data[4], data[5]);
                
            });
            // 点击区域选择区域
            var $districtManualDrap = $('#districtManualDrap');
            $('#districtManual').on('click', function () {
                if (!canClick) {
                    return false;
                }
                if (vars.edit === '0' || vars.edit === '2') {
                    $districtManualDrap.show();
                }
            });
            //  给区域选择列表添加点击事件
            $districtManualDrap.on('click', 'li', function () {
                $('.noinput').attr('disabled',true);
                canClick = false;
                // 每次点击区域选择列表li时 更新商圈显示span中的内容
                dComarea.text('请选择商圈');
                var $that = $(this);
                // 获取用户选中的区域名称
                var selectedValue = $that.text();
                // 将用户选择的区域写入到对应的显示div中
                districtManual.text(selectedValue);
                // 隐藏区域选择下拉列表
                $districtManualDrap.hide();
                //  当用户没有从联想接口获取到小区名称的数据时 根据用户选择的区域值 动态的获取对应的商圈
                // 并将对应于区域的商圈列表数据写入到对应的商圈选择下拉列表中
                var disId = $that.attr('dis_id');
                var param = {c: 'myzf', a: 'ajaxGetComarea', dis_id: disId, purpose: '写字楼'};
                var str = '';
                $.get(vars.mySite, param, function (data) {
                    if (data) {
                        var i;
                        var len = data.length;
                        for (i = 0; i < len; i++) {
                            str += '<li value="' + data[i].name + '">' + data[i].name + '</li>';
                        }
                    }
                    // 将选择的区域名称对应的商圈列表数据写入到商圈选择下拉列表中
                    $('#comareaManualDrapLi').html(str);
                }, 'json');
                // 隐藏区域选择下拉列表隐藏时 允许页面滑动
                enable();
                enClick();
                //写入cookie
                inputCookie.district = $that.text();
                transCookie(inputCookie);
            });
            // 点击商圈选择商圈
            var $comareaManual = $('#comareaManual');
            var $comareaManualDrap = $('#comareaManualDrap');
            $comareaManual.on('click', function () {
                if (!canClick) {
                    return false;
                }
                if (districtManual.text() === '请选择区域') {
                    showMsg('请选择区域');
                    return false;
                }
                if (vars.edit === '0' || vars.edit === '2') {
                   $comareaManualDrap.show(); 
                }
                
            });
            // 给商圈选择列表添加点击事件
            $comareaManualDrap.on('click', 'li', function () {
                $('.noinput').attr('disabled',true);
                canClick = false;
                var $that = $(this);
                // 获取选中的商圈值
                var selectedValue = $that.text();
                // 设置商圈显示span标签的值
                $comareaManual.text(selectedValue);
                // 隐藏商圈选择下拉列表
                $comareaManualDrap.hide();
                // 允许页面滚动
                enable();
                enClick();
                //写入cookie
                inputCookie.comarea = $that.text();
                transCookie(inputCookie);
            });


            // 上传图片处理 start
            var $showpicId = $('#show_pic');
            // 图片上传
            var imgupload = {};
            require.async(['imageUpload/1.0.0/imgVideoUpload'], function (ImageUpload) {
                imgupload = new ImageUpload({
                    richInputBtn: '',
                    container: '#show_pic',
                    maxLength: 10,
                    url: '?c=myesf&a=ajaxUploadImg&city=' + vars.city,
                    imgCountId: '',
                    imgsUrl: vars.shineiimg,
                    inputClass:'zf_newsc',
                    // 添加图片按钮模版
                    inputTemp: '<input id="uploadBtn" type="file" multiple="multiple" class="upload-input"><span id="uploadTxt">添加图片/视频</span>',
                    loadingGif:vars.loadingGif,
                    numChangeCallback: function (count,imgsArray) {
                        if(imgsArray){
                            imgupload.imgsArray = imgsArray;
                        }
                        if (count === 0) {
                            $showpicId.css('display', 'block').find('dl').addClass('wi80');
                        }
                        if(count >= 1){
                            var $video  = $('#v-cover');
                            var videoLen = $video.length;
                            var $coverImg = $('#coverImg');
                            if(!$coverImg.length){
                                var eqNum = videoLen ? 1 : 0;
                                $('#show_pic').find('dd').not('.zf_newsc').eq(eqNum).append('<div id="coverImg" class="cver">封面</div>');
                            }
                        }
                        $('#uploadBtn').val('');
                        if (vars.edit === '0') {
                            //写cookie
                            var cookieTemp
                            cookieTemp = getCookie('inputCookieXzl'); 
                            if (cookieTemp) {
                                cookieTemp = JSON.parse(cookieTemp);
                            } else {
                                cookieTemp = {};
                            }
                            cookieTemp.shineiimg = getImgUrlFileName()[1];
                            transCookie(cookieTemp);
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
            });

            /**
             * 获取上传图片路径
             * @returns 返回一长度为2的数组 元素一为标题图片的地址
             * 元素二为所有图片的地址
             */
            function getImgUrlFileName(submit) {
                var imgsArray = imgupload.imgsArray;
                var arr = [], arr2 = [], titleImg;
                if (imgsArray) {
                    for (var i = 0; i < imgsArray.length; i++) {
                        var thisImg = imgsArray[i];
                        // 提交的时候不收集视频信息
                        if(!submit){
                            if(thisImg.mediaId){
                                arr.push(thisImg.imgurl + ',' + thisImg.fileName + ',' + thisImg.mediaId)
                            }else{
                                arr.push(thisImg.imgurl + ',' + thisImg.fileName);
                            }
                        }else {
                            if(!thisImg.mediaId){
                                arr.push(thisImg.imgurl + ',' + thisImg.fileName);
                            }
                        }
                        if (thisImg.generTime === 'undefined' && submit) {
                            thisImg.generTime = thisImg.generTime.replace(/(\d{4}):(\d\d):(\d\d)/g, "$1-$2-$3");
                            if (thisImg.generTime || (thisImg.gpsX && thisImg.gpsY)) {
                                arr2.push(thisImg.imgurl + '|' + thisImg.generTime + '|' + thisImg.gpsX + '|' + thisImg.gpsY);
                            }
                        }
                    }
                    if (arr[0] && submit) {
                        titleImg = arr[0].imgurl;
                    } else {
                        titleImg = '';
                    }
                }
                return [titleImg, arr.join(';'), arr2.length && arr2.join(';')];
            }

            // 控制面积input输入框的输入
            $('#buildingareaManual').on('keyup', function (ev) {
                var value = ev.target.value;
                if (value.indexOf(0) === 0) {
                    value = '';
                }
                value = value.match(/\d{0,4}(\.\d{0,2})?/g);
                ev.target.value = value[0];
                // 建筑面积输入时，显示能否分割
                if (ev.target.value !== '' || vars.edit === '1' || vars.edit === '2') {
                    $('.area-display').show();
                } else {
                    $('.area-display').hide();
                }
                //写cookie
                inputCookie.allacreage = value[0];
                transCookie(inputCookie);
            });
            $('#priceManual').on('keyup', function (ev) {
                var value = ev.target.value;
                if (value.indexOf(0) === 0) {
                    ev.target.value = '';
                }
                ev.target.value = ev.target.value.replace(/[\D]/g, '');
                //写cookie
                inputCookie.houseprice = ev.target.value;
                transCookie(inputCookie);
            });
            // 楼层取消非数字的输入
            $('#floorManual').on('keyup', function (ev) {
                var value = ev.target.value;
                if (value.indexOf(0) === 0) {
                    ev.target.value = '';
                }
                ev.target.value = ev.target.value.replace(/[\D]/g, '');
                //写cookie
                inputCookie.housefloor = ev.target.value;
                transCookie(inputCookie);
            });
            // 总楼层取消非数字的输入
            $('#totlefloorManual').on('keyup', function (ev) {
                var value = ev.target.value;
                if (value.indexOf(0) === 0) {
                    ev.target.value = '';
                }
                ev.target.value = ev.target.value.replace(/[\D]/g, '');
                
                //写cookie
                inputCookie.totalfloor = ev.target.value;
                transCookie(inputCookie);
            });

            // 类型级别点击事件
            $('#TypeGrade').on('click', function () {
                if (!canClick) {
                    return false;
                }
                $('#officeTypeDrap').show();
                slideFilterBox.refresh('#officeTypeDrapCon');
                slideFilterBox.to('#officeTypeDrapCon', 0);
                unable();
            });
            var thisVal = '';
            $('#officeTypeDrapCon').find('li').on('click', function() {
                $('.noinput').attr('disabled',true);
                canClick = false;
                thisVal = $(this).html();
                $('#TypeGrade').html(thisVal);
                $('#officeGradeDrap').show();
                $('#officeTypeDrap').hide();
                slideFilterBox.refresh('#officeGradeDrapCon');
                slideFilterBox.to('#officeGradeDrapCon', 0);
                enClick();
                //写cookie
                inputCookie.shangyongtype = thisVal;
                transCookie(inputCookie);
            });
            $('#officeGradeDrapCon').find('li').on('click', function(){
                $('.noinput').attr('disabled',true);
                canClick = false;
                var nextVal = $(this).html();
                //var thisVal = $('#TypeGrade').html();
                $('#TypeGrade').html(thisVal + '-' + nextVal);
                $('#officeGradeDrap').hide();
                enClick();
                //写cookie
                inputCookie.pumianjibietype = nextVal;
                transCookie(inputCookie);
            });

            /**
             *  点击选项，出来弹框
             * @param btn 点击的按钮
             * @param parent1 弹框容器
             * @param parent2 选项的父元素
             * @param next 类型级别中的级别
             * @param relative 有关联的div
             */
            function selectFun(btn, parent1, parent2, next, relative) {
                $(btn).on('click', function () {
                    if (!canClick) {
                        return false;
                    }
                    $(parent1).show();
                    slideFilterBox.refresh(parent2);
                    slideFilterBox.to(parent2, 0);
                    unable();
                });
                $(parent2).find('li').on('click', function () {
                    $('.noinput').attr('disabled',true);
                    canClick = false;
                    var thisVal = $(this).html();
                    $(parent1).hide();
                    $(btn).html(thisVal);
                    if (btn === '#divide') {
                        //写cookie
                        inputCookie.issplit = thisVal;
                        transCookie(inputCookie);
                    } else if (btn === '#priceType') {
                        //写cookie
                        inputCookie.pricetype = thisVal;
                        transCookie(inputCookie);
                    } else if (btn === '#payWay') {
                        //写cookie
                        inputCookie.paytype = thisVal;
                        transCookie(inputCookie);
                    } else if (btn === '#tentFee') {
                        //写cookie
                        inputCookie.iswuyefei = thisVal;
                        transCookie(inputCookie);
                    } else if (btn === '#decoration') {
                        //写cookie
                        inputCookie.fitment = thisVal;
                        transCookie(inputCookie);
                    }
                    
                    if ($(relative).length) {
                        $(relative).show();
                    }
                    enable();
                    enClick();
                });
            }

            // 点击类型级别,选择类型级别
            //selectFun('#TypeGrade', '#officeTypeDrap', '#officeTypeDrapCon', '#officeGradeDrap');
            // 点击是否分割，选择分割类别
            selectFun('#divide', '#divideDrap', '#divideDrapCon');
            // 点击租金单位，选择租金单位
            selectFun('#priceType', '#priceTypeDrap', '#priceTypeDrapCon', '', '.price-display');
            // 选择支付方式
            selectFun('#payWay', '#payWayDrap', '#payWayDrapCon');
            // 选择是否包含物业费
            selectFun('#tentFee', '#tentFeeDrap', '#tentFeeDrapCon');
            // 选择装修程度
            //selectFun('#tentFee', '#tentFeeDrap', '#tentFeeDrapCon');
            // 选择装修程度
            selectFun('#decoration', '#decorationDrap', '#decorationCon');
            // 点击浮层取消按钮隐藏浮层
            $('.cancel').on('click', function () {
                $('.sf-maskFixed').hide();
                enable();
            });

            //输入物业费限制
            $('#tentFeeVal').on('keyup', function(ev) {
                var value = ev.target.value;
                if (value.indexOf(0) === 0) {
                    ev.target.value = '';
                }
                ev.target.value = ev.target.value.replace(/[\D]/g, '');

                //写cookie
                inputCookie.wuyefei = ev.target.value;
                transCookie(inputCookie);
            });

            //输入房源描述，写入cookie
            $('#descriptionManual').on('input', function(ev) {
                var value = ev.target.value;
                //写cookie
                if (vars.localStorage) {
                    window.localStorage.setItem('descriptionXzl', encodeURIComponent(value));
                    window.localStorage.setItem('descriptionTimeXzl', Date.parse(new Date())); 
                }
                // inputCookie.housedetail = ev.target.value;
                // transCookie(inputCookie);
            });

            //输入姓名，写入cookie
            $('#contactpersonManual').on('input', function(ev) {
                var value = ev.target.value;
                //写cookie
                inputCookie.chinesename = ev.target.value;
                transCookie(inputCookie);
            });
            // 提示弹框
            var msg = $('#sendFloat'),
                msgP = $('#sendText'),
                timer = null;

            function showMsg(text, callback) {
                text = text || '信息有误！';
                msgP.html(text);
                msg.fadeIn();
                clearTimeout(timer);
                timer = setTimeout(function () {
                    msg.fadeOut();
                    callback && callback();
                }, 2000);
            }

            // 日期选择功能
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
                if (!canClick) {
                    return false;
                }
                dtSelect.show('dtSelect.setting.SELET_TYPE_DATE');
            });

            // 手机号、验证码输入
            var $mobilecodeManualId = $('#mobilecodeManual');
            var oldPhone = $mobilecodeManualId.val();
            if (badTelExp.test(oldPhone)) {
                $('#use400').hide();
            }
            $mobilecodeManualId.on('input', function () {
                var me = $(this), messageCodeDl = $('#messageCodeDl'), sendVerifyCode = $('#sendVerifyCode');
                me.val(me.val().substring(0, 11).replace(/[\D]/g, ''));
                if (oldPhone !== me.val()) {
                    vars.authenticated = 0;
                    messageCodeDl.show();
                    sendVerifyCode.show();
                } else if (oldPhone !== '' && oldPhone === me.val()) {
                    vars.authenticated = 1;
                    messageCodeDl.hide();
                    sendVerifyCode.hide();
                }
                if (badTelExp.test(me.val())) {
                    $('#use400').hide();
                } else {
                    $('#use400').show();
                }
                //写cookie
                inputCookie.mobile = me.val();
                transCookie(inputCookie);
            });

            // 控制验证码发送成功后要60秒后才可以从新发送
            // 倒计时秒数
            var timeCount = 60;
            // 发送验证码按钮
            var $sendVerifyCode = $('#sendVerifyCode');
            // // 点击获取语音验证码
            // var timeCountV = 60;
            // // 防止多次请求发送语音验证码
            // var sendFlag = true;
            // 发送语音验证码按钮
            //var $sendVoice = $('#sendVoice');
            var timer1, timer2;
            // 点击发送验证码成功时的回调函数
            function countDown() {
                // 发送语音验证码按钮置为灰色
                //$sendVoice.removeClass('red-f6');
                // 发送验证码按钮置为灰色
                $sendVerifyCode.addClass('noClick');
                // 显示发送语音验证码按钮
                $('.submitbox').find('li').eq(0).show();
                // 60s倒计时
                timer1 = setInterval(function () {
                    timeCount--;
                    $sendVerifyCode.text(timeCount + 's');
                    if (timeCount === -1) {
                        // 清除定时器
                        clearInterval(timer1);
                        // 倒计时结束的时候把发送验证码的文本修改为重新获取
                        $sendVerifyCode.text('重新获取');
                        // 将发送语音验证码按钮设置为红色可点击状态
                        //$sendVoice.addClass('red-f6');
                        // 将发送验证码按钮设置为红色可点击状态
                        $sendVerifyCode.removeClass('noClick');
                        timeCount = 60;
                    }
                }, 1000);
            }

            // 点击获取验证码
            $sendVerifyCode.on('click', function () {
                if (!canClick || $(this).hasClass('noClick')) {
                    return false;
                }
                var phone = $('#mobilecodeManual').val();
                //$('.submitbox').find('div').show();
                // 调用发送验证码接口getPhoneVerifyCode  param 手机号吗 发送成功的回掉函数 发送失败的回掉函数
                // verifycode.sendVerifyCodeAnswer 验证码验证接口
                if (inputverify()) {
                    verifycode.getPhoneVerifyCode(phone, countDown, function () {
                        // 获取验证码失败 回掉此函 把获取验证码按钮置为可用
                        // displayLose(2000,'验证码发送失败！');
                        return false;
                    });
                }
                
            });

            //滑动验证码处理 start
            //引用验证码
            require.async('https://static.soufunimg.com/common_m/m_recaptcha/js/app.js', function(){
                /*验证码初始化*/
                (function(window, $) {
                    // 调用验证控件
                    window.fCheck.init({
                        container: '.slideverify',
                        url: vars.askSite + '?c=public&a=ajaxCodeInit&mode=1',
                        callback: function() {
                            // 验证成功后的回调
                        }
                    });
                })(this, jQuery);
            });

            // 给下拉浮层列表取消按钮添加点击事件
            $('.cancel').on('click', function () {
                // 隐藏下拉浮层列表
                $('.sf-maskFixed').hide();
                enable();
            });

            // // 联系人只能输入汉字的限制
            // var contactpersonManualTest = /^([a-zA-Z\u4e00-\u9fa5]+[\s]?)+$/;
            // $('#contactpersonManual').on('input', function () {
            //     var inputVal = $(this).val();
            //     if (inputVal !== '' && inputVal !== ' ' && !contactpersonManualTest.test(inputVal)) {
            //         displayLose(2000, '只能输入汉字或字母！');
            //         $(this).val('');
            //     }
            // });
            // 性别选择
            $('#selectGender').find('a').on('click', function () {
                if (!canClick) {
                    return false;
                }
                var $that = $(this);
                $that.siblings().removeClass('active');
                $that.addClass('active');
                //写cookie
                inputCookie.gender = $that.text();
                transCookie(inputCookie);
            });

            // 是否开启400免费电话
            var $isuseTel = $('#isuse400tel');
            $isuseTel.on('click', function () {
                if (!canClick) {
                    return false;
                }
                if ($(this).attr('checked') === 'checked') {
                    // 如果是选中的再次点击取消选中
                    $(this).attr('checked', false);
                    $isuseTel.val('0');
                } else {
                    $(this).attr('checked', true);
                    $isuseTel.val('1');
                }
                //写cookie
                inputCookie.Isuse400 = $isuseTel.val();
                transCookie(inputCookie);
            });

            //验证输入
            function inputverify() {
                // 首先验证这前要求的必填项是否都填写
                if ($('#projnameManual').val() === '') {
                    displayLose(2000, '请输入小区名称');
                    return false;
                } else if (districtManual.html() === '请选择区域') {
                    // 验证区域sapn标签的值
                    displayLose(2000, '请选择区域');
                    return false;
                } else if (dComarea.html() === '请选择商圈') {
                    // 验证商圈
                    displayLose(2000, '请选择商圈');
                    return false;
                } else if ($('#addressManual').val() === '') {
                    // 验证地址输入框的值
                    displayLose(2000, '地址不能为空');
                    return false;
                } else if ($('#TypeGrade').html() === '请选择') {
                    // 验证户型是否选择
                    displayLose(2000, '类型级别不能为空');
                    return false;
                } else if ($('#buildingareaManual').val() === '') {
                    //验证建筑面积
                    displayLose(2000, '建筑面积不能为空');
                    return false;
                } else if ($('#priceManual').val() === '') {
                    //验证租金
                    displayLose(2000, '租金不能为空');
                    return false;
                } else if ($('#priceType').html() === '请选择') {
                    //验证租金
                    displayLose(2000, '租金单位不能为空');
                    return false;
                } else if ($('#tentFeeVal').val() === '') {
                    //验证租金
                    displayLose(2000, '物业费不能为空');
                    return false;
                } else if ($('#floorManual').val() === '' || $('#totlefloorManual').val() === '') {
                    // 判断楼层
                    displayLose(2000, '楼层不能为空');
                    return false;
                } else if (parseInt($('#floorManual').val()) > parseInt($('#totlefloorManual').val())) {
                    // 判断楼层不能大于总楼层
                    displayLose(2000, '楼层不能大于总楼层');
                    return false;
                } else if ($('#descriptionManual').val() === '') {
                    // 判断建筑面积
                    displayLose(2000, '描述不能为空');
                    return false;
                } else if ($('#contactpersonManual').val() === '') {
                    // 验证联系人
                    displayLose(2000, '联系人不能为空');
                    return false;
                } else if (!telExp.test($('#mobilecodeManual').val())) {
                    // 验证手机号
                    displayLose(2000, '请输入正确格式的手机号');
                    return false;
                } else {
                    return true;
                }
            }
            $('.submit').on('click', function () {

                if (!canClick || !inputverify()) {
                    return false;
                }
                var verifyError = function () {
                    displayLose(2000, '短信验证码验证失败,请尝试重新发送');
                };
                if (window.fCheck.config.result === null){
                    displayLose(2000, '您尚未完成滚动条验证');
                    return false;
                }
                var verifySuccess = function () {
                    var param = {c: 'myzf', a: 'postRentInfo', city: vars.city};
                    var beginTime = $('#begintime');
                    var roomIn = '';
                    if (beginTime.html() !== '随时入住') {
                        roomIn = beginTime.html();
                    }
                    var $videoCover = $('#v-cover');
                    param.submitType = 'xzl';
                    // 写字楼类型
                    param.shangyongtype = $('#TypeGrade').html().split('-')[0];
                    // 写字楼级别
                    param.pumianjibietype = $('#TypeGrade').html().split('-')[1];
                    // 租金单位
                    param.pricetype = $('#priceType').html().trim();
                    // 是否可分割
                    param.issplit = $('#divide').html().trim();
                    // 物业费
                    param.wuyefei = $('#tentFeeVal').val().trim();


                    // 获取入住时间
                    param.begintime = roomIn;
                    // 获取房子id 编辑页进入才有
                    param.houseid = vars.houseid;
                    //  获取input框中的手机号
                    param.mobilecode = $('#mobilecodeManual').val().trim();
                    // 获取小区名称input框的值
                    param.projname = $('#projnameManual').val().trim();
                    // 获取区域选择的数据
                    param.district = districtManual.html().trim();
                    // 获取商圈选择的数据 该数据在大城市中有  小城市中没有
                    param.comarea = dComarea.html();
                    // 获取地址input框中的数据
                    param.address = $('#addressManual').val().trim();
                
                    // 获取建筑面积input框中的数据
                    param.buildingarea = $('#buildingareaManual').val().trim();
                    // 获取租金
                    param.price = $('#priceManual').val().trim();
                    
                    // 物业类型,后台向前台传的
                    param.purpose = $('#purposeManual').val();
                    if($videoCover.length){
                        param.VideoId = $videoCover.attr('mediaId');
                    }
                    // 标题图片++++++++++
                    param.titleimage = getImgUrlFileName(true)[0];
                    // 上传图片路径++++++++++++++
                    param.shineiimg = getImgUrlFileName(true)[1];
                    // 上传图片详细信息
                    param.imgPosList = getImgUrlFileName(true)[2];
                    // 编辑页面(input)
                    param.edit = vars.edit;
                    
                    // 描述
                    param.description = $('#descriptionManual').val().trim();
                    // 楼层-第X层
                    param.floor = $('#floorManual').val().trim();
                    // 楼层-共X层
                    param.totlefloor = $('#totlefloorManual').val().trim();    
                    // 支付方式,月付等等
                    param.payinfo = $('#payWay').html().trim();
                    // 是否包含物业费
                    param.iswuyefei = $('#tentFee').html().trim();
                    // 装修
                    param.fitment = $('#decoration').html().trim();
                    // 小区id
                    param.projcode = $('#projcode').val().trim();
                    // 绑定400电话
                    if ($('#isuse400tel').val()) {
                        param.isuse400tel = $('#isuse400tel').val().trim();
                    }
                    // 联系人
                    param.contactperson = $('#contactpersonManual').val().trim();
                    // 性别
                    param.gender = $('#selectGender ').find('a.active').text().trim();
                    // sfut
                    param.telSfut = mysfut;
                    //param.hcVer = zfhc;
                    var currentUrl = window.location.href;
                    var refUrl = document.referrer;
                    var sucurl = vars.mySite + '?c=myzf&a=publishSuccess&pubtype=3' + '&city=' + vars.city  + '&edit=' + vars.edit;
                    if (currentUrl.lastIndexOf('baidu-waptc') !== -1 || refUrl.lastIndexOf('baidu-waptc') !== -1) {
                        param['baidu-waptc'] = '';
                        sucurl += '&baidu-waptc';
                    }
                    // 红包活动20170115
                    if (vars.channelurl === '&channel=rentcenter' && vars.edit === '0') {
                        param['SourceDes'] = 'rentcenterwapliuyi';
                    }
                    // 滑动验证码
                    param.challenge = window.fCheck.config.result.fc_challenge;
                    param.validate= window.fCheck.config.result.fc_validate;
                    
                    if (!submitFlag) {
                        return false;
                    }
                    submitFlag = false;
                    $.post(vars.mySite, param, function (data) {
                        if (data.result === '100') {
                            if (vars.edit === '1' && data.houseStatus === '4')  {
                                var managerUrl = vars.mySite + '?c=myzf&city=' + vars.city;
                                displayLose(2000, '修改失败', managerUrl);
                            } else {
                                //成功cookie置空
                                inputCookie = '';
                                transCookie(inputCookie);
                                if (vars.localStorage) {
                                    window.localStorage.setItem('descriptionXzl', encodeURIComponent(''));
                                    window.localStorage.setItem('descriptionTimeXzl', ''); 
                                }
                                sucurl += '&houseid=' + data.houseid  + '&chongfu=' + data.chongFuHouse + vars.channelurl + vars.h5hdurl;
                                //返回红包获得状况
                                sucurl +=  data.message == 'SendBonusSuc' ? '&SendBonus=yes' : '&SendBonus=ishave';
                                // 储存一个值，给发布成功页面判断是来自发布页还是浏览器刷新
                                if (data.message == 'SendBonusSuc') {
                                    vars.localStorage.setItem('hongbaoPub', true);
                                }
                                if (vars.edit === '1') {
                                    displayLose(2000, data.isOpen ? '为保证展示效果，稍后可能有工作人员与您电话核实房源信息' : '修改成功', sucurl);
                                } else {
                                    displayLose(2000, data.isOpen ? '为保证展示效果，稍后可能有工作人员与您电话核实房源信息' : '发布成功', sucurl);
                                }
                            }
                        } else if (data.message) {
                            displayLose(2000, data.message);
                            window.fCheck.reinit();
                        } else if (data === '') {
                            displayLose(2000, '网络错误,请稍候再试');
                            window.fCheck.reinit();
                        }
                    }, 'json').always(function () {
                        submitFlag = true;
                    });
                };
                // 如果用户登录了并且输入手机号为登录的手机号码
                if (vars.authenticated === '1') {
                    // 已经登录了,不用再验证验证码
                    verifySuccess();
                } else {
                    if ($('#messagecodeManual').val() === '') {
                        displayLose(2000, '请输入正确的短信验证码');
                        return false;
                    }
                    verifycode.sendVerifyCodeAnswer($('#mobilecodeManual').val(),$('#messagecodeManual').val(),function (sfut) {
                        mysfut = sfut;
                        verifySuccess();
                    },verifyError);
                }

            });

            // 送红包提示关闭按钮
            $('.zu-tips-hb').children('a').on('click', function() {
                $('.zu-tips-hb').css('display', 'none');
            });

            // 提示上传视频图片tip按钮
            $('.zu-tips').children('a').on('click', function() {
                $('.zu-tips').css('display', 'none');
            });
        };
    });
