/**
 * 知识搜索页面
 * by blue
 * 20150924 blue 整理代码，删除冗长代码，提高代码效率
 */
define('modules/zhishi/settledScore', ['jquery'], function (require, exports, module) {
    'use strict';
    // jquery库
    var $ = require('jquery');
    // 页面传入的参数
    var vars = seajs.data.vars;
    module.exports = function () {
        // 屏幕自适应
        (function (doc, win) {
            var docEl = doc.documentElement, docB = doc.body;
            var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
            // 手机横屏事件
            var recalc = function () {
                var clientWidth = docEl.clientWidth;
                if (!clientWidth) return;
                if (clientWidth >= 640) {
                    docEl.style.fontSize = 40 + 'px';
                    docB.style.fontSize = 40 + 'px';
                } else {
                    docEl.style.fontSize = 20 * (clientWidth / 320) + 'px';
                    docB.style.fontSize = 20 * (clientWidth / 320) + 'px';
                }
            };
            $(win).on(resizeEvt, recalc, false);
            $(doc).ready(recalc());
        })(document, window);

        // 计算的总分
        var totalScore = 0;
        // 社保年份
        var socicalYears = 0;
        // 提示说明的p
        var shuoMing = $('.shuoming p');
        // 提示tip
        var tip = $('.box3>.shouming>.tips');
        // 最后的总分放置的span
        // var myScore = $('#myScore');
        // 最后的超过人的比例放置的span
        // var peoper = $('#peoper');
        // 灰色浮层
        var floatDiv = $('.float');
        // 是否需要重新请求接口来计算百分比标识
        var again = 0;


        /**
         * 根据当前用户的分数来获取超越多少人的比例
         * @param totalScore 总分
         * @param qualify 是否计算超过百分比
         * @param again 是否再次请求接口获得百分比
         */
        var getScorePercent = function (totalScore, qualify, again) {
            $.post(vars.zhishiSite + '?c=zhishi&a=ajaxGetScorePercent&city=' + vars.city, {
                score: totalScore,
                qualify: qualify,
                again: again
            }, function (data) {
                if (data && data.code === '200' && qualify === 1) {
                    shuoMing.show();
                    shuoMing.html('经过计算，你的积分是<span>' + totalScore + '</span><br>超过了<span>' + data.per + '</span>的参与测试用户');
                } else if (data && data.code === '102' && qualify === 1) {
                    shuoMing.hide();
                    floatDiv.show();
                }
            });
        };
        floatDiv.on('click', function () {
            $(this).hide();
            getScorePercent(totalScore, 1, 1);
        });


        $('input:text').on('keyup', function () {
            var value = $(this).val().replace(/\D/g, '');
            $(this).val(value);
        });

        // 点击开始按钮
        $('.start-btn').on('click', function () {
            // 进入测试页面
            $('.box2').show();
            // 测试页面分为10步 显示测试页面一
            $('#part1').fadeIn(500);
            // 隐藏开始页面
            $('.box1').hide();
        });

        // part1--点击选择是否符合基本条件
        // 如果点击了符合条件
        $('#part1Input1').on('click', function () {
            // 隐藏步骤一页面
            $('#part1').hide();
            // 进入测试步骤二页面
            $('#part2').fadeIn(500);
        });

        // 如果点击了不符合条件
        $('#part1Input0').on('click', function () {
            // 隐藏测试步骤二页面
            $('.box2').hide();
            // 设置提示信息
            shuoMing.html('您暂时还没有资格哦！让小伙伴一起来试试吧！');
            // 隐藏注释说明信息
            tip.hide();
            // 进入步骤3
            $('.box3').fadeIn(500);
            // 测试数据发送到后台
            getScorePercent(0, 0, 0);
        });

        // part2--社保年份(7-42) 社保确定按钮添加点击事件
        var $socialVal = $('#socialVal');
        $('#socialSub').on('click', function () {
            // 获取填写的社保年数
            var socialVal = parseInt($socialVal.val());
            socicalYears = socialVal;
            if (socialVal >= 7 && socialVal <= 42) {
                // 连续缴纳社保满1年积3分
                totalScore += socialVal * 3;
                $('#part2').hide();
                $('#part3').fadeIn(500);
            } else {
                $socialVal.val('');
            }
        });


        // part3--合法稳定住所
        // 自住房 myHouseRadio  rentHouseRadio 该测试页面对应的两个单选按钮 myHouse rentHouse 单选按钮对应输入的值
        var myHouseRadio = $('#myHouseRadio');
        var rentHouseRadio = $('#rentHouseRadio');
        var myHouse = $('#myHouse');
        var rentHouse = $('#rentHouse');
        // part2页面对应的操作
        $('#myHouseRadio,#rentHouseRadio').on('click', function () {
            var $that = $(this);
            var valId = $that.attr('id').replace('Radio', '');
            if ($that.is(':checked')) {
                $('#' + valId).attr('disabled', false);
            } else {
                $('#' + valId).attr('disabled', true);
            }
        });

        // 计算居住分数
        $('#houseSub').on('click', function () {
            // house11保存选项一对应的积分 house21 保存选项二对应的积分
            var house11 = 0, house21 = 0;
            // 选项一对应的年限
            var house10 = parseInt(myHouse.val());
            if (myHouseRadio.is(':checked') && house10 > 0) {
                // 当连续居住年限(自由产权1年1分)大于缴纳社保年限，以连续缴纳社保年限作为连续居住年限。
                house11 += house10 > socicalYears ? socicalYears : house10;
            }
            // 选项二对应的年限
            var house20 = parseInt(rentHouse.val());
            if (rentHouseRadio.is(':checked') && house20 > 0) {
                // 当连续居住年限(租赁或宿舍1年0.5分)大于缴纳社保年限，以连续缴纳社保年限作为连续居住年限。
                house21 += house20 > socicalYears ? socicalYears * 0.5 : house20 * 0.5;
            }
            if (myHouseRadio.is(':checked') && house10 > 0 || rentHouseRadio.is(':checked') && house20 > 0
                || (!myHouseRadio.is(':checked') && !rentHouseRadio.is(':checked'))) {
                totalScore += house11 + house21;
                $('#part3').hide();
                $('#part4').fadeIn(500);
            }
        });

        // part4--学历选择
        $('#eduSub').on('click', function () {
            if ($('#edu1').is(':checked')) {
                // 专科10.5
                totalScore += 10.5;
            } else if ($('#edu2').is(':checked')) {
                // 本科15
                totalScore += 15;
            } else if ($('#edu3').is(':checked')) {
                // 研究生26
                totalScore += 26;
            } else if ($('#edu4').is(':checked')) {
                // 博士37
                totalScore += 37;
            }
            $('#part4').hide();
            $('#part5').fadeIn(500);
        });


        // part5--职住区域选择start
        // 居住区域复选框
        var areaLiveRadio = $('#areaLiveRadio');
        // 工作和居住区域复选框
        var areaJobAndLiveRadio = $('#areaJobAndLiveRadio');
        // 居住年限input框
        var areaLiveVal = $('#areaLiveVal');
        // 工作和居住区域年限input框
        var areaJobAndLiveVal = $('#areaJobAndLiveVal');
        // 都没选择的框
        var areaNo = $('#areaNo');
        // 点击职住区域页面的确定按钮计算相应的积分
        $('#jobAndLiveSub').on('click', function () {
            // 居住年限input框对应的数据
            var areaLiveValue = areaLiveVal.val();
            // 工作和居住区域年限input框对应的数据
            var areaJobAndLiveValue = areaJobAndLiveVal.val();
            // 居住年限，居住分数，工作和居住年限，工作和居住分数,职住总分
            var liveYear = 0, liveScore = 0, liveJobYear = 0, liveJobScore = 0;
            // 居住地从城六区转移到其他区域,每满1年加2分，最高加6分
            if (areaLiveRadio.is(':checked')) {
                // areaLiveVal.show();
                liveYear = parseInt(areaLiveValue);
                if (liveYear > 0) {
                    liveScore += liveYear >= 3 ? 6 : liveYear * 2;
                }
            }
            // 就业地和居住地均由城六区转移到其他区域,每满1年加4分，最高加12分
            if (areaJobAndLiveRadio.is(':checked')) {
                // areaJobAndLiveVal.show();
                liveJobYear = parseInt(areaJobAndLiveValue);
                if (liveJobYear > 0) {
                    liveJobScore += liveJobYear >= 3 ? 12 : liveJobYear * 4;
                }
            }
            // 计算总分
            totalScore += liveScore + liveJobScore > 12 ? 12 : liveScore + liveJobScore;
            // 满足一下条件才允许进入步骤6的测试页面
            if (areaLiveRadio.is(':checked') && areaLiveValue > 0
                || areaJobAndLiveRadio.is(':checked') && areaJobAndLiveValue > 0 || areaNo.is(':checked')) {
                $('#part5').hide();
                $('#part6').fadeIn(500);
            }
        });

        //  part6 居住区域，工作域和居住都没选，选择了无
        areaNo.on('click', function () {
            areaLiveRadio.attr('checked', false);
            areaJobAndLiveRadio.attr('checked', false);
            areaLiveVal.attr('disabled', true);
            areaJobAndLiveVal.attr('disabled', true);
        });

        $('#areaLiveRadio,#areaJobAndLiveRadio').on('click', function () {
            var $that = $(this);
            var valId = $that.attr('id').replace('Radio', 'Val');
            if ($that.is(':checked')) {
                $('#' + valId).attr('disabled', false);
                areaNo.attr('checked', false);
            } else {
                $('#' + valId).attr('disabled', true);
            }
        });

        // 6--创新创业选择start
        var innovation1Radio = $('#innovation1Radio');
        var innovation2Radio = $('#innovation2Radio');
        var innovation3Radio = $('#innovation3Radio');
        var innovation3Val = $('#innovation3Val');
        var innovation4Radio = $('#innovation4Radio');
        var innovation4Val = $('#innovation4Val');
        var innovation5Radio = $('#innovation5Radio');
        var innovation5Val = $('#innovation5Val');
        // 选择无的按钮
        var innovationNo = $('#innovationNo');
        // part6 part7 part9 单选按钮对应的点击事件
        $('#part6,#part7,#part9').find('input:checkbox').on('click',function () {
            var $that = $(this);
            if ($that.is(':checked') && $that.parent().next().length) {
                // 隐藏对应的输入框
                $that.parent().next().show();
            } else {
                // 隐藏对应的输入框
                if ($that.parent().next().length) {
                    $that.parent().next().hide();
                }
            }
            var $eleId = $that.attr('id');
            var partId = $that.closest('.part').attr('id');
            if ($eleId === 'innovationNo' || $eleId === 'taxNo' || $eleId === 'honoursNo') {
                // 在对应的模块中去查找
                $('#' + partId).find('input:checkbox').not('#innovationNo,#taxNo,#honoursNo').each(function () {
                    var $that = $(this);
                    $that.attr('checked',false);
                    // 隐藏对应的输入框
                    if ($that.parent().next().length) {
                        $that.parent().next().hide();
                    }
                });
            } else {
                // 在对应的模块中去查找
                $('#' + partId).find('#innovationNo,#taxNo,#honoursNo').attr('checked',false);
            }
        });

        // 计算创新创业分
        $('#innovationSub').on('click', function () {
            var innovation10 = 0, innovation11 = 0, innovation20 = 0, innovation21 = 0, innovation30 = 0, innovation31 = 0;
            if (innovationNo.is(':checked')) {
                $('#part6').hide();
                $('#part7').fadeIn(500);
            } else if (innovation1Radio.is(':checked')) {
                // 不累计，国家级奖 最高加12分
                totalScore += 12;
            } else if (innovation2Radio.is(':checked')) {
                // 不累计，市级奖项 最高加6分
                totalScore += 6;
            } else {
                // 任国家高新企业高管或核心技术人员
                innovation10 = parseInt(innovation3Val.val());
                if (innovation3Radio.is(':checked') && innovation10 > 0) {
                    // 每满1年加2分，最高加6分
                    innovation11 += innovation10 >= 3 ? 6 : innovation10 * 2;
                }
                // 在创业企业投资或就业
                innovation20 = parseInt(innovation4Val.val());
                if (innovation4Radio.is(':checked') && innovation20 > 0) {
                    // 每满1年加2分，最高加6分
                    innovation21 += innovation20 >= 3 ? 6 : innovation20 * 2;
                }
                // 在创业中介机构投资或就业
                innovation30 = parseInt(innovation5Val.val());
                if (innovation5Radio.is(':checked') && innovation30 > 0) {
                    // //每满1年加1分，最高加3分
                    innovation31 += innovation30 >= 3 ? 3 : innovation30;
                }

                // 总分取出后面三项最大的
                totalScore += Math.max(innovation11, innovation21, innovation31);
            }
            $('#part6').hide();
            $('#part7').fadeIn(500);
        });

        /* 创新创业选择end*/
        /* ====================================================*/

        /* 7--纳税start*/
        var taxRadio1 = $('#taxRadio1');
        var taxRadio2 = $('#taxRadio2');
        var tax2Val = $('#tax2Val');
        // 无
        var taxNo = $('#taxNo');
        $('#taxSub').on('click', function () {
            if (taxNo.is(':checked')) {
                $('#part7').hide();
                $('#part8').fadeIn(500);
            } else {
                if (taxRadio1.is(':checked')) {
                    // 近3年连续纳税加6分
                    totalScore += 6;
                }
                var records = parseInt(tax2Val.val());
                if (taxRadio2.is(':checked') && records > 0) {
                    // 有涉税违法行为记录,每条记录减12分
                    totalScore -= records * 12;
                }
                $('#part7').hide();
                $('#part8').fadeIn(500);
            }
        });
        // 纳税end


        // 8--年龄选择
        $('#ageSub').on('click', function () {
            // 申请人年龄不超过45周岁的加20分
            if ($('#ageRadio').is(':checked')) {
                totalScore += 20;
            }
            $('#part8').hide();
            $('#part9').fadeIn(500);
        });

        // 9--荣誉选择start
        var honoursRadio1 = $('#honoursRadio1');
        var honoursRadio2 = $('#honoursRadio2');
        var honoursRadio3 = $('#honoursRadio3');
        var honoursRadio4 = $('#honoursRadio4');
        var honoursRadio5 = $('#honoursRadio5');
        var honoursNo = $('#honoursNo');
        $('#honoursSub').on('click', function () {
            if (honoursNo.is(':checked')) {
                totalScore += 0;
            } else if (honoursRadio1.is(':checked') || honoursRadio2.is(':checked') || honoursRadio3.is(':checked')
                || honoursRadio4.is(':checked') || honoursRadio5.is(':checked')) {
                // 荣誉表彰指标加20分
                totalScore += 20;
            }
            $('#part9').hide();
            $('#part10').fadeIn(200);
        });
        // 荣誉选择end
        // 10--守法记录start
        var lawRadio = $('#lawRadio');
        var lawVal = $('#lawVal');
        lawRadio.on('click', function () {
            lawVal.show();
        });
        $('#lawNo').on('click', function () {
            lawRadio.attr('checked', false);
            lawVal.hide();
        });
        $('#lawSub').on('click', function () {
            var lawNum = parseInt(lawVal.val());
            if (lawRadio.is(':checked') && lawNum > 0) {
                // 每条行政拘留减30分
                totalScore -= 30 * lawNum;
            }
            $('#part10').hide();
            $('.box2').hide();
            $('.box3').fadeIn(200);
            getScorePercent(totalScore, 1, 0);
        });
        // 守法记录end

        // 再测一遍
        $('.again').click(function () {
            totalScore = 0;
            socicalYears = 0;
            $('#part1Input1').attr('checked', false);
            $('#part1Input0').attr('checked', false);
            shuoMing.text('');
            tip.text('');
            $('.box3').hide();
            $('.box2').show();
            $('#part1').fadeIn(500);
        });
    };
});
