/**
 *房源发布主类
 * 删除冗余代码(主要是跟编辑页有关的代码) 20170206 lina
 */
define('modules/myesf/delegateAndResale', ['jquery', 'verifycode/1.0.0/verifycode', 'modules/esf/yhxw', 'modules/myesf/common'],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var $ = require('jquery');
            var vars = seajs.data.vars;
            var url = '/my/?c=myesf';
            var login = vars.userphone;
            var mysfut;
            // 引入用户行为对象
            var yhxw = require('modules/esf/yhxw');
            // 刷新历史信息
            require('modules/myesf/common');
            // var obj = {};
            var c = vars.localStorage, preload = [];
            var loacalStorage = vars.localStorage || null;
            var HistoryName = 'delegateAndResaleH_' + vars.city;
            var imgsName = 'delegateAndResaleImg_' + vars.city;
            preload.push('modules/myesf/myutil');
            require.async(preload);
            var newcountEsffabu = 0;
            // 电话号码
            var $phone = $('#phone'),
                // 验证码
                $verCode = $('#ver_code'),
                // 联想列表
                $searchCompletev1 = $('#search_completev1'),
                // 隐藏域中newcode的id
                $newcode = $('#newcode'),
                // 户型选择输入框
                $room = $('#room'),
                // 总楼层输入框
                $totalfloor = $('#totalfloor'),
                // 小区名称输入框
                $projname = $('#projname'),
                // 楼层输入框
                $floor = $('#floor'),
                // 建筑面积输入框
                $area = $('#area'),
                // 隐藏域中的小区位置
                $addressv1 = $('#addressv1'),
                // 朝向输入框
                $forward = $('#forward'),
                // 隐藏域中的户型
                $roomnum = $('#roomnum'),
                // 隐藏域中的厅
                $hall = $('#hall'),
                // 隐藏域中的卫
                $toilet = $('#toilet'),
                // 售价输入框
                $price = $('#price'),
                // 接电时间
                $time = $('#time'),
                // 提交按钮
                $submit = $('#submit'),
                // 短信验证码输入框
                $valicode = $('#valicode'),
                // 区域
                $district = $('#district'),
                // 商圈
                $comarea = $('#comarea'),
                // 没有楼栋信息
                $noLouPan = $('#noLouPan'),
                // 不在评估价范围弹窗
                $myprompt = $('#chaprompt'),
                // 特价房弹窗
                $tjfprompt = $('#tjfprompt');
            vars.userphone = vars.userphone || '';
            // 记录用户浏览动作
            yhxw({type: 0, pageId: 'mesfrelease', curChannel: 'myesf'});
            // 记录历史信息,朝向
            $forward.on('change', function () {
                var obj = JSON.parse(loacalStorage.getItem(HistoryName));
                obj.forward = $(this).val();
                loacalStorage && loacalStorage.setItem(HistoryName, JSON.stringify(obj));
            });

            /* 提示弹框*
             * modified by bjwanghongwei@fang.com
             * 20161226
             * 取消alert弹窗，（app会出现BUG）
             */
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

            var $linkman = $('#linkman');
            var results;
            // 房源位置联想
            function check() {
                var projname = $projname.val(), room = $room.val(), tmpvalicode = $valicode.val(),
                    price = $price.val(), telephone = $phone.val(), area = $area.val(), linkman = $linkman.val(),
                    time = $time.val(), hall = $hall.val(), floor = $floor.val(), totalfloor = $totalfloor.val(), toilet = $toilet.val();
                var louListLen = $searchCompletev1.find('.li-loudong').length;
                if (vars.city === 'bj') {
                    results = $('#fyPosition').val().split('-');
                }
                if (!projname && !vars.firstlistds) {
                    // 非28电商
                    showMsg('请输入小区名称');
                    return false;
                } else if (vars.firstlistds && (!projname || $('.font01 ').find('p').is(':visible') || (louListLen && louListLen >= 1))) {
                    // 28电商
                    showMsg('请输入小区名称');
                    return false;
                } else if (vars.city === 'bj' && !results[0]) {
                    showMsg('楼栋号不能为空');
                    return false;
                } else if (vars.city === 'bj' && !results[1]) {
                    showMsg('单元号不能为空');
                    return false;
                } else if (vars.city === 'bj' && !results[2]) {
                    showMsg('门牌号不能为空');
                    return false;
                } else if (room === '') {
                    showMsg('户型不能为空');
                    return false;
                } else if (room === '0') {
                    showMsg('户型不能为0');
                    return false;
                } else if (!hall) {
                    showMsg('厅不能为空');
                    return false;
                } else if (!toilet) {
                    showMsg('卫不能为空');
                    return false;
                } else if (area === '') {
                    showMsg('请输入面积');
                    return false;
                } else if (!floor) {
                    showMsg('层数不能为空');
                    return false;
                } else if (!totalfloor) {
                    showMsg('总层数不能为空');
                    return false;
                } else if (parseInt(floor) > parseInt(totalfloor)) {
                    showMsg('楼层不能大于总楼层');
                    return false;
                } else if (price === '') {
                    showMsg('请输入价格');
                    return false;
                } else if (!/^\d{0,8}\.{0,1}(\d{1,2})?$/i.test(price)) {
                    showMsg('请输入正确的价格');
                    return false;
                } else if (parseInt(area) > 10000 || parseInt(area) < 2) {
                    showMsg('面积要大于2平方米小于10000平方米');
                    return false;
                } else if (parseInt(price) > 100000 || parseInt(price) < 2 && vars.city !== 'bj') {
                    showMsg('售价要大于2万元小于10亿元');
                    return false;
                } else if (parseInt(price) > 10000 || parseInt(price) < 2 && vars.city === 'bj') {
                    alert('售价要大于2万元小于1亿元');
                    return false;
                } else if ((parseFloat(price) / parseFloat(area)) >15 && vars.city === 'bj') {
                    alert('单价要小于15万元/平米');
                    return false;
                } else if (telephone === '') {
                    showMsg('请输入手机号');
                    return false;
                } else if (time === '') {
                    showMsg('请输入接电时间');
                    return false;
                } else if (!/^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/i.test(telephone)) {
                    $('#phone_message').show();
                    showMsg('请输入正确格式的手机号');
                    return false;
                } else if (tmpvalicode === '' && !$verCode.is(':hidden')) {
                    showMsg('请输入验证码');
                    return false;
                } else if ($linkman.length > 0 && !linkman) {
                    showMsg('姓名不能为空');
                    return false;
                }
                return true;
            }

            function getParam(sign) {
                var param = {};
                // 城市
                param.city = vars.city;
                // 楼层
                param.floor = $floor.val();
                // 总楼层
                param.totalfloor = $totalfloor.val();
                // 户型
                param.room = $roomnum.val();
                // 厅
                param.hall = $hall.val();
                // 朝向
                param.forward = $forward.val();
                param.description = $('#description').val();
                param.linkman = $linkman.val();
                // 城市有楼栋位置
                if (vars.buildNum) {
                    param.block = $('#fyPosition').val().split('-')[0];
                    param.UnitNumber = $('#fyPosition').val().split('-')[1];
                    param.RoomNumber = $('#fyPosition').val().split('-')[2];
                }
                if (localStorage.newCode) {
                    param.newCode = localStorage.newCode;
                }
                param.delegateId = vars.delegateId;
                param.source = vars.source;
                param.IsLoan = 0;
                if (sign === 'ref') {
                    param.newcode = $newcode.val();
                    param.bulidArea = $area.val();
                } else {
                    // 售价
                    param.price = $price.val();
                    // 卫
                    param.toilet = $toilet.val();
                    // 建筑面积
                    param.area = $area.val();
                    // 接电时间
                    param.callTime = $time.val();
                    if ($addressv1.val() !== '') {
                        param.address = $addressv1.val();
                    }
                    if ($district.val() === '') {
                        param.district = $('#districtManual').find('option:selected').text();
                    } else {
                        param.district = $district.val();
                    }
                    if ($comarea.val() === '') {
                        param.comarea = $('#comareaManual').find('option:selected').text();
                    } else {
                        param.comarea = $comarea.val();
                    }
                }
                // 小区位置
                param.projName = $projname.val();
                param.newcode = $newcode.val();
                // 联系电话
                param.telephone = $phone.val();
                return param;
            }

            require.async(['modules/myesf/myutil'], function (MyUtil) {
                function refPrice() {
                    // 参考价
                    var refprice = '';
                    var param = getParam('ref');
                    param.bulidArea = 1;
                    param.a = 'ajaxgetplpgInfo';

                    var $refPrice = $('#refPrice');
                    var html = '房天下评估价:<em id="priceUnit">';
                    if ($area.val() !== '') {
                        param.bulidArea = $area.val();
                    }
                    if (param.newcode) {
                        var onComplete = function (data) {
                            if (data.HouseInfo[0].AvagePrice) {
                                refprice = data.HouseInfo[0].AvagePrice;
                            }
                            if (!param.newcode || !refprice || !parseInt(refprice)) {
                                $refPrice.html('暂无').hide();
                            } else if (param.newcode && param.bulidArea && param.bulidArea !== 1) {
                                var totleprice = parseFloat(refprice);
                                if (refprice) {
                                    totleprice = totleprice / 10000 * param.bulidArea;
                                    totleprice = totleprice.toFixed(2);
                                    html += totleprice + '</em>万元</label>';
                                    $refPrice.html(html).show();
                                }
                            } else {
                                refprice = (refprice / 10000).toFixed(2);
                                html += refprice + '</em>万元</label>';
                                $refPrice.html(html).show();
                            }
                            if (html) {
                                localStorage.refprice = html;
                            }

                            // 用户输入价格
                            var myPrice = $('#price').val();
                            // 展示的评估价
                            var showPrice = $('#priceUnit').html() || 0;

                            // 用户输入价格在评估差距外显示差距大tips
                            if (myPrice && (myPrice >= showPrice * 1.3 || myPrice <= showPrice * 0.7)) {
                                if (vars.xytype === '1'){
                                    $tjfprompt.css('display', 'none');
                                }
                                $myprompt.css('display', 'block');
                            } else {
                                // 评估价不为0显示默认tips
                                if (showPrice > 0 && vars.xytype === '1'){
                                    $tjfprompt.css('display', 'block');
                                }
                                $myprompt.css('display', 'none');
                            }
                        };
                        MyUtil.ajax(url, 'get', param, onComplete);
                    } else {
                        $refPrice.html('暂无').hide();
                    }
                }

                refPrice();
                function parsevalue(arr) {
                    $searchCompletev1.html('').hide();
                    var tempArr = arr.split(',');
                    $addressv1.val(tempArr[2]);
                    $district.val(tempArr[4]);
                    $comarea.val(tempArr[5]);
                    $projname.val(tempArr[1]);
                    $newcode.val(tempArr[0]);
                    // 记录历史信息.楼盘,地址,区域,商圈和id
                    var obj = JSON.parse(loacalStorage.getItem(HistoryName)) || {};
                    obj.projname = tempArr[1];
                    obj.addressv1 = tempArr[2];
                    obj.district = tempArr[4];
                    obj.comarea = tempArr[5];
                    obj.newcode = tempArr[0];
                    loacalStorage && loacalStorage.setItem(HistoryName, JSON.stringify(obj));
                    $noLouPan.hide();
                    $('#pgShow').html('<a href="' + vars.pingguSite + vars.city + '_' + tempArr[0] + '.html" ' + 'class="flor f14">查查邻居房价</a>');
                    refPrice();
                }

                $searchCompletev1.on('click', 'li.li-loudong', function (e) {
                    $projname.blur();
                    var el = e.target;
                    var donginfo = $(el).data('donginfo');
                    parsevalue(donginfo);
                    return false;
                });

                
                $('.referprice, #price').on('change input', function () {
                    refPrice();
                });


                /**
                 *  提交函数
                 */
                function submit() {
                    if (!check()) {
                        return false;
                    }
                    var param = getParam();
                    param.a = 'addDelegateAndResale';
                    // 添加sfut参数
                    param.telSfut = mysfut;

                    // 统计提交动作
                    yhxw({type: 46, pageId: 'mesfrelease', curChannel: 'myesf', params: param});
                    if (param.telephone !== '') {
                        $submit.unbind('click');
                        $submit.removeClass('bg-blu').addClass('bg-gra2');
                        if (vars.hasOwnProperty('utm_term') && vars.utm_term.length > 0) {
                            param.utm_term = vars.utm_term;
                        }
                        if (vars.hasOwnProperty('utm_source') && vars.utm_source.length > 0) {
                            param.utm_source = vars.utm_source;
                        }
                        var onComplete = function (data) {
                            if (data.checkAgent) {
                                if (data.checkAgent === '1') {
                                    $('#agentTips').show();
                                    $submit.addClass('noClick');
                                    $submit.removeClass('bg-gra2').addClass('bg-blu');
                                    return;
                                } else if (data.checkAgent === '0') {
                                    $('#agentTips').hide();
                                } else {
                                    $('#agentTips').hide();
                                    return;
                                }
                            }
                            if (data.userlogin) {
                                if (data.fabuInfo.result === '1') {
                                    showMsg('发布成功！');
                                    if (c) {
                                        c.setItem('newcountEsffabu', newcountEsffabu + 1);
                                        // 保存新发布状态信息到本地
                                    }
                                    var href = '/my/?c=myesf&a=successfabu&city=' + vars.city;
                                    if (data.fabuInfo.indexId) {
                                        href += '&indexId=' + data.fabuInfo.indexId;
                                    }
                                    window.location = href;
                                } else {
                                    if (data.fabuInfo.message) {
                                        showMsg(data.fabuInfo.message);
                                    } else {
                                        showMsg(data.fabuInfo);
                                    }
                                    $submit.bind('click', submit);
                                    $submit.removeClass('bg-gra2').addClass('bg-blu');
                                }
                            } else {
                                showMsg('请输入正确的验证码');
                                $submit.bind('click', submit);
                                $submit.removeClass('bg-gra2').addClass('bg-blu');
                            }
                        };
                        MyUtil.ajax(url, 'post', param, onComplete);
                    }
                    // 提交的时候清除历史信息
                    loacalStorage && loacalStorage.removeItem(HistoryName);
                    loacalStorage && loacalStorage.removeItem(imgsName);
                    if (localStorage && localStorage.loupanSelect) {
                        localStorage.loupanSelect = '';
                    }
                }

                var getCheckCode = $('#getCheckCode');
                $phone.on('input', function () {
                    if ($phone.val() > 10000000000 && $phone.val() < 20000000000) {
                        getCheckCode.addClass('btn-oka').html('发送验证码');
                    } else {
                        if (getCheckCode.hasClass('btn-oka')) {
                            getCheckCode.removeClass('btn-oka').html('发送验证码');
                        }
                    }
                    // 修改手机号时隐藏中介人手机号提示
                    $('#agentTips').hide();
                });
                var verifyError = function () {
                    showMsg('短信验证码错误');
                };

                // 点击提交按钮
                $submit.on('click',function () {
                    if (vars.xytype) {
                        if (!$('.ipt-rd').attr('checked')) {
                            showMsg('请同意房屋委托出售协议');
                            return false;
                        }
                    }
                    // 更改页面中隐藏域中用户的电话发布
                    var telephoneNum = $phone.val().trim();
                    if (telephoneNum !== vars.userphone || !vars.userphone) {
                        var verifycode = require('verifycode/1.0.0/verifycode');
                        if (!$valicode.val()) {
                            showMsg('请输入正确的短信验证码');
                            return;
                        }
                        verifycode.sendVerifyCodeAnswer($phone.val(), $valicode.val(), function (sfut) {
                            mysfut = sfut;
                            submit();
                        }, verifyError, login);
                    } else {
                        submit();
                    }
                });
            });
        };
    });