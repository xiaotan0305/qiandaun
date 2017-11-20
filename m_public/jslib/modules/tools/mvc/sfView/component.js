/**
 * Created by lina on 2017/7/19.
 * 首付贷款公用组件
 */
define('modules/tools/mvc/sfView/component', [], function (require, exports, module) {
    'use strict';
    function hideDiv() {
        document.ontouchmove = function () {
            return true;
        };
    }
    var vars = seajs.data.vars;
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
    // 弹框组件
    Vue.component('floatAlert', {
        template: '<div class="floatAlert">'
        + '<div class="alert"><div class="cont">'
        + '<h3>{{floatTit}}</h3><p>{{floatCon}}</p></div>'
        + '<div class="btns"><a href="javascript:void(0);" @click="hasKnow"><strong>我知道了</strong></a></div>'
        + '</div></div>',
        replace: true,
        props: ['floatTit', 'floatCon'],
        methods: {
            hasKnow: function () {
                this.$parent.floatShow = false;
            }
        }
    });
    // 选择框组件
    Vue.component('selectLi', {
        replace: true,
        props: ['label', 'dataValue', 'msg', 'id'],
        template: '<li><div>{{label}}</div><div class="arr-rt" id="{{id}}" data-value="{{dataValue}}">{{msg}}</div></li>'
    });
    // 列表组件
    Vue.component('liList', {
        replace: true,
        template: '<ul>'
        + '<li v-for="todo in todos" data-val={{todo.val}} class={{todo.cla}} v-on:click ="fill($index)">{{todo.text}}</li>'
        + '</ul>',
        props: ['todos', 'fill','id']
    });
    // 按揭年数组件
    Vue.component('mgYear', {
        replace: true,
        template: '<div class="sf-maskFixed">'
        + ' <div class="sf-bdmenu"><div class="tt">'
        + '<div class="cancel" @click="cancel">取消</div></div>'
        + ' <div class="con"><section id="{{yearId}}" style="height: 202px;overflow: hidden;">'
        + '<li-list :todos="todos" v-bind:fill="fill"></li-list>'
        + ' </section></div></div></div>',
        props:['yearId'],
        data: function () {
            var todos = [];
            var i = parseInt(vars.maxyear);
            for (; i >= 1; i--) {
                todos.push({
                    text: i + '年（' + i * 12 + '期）',
                    val: i,
                    cla: ''
                });
            }
            todos[0].cla = 'activeS';
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
                this.$parent.yearShow = false;
                this.$parent.$parent.enable();
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
    // 贷款类型组件
    Vue.component('dkType', {
        replace: true,
        template: '<div class="sf-maskFixed" id="floatDiv">'
        + ' <div class="sf-bdmenu"><div class="tt">'
        + '<div class="cancel" @click="cancel">取消</div></div>'
        + ' <div class="con"><section id="selectType" style="height: 202px;overflow: hidden;">'
        + '<li-list :todos="todos" v-bind:fill="fill"></li-list>'
        + ' </section></div></div></div>',
        data: function () {
            return {
                todos: [
                    {text: '商业贷款', cla: 'activeS'},
                    {text: '公积金贷款', cla: ''},
                    {text: '组合贷款', cla: ''}
                ],
                fill: function (index) {
                    this.todos.forEach(function (value, inx, array) {
                        array[inx].cla = '';
                    });
                    this.todos[index].cla = 'activeS';
                    this.$dispatch('dk-type', this.todos[index]);
                    hideDiv();
                }
            };
        },
        methods: {
            cancel: function () {
                this.$parent.typeShow = false;
            }
        }
    });
    // 利率组件
    Vue.component('mgRate', {
        replace: true,
        template: '<section id="ratePage" class="ratePageSec">'
        + ' <ul class="jsq-list"><li><div class="width2">自定义利率：</div>'
        + '<div><div class="flexbox">'
        + '<input type="number" class="ipt-text" id="lilvDef" v-on:keydown="keydownEvent" value="{{userRate}}" v-model="userRate" placeholder="{{hint}}">'
        + '<span class="gray-8">%</span><a href="javascript:;" class="btn" id="btnRateOk" v-on:click="rateBtnClick">确 定</a>'
        + '</div></div></li></ul>'
        + '<div class="c-list"><div class="list-t">或者选择常用利率</div>'
        + '<li-list id="rateList" :todos="todos" v-bind:fill="fill"></li-list>'
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
                    {text: '不满两年', val: '1', cla: ''},
                    {text: '满两年', val: '2', cla: ''},
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
        },
        ready:function(){
            if(vars.houseYear == 1){
               this.todos[0].cla = 'activeS';
            }else if(vars.houseYear == 2){
                this.todos[1].cla = 'activeS';
            }else if(vars.houseYear == 3){
                this.todos[2].cla = 'activeS';
            }
        }
    });
    // 是否唯一
    Vue.component('mgHousing3', {
        replace: true,
        template: '<div class="sf-maskFixed">'
        + ' <div class="sf-bdmenu"><div class="tt">'
        + '<div class="cancel" @click="cancel">取消</div></div>'
        + ' <div class="con">'
        + '<li-list :todos="todos" v-bind:fill="fill"></li-list>'
        + '</div></div></div>',
        data: function () {
            return {
                todos: [
                    {text: '唯一', val: '1', cla: 'activeS'},
                    {text: '不唯一', val: '2', cla: ''}
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

});