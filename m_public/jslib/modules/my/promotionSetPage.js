define('modules/my/promotionSetPage', [ 'slideFilterBox/1.0.0/slideFilterBox','floatAlert/1.0.0/floatAlert'], function (require, exports, module) {
    'use strict';

    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var clickFlag = true;
        var floatAlert = require('floatAlert/1.0.0/floatAlert');
        var option = {
            type:'1'
        };
        var floatObj = new floatAlert(option);
        var station = vars.station ? 1:'';
        // 存储向后台传递的参数
        var param = {
            // 置顶天数
            days:1.5,
            // 小区名字
            proj:1,
            // 商圈
            comarea:1,
            // 区县
            station:station

        };
        var totalPrice = '',yhPrice = '';
        var $totalPrice = $('#totalprice');
        var $yhPrice = $('#protprice');
        $(document).on('click','a',function(){
            if(!clickFlag){
                return false;
            }
        });
        /**
         * 获取价格的函数
         */
        var ajaxFlag = true;
        function getPrice(){
            if(ajaxFlag){
                ajaxFlag = false;
                $.ajax({
                    url: vars.mySite + '?c=myzf&a=ajaxGetSettopPrice&city=' + vars.city,
                    data:param,
                    success:function(data){
                        ajaxFlag = true;
                        totalPrice = parseFloat(data.totalprice);
                        yhPrice = parseFloat(data.discountprice);
                        oldPrice = totalPrice;
                        oldYh = yhPrice;
                        if(yhPrice){
                            $yhPrice.show();
                            $yhPrice.html('已优惠' + yhPrice.toFixed(2) + '元');
                        }else{
                            $yhPrice.hide();
                        }
                        if(hbVal){
                            if(hbVal >= totalPrice){
                                yhPrice += totalPrice;
                                totalPrice = 0;
                                $totalPrice.html('0.00元');
                            }else{
                                yhPrice += hbVal;
                                totalPrice = totalPrice - hbVal;
                                $totalPrice.html( totalPrice.toFixed(2) + '元');
                            }
                            $yhPrice.html('已优惠' + yhPrice.toFixed(2) + '元');
                        }else{
                            $totalPrice.html( totalPrice.toFixed(2) + '元');
                        }
                    },
                    error:function(err){
                        ajaxFlag = true;
                        floatObj.showMsg(err);
                    }
                })
            }

        }
        getPrice();
        var $selBtn = $('.xuan');
        $selBtn.on('click','i',function(){
            var $this = $(this);
            var $parents = $this.parents('.xuan');
            var index = $parents.index();
            if($this.hasClass('cur')){
                $this.removeClass('cur');
                $parents.removeClass('xuan2');
            }else{
                $this.addClass('cur');
                $parents.addClass('xuan2');
            }
            var seleted = $this.hasClass('cur');
            if(seleted){
                if(index === 0){
                    param.proj = 1;
                }else if(index === 1){
                    param.comarea = 1;
                }else if(index === 2){
                    param.station = 1;
                }
            }else{
                if(index === 0){
                    param.proj = 0;
                }else if(index === 1){
                    param.comarea = 0;
                }else if(index === 2){
                    param.station = 0;
                }
            }
            if(param.days && (param.proj || param.comarea || param.station)){
                getPrice();
            }else{
                totalPrice = 0;
                yhPrice = 0;
                $totalPrice.text('0.00元');
                $yhPrice.hide();
            }
        });
        // 时间选择按钮
        var $selDay = $('#c3');
        // 选择时间选框
        var sfMaskFixed = $('#zddays');
        // 取消选择时间按钮
        var $cancel = $('.cancel');
        // 筛选插件
        var iscrollCtrl = require('slideFilterBox/1.0.0/slideFilterBox');
        $selDay.on('click',function(){
            // 没有选择一个关键字，给出提示
            if(!param.proj && !param.comarea && !param.station){
                floatObj.showMsg('请选择至少一个关键字',2000);
                return false;
            }
            sfMaskFixed.show();
            iscrollCtrl.refresh('#scrollList1');
        });
        function check(){
            if(!param.proj && !param.comarea && !param.station){
                floatObj.showMsg('请选择至少一个关键字!',2000);
                return false;
            }else if(!param.days){
                floatObj.showMsg('请选择置顶天数',2000);
                return false;
            }else{
                return true;
            }
        }
      // 选择置顶时间
        $('#scrollList1').on('click', 'li', function () {
            var ele = $(this);
            clickFlag = false;
            var timeContent = ele.html();
            $selDay.html(timeContent);
            param.days = ele.attr('days');
            if(param.proj || param.comarea || param.station){
                getPrice();
            }
            sfMaskFixed.hide();
            setTimeout(function(){
                clickFlag = true;
            },300);
        });
        $cancel.on('click',function(){
            $(this).parents('.sf-maskFixed').hide();
        });
        // 选择红包
        var $hbBtn = $('#ishave');
        var $hbCon = $('#zdhb');
        $hbBtn.on('click',function(){
            if(!check()){
                return false;
            }
            $hbCon.show()
        });
        var hbVal = '',hbId = '';
        var oldPrice,oldYh;
        // 选择红包
        $hbCon.on('click','li',function(){
            var $this = $(this);
            clickFlag = false;
             hbVal = parseFloat($this.attr('value'));
            totalPrice = oldPrice;
            yhPrice = oldYh;
            if(hbVal && totalPrice){
                hbId = $this.attr('b-id');
                if(hbVal >= totalPrice){
                    $totalPrice.html('0.00元');
                    yhPrice += totalPrice;
                    totalPrice = 0;
                }else{
                    totalPrice = totalPrice - hbVal;
                    yhPrice += hbVal;
                    $totalPrice.html( totalPrice.toFixed(2) + '元');
                }
                if($yhPrice.is(':hidden') && yhPrice){
                    $yhPrice.show();
                }
                $yhPrice.html('已优惠' + yhPrice.toFixed(2) + '元');
                $hbBtn.html(hbVal.toFixed(2) + '元');
            }else{
                if(!yhPrice){
                    $yhPrice.hide();
                }
                $hbBtn.html('不使用');
                hbId = '';
                $yhPrice.html('已优惠' + yhPrice.toFixed(2) + '元');
                $totalPrice.html(totalPrice.toFixed(2) + '元');
            }
            $hbCon.hide();
            setTimeout(function(){
                clickFlag = true;
            },300);

        });
        var params = {};
        var isAgree = true;
        var $zdBox = $('.zd-xy-box');
        // 点击置顶协议
        $zdBox.find('.checkBox').on('click',function(){
            var $this = $(this);
            var $zdXyBtn = $this.find('i');
            if($zdXyBtn.hasClass('cur')){
                isAgree = false;
                $zdXyBtn.removeClass('cur');
            }else{
                isAgree = true;
                $zdXyBtn.addClass('cur');
            }
        });
        var $xyCon = $('.xy-out');
        // 弹出协议内容
        $zdBox.find('a').on('click',function(){
            $xyCon.show();
        });
        // 点击协议关闭按钮
        $('.close-btn').on('click',function(){
            $xyCon.hide();
        });
        var $keyword = $('#keyword');
        // 提交
        $('#subButton').on('click',function(){
            if(!check()){
                return false;
            }
            if(!isAgree){
                floatObj.showMsg('请同意置顶规则与协议！',2000);
                return false;
            }
            // 大城市传参 楼盘名称+商圈
            params = {
                Days: param.days,
                HouseId: vars.houseid,
                hongbao: hbVal,
                'totalPrice_pay': totalPrice,
                bonusid: hbId
            };
            if(param.station){
                params.station = vars.station;
                params.line = vars.line;
                params.keyid = vars.keyid;
            }
            var checkType = '';
            if(param.proj && !param.comarea && !param.station){
                checkType = 1;
            }else if(!param.proj && param.comarea && !param.station){
                checkType = 2;
            }else if(param.proj && param.comarea && !param.station){
                checkType = 3;
            }else if(!param.proj && !param.comarea && param.station){
                checkType = 7;
            }else if(param.proj && !param.comarea && param.station){
                checkType = 8;
            }else if(!param.proj && param.comarea && param.station){
                checkType = 9;
            }else if(param.proj && param.comarea && param.station){
                checkType = 10;
            }
            params.CheckType =  checkType;
            if(param.proj){
                params.ProjName = $keyword.find('.xuan').eq(0).text();
            }
            if(param.comarea){
                params.Comerea = $keyword.find('.xuan').eq(1).text();
            }
            $.ajax({
                type: 'post',
                url: vars.mySite + '?c=my&a=ajaxCreateOrder&city=' + vars.city,
                data:params,
                success:function(data){
                    if (data.errcode === '100') {
                        // 状态码为100表示置顶成功（后台已创建订单成功并消费红包）
                        var sucUrl = '?c=my&a=zhiDingSuc&status=' + data.suc;
                        // 如果是通过置顶短信过来的增加sf_source字段
                        if (vars.sf_source === 'messagesend') {
                            sucUrl += '&sf_source=' + vars.sf_source;
                        }
                        window.location.href = sucUrl;
                    } else if (data.errcode == '200' && data.CashierParam) {
                        //状态码200为创建订单成功，跳转收银台支付
                        $.each(data.CashierParam, function (index, val) {
                            $('#' + index).val(val);
                        });
                        $('#form').submit();
                    } else {
                        //如果异常，返回异常信息
                        floatObj.showMsg(data.errmsg, 2000);
                        return false;
                    }

                }
            })
        });
    };
});