/**
 * 组件
 * by zhangcongfeng@fang.com
 */
define('view/components', ['util/common'], function () {
    'use strict';
    function hideDiv() {
        document.ontouchmove = function () {
            return true;
        };
    }

    // 输入框组件
    Vue.component('inputLi', {
        replace: true,
        props: ['label', 'value', 'hint', 'unit', 'id', 'change'],
        template: '<li><div>{{label}}</div>'
        + '<div><div class="flexbox">'
        + '<input type="text" class="ipt-text" v-bind:value="value"  pattern="[0-9]*" placeholder="{{hint}}" v-on:input="inputLimit" id="{{id}}">'
        + '<span>{{unit}}</span></div></div></li>',
        methods: {
            inputLimit: function (ev) {
                var value = ev.target.value;
                value = value.match(/\d{0,4}(\.\d{0,2})?/g);
                ev.target.value = value[0];
                // this[ev.target.id] = value[0];
            }
        }
    });
    // 选择框组件
    Vue.component('selectLi', {
        replace: true,
        props: ['label', 'dataValue', 'msg', 'id'],
        template: '<li><div>{{label}}</div><div class="arr-rt" id="{{id}}" data-value="{{dataValue}}">{{msg}}</div></li>'
    });
    // 按钮组件
    Vue.component('vButton', {
        replace: true,
        template: '<div class="jsq-btn" id="btnCal"><input type="button" value="开始计算"></div>'
    });
    // 单选组件
    Vue.component('vRadio', {
        replace: true,
        props: ['label', 'name','changeRadio'],
        template: '<div>{{label}}</div><div class="radioBox" v-on:click="changeRadio">'
        + '<label><input type="radio" class="ipt-rd" name="{{name}}" id="isUnique" value="1" checked="checked" v-model="picked"/>是</label>'
        + '<label><input type="radio" class="ipt-rd" name="{{name}}" id="noUnique" value="0" v-model="picked" />否</label></div>',
        data: function () {
            return {
                picked: ''
            };
        },
        methods: {
            changeRadio: function () {
                this.$parent.$parent.ajaxFlag = true;
            }
        }
    });
    // 多选组件
    Vue.component('vCheckbox', {
        replace: true,
        props: ['checkChange'],
        template: '<ul class="choseList" id="houseFeature">'
        + '<li><label><input type="checkbox" class="ipt-cb" checked="checked" v-model="check1" v-on:change="checkChange">房产购置满两年</label></li>'
        + '<li><label><input type="checkbox" class="ipt-cb" checked="checked" v-model="check2" v-on:change="checkChange">房产首次购置</label></li>'
        + '<li><label><input type="checkbox" class="ipt-cb" checked="checked" v-model="check3" v-on:change="checkChange">卖方唯一购房</label></li></ul>',
        data: function () {
            return {
                check1: '',
                check2: '',
                check3: ''
            };
        }
    });
    // 列表组件
    Vue.component('liList', {
        replace: true,
        template: '<ul>'
        + '<li v-for="todo in todos" data-val={{todo.val}} class={{todo.cla}} v-on:click ="fill($index)">{{todo.text}}</li>'
        + '</ul>',
        props: ['todos', 'fill']
    });
    // 首付比例组件
    Vue.component('downPayment', {
        replace: true,
        template: '<section id="sfRatePage" class="sfRatePageSec">'
        + '<ul class="jsq-list"><li><div>自定义：</div><div><div class="flexbox">'
        + '<input type="number" class="ipt-text" id="inputDai" v-on:input="inputLimit" value="{{userVal}}" v-model="userVal" placeholder="{{hint}}">'
        + '<span class="gray-8">万元</span><a href="javascript:void(0);" class="btn" v-on:click="userDefined">确 定</a>'
        + '</div></div></li></ul>'
        + '<div class="c-list"><div class="list-t">或者选择首付比例</div><li-list :todos="todos" v-bind:fill="fill"></li-list>'
        + ' </div></section>',
        data: function () {
            return {
                todos: [
                    {text: '一成', val: '1', cla: ''},
                    {text: '二成', val: '2', cla: ''},
                    {text: '三成', val: '3', cla: 'on'},
                    {text: '四成', val: '4', cla: ''},
                    {text: '五成', val: '5', cla: ''},
                    {text: '六成', val: '6', cla: ''},
                    {text: '七成', val: '7', cla: ''},
                    {text: '八成', val: '8', cla: ''},
                    {text: '九成', val: '9', cla: ''}
                ],
                userVal: '',
                hint: '',
                fill: function (index) {
                    this.todos.forEach(function (value, inx, array) {
                        array[inx].cla = '';
                    });
                    this.todos[index].cla = 'on';
                    // 传递到父组件
                    this.$dispatch('child-msg', this.todos[index]);
                }
            };
        },
        methods: {
            inputLimit: function (ev) {
                var value = ev.target.value;
                value = value.match(/\d{0,4}(\.\d{0,2})?/g);
                ev.target.value = value[0];
                this[ev.target.id] = value[0];
            },
            userDefined: function () {
                // console.log(this.userVal);
                var user = Number(this.userVal);
                if (user > this.$parent.totalMoney || user <= 0) {
                    this.userVal = '';
                    this.hint = '请输入正确的数字';
                } else {
                    // 去除选项上的样式
                    this.todos.forEach(function (value, inx, array) {
                        array[inx].cla = '';
                    });
                    this.$dispatch('child-msg2', this.userVal);
                }
            }
        }
    });
    // 按揭年数组件
    Vue.component('mgYear', {
        replace: true,
        template: '<div class="sf-maskFixed" id="floatDiv">'
        + ' <div class="sf-bdmenu"><div class="tt">'
        + '<div class="cancel" @click="cancel">取消</div></div>'
        + ' <div class="con"><section style="height: 202px;overflow: hidden;">'
        + '<li-list :todos="todos" v-bind:fill="fill"></li-list>'
        + ' </section></div></div></div>',
        data: function () {
            var todos = [];
            for (var i = 1; i <= 30; i++) {
                todos.push({
                    text: i + '年（' + i * 12 + '期）',
                    val: i,
                    cla: ''
                });
            }
            todos[19].cla = 'activeS';
            return {
                todos: todos,
                fill: function (index) {
                    this.todos.forEach(function (value, inx, array) {
                        array[inx].cla = '';
                    });
                    this.todos[index].cla = 'activeS';

                    this.$dispatch('year-msg', this.todos[index]);
                    hideDiv();
                }
            };
        },
        methods: {
            cancel: function () {
                $('#floatDiv').hide();
                hideDiv();
                // this.$parent.showYear = false;
            }
        },
        events: {
            yearSel: function (num) {
                this.todos.forEach(function (value, inx, array) {
                    array[inx].cla = '';
                });
                this.todos[num - 1].cla = 'activeS';
            }
        }
    });
    // 利率组件
    Vue.component('mgRate', {
        replace: true,
        template: '<section id="ratePage" class="ratePageSec">'
        + ' <ul class="jsq-list"><li><div class="width2">自定义利率：</div>'
        + '<div><div class="flexbox">'
        + '<input type="text" class="ipt-text" id="lilvDef" v-on:keydown="keydownEvent" value="{{userRate}}" v-model="userRate" placeholder="{{hint}}">'
        + '<span class="gray-8">%</span><a href="javascript:;" class="btn" id="btnRateOk" v-on:click="rateBtnClick">确 定</a>'
        + '</div></div></li></ul>'
        + '<div class="c-list"><div class="list-t">或者选择常用利率</div>'
        + '<li-list :todos="todos" v-bind:fill="fill"></li-list>'
        + '</div></section>',
        data: function () {
            return {
                todos: [
                    {text: '基准利率', val: '1', cla: 'on'},
                    {text: '7折', val: '0.7', cla: ''},
                    {text: '85折', val: '0.85', cla: ''},
                    {text: '88折', val: '0.88', cla: ''},
                    {text: '9折', val: '0.9', cla: ''},
                    {text: '95折', val: '0.95', cla: ''},
                    {text: '1.05倍', val: '1.05', cla: ''},
                    {text: '1.1倍', val: '1.1', cla: ''},
                    {text: '1.2倍', val: '1.2', cla: ''},
                    {text: '1.3倍', val: '1.3', cla: ''}
                ],
                fill: function (index) {
                    this.todos.forEach(function (value, inx, array) {
                        array[inx].cla = '';
                    });
                    this.todos[index].cla = 'on';
                    this.$dispatch('rate-msg', this.todos[index], index);
                },
                userRate: '',
                hint: ''
            };
        },
        methods: {
            rateBtnClick: function () {
                var value = parseFloat(Number(this.userRate).toFixed(2)) || 0;
                if (value === 0 || value === '') {
                    this.userRate = '';
                    this.hint = '请输入正确的利率';
                }
                if (Number(this.userRate) <= 0) {
                    this.userRate = '';
                    this.hint = '请输入正确的利率';
                } else {
                    this.$dispatch('rate-msg2', this.userRate);
                    // 自定义利率把选项样式清空
                    this.todos.forEach(function (value, inx, array) {
                        array[inx].cla = '';
                    });
                }
            },
            inputLimit: function (ev) {
                var value = ev.target.value;
                value = value.match(/\d{0,2}(\.\d{0,2})?/g);
                ev.target.value = value[0];
                this[ev.target.id] = value[0];
            },
            keydownEvent: function (ev) {
                var ev = ev || window.event;
                var code = ev.keyCode;
                var currentVal = String.fromCharCode(code);
                var hasValue = ev.target.value;
                // 95-106:0-9 |47-58:0-9 |110|190:. 37:<- 39:-> 8:backspace
                if ((code > 95 && code < 106) || (code > 47 && code < 58) || code === 110 || code === 190 || code === 37 || code === 39 || code === 8) {
                    if (!isNaN(currentVal)) {
                        if (hasValue.indexOf('.') > -1) {
                        // 包含小数点
                            if (Number(hasValue) > 99.99 || Number(hasValue) < 0) {
                                ev.preventDefault();
                                return false;
                            } else if (/\d+\.\d{2}/.test(hasValue)) {
                                ev.preventDefault();
                                return false;
                                // return true;
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
                        if (code === 8 || code === 37 || code === 39) {
                            // return true;
                        } else if (code === 190 || code === 110) {
                            if (hasValue.indexOf('.') > -1) {
                                ev.preventDefault();
                                return false;
                            } else if (hasValue.length >= 3) {
                                ev.preventDefault();
                                return false;
                            } else if (hasValue.length === 0) {
                                ev.preventDefault();
                                return false;
                            }
                            else {
                            }
                        } else if (hasValue === '') {

                        }
                    }
                } else {
                    ev.preventDefault();
                    return false;
                }
            }
        }
    });
    // 房屋性质组件
    Vue.component('mgHousing', {
        replace: true,
        template: '<div class="sf-maskFixed" id="floatDiv">'
        + ' <div class="sf-bdmenu"><div class="tt">'
        + '<div class="cancel" @click="cancel">取消</div></div>'
        + ' <div class="con">'
        + '<li-list :todos="todos" v-bind:fill="fill"></li-list>'
        + '</div></div></div>',
        data: function () {
            return {
                todos: [
                    {text: '普通住宅', val: '0', cla: 'activeS'},
                    {text: '非普通住宅', val: '1', cla: ''}
                ],
                fill: function (index) {
                    this.todos.forEach(function (value, inx, array) {
                        array[inx].cla = '';
                    });
                    this.todos[index].cla = 'activeS';
                    this.$dispatch('housing-msg', this.todos[index]);
                }
            };
        },
        methods: {
            cancel: function () {
                this.$parent.showHousing = false;
                hideDiv();
            }
        }
    });
    // 房产证年限
    Vue.component('mgHousing2', {
        replace: true,
        template: '<div class="sf-maskFixed" id="floatDiv">'
        + ' <div class="sf-bdmenu"><div class="tt">'
        + '<div class="cancel" @click="cancel">取消</div></div>'
        + ' <div class="con">'
        + '<li-list :todos="todos" v-bind:fill="fill"></li-list>'
        + '</div></div></div>',
        data: function () {
            return {
                todos: [
                    {text: '不满两年', val: '1', cla: 'activeS'},
                    {text: '满两年不满五年', val: '2', cla: ''},
                    {text: '满五年', val: '3', cla: ''}
                ],
                fill: function (index) {
                    this.todos.forEach(function (value, inx, array) {
                        array[inx].cla = '';
                    });
                    this.todos[index].cla = 'activeS';
                    this.$dispatch('housing2-msg', this.todos[index]);
                }
            };
        },
        methods: {
            cancel: function () {
                this.$parent.showHousing2 = false;
                hideDiv();
            }
        }
    });
    // esf房屋性质
    Vue.component('mgHousing3', {
        replace: true,
        template: '<div class="sf-maskFixed" id="floatDiv">'
        + ' <div class="sf-bdmenu"><div class="tt">'
        + '<div class="cancel" @click="cancel">取消</div></div>'
        + ' <div class="con">'
        + '<ul>'
        + '<li v-for="todo in todos" data-val={{todo.val}} class={{todo.cla}} v-on:click ="fill($index)">{{todo.text}}</li>'
        + '</ul>'
        + '</div></div></div>',
        data: function () {
            return {
                todos: [
                    {text: '普通住宅', val: '1', cla: 'activeS'},
                    {text: '非普通住宅', val: '2', cla: ''},
                    {text: '经济适用房', val: '3', cla: ''}
                ],
                fill: function (index) {
                    this.todos.forEach(function (value, inx, array) {
                        array[inx].cla = '';
                    });
                    this.todos[index].cla = 'activeS';
                    this.$dispatch('housing3-msg', this.todos[index]);
                }
            };
        },
        methods: {
            cancel: function () {
                this.$parent.showHousing3 = false;
                hideDiv();
            }
        }
    });
    // esf计算方式
    Vue.component('mgHousing4', {
        replace: true,
        template: '<div class="sf-maskFixed" id="floatDiv">'
        + ' <div class="sf-bdmenu"><div class="tt">'
        + '<div class="cancel" @click="cancel">取消</div></div>'
        + ' <div class="con">'
        + '<ul>'
        + '<li v-for="todo in todos" data-val={{todo.val}} class={{todo.cla}} v-on:click ="fill($index)">{{todo.text}}</li>'
        + '</ul>'
        + '</div></div></div>',
        data: function () {
            return {
                todos: [
                    {text: '按总价计算', val: '1', cla: 'activeS'},
                    {text: '按差价计算', val: '2', cla: ''}
                ],
                fill: function (index) {
                    this.todos.forEach(function (value, inx, array) {
                        array[inx].cla = '';
                    });
                    this.todos[index].cla = 'activeS';
                    this.$dispatch('housing4-msg', this.todos[index]);
                }
            };
        },
        methods: {
            cancel: function () {
                this.$parent.showHousing4 = false;
                hideDiv();
            }
        }
    });
});