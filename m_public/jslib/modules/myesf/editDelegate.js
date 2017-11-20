define('modules/myesf/editDelegate', ['jquery', 'modules/esf/yhxw'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var url = '/my/?c=myesf';
        var yhxw = require('modules/esf/yhxw');
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });
        var c = vars.localStorage, preload = [];
        preload.push('modules/myesf/myutil', 'modules/myesf/common', 'jwingupload/1.0.6/jwingupload.source');
        require.async(preload);
        var editDelegateCount = 0;
        var $newcode = $('#newcode'),
            // 建筑面积
            $room = $('#room'),
            $hall = $('#hall'),
            // 总楼层
            $totalfloor = $('#totalfloor'),
            // 楼层
            $floor = $('#floor'),
            // 建筑面积
            $area = $('#area'),
            $forward = $('#forward'),
            $toilet = $('#toilet'),
			$price = $('#price'),
            $submit = $('#submit'),
            $roomnum = $('#roomnum'),
            $bbsAddPic = $('#bbsAddPic'),
			$linkman = $('#linkman');
        $bbsAddPic.one('click', function () {
            $('#note').hide();
        });
        var pageId = 'muchelpsellrevise';
        // 统计用户浏览行为
        yhxw({type: 0,pageId: pageId,curChannel: 'myesf'});
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
        $('input').on('click',function(){
            isSave = false;
        });
        var $roomParent = $('#room').parent();
        var $forwardParent = $('#forward').parent();
        $roomParent.on('click',function(){
            isSave = false;
        });
        $forwardParent.on('click',function(){
            isSave = false;
        });
        // 点击左上角的回退按钮
        var $floatAlert = $('.floatAlert');
        $('.back').on('click', function () {
            // 没有保存显示提示未保存的弹框
            if(!isSave) {
                $floatAlert.eq(0).show();
                unable();
            }else{
                $('.left').find('a').attr('href','javascript:history.back(-1);');
            }
        });
        // 点击弹框的取消按钮
        $('#cancel').on('click', function () {
            $floatAlert.hide();
            enable();
        });
        function check() {
            var room = $room.val(), linkman = $linkman.val(), price = $price.val(),
                area = $area.val(), hall = $hall.val(), floor = $floor.val(), totalfloor = $totalfloor.val(), toilet = $toilet.val();
            if (room === '') {
                alert('户型不能为空');
                return false;
            } else if (!room.substring(0, 1)) {
                alert('户型不能为0');
                return false;
            } else if (!hall) {
                alert('厅不能为空');
                return false;
            } else if (!toilet) {
                alert('卫不能为空');
                return false;
            } else if (area === '') {
                alert('请输入面积');
                return false;
            } else if (floor < 0) {
                alert('层数应在1~99之间');
                return false;
            } else if (floor === '0') {
                alert('层数不能为0');
                return false;
            } else if (!floor) {
                alert('层数不能为空');
                return false;
            } else if (totalfloor < 0) {
                alert('总层数应在1~99之间');
                return false;
            } else if (totalfloor === '0') {
                alert('总层数不能为0');
                return false;
            } else if (!totalfloor) {
                alert('总层数不能为空');
                return false;
            } else if (parseInt(floor) > parseInt(totalfloor)) {
                alert('楼层不能大于总楼层');
                return false;
            } else if (price === '') {
                alert('请输入价格');
                return false;
            } else if (!/^\d{0,8}\.{0,1}(\d{1,2})?$/i.test(price)) {
                alert('请输入正确的价格');
                return false;
            } else if (parseInt(area) > 10000 || parseInt(area) < 2) {
                alert('面积要大于2平方米小于10000平方米');
                return false;
            } else if (parseInt(price) > 100000 || parseInt(price) < 2 && vars.city !== 'bj') {
                alert('售价要大于2万元小于10亿元');
                return false;
            } else if (parseInt(price) > 10000 || parseInt(price) < 2 && vars.city === 'bj') {
                alert('售价要大于2万元小于1亿元');
                return false;
            } else if ((parseFloat(price) / parseFloat(area)) >15 && vars.city === 'bj') {
                alert('单价要小于15万元/平米');
                return false;
            } else if (!linkman) {
                alert('姓名不能为空');
                return false;
            }
            return true;
        }
        // 获得住宅信息
        function getParam(sign) {
            var param = {};
            if (sign === 'ref') {
                param.newcode = $newcode.val();
                param.bulidArea = $area.val();
            } else {
                param.imgs = vars.imgs;
                param.description = vars.description;
                param.city = vars.city;
                param.UnitNumber = vars.unitNumber;
                param.houseId = vars.houseId;
                param.indexId = vars.indexId;
                param.callTime = vars.callTime;
                param.price = $price.val();
                param.room = $room.val().substring(0, 1);
                param.hall = $hall.val();
                param.toilet = $toilet.val();
                param.area = $area.val();
                param.block = vars.block;
                param.roomNumber = $roomnum.val();
                param.floor = $floor.val();
                param.totalfloor = $totalfloor.val();
                param.forward = $forward.val();
                param.linkman = $('#linkman').val();
                param.rawid = vars.rawid;
                param.delegateId = vars.delegateId;
            }
            return param;
        }
        // 房天下估计
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
                        refprice = data.HouseInfo[0].AvagePrice;
                        if (!param.newcode || refprice === 0.00 || refprice === '0' || refprice === 0 || refprice === 'undefined') {
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
                    };
                    MyUtil.ajax(url, 'get', param, onComplete);
                } else {
                    $refPrice.html('暂无').hide();
                }
            }

            refPrice();

            $('.referprice').on('change keyup', function () {
                refPrice();
            });
            function submit() {
                if (!check()) {
                    return;
                }
                var param = getParam();
                param.a = 'ajaxdelegateEdit';
                var onComplete = function (data) {
                    if (data.result === '1') {
                        $submit.removeClass('bg-blu').addClass('bg-gra2').unbind('click');
                        alert(data.message);
                        if (c) {
                            c.setItem('editDelegateCount', editDelegateCount + 1);
                            // 保存新发布状态信息到本地
                        }
                        // 提交完后的跳转地址
                        window.location.href = '/my/?c=myesf&a=publishAppend&city=' + vars.city + '&indexId=' + vars.indexId + '&houseid=' + vars.houseId;
                    } else if (data.message) {
                        alert(data.message);
                    } else {
                        alert(data);
                    }
                };
                yhxw({type: 86,pageId: pageId,curChannel: 'myesf', housetype: param.room + '室', area: param.bulidArea, floornum: param.floor, totalprice: param.price, direction: param.description, name: param.linkman, totalfloor: param.totalfloor});
                MyUtil.ajax(url, 'post', param, onComplete);
            }
            // 点击提交按钮
            $submit.click(function () {
                submit();
            });
        });
    };
});