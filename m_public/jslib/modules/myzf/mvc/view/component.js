/**
 * 租房发布页vue改版
 * create by zdl
 * 20161109
 */
define('modules/myzf/mvc/view/component', ['jquery'], function (require, exports, module) {
    'use strict';
    var vars = seajs.data.vars;
    //写cookies
    function setCookie(name, value) {
        //var Days = 1;
        var exp = new Date();
        exp.setTime(exp.getTime() + 0.5 * 60 * 60 * 1000);
        document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + exp.toGMTString() + "; path=/";
    }

    // function getCookie(name) {
    //     var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    //     if (arr = document.cookie.match(reg)) {
    //         return unescape(arr[2]);
    //     } else {
    //         return null;
    //     }
    // }

    function transCookie(value, varRenttype) {
        if (vars.edit === '0') {
            value = JSON.stringify(value); //可以将json对象转换成json对符串
            if (varRenttype) {
                setCookie('inputCookieHz', value);
            } else {
                setCookie('inputCookieZz', value);
            }
        } 
    }

    // 列表组件
    Vue.component('liList', {
        replace: true,
        template: '<ul>'
        + '<li v-for="todo in todos" dis-id= {{todo.id}} data-val={{todo.val}}  v-on:click ="fill($index)">{{todo.text}}</li>'
        + '</ul>',
        props: ['todos', 'fill']
    });

    Vue.component('dlDd', {
        replace: true,
        props: ['dtText', 'spanText','id'],
        template: '<dl><dt>{{{dtText}}}</dt>'
        + '<dd class="arr-rt font02"><span id={{id}} class="xuan2">{{spanText}}</span></dd></dl>'
    });

    Vue.component('districtdrapList', {
        replace: true,
        props: ['districtInfoName'],
        template: '<div id="areaDrap" class="sf-maskFixed">'
        + '<div class="sf-bdmenu"><div class="tt"><div class="cancel" v-on:click="cancle">取消</div><div class="info">选择区域</div></div>'
        + '<div id="areaDrapCon" class="con" style="display: block;">'
        + '<li-list :todos="todos" v-bind:fill="fill"></li-list>'
        + '</div></div></div>',
        data: function () {
            var todosLen = this.$parent.districtInfoName.length;
            var todos = [];
            for (var i = 0; i < todosLen; i++) {
                todos.push({
                    text: this.$parent.districtInfoName[i],
                    id: this.$parent.districtInfoId[i]
                });
            }
            return {
                todos: todos,
                fill: function (index) {
                    this.$dispatch('modify-districtval', this.todos[index]);
                }
            };
        },
        methods: {
            cancle: function () {
                this.$parent.districtShow = false;
            }
        }
    });
    Vue.component('drapList', {
        replace: true,
        props: ['huxing'],
        template: '<div id="huxingShiDrap" class="sf-maskFixed">'
        + '<div class="sf-bdmenu"><div class="tt"> <div class="cancel" v-on:click="cancle">取消</div>'
        + '<div id="huxingShiText" class="info">{{huxing}}</div></div>'
        + '<div id="huxingShiDrapCon" class="con" style="display: block;">'
        + '<li-list :todos="todos" v-bind:fill="fill"></li-list>'
        + '</div></div></div>',
        data: function () {
            var todos = [];
            for (var i = 0; i <= 9; i++) {
                todos.push({
                    text: i + '室',
                    val: i
                });
            }
            return {
                todos: todos,
                fill: function (index) {
                    this.$dispatch('modify-val1', this.todos[index]);
                }
            };
        },
        methods: {
            cancle: function () {
                this.$parent.huxingStep1 = false;
            }
        }
    });
    Vue.component('rentwaydrapList', {
        replace: true,
        props: [],
        template: '<div id="shareTypeDrap" class="sf-maskFixed">'
        + '<div class="sf-bdmenu"><div class="tt"> <div class="cancel" v-on:click="cancle">取消</div><div class="info">选择合租类型</div>'
        + '<div id="shareTypeDrapCon" class="con">'
        + '<li-list :todos="todos" v-bind:fill="fill"></li-list>'
        + '</div></div>',
        data: function () {
            var todos = [{text: '主卧'}, {text: '次卧'}, {text: '床位'}, {text: '隔断间'}];
            return {
                todos: todos,
                fill: function (index) {
                    this.$dispatch('modify-rentwayval', this.todos[index]);
                }
            };
        },
        methods: {
            cancle: function () {
                this.$parent.rentwayShow = false;
            }
        }
    });
    Vue.component('drapList2', {
        replace: true,
        props: ['huxing'],
        template: '<div id="huxingTingDrap" class="sf-maskFixed">'
        + '<div class="sf-bdmenu"><div class="tt"> <div class="cancel" v-on:click="cancle">取消</div>'
        + '<div class="info">{{huxing}}</div></div>'
        + '<div id="huxingTingDrapCon" class="con" style="display: block;">'
        + '<li-list :todos="todos" v-bind:fill="fill"></li-list>'
        + '</div></div></div>',
        data: function () {
            var todos = [];
            for (var i = 0; i <= 9; i++) {
                todos.push({
                    text: i + '厅',
                    val: i
                });
            }
            return {
                todos: todos,
                fill: function (index) {
                    this.$dispatch('modify-val2', this.todos[index]);
                }
            };
        },
        methods: {
            cancle: function () {
                this.$parent.huxingStep2 = false;
            }
        }
    });
    Vue.component('drapList3', {
        replace: true,
        props: ['huxing'],
        template: '<div id="huxingWeiDrap" class="sf-maskFixed">'
        + '<div class="sf-bdmenu"><div class="tt"> <div class="cancel" v-on:click="cancle">取消</div>'
        + '<div class="info">{{huxing}}</div></div>'
        + '<div id="huxingWeiDrapCon" class="con" style="display: block;">'
        + '<li-list :todos="todos" v-bind:fill="fill"></li-list>'
        + '</div></div></div>',
        data: function () {
            var todos = [];
            for (var i = 0; i <= 9; i++) {
                todos.push({
                    text: i + '卫',
                    val: i
                });
            }
            return {
                todos: todos,
                fill: function (index) {
                    this.$dispatch('modify-val3', this.todos[index]);
                }
            };
        },
        methods: {
            cancle: function () {
                this.$parent.huxingStep3 = false;
            }
        }
    });

    Vue.component('equitmentList', {
        replace: true,
        props: [],
        template: '<dl id="equitmentManual"><dt>配套设施</dt><dd class="facility">'
        + '<a v-for="todo in todos" href="javascript:void(0);" class="{{todo.cla}}" v-on:click="changeClass($index)">{{todo.text}}</a>'
        + '</dd></dl>',
        data: function () {
            var varsEquitment = this.$parent.varsEquitment;
            var todos = [{text: '床', cla: ''},
                {text: '宽带', cla: ''},
                {text: '电视', cla: ''},
                {text: '洗衣机', cla: ''},
                {text: '冰箱', cla: ''},
                {text: '暖气', cla: ''},
                {text: '空调', cla: ''},
                {text: '热水器', cla: ''}
            ];
            var todosLen = todos.length;
            // 只有编辑页才需要重新初始化改数据
            //if (this.$parent.varsEdit) {
                for (var i = 0; i < todosLen; i++) {
                    if (varsEquitment.indexOf(todos[i].text) !== -1) {
                        todos[i].cla = 'btn_red';
                    }
                }
            //}
            return {
                todos: todos
            };
        },
        methods: {
            changeClass: function (index) {
                if(!this.$parent.canClick){
                    return false;
                }
                if (this.todos[index].cla === '') {
                    this.todos[index].cla = 'btn_red';
                } else {
                    this.todos[index].cla = '';
                }
                // 更新设备选中数据
                var todosLen = this.todos.length;
                var selectedEq = [];
                for (var i = 0; i < todosLen; i++) {
                    if (this.todos[i].cla === 'btn_red') {
                        selectedEq.push(this.todos[i].text);
                    }
                }
                this.$parent.varsEquitment = selectedEq.join(',');
                this.$parent.cookieValue.equitment = this.$parent.varsEquitment;
                transCookie(this.$parent.cookieValue, this.$parent.varRenttype);
            }
        }
    });
    Vue.component('forwarddrapList', {
        replace: true,
        props: [],
        template: '<div id="directionDrap" class="sf-maskFixed">'
        + '<div class="sf-bdmenu"><div class="tt"> <div class="cancel" v-on:click="cancle">取消</div><div class="info">选择朝向</div>'
        + '<div id="directionDrapCon" class="con">'
        + '<li-list :todos="todos" v-bind:fill="fill"></li-list>'
        + '</div></div>',
        data: function () {
            var todos = [
                {text: '南北'},
                {text: '南'},
                {text: '东南'},
                {text: '西南'},
                {text: '北'},
                {text: '西'},
                {text: '东西'},
                {text: '西北'},
                {text: '东北'}
            ];
            return {
                todos: todos,
                fill: function (index) {
                    this.$dispatch('modify-forwardval', this.todos[index].text);
                }
            };
        },
        methods: {
            cancle: function () {
                this.$parent.showForward = false;
            }
        }
    });
    Vue.component('payinfodrapList', {
        replace: true,
        props: [],
        template: '<div id="payWayDrap" class="sf-maskFixed">'
        + '<div class="sf-bdmenu"><div class="tt"> <div class="cancel" v-on:click="cancle">取消</div><div class="info">选择支付方式</div>'
        + '<div id="payWayDrapCon" class="con">'
        + '<li-list :todos="todos" v-bind:fill="fill"></li-list>'
        + '</div></div>',
        data: function () {
            var todos = [
                {text: '押一付三'},
                {text: '押一付二'},
                {text: '押一付一'},
                {text: '半年付'},
                {text: '年付'},
                {text: '面议'}
            ];
            return {
                todos: todos,
                fill: function (index) {
                    this.$dispatch('modify-payinfoval', this.todos[index].text);
                }
            };
        },
        methods: {
            cancle: function () {
                this.$parent.showPayinfo = false;
            }
        }
    });
    Vue.component('decorationdrapList', {
        replace: true,
        props: [],
        template: '<div id="decorationDrap" class="sf-maskFixed">'
        + '<div class="sf-bdmenu"><div class="tt"> <div class="cancel" v-on:click="cancle">取消</div><div class="info">选择装修程度</div>'
        + '<div id="decorationDrapCon" class="con">'
        + '<li-list :todos="todos" v-bind:fill="fill"></li-list>'
        + '</div></div>',
        data: function () {
            var todos = [
                {text: '豪华装修'},
                {text: '精装修'},
                {text: '简单装修'},
                {text: '毛坯'}
            ];
            return {
                todos: todos,
                fill: function (index) {
                    this.$dispatch('modify-decorationval', this.todos[index].text);
                }
            };
        },
        methods: {
            cancle: function () {
                this.$parent.showDecoration = false;
            }
        }
    });

    Vue.component('sexSelect', {
        replace: true,
        props: [],
        template: '<div class="radioBox"><a v-for="todo in todos" href="javascript:void(0);" class="{{todo.cla}}" v-on:click="changeSex($index)">{{todo.text}}</a></div>',
        data: function () {
            if (this.$parent.gender === '女士') {
                var classGile = 'active'
                var classBoy = ''
            } else {
                var classGile = ''
                var classBoy = 'active'
            }
            var todos = [{text: '先生',cla: classBoy}, {text: '女士',cla: classGile}];
            return {
                todos: todos
            };
        },
        methods: {
            changeSex: function (index) {
                if(!this.$parent.canClick){
                    return false;
                }
                this.todos[0].cla = '';
                this.todos[1].cla = '';
                this.todos[index].cla = 'active';
                this.$parent.gender = this.todos[index].text;
                this.$parent.cookieValue.gender = this.$parent.gender;
                transCookie(this.$parent.cookieValue, this.$parent.varRenttype);
            }
        }
    });
});