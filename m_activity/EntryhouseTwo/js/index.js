/**
 * Created by user on 2016/9/7.
 * modified on 2016/10/24
 */
$(function ($) {
    'use strict';
    // 主域名
    var totalP = $('#total_p').val();
    var mainSite = $('#mainSite').val();
    var newcode = $('#total_newcode').val();
    // 用户登录信息
    var user = $('#total_user').val();
    // 小区名称
    var projName = $('#projName').text();
    // 楼栋名称
    var ldNameLi = $('#ldNameLi');
    // 年代选择弹框
    var ndSelector = $('#ndSelector');
    // total_num是还有多少个楼盘没有填写
    var totalNum = $('#total_num').val();
    // 抽奖状态 0是不能抽奖，1是可抽奖，2是以抽奖
    var totlaStatus = $('#total_status');
    // 选择年代事件
    $('#buildND').on('click', function () {
        ndSelector.show();
        // 自动滑动到2000，原本是1960年，所以是li的高度乘以40/(ㄒoㄒ)/~~
        $('.optionbox').eq(1).scrollTop($('.optionbox').eq(1).find('li').outerHeight(true) * 40);
    });
    // 建筑年代输入框
    var ndText = $('#ndText');
    // 选择建筑年代处理事件
    ndSelector.find('li').on('click', function () {
        var $this = $(this);
        $this.addClass('choseon').siblings().removeClass('choseon');
        ndSelector.hide();
        ndText.text($this.find('a').text());
    });
    $('#backNdBtn').on('click', function () {
        ndSelector.hide();
    });
    // 产权性质、物业类型、产权年限、建筑形式、临街朝向、楼栋朝向、有无电梯对应的列表
    var selectorList = $('.selectorList');
    // 楼栋名称
    var ldName = $('#ldName');
    // 楼栋别名
    var ldElseName = $('#ldElseName');
    // 楼号列表
    var ldList = $('#ldList');
    var jzxsText = $('#jzxsText');
    // 别墅对应的建筑形式列表
    var bsList = $('.bs');
    // 其他物业类型对应的建筑形式列表
    var ptList = $('.pt');
    var dsNumDiv = $('#dsNumDiv');
    // 底商层数输入框
    var dsNumText = $('#dsNumText');
    // 底商有无输入框
    var dsTextDiv = $('#dsText');
    // 第一次进页面初始化数据
    initPage();

    /**
     *  产权性质、物业类型、产权年限、建筑形式、临街朝向、楼栋朝向、有无电梯按钮的样式渲染
     */
    function renderList() {
        var textArr = $('.selectorText');
        textArr.each(function () {
            var $this = $(this),
                txt = $this.text().trim(),
                nextBox = $this.parents('p').next();
            var showA = [];
            if (txt !== '') {
                showA = nextBox.find('a:contains(' + txt + ')');
            }
            if (showA.length) {
                if (showA.length > 1) {
                    showA.each(function () {
                        var $that = $(this),
                            thatTxt = $that.text().trim();
                        if (thatTxt === txt) {
                            $that.addClass('on').siblings().removeClass('on');
                        }
                    });
                } else {
                    showA.addClass('on').siblings().removeClass('on');
                }
            } else {
                nextBox.find('a').removeClass('on');
            }
        });
    }

    /**
     * 初始化页面
     */
    function initPage() {
        if(ldName[0]) {
            ldName[0].style.height = ldName[0].scrollHeight + 'px';
        }
        var dongInfo = '';
        if (dongInfo) {
            renderForm($.parseJSON(dongInfo));
        } else {
            var operastion = $('#wyText').text().trim();
            if (operastion === '别墅') {
                bsList.show();
                ptList.hide();
            }
            if (dsTextDiv.text() === '有') {
                dsNumDiv.show();
            }
            renderList();
            //if (dsTextDiv.text() === '无') {
            //    $('#6').find('a').removeClass('on');
            //}
        }
    }

    /**
     * 重置表单
     */
    function resetForm() {
        // 楼栋名称重置
        ldName.val('');
        ldName.removeAttr('style');
        // 楼栋别名重置
        ldElseName.val('');
        ldElseName.removeAttr('style');
        // 重置建筑年代
        ndText.text('');
        selectorList.find('a').removeClass('on');
        $('.selectorText').text('');
    }

    /**
     * 根据获取到的楼栋数据渲染楼栋表单
     * @param dongInfo 楼栋数据
     */
    function renderForm(dongInfo) {
        ldName.val(dongInfo.dongname);
        ldName[0].style.height = ldName[0].scrollHeight + 'px';
        ldElseName.val(dongInfo.alias);
        var buildage = dongInfo.buildage;
        if (buildage) {
            ndText.text(buildage + '年');
        }
        var coord = dongInfo.coord;
        if(coord === '有' || coord === '无') {
            $('#markText').text(coord);
        } else {
            $('#markText').text('无');
        }
        var property = dongInfo.property;
        var operastion = dongInfo.operastion;
        if (operastion === '别墅') {
            bsList.show();
            ptList.hide();
        } else {
            bsList.hide();
            ptList.show();
        }
        var propertyYear = dongInfo.propertyYear;
        propertyYear = propertyYear && propertyYear + '年';
        var buildCategory = dongInfo.buildCategory;
        var towardsStreet = dongInfo.towardsStreet;
        //var towards = dongInfo.towards;
        var dishang = dongInfo.dishang;
        if (dishang === '0') {
            dsNumDiv.hide();
            dsTextDiv.text('无');
        } else if (!dishang) {
            dsNumDiv.hide();
        } else {
            dsNumDiv.show();
            dsTextDiv.text('有');
            dsNumText.text(dishang + '层');
        }
        var elevator = dongInfo.elevator;
        var status = dongInfo.status;
        if (elevator === '1') {
            elevator = '有';
        } else if (elevator === '0') {
            elevator = '无';
        }
        $('#cqText').text(property);
        $('#wyText').text(operastion);
        if(propertyYear === '0年') {
            propertyYear = '';
        }
        $('#cqnxText').text(propertyYear);
        jzxsText.text(buildCategory);
        $('#ljcxText').text(towardsStreet);
        //$('#ldcxText').text(towards);
        $('#dtText').text(elevator);
        if (status === '1') {
            ldList.find('.current').addClass('finished');
        } else if (status === '2') {
            ldList.find('.current').addClass('noneth');
        }
        renderList();
    }

    // 楼栋不存在按钮
    var notExitBtn = $('#notExitBtn');
    // 点击楼号列表选择
    ldList.on('click', 'li', function () {
        var $this = $(this);
        var dongid = $this.attr('data-dongid');
        // 被点击的li切换成点击状态
        $this.addClass('current').siblings().removeClass('current');
        // 非补充楼栋列表切换显示楼栋不存在按钮
        notExitBtn.show();
        // 楼栋列表切换将表单重置
        resetForm();
        if ($this.text() === '补充楼栋') {
            notExitBtn.hide();
        }
        var dongInfo = '';
        // 切换列表时将滚动条还原到顶部
        $('.special').scrollTop(0);
        if (dongInfo) {
            renderForm($.parseJSON(dongInfo));
        } else {
            $.getJSON(mainSite + '/huodongAC.d?m=getOneDongInfo&class=EntryhouseHc', {
                dongid: dongid,
                user: user,
                newcode: newcode
            }, function (data) {
                renderForm($.parseJSON(decodeURIComponent(data.root.dongInfo)));
            });
        }
    });
    // 楼栋是否标点跳转
    $('#buildMark a').on('click', function () {
        var dongId = ldList.find('li.current').attr('data-dongid');
        if(dongId) {
            location.href = mainSite + '/huodongAC.d?m=postMarkInfo&class=EntryhouseHc&user='+user+'&newcode='+ newcode +'&dongid=' + dongId;
        }
    });
    // 楼栋标点图
    $('#buildMarkMap').on('click', function () {
        location.href = mainSite + '/huodongAC.d?m=postMarkInfo&class=EntryhouseHc&user='+user+'&newcode='+ newcode;
    });
    // 产权性质、物业类型、产权年限、建筑形式、临街朝向、楼栋朝向、有无电梯按钮选择地方处理
    selectorList.find('a').on('click', function () {
        var $this = $(this);
        var textId = $this.parent('p').attr('aria-id');
        $('#' + textId).text($this.text());
        $this.addClass('on').siblings().removeClass('on');
    });
    // 有底商的点击事件
    $($('#6 a')[0]).on('click', function () {
        dsNumDiv.show();
    });
    // 无底商的点击事件
    $($('#6 a')[1]).on('click', function () {
        dsNumDiv.hide();
    });
    // 点击别墅的时候控制联动
    $('#bs').on('click', function () {
        jzxsText.text('');
        bsList.removeClass('on').show();
        ptList.hide();
    });
    // 点击别墅以外的时候控制联动
    $('#1 a:not(#bs)').on('click', function () {
        jzxsText.text('');
        bsList.hide();
        ptList.removeClass('on').show();
    });
    // 提示弹框
    var dialog = $('#dialog');
    // 提示弹框回复按钮div
    var btnDiv = $('#feedbackBtn');
    // 提示弹框反馈文字
    var feedbackText = $('#feedback');
    // 提示弹框点击否的操作
    $('#no').on('click', function () {
        dialog.hide();
    });
    // 提示弹框点击隐藏
    dialog.on('click', function () {
        $(this).hide();
    });
    // 弹框box
    var alertDialog = $('#alertDialog');
    // 保存弹框
    var saveBox = [];
    // 标识是否是可抽奖楼盘 '3'是不可抽奖
    var totalStatus = $('#total_status').val();

    /**
     * 提交表单数据
     * @param selectedLi 选择的楼栋
     * @param exist 表示是否是楼栋不存在 0代表不存在
     * @param dongInfo 提交的楼栋数据
     */
    function sunmitData(selectedLi, exist, dongInfo) {
        $.ajax({
            type: 'post',
            url: mainSite + '/huodongAC.d?m=postDongInfo&class=EntryhouseHc',
            data: {
                user: encodeURIComponent(user),
                newcode: newcode,
                projname: encodeURIComponent(projName),
                exist: exist,
                dongid: dongInfo.dongid,
                dongname: encodeURIComponent(dongInfo.dongname),
                alias: encodeURIComponent(dongInfo.alias),
                buildage: encodeURIComponent(dongInfo.buildage),
                property: encodeURIComponent(dongInfo.property),
                operastion: encodeURIComponent(dongInfo.operastion),
                propertyYear: encodeURIComponent(dongInfo.propertyYear),
                buildCategory: encodeURIComponent(dongInfo.buildCategory),
                towardsStreet: encodeURIComponent(dongInfo.towardsStreet),
                dishang: dongInfo.dishang,
                elevator: dongInfo.elevator
            },
            dataType: 'json',
            success: function (response) {
                var dongid = dongInfo.dongid;
                var root = response.root;
                var code = root.code;
                var num = root.num;
                if (code === '1') {
                    selectedLi.html('<em></em>' + dongInfo.dongname);
                    dongid = response.root.dongid;
                    selectedLi.attr('data-dongid', dongid);
                    if (exist === '1') {
                        showDialog(num);
                        // 将对应楼号表示为完成状态, 不存在楼栋不用标记
                        ldList.find('.current').addClass('finished');
                    } else {
                        showDialog(num);
                        // dialog.show();
                        // btnDiv.hide();
                        // feedbackText.text('提交成功');
                        ldList.find('.current').addClass('noneth').removeClass('finished');
                    }
                } else {
                    dialog.show();
                    btnDiv.hide();
                    feedbackText.text('提交失败');
                }
                setTimeout(function () {
                    dialog.hide();
                }, 1000);
            },
            error: function () {
                dialog.show();
                btnDiv.hide();
                feedbackText.text('提交失败');
                setTimeout(function () {
                    dialog.hide();
                }, 1000);
            }
        });
    }

    function showDialog(num) {
        if(num !== '0') {
            // 非最后一个楼栋情况
            alertDialog.show();
            saveBox = $('#save_btn1');
            saveBox.show();
            $('#alertNum').text(num);
            setTimeout(function () {
                alertDialog.hide();
                saveBox.hide();
            }, 3000);
        } else if (num === '0') {
            // 最后一个楼栋情况
            alertDialog.show();
            saveBox = $('#save_btn2');
            saveBox.show();
            if(totalStatus === '3') {
                setTimeout(function () {
                    alertDialog.hide();
                    saveBox.hide();
                }, 1500);
            }
        }
    }
    // 关闭弹框
    $('.dialogClose').on('click', function () {
        alertDialog.hide();
        saveBox.hide();
    });
    // 弹框抽奖链接跳转
    $('#dialogLottery').on('click', function () {
        alertDialog.hide();
        saveBox.hide();
        location.href = mainSite + '/huodongAC.d?m=getGswInfoyjy&class=GuaShiWuSpecialHc&channel=others&city=&lotteryId=7039&p=' + totalP;
    });
    // 抽奖按钮
    var lotteryBtn = $('#lotteryBtn');
    lotteryBtn.on('click', function () {
        var ldArr = ldList.find('li');
        var ldNum = ldArr.length;
        if(totalNum !== '0') {
            alertDialog.show();
            // 填写完全部楼栋才可以
            saveBox = $('#lottery_btn1');
            saveBox.show();
        } else {
            if(totlaStatus === '1' || totlaStatus === '2') {
                // 可以跳转抽奖
                location.href = mainSite + '/huodongAC.d?m=getGswInfoyjy&class=GuaShiWuSpecialHc&channel=others&city=&lotteryId=7039&p=' + totalP;
            }
            if(ldNum === 0) {
                alertDialog.show();
                // 提示补充楼栋才能抽奖
                saveBox = $('#lottery_btn2');
                saveBox.show();
            } else {
                // 标识是否可以跳转
                var flag = false;
                $.each(ldArr, function () {
                    if($(this).attr('data-dongid')) {
                        flag = true;
                        // 用户填写了>= 1个楼栋,可以跳转抽奖
                        location.href = mainSite + '/huodongAC.d?m=getGswInfoyjy&class=GuaShiWuSpecialHc&channel=others&city=&lotteryId=7039&p=' + totalP;
                        return false;
                    }
                });
                if(!flag) {
                    // 不可以抽奖弹出提示
                    alertDialog.show();
                    // 填写完全部楼栋才可以
                    saveBox = $('#lottery_btn1');
                    saveBox.find('p').text('楼栋填写完整才能抽奖');
                    saveBox.show();
                }
            }
        }
        if(saveBox.length > 0) {
            setTimeout(function () {
                alertDialog.hide();
                saveBox.hide();
            }, 1500);
        }
    });

    // 提交表单
    $('.submitBtn').on('click', function () {
        var $this = $(this);
        var dongInfo = {};
        var exist = '1';
        var selectedLi = ldList.find('.current');
        dongInfo.dongid = selectedLi.attr('data-dongid') || '';
        dongInfo.status = selectedLi.attr('data-status') || '';
        dongInfo.dongname = ldName.val();
        var notFlag = false;
        if ($this.attr('id') === 'notExitBtn') {
            exist = '0';
            if (!dongInfo.dongname) {
                notFlag = true;
                btnDiv.hide();
                feedbackText.text('请填写楼栋名称');
                dialog.show();
                setTimeout(function () {
                    dialog.hide();
                }, 1000);
            } else {
                btnDiv.show();
                feedbackText.text('标记"' + dongInfo.dongname + '"不存在');
                dialog.show();
            }
        }
        dongInfo.alias = ldElseName.val();
        dongInfo.buildage = ndText.text().trim();
        dongInfo.property = $('#cqText').text();
        dongInfo.operastion = $('#wyText').text();
        dongInfo.propertyYear = $('#cqnxText').text().trim();
        dongInfo.buildCategory = jzxsText.text();
        dongInfo.towardsStreet = $('#ljcxText').text();
        // 标识底商是否存在
        var dsFlag = $('#dsText').text();
        // 标识底商层数
        if (dsFlag === '无') {
            dongInfo.dishang = 0;
        } else {
            dongInfo.dishang = dsNumText.text().trim().replace('层', '');
        }
        var elevator = $('#dtText').text().trim();
        dongInfo.elevator = '';
        if (elevator === '有') {
            dongInfo.elevator = '1';
        } else if(elevator === '无') {
            dongInfo.elevator = '0';
        }
        dongInfo.newcode = newcode;
        dongInfo.projname = projName;
        dongInfo.status = selectedLi.attr('data-status');
        dongInfo.user = user;
        var notComplete = false;
        if (dongInfo.status !== '2' && exist === '1') {
            // 楼栋名称未填写不能提交
            if (!dongInfo.dongname || !dongInfo.buildage || !dongInfo.property || !dongInfo.operastion || !dongInfo.propertyYear || !dongInfo.buildCategory
                || !dongInfo.towardsStreet || !dsFlag || !dongInfo.elevator) {
                notComplete = true;
            }
        }
        if(dsFlag === '有' && !dongInfo.dishang) {
            notComplete = true;
        }
        if (notComplete) {
            btnDiv.hide();
            feedbackText.text('表单填写不完整');
            notComplete = true;
            dialog.show();
            setTimeout(function () {
                dialog.hide();
            }, 1000);
        }
        if (exist === '0' && !notFlag) {
            $('#yes').on('click', function () {
                sunmitData(selectedLi, exist, dongInfo);
            });
        } else if (!notComplete && !notFlag) {
            if (dongInfo.status === '2') {
                exist = '0';
            }
            sunmitData(selectedLi, exist, dongInfo);
        }
    });
    var addLdHtml = '<li class="current"><em></em>补充楼栋</li>';
    // 补充楼栋操作
    $('#addLd').on('click', function () {
        resetForm();
        notExitBtn.hide();
        $('#markText').text('无');
        ldNameLi.show();
        ldList.find('li').removeClass('current');
        ldList.prepend(addLdHtml);
    });
    // 操作说明
    $('#czBtn').on('click', function () {
        $('#czsm').show().siblings('.main-infor-box').hide();
        $(this).addClass('on').siblings('a').removeClass('on');
    });
    // 常见问题
    $('#cjBtn').on('click', function () {
        $('#cjwt').show().siblings('.main-infor-box').hide();
        $(this).addClass('on').siblings('a').removeClass('on');
    });
});