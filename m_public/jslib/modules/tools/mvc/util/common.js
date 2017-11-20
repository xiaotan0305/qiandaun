/**
 * Created by user on 2015/7/1.
 */

define("util/common", ["model/setting"], function (require, exports, module) {
    "use strict";
    var setting = require("model/setting");
    var common = {
        getPageName: function (currentUrl) {
            var currentUrl = currentUrl || window.location.href;
            if (currentUrl.indexOf("/daikuan.html") > -1 || /tools\/$/.test(currentUrl)) {
                return setting.BUSINESS_LOANS;
            } else if (currentUrl.indexOf("/gjj.html") > -1) {
                return setting.FUND_LOANS;
            } else if (currentUrl.indexOf("/zh.html") > -1) {
                return setting.COMBINATION_LOANS;
            } else if (currentUrl.indexOf("/taxs.html") > -1) {
                return setting.NEWHOUSE_TAX_CALCULATION;
            } else if (currentUrl.indexOf("/esftaxs.html") > -1) {
                return setting.ESF_TAX_CALCULATION;
            } else if (currentUrl.indexOf("/sfdai.html") > -1) {
                return setting.DOWN_PAYMENT_LOANS;
            } else {
                return setting.BUSINESS_LOANS;
            }
        },
        /*
         * 鼠标按下验证函数*/
        downFn: function (ev) {
            var ev = ev || window.event;
            var code = ev.keyCode;
            if (code == 0) {
                ev.preventDefault();
                return false;
            }
            var currentVal = String.fromCharCode(code);
            var hasValue = this.value;
            var len = 4;
            var maxNum = 9999.99;
            if (ev.data) {
                // console.log(ev.data,ev.data.length);
                if (ev.data.length == 5) {
                    maxNum = 99999.99;
                    len = 5;
                }
                else if (ev.data.length == 6) {
                    maxNum = 999999.99;
                    len = 6;
                }
            }
            //95-106:0-9 |47-58:0-9 |110|190:. 37:<- 39:-> 8:backspace
            if ((code > 95 && code < 106) || (code > 47 && code < 58) || code == 110 || code == 190 || code == 37 || code == 39 || code == 8) {
                if (ev.data.pageType == 2) {
                    if (hasValue == "请输入贷款金额") {
                        hasValue = this.value = "";
                    }
                }
                // console.log(currentVal,hasValue);
                if (!isNaN(currentVal)) {
                    if (hasValue.indexOf('.') > -1) {//包含小数点
                        if (Number(hasValue) > maxNum || Number(hasValue) < 0) {
                            // console.log(hasValue,maxNum);
                            ev.preventDefault();
                            return false;
                        } else if (parseInt(hasValue).toString().length > len) {
                            // console.log(parseInt(hasValue).toString().length);
                            ev.preventDefault();
                            return false;
                        }else if (/\d+\.\d{2}/.test(hasValue)) {
                            // 小数点后大于等于2位时
                            // 判断光标位置(前移)
                            // console.log(this.selectionStart);
                            var num = parseInt(hasValue).toString().length;
                            if (this.selectionStart <= num) {
                                if (parseInt(hasValue).toString().length >= len) {
                                    ev.preventDefault();
                                    return false;
                                }else {
                                    return true;
                                }
                            }else {
                                ev.preventDefault();
                                return false;
                            }
                        }
                    }
                    else {
                        // console.log(hasValue);
                        if (Number(hasValue) > maxNum || Number(hasValue) < 0) {
                            ev.preventDefault();
                            return false;
                        } else if (hasValue.length >= len) {
                            ev.preventDefault();
                            return false;
                        } else {
                        }
                    }
                } else {
                    if (code == 8 || code == 37 || code == 39) {
                        //return true;
                    } else if ((code == 190 || code == 110) && len != 6) {
                        if (hasValue.indexOf('.') > -1) {
                            ev.preventDefault();
                            return false;
                        } else if (hasValue.length == len + 1) {
                            ev.preventDefault();
                            return false;
                        } else if (hasValue.length == 0) {
                            ev.preventDefault();
                            return false;
                        } else {
                        }
                    } else if (hasValue == "") {

                    } else if ((code == 190 || code == 110) && len == 6) {
                        if (hasValue.length == 6) {
                            ev.preventDefault();
                            return false;
                        } else {
                        }
                    }
                }
            } else {
                ev.preventDefault();
                return false;
            }
        },
        /*
         * 鼠标按下验证函数为利率定制的方法*/
        downFnForRate: function (ev) {
            var ev = ev || window.event;
            var code = ev.keyCode;
            var currentVal = String.fromCharCode(code);
            var hasValue = ev.target.value;
            //95-106:0-9 |47-58:0-9 |110|190:. 37:<- 39:-> 8:backspace
            if ((code > 95 && code < 106) || (code > 47 && code < 58) || code == 110 || code == 190 || code == 37 || code == 39 || code == 8) {
                if (!isNaN(currentVal)) {
                    if (hasValue.indexOf('.') > -1) {//包含小数点
                        if (Number(hasValue) > 99.99 || Number(hasValue) < 0) {
                            ev.preventDefault();
                            return false;
                        } else if (/\d+\.\d{2}/.test(hasValue)) {
                            ev.preventDefault();
                            return false;
                            //return true;
                        } else {

                        }
                    }
                    else {
                        if (Number(hasValue) > 99.99 || Number(hasValue) < 0) {
                            ev.preventDefault();
                            return false;
                        } else if (hasValue.length >= 2) {
                            ev.preventDefault();
                            return false;
                        } else {
                        }
                    }
                } else {
                    if (code == 8 || code == 37 || code == 39) {
                        //return true;
                    } else if (code == 190 || code == 110) {
                        if (hasValue.indexOf('.') > -1) {
                            ev.preventDefault();
                            return false;
                        } else if (hasValue.length >= 3) {
                            ev.preventDefault();
                            return false;
                        } else if (hasValue.length == 0) {
                            ev.preventDefault();
                            return false;
                        }
                        else {
                        }
                    } else if (hasValue == "") {

                    }
                }
            } else {
                ev.preventDefault();
                return false;
            }
        },
        autoPie: function (arr, id) {
            $("div[id^=pieCon] canvas").remove();
            require.async("chart/pie/1.0.0/pie", function (pie) {
                var p = new pie({
                    id: id || "#pieCon",//容器id
                    animateType: "increaseTogether",//效果类型，暂时只有这一种需要其他类型再扩展
                    height: 140,//canvas的高
                    width: 140,//canvas的宽
                    radius: 140,//半径
                    part: 50,//分割份数，即增量的速度
                    space: 1,//空白间隔的大小
                    hollowedRadius: 70,//是否挖空，如果为0则不挖空，否则为挖空的半径
                    dataArr: (function (arr) {
                        var isAllZero = 0;
                        for (var i = 0, len = arr.length; i < len; i++) {
                            isAllZero += arr[i].value;
                        }
                        if (isAllZero == 0) {
                            for (var i = 0, len = arr.length; i < len; i++) {
                                if (arr[i].value == 0) {
                                    arr[i].value = 10;
                                }
                            }
                        }
                        return arr;
                    })(arr, id)
                });
                p.run();
            });
        },
        calMethod: function (data, type) {
            // type, dkMoney, monthRate, monthNum
            // 涉及到金额的单位统一为元
            // 还款方式公式计算
            var cal = {};
            if (type == 0) {
                // 等额本息
                // 〔贷款本金×月利率×(1＋月利率)＾款月数〕÷〔(1＋月利率)＾款月数-1〕
                cal.payMonth = ((data.dkMoney * data.monthRate * Math.pow(1 + data.monthRate, data.monthNum)) / (Math.pow(1 + data.monthRate, data.monthNum) - 1)).toFixed(2);
                // 总利息=还款月数×每月月供额-贷款本金
                cal.payLx = Math.ceil(data.monthNum * cal.payMonth - data.dkMoney);
                // 等额本息的每月递减值是0
                cal.payDifferent = 0;
            } else if (type == 1) {
                // 等额本金
                // (贷款本金÷款月数)+(贷款本金-已归本金累计额)×月利率 默认第一个月
                cal.payMonth = (data.dkMoney / data.monthNum + (data.dkMoney) * data.monthRate).toFixed(2);
                // 〔(总贷款额÷款月数+总贷款额×月利率)+总贷款额÷还款月数×(1+月利率)〕÷2×款月数-总贷款额
                cal.payLx = Math.ceil(((data.dkMoney / data.monthNum + data.dkMoney * data.monthRate + (data.dkMoney / data.monthNum) * (1 + data.monthRate)) / 2) * data.monthNum - data.dkMoney);
                // 等额本金还款方式的每月递减金额(每月应还本金*月利率)(zhangcongfeng@fang.com 2016-04-21)
                cal.payDifferent = (data.dkMoney / data.monthNum * data.monthRate).toFixed(2);
            }
            // 返回月供和总利息
            return cal;
        },
        everyMonthPay: function (data) {
            // type,dkMonth,hkmoney,monthRate,i,dkmoney,monthPayOrigin
            var type = data.type;
            var dkMonth = data.dkMonth;
            var hkmoney = data.hkmoney;
            var monthRate = data.monthRate;
            // 第i个月
            var i = data.i;
            var dkmoney = data.dkmoney;
            var monthPayOrigin = data.monthPayOrigin;
            var cal = {};
            if (type == 0) {//等额本息
                //每月应还本金=贷款本金×月利率×(1+月利率)^(还款月序号-1)÷〔(1+月利率)^款月数-1〕
                cal.bj = Math.ceil(dkmoney * monthRate * Math.pow(1 + monthRate, i - 1) / (Math.pow(1 + monthRate, dkMonth) - 1));
                //每月应还利息=贷款本金×月利率×〔(1+月利率)^还款月数-(1+月利率)^(款月序号-1)〕÷〔(1+月利率)^款月数-1〕
                cal.bx = Math.ceil(dkmoney * monthRate * (Math.pow(1 + monthRate, dkMonth) - Math.pow(1 + monthRate, i - 1)) / (Math.pow(1 + monthRate, dkMonth) - 1));
                //剩余还款
                cal.sy = hkmoney - Math.ceil(i * (monthPayOrigin));
            }
            else if (type == 1) {//等额本金
                //每月应本金=贷款本金÷款月数
                //每月应利息=剩余本金×月利率=(贷款本金-已归本金累计额)×月利率
                cal.bj = dkmoney / dkMonth;
                cal.bx = (dkmoney - (i - 1) * cal.bj) * monthRate;
            }
            return cal;
        },
        unique: function (arr) {
            var temp = new Array();
            arr.sort(function (a, b) {
                return a - b;
            });
            for (var i = 0, l = arr.length; i < l; i++) {
                if (arr[i] == arr[i + 1]) {
                    continue;
                }
                temp[temp.length] = arr[i];
            }
            return temp;
        },
        templateFn: function (tmpl, map) {
            var out = tmpl.replace(/{(\w+)}/g, function (match, capture) {
                var val = map[capture];
                if (val) {
                    return val;
                }
                else if (val == '') {
                    return val;
                }
                else {
                    return '';
                }
            });
            return out;
        },
        formatNum: function (num, length) {
            // 格式化两位小数 如果23.00 则保留为23 如果是23.1就23.10;parseFloat 将它的字符串参数解析成为浮点数并返回
            return parseFloat(Number(num).toFixed(length || 2)) || 0;
        },
        formatNumStr: function (num, length) {
            return (Number(num).toFixed(length || 2)) || 0;
        },
        convertToZH: function (num) {
            // '一', '二', '三', '四', '五', '六', '七', '八', '九','十'
            var arr = ['\u4e00', '\u4e8c', '\u4e09', '\u56db', '\u4e94', '\u516d', '\u4e03', '\u516b', '\u4e5d', '\u5341', '\u000d', '\u000a'];
            return arr[num - 1];
        },
        scrollEvent: function () {
            // 页面滚动效果
            // 页面加载完之后设置贷款详细表的高度
            // 44px 头部的高度 80px脚的高度 浮层的高度44px
            var dataBox = $('.data-box');
            var dHeight = document.body.offsetHeight - dataBox[0].offsetTop - 44;
            dataBox.css({height: dHeight + 'px',overflow: 'auto'});
            // 滚动页面至最顶端
            $(document.body).scrollTop(0);

            // 滚动时年数提示
            var yearChange = $('#yearChange');
            dataBox.scroll(function () {
                var scrollTop = dataBox.scrollTop();
                if (scrollTop >= 505) {
                    yearChange.html('<span>第' + Math.ceil(scrollTop / 505) + '年</span>');
                } else {
                    yearChange.html('<span>第1年</span>');
                }
            });
            // dataBox.scrollTop(0);
        },
        showDiv: function () {
            document.addEventListener('touchmove', function (e) {
                e.preventDefault();
            });
        },
        hideDiv: function () {
            document.removeEventListener('touchmove', function (e) {
                e.preventDefault();
            });
        }
    };
    module.exports = common;
});
