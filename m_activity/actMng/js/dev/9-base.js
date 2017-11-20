/**
 * @authors fenglinzeng (fenglinzeng@fang.com)
 * @date    2016-10-31 15:37:49
 * @version $0.1$
 * @about   一期的代码比较乱，想到一点功能需求就写一点，先别嫌弃。
 */

$(document).ready(function ($) {
    var gVar = {
        // siteUrl = 'http://127.0.0.1:3200/';
        siteUrl: 'http://192.168.220.191:3200/',
        labels: JSON.parse($('#labels').val()),
        // 因为首屏数据由后台输出，所以从第二页开始请求数据
        page: 2,
        // 用变量避免重复触发加载
        isLoaded: true,
        // 是否编辑模式，如果点编辑，设为true，如果点发布，设为false
        isEdit: false,
        // 实例化模态框
        modal: new Modal($('#imgUrl').val()),
        // 键盘操作
        inputFocused: false,
        selectListIndex: -1
    };

    // 把所有技术插入到下拉列表里
    function initLabelSelect() {
        var labelHTML = '';
        for (var a in gVar.labels) {
            if ({}.hasOwnProperty.call(gVar.labels, a)) {
                labelHTML += '<li class="filterItem" filter-id="' + gVar.labels[a].id + '">' + gVar.labels[a].name + '</li>';
            }
        }
        labelHTML = '<li class="filterItem" filter-id="">' + '所有' + '</li>' + labelHTML;
        $('#labelDrop').html(labelHTML);
    }

    function bindKeyEv() {
        // 键盘操作
        $(window).on('keyup', function (event) {
            if (gVar.inputFocused) {
                // 回车
                if (event.keyCode === 13) {
                    var inputFilter = $('#inputFilter');
                    var userInput = inputFilter.val();
                    inputFilter.val('');
                    var insertHTML = '';
                    if (userInput) {
                        insertHTML = '<span class="tag removeAble imnew">' + userInput + '</span>';
                    }else {
                        var $this = $('#labelSelect').find('li.active');
                        var name = $this.html();
                        var color = $this.data('color');
                        var id = $this.data('id');
                        insertHTML = '<span class="tag removeAble" data-id="' + id + '" style="background-color:' + color + '">' + name + '</span>';
                    }
                    $(insertHTML).insertBefore('.dropInput');
                    $('#labelSelect').html('').hide();
                }
                // 方向下键
                if (event.keyCode === 40) {
                    gVar.selectListIndex++;
                    $('#labelSelect').find('li').removeClass('active').eq(gVar.selectListIndex).addClass('active');
                }
                // 方向上键
                if (event.keyCode === 38) {
                    gVar.selectListIndex--;
                    $('#labelSelect').find('li').removeClass('active').eq(gVar.selectListIndex).addClass('active');
                }
            }
        });
    }

    /**
     * [datePicker 调用调用日期选择器]
     * @param  {[type]}  placeholder [日期显示DOM]
     * @param  {Boolean} isSingle    [是否单选]
     * @param  {[type]}  triggerID   [触发的ID，和placeholder都可以触发]
     * @param  {[type]}  shortOpr    [是否快捷操作]
     * @param  {[type]}  succFn      [确定的回调]
     * @param  {[type]}  clearFn     [清除的回调]
     */
    function datePicker(placeholder, isSingle, triggerID, shortOpr, succFn, clearFn) {
        var d = new Date();

        var userTime = $('#' + placeholder).html();
        var formatedTime = formatTime(userTime);
        var startTime,endTime;
        // 如果时间容器里有时间，则使用容器里的时间，否则js取时间
        if (userTime) {
            // 如果是时间段
            if (formatedTime.indexOf('/') !== -1) {
                startTime = formatedTime.split('/')[0];
                endTime = formatedTime.split('/')[1];
            }else {
            // 如果是时间点
                startTime = formatedTime;
                endTime = formatedTime;
            }
        }else {
            if (isSingle && shortOpr) {
                startTime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + (d.getDate() < 10 ? '0' + d.getDate() : d.getDate());
            }else {
                startTime = d.getFullYear() + '-' + d.getMonth() + '-' + (d.getDate() < 10 ? '0' + d.getDate() : d.getDate());
            }
            endTime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + (d.getDate() < 10 ? '0' + d.getDate() : d.getDate());
        }

        var dateRange = new pickerDateRange(placeholder, {
            isTodayValid: true,
            isSingleDay: isSingle,
            startDate: startTime,
            endDate: endTime,
            inputTrigger: triggerID,
            magicSelect: false,
            shortOpr: shortOpr,
            success: function (obj) {
                succFn && succFn(obj);
            },
            clear: function () {
                clearFn && clearFn();
            }
        });
    }


    function binLogin() {
        // 登录
        $('#userLog').on('click', function (event) {
            event.stopPropagation();
            gVar.modal.loginBox();
        });
    }

    function bindPostNew() {
        // 右上角发布按钮
        $('#postNew').on('click', function (event) {
            event.stopPropagation();
            gVar.isEdit = false;
            gVar.modal.postNew(postNewInitFn);
        });
    }

    // 发布模态框初始化
    function postNewInitFn() {
        // 发布按钮
        $('#post').on('click', function () {
            var id = $(this).attr('data-id');
            postNewFn(id);
        });

        // 预览按钮
        var viewURL = $('#viewURL');
        var viewBtn = $('#view');
        viewBtn.on('click', function () {
            var inputURL = formatURL(viewURL.val());
            $('.showBox').html('<iframe src="' + inputURL + '" width="280" height="498"></iframe>');
        });

        var techName, techHTML = '';
        // 下拉列表ul
        var techList = $('#labelSelect');
        // 输入框
        var inputFilter = $('#inputFilter'),
            userInput = inputFilter.val(),
            subInput;

        /**
         * [filterInput 根据输入内容筛选匹配内容插入列表]
         * @param  {[num]} inputLen [输入的长度]
         */
        function filterInput(inputLen) {
            if (userInput) {
                subInput = userInput.substring(0, inputLen);
                techHTML = '';
                for (var a in gVar.labels) {
                    if ({}.hasOwnProperty.call(gVar.labels, a)) {
                        techName = gVar.labels[a].name.substring(0, inputLen);
                        if (techName === subInput) {
                            techHTML += '<li data-id="' + gVar.labels[a].id + '" data-color="' + gVar.labels[a].color + '">' + gVar.labels[a].name + '</li>';
                        }
                    }
                }
                techList.html(techHTML).show();
            }
        }

        // 技术输入时弹出下拉筛选，点击时根据已经输入内容弹出下拉筛选
        inputFilter.on('input click', function () {
            userInput = inputFilter.val().toLowerCase().trim();
            var inputLen = userInput.length;
            // 如果没有输入，则插入所有选项
            if (inputLen === 0) {
                var labels = getAllLabelToList();
                techList.html(labels).show();
            }
            filterInput(inputLen);
            gVar.selectListIndex = -1;
        // 失焦或者获得焦点时，gVar.inputFocused是判断是否可以用键盘操作的开关变量
        }).on('focus', function () {
            gVar.inputFocused = true;
        }).on('blur', function () {
            gVar.inputFocused = false;
        });

        // 选中下拉筛选后
        techList.on('click', 'li', function () {
            var $this = $(this);
            var name = $this.html();
            var color = $this.data('color');
            var id = $this.data('id');
            // 清空输入框
            inputFilter.val('');
            // 清空并隐藏下拉列表
            techList.html('').hide();
            // 重置列表序号（键盘操作）
            gVar.selectListIndex = -1;
            $('<span class="tag removeAble" data-id="' + id + '" style="background-color:' + color + '">' + name + '</span>').insertBefore('.dropInput');
        });

        // 如果inputFace下的label有.removeAble，就是可以删除的label
        $('.inputFace').on('click', '.removeAble', function () {
            $(this).remove();
        });

        var timer;
        // 输入框鼠标移开时清空下拉筛选列表
        techList.on('mouseout', function () {
            timer = setTimeout(function () {
                techList.html('').hide();
            },500);
        }).on('mouseover', function () {
            clearTimeout(timer);
        });

        // 开发时长和上线时间的时间选择器调用
        datePicker('devTime',false,'devTimeTrigger',false);
        datePicker('pubTime',true,'pubTimeTrigger',true);
    }

    // 发布或者修改按钮点击后
    function postNewFn(thisid) {
        var id = thisid || '';
        if (id === 'undefined') {
            id = '';
        }

        // 因为是发布，所以默认用发布方法和发布提示文字
        var submitController = 'ajaxPublish';
        var succSlogan = '发布成功';
        // 如果是编辑模式，则修改为编辑方法和编辑提示文字
        if (gVar.isEdit) {
            succSlogan = '修改成功';
            submitController = 'ajaxUpdateById';
        }

        // 获取所有的技术label
        var inputLabels = getExistedLabels();
        var labels = inputLabels.existed;
        var addLabels = inputLabels.newAdd || '';

        // 获取时间
        var timeArr = $('#devTime').html().trim().split('至');
        var begintime = slashTime(timeArr[0]);
        var endtime = slashTime(timeArr[1]);
        var uptime = slashTime($('#pubTime').html());

        // 获取所有的填写内容
        var name = $('#actName').val().trim();
        var author = $('input#fe').val().trim();
        var backstage = $('input#be').val().trim();
        var product = $('input#pm').val().trim();
        var introduction = $('#introduction').val();

        // 处理url
        var testUrl = $('#testURL').val().trim();
        var formalUrl = $('#viewURL').val().trim();
        testUrl = formatURL(testUrl);
        formalUrl = formatURL(formalUrl);

        // 判断是否为空
        if (!name) {
            $.showLoading('活动名称不能为空',true);
            return false;
        }else if (!author) {
            $.showLoading('前端不能为空',true);
            return false;
        }else if (!backstage) {
            $.showLoading('后端不能为空',true);
            return false;
        }else if (!product) {
            $.showLoading('产品不能为空',true);
            return false;
        }else if (!labels) {
            $.showLoading('技术不能为空',true);
            return false;
        }else if (!formalUrl) {
            $.showLoading('正式地址不能为空',true);
            return false;
        }else if (!testUrl) {
            $.showLoading('测试地址不能为空',true);
            return false;
        }else if (!begintime) {
            $.showLoading('开始时间不能为空',true);
            return false;
        }else if (!endtime) {
            $.showLoading('结束时间不能为空',true);
            return false;
        }else if (!uptime) {
            $.showLoading('上线不能为空',true);
            return false;
        }else if (!isURL(formalUrl)) {
            $.showLoading('正式地址不标准',true);
            return false;
        }else if (!isURL(testUrl)) {
            $.showLoading('测试地址不标准',true);
            return false;
        }

        // 如果是编辑模式
        if (gVar.isEdit) {
            // 弹出输入密码
            gVar.modal.prompt('修改验证','请输入密码',function (txt) {
                // 点击确定后，向后台发送数据
                postAjax(txt);
            },function () {
                // 点击取消
                $.showLoading('取消了',true);
                return false;
            });
        }else {
            // 如果不是编辑模式，就是发布模式，密码为空
            postAjax('');
        }

        function postAjax(pwd) {
            $.ajax({
                url: gVar.siteUrl + 'act/?c=actmng&a=' + submitController,
                type: 'post',
                dataType: 'json',
                async: false,
                data: {
                    // c: 'actmng',
                    // a: submitController,
                    name: name,
                    author: author,
                    backstage: backstage,
                    product: product,
                    labels: labels,
                    testUrl: testUrl,
                    formalUrl: formalUrl,
                    begintime: begintime,
                    endtime: endtime,
                    uptime: uptime,
                    introduction: introduction,
                    addLabels: addLabels,
                    id: id,
                    pwd: pwd
                }
            })
            .done(function (data) {
                if (data.code === '100') {
                    gVar.modal.alert('提示',succSlogan,function () {
                        location.reload();
                    });
                }else {
                    gVar.modal.alert(data.msg);
                }
            })
            .fail(function (data) {
                gVar.modal.alert('网络错误：' + data.statusText);
            });
        }
    }

    function openItem() {
        // 查看活动详情
        $('.listBox').on('click', '.openItem', function () {
            // 获取该项的id
            var id = $(this).parents('.listItem').attr('data-id');
            // 根据id去后台取对应的详细数据
            var info = ajaxGetSingleInfo(id);
            // 先根据正式站地址把地址做编码处理，配合 http://u.fang.com/qrcode.php?url= 使用
            var qrCode = encodeURIComponent(info.formalUrl);
            // 获取到的label是一个字符串，拆成数组
            var labelsArr = info.labels.split(',');
            // 然后遍历这个labels数组拼接成html
            var labelsHTML = '';
            for (var i = 0,labelLen = labelsArr.length; i < labelLen; i++) {
                labelsHTML += '<span class="tag" style="background-color:' + getLabelColorByID(labelsArr[i]) + '">' + getLabelNameByID(labelsArr[i]) + '</span>';
            }
            // 判断url是否带有http或者https，如果没带的话就加上
            var formalUrl = formatURL(info.formalUrl);
            var testUrl = formatURL(info.testUrl);
            // 把内容转换成markdown内容
            var markedIntro = marked(info.introduction);
            // 调用gVar.modal.ItemInfo方法根据获取到的数据弹出详情页
            gVar.modal.ItemInfo(info.name,formalUrl,labelsHTML,info.product,info.author,info.backstage,parseTime(info.begintime),parseTime(info.endtime),parseTime(info.uptime),testUrl,markedIntro,qrCode);
        });
    }

    function dropListInit() {
        // 列表页筛选下拉列表的点击显示隐藏
        $('.filterTitle').on('click', function (event) {
            // 阻止冒泡
            event.stopPropagation();
            var thisList = $(this).siblings('.filterList');
            // 隐藏除了点击的该项列表以外的列表
            $('.filterList').not(thisList).hide();
            // 然后显示该项的列表
            thisList.fadeIn(100);
        });
        // 列表页筛选下拉列表选中某项后
        $('.filterList').on('click', '.filterItem', function () {
            var $this = $(this);
            // 下拉列表的单项点击以后，首先隐藏整个列表，然后表头文字改成选中项的文字，同时表头属性filter-id改成选中的filter-id（筛选时从此获取id）
            $this.parents('.filterList').hide().siblings('.filterTitle').text($this.text()).attr('filter-id', $this.attr('filter-id'));
            // 获取数据并插入列表
            appendList(1,true);
        });

        // 如果点击目标不是下拉菜单，隐藏下拉菜单
        $('body').not('.filterBox').on('click', function () {
            $('.filterList').hide();
        });

        // 列表页点击日期选择器后，隐藏所有的下拉列表
        $('#dateRange').on('click', function () {
            $('.filterList').hide();
        });
    }

    /**
     * [showDate 列表右上角筛选时间后显示时间]
     * @param  {[type]} obj [时间选择器带的参数]
     */
    function showDate(obj) {
        var startDate = slashTime(obj.startDate);
        var endDate = slashTime(obj.endDate);
        $('.timeTip').removeClass('active').html(startDate + '<br>' + endDate).addClass('active');
        appendList(1,true);
    }

    /**
     * [hideDate 清除选择的时间后隐藏时间tip]
     */
    function hideDate() {
        $('.timeTip').removeClass('active');
        appendList(1,true);
    }

    // 列表页调用时间选择器
    datePicker('dateRange',false,'dateRange',false,showDate,hideDate);

    function listRemoveBtn() {
        // 列表页删除按钮回调
        $('#listContent').on('click', '.remove', function () {
            var $that = $(this);
            // 获取删除项的id
            var id = $that.parents('.listItem').attr('data-id');
            // 弹出确认删除窗口并提示输入密码
            gVar.modal.prompt('删除验证','请输入密码',function (txt) {
                // 获取输入的密码
                var psw = txt;
                // ajax给后台删除项id和密码
                $.ajax({
                    url: gVar.siteUrl + 'act/',
                    type: 'get',
                    dataType: 'json',
                    data: {
                        c: 'actmng',
                        a: 'ajaxRemoveById',
                        id: id,
                        pwd: psw
                    }
                })
                .done(function (data) {
                    // 提示文字
                    gVar.modal.alert(data.msg);
                    // 如果删除成功，前台删除该项
                    if (data.code === '100') {
                        $that.parents('.listItem').remove();
                    }
                })
                .fail(function (data) {
                    gVar.modal.alert('网络错误：' + data.statusText);
                });
            },function () {
                $.showLoading('取消',true);
            });
        });
    }

    function listEditBtn() {
        // 列表页编辑按钮回调
        $('#listContent').on('click', '.edit', function () {
            // gVar.isEdit是一个全局变量，判断是否是编辑模式（因为编辑和发布公用一个gVar.modal层）
            gVar.isEdit = true;
            // 获取编辑项的id
            var id = $(this).parents('.listItem').attr('data-id');
            // 去后台取该项的详细信息
            var info = ajaxGetSingleInfo(id);

            // 获取到的label是一个字符串，拆成数组
            var techArr = info.labels.split(',');
            // 拼接labels
            var techHTML = '';
            for (var i = 0,techLen = techArr.length; i < techLen; i++) {
                if (techArr[i] === '') {
                    techHTML += '<span class="tag removeAble">' + '数据有误' + '</span>';
                }else {
                    techHTML += '<span class="tag removeAble" data-id="' + techArr[i] + '" style="background-color:' + getLabelColorByID(techArr[i]) + '">' + getLabelNameByID(techArr[i]) + '</span>';
                }
            }
            // 验证url是否带有http，没带就加上
            var prodURL = formatURL(info.formalUrl);
            var testURl = formatURL(info.testUrl);

            gVar.modal.postNew(postNewInitFn,info.name,prodURL,techHTML,info.product,info.author,info.backstage,parseTime(info.begintime),parseTime(info.endtime),parseTime(info.uptime),testURl,info.introduction,id,gVar.isEdit);
        });
    }

    // // 点击label后高亮同类label
    // $('.listBox').on('click', '.tag', function (event) {
    //     // event.preventDefault();
    //     event.stopPropagation();
    //     $.showLoading('点击了标签。需求待定',true);
    // });

    // 无限滚动加载
    function appendList(page,innerHTML) {
        // 开始加载
        gVar.isLoaded = false;
        var reqPage = page;
        // 获取筛选列表的id，如果没有选的话就默认all
        var tech = $('#tech').attr('filter-id') ? $('#tech').attr('filter-id') : 'all';
        // 时间排序
        var timeOrder = $('#timeOrder').attr('filter-id');
        // 获取时间，如果没有选择时间的话传空
        var time = $('.timeTip.active').html();
        var timeArr = time ? time.split('<br>') : '';

        // 小彩蛋，「我是有底线的」
        $('#bottomLine').remove();

        // 根据筛选数据去获取请求数据
        $.ajax({
            url: gVar.siteUrl + 'act/',
            type: 'get',
            dataType: 'json',
            data: {
                c: 'actmng',
                a: 'ajaxGetActList',
                technology: tech,
                page: reqPage,
                sort: timeOrder,
                timeStart: timeArr[0],
                timeEnd: timeArr[1]
            }
        })
        .done(function (data) {
            // 如果请求到数据
            if (data.code === '100') {
                var html = '';
                for (var i = 0; i < data.actlist.length; i++) {
                    var labels = '';
                    // 首先拼接labels
                    for (var j = 0; j < data.actlist[i].labels.length; j++) {
                        if (data.actlist[i].labels[j]) {
                            labels += '<span class="tag" data-color="" style="background:' + data.actlist[i].labels[j].color + '">' + data.actlist[i].labels[j].name + '</span>';
                        }else {
                            labels += '';
                        }
                    }
                    // 然后处理一下时间，换成年月日形式显示
                    var uptime = parseTime(data.actlist[i].uptime);
                    html += '<li class="listItem" data-id="' + data.actlist[i].id + '">'
                                + '<div class="hasHash">'
                                    + '<a href="javascript:void(0)" class="openItem">'
                                        + '<b>' + data.actlist[i].name + '</b>'
                                        + labels
                                        + '<ul>'
                                            + '<li>作者：' + data.actlist[i].author + '</li>'
                                            + '<li>上线日期：' + uptime + '</li>'
                                        + '</ul>'
                                    + '</a>'
                                    + '<div class="tools"><i class="edit">修改</i><i class="remove">删除</i></div>'
                                + '</div>'
                            + '</li>';
                }
                // appendList的第二个参数如果为true的话，使用innerHTML方法，否则append
                // 因为筛选查询和无限下拉公用这个函数方法
                if (innerHTML) {
                    $('#listContent').html(html);
                }else {
                    $('#listContent').append(html);
                }
                // 加载完成
                gVar.isLoaded = true;
            }else {
                // 加载完成
                gVar.isLoaded = false;
                // 如果数据加载完了或者返回不正常，显示返回的文字
                gVar.modal.alert(data.msg);
                // 同时显示彩蛋
                $('main').append('<p id="bottomLine" style="text-align:center;color:#ccc">我是有底线的</p>');
            }
        })
        .fail(function (data) {
            gVar.modal.alert('网络错误：' + data.statusText);
        });
    }

    function bindInfinite() {
        // 无限下拉
        // 给body绑定无限下拉，调用获取列表
        $('body').infinite(0).on('infinite', function () {
            if (gVar.isLoaded) {
                appendList(gVar.page);
                gVar.page++;
            }
        });
    }

    /**
     * [ajaxGetSingleInfo 获取单条活动数据]
     * @param  {[number]} id [活动id]
     * @return {[obj]}    [获取到的数据]
     */
    function ajaxGetSingleInfo(id) {
        var info = '';
        $.ajax({
            url: gVar.siteUrl + 'act/',
            type: 'get',
            dataType: 'json',
            async: false,
            data: {
                c: 'actmng',
                a: 'ajaxGetById',
                id: id
            }
        })
        .done(function (data) {
            if (data.code !== '100') {
                gVar.modal.alert(data.msg);
            }else{
                info = data.data[0];
            }
        })
        .fail(function (data) {
            gVar.modal.alert('网络错误：' + data.statusText);
        });
        return info;
    }

    /**
     * [parseTime 处理时间格式]
     * @param  {[str]} time [后台返回的时间格式（2016-08-04T16:00:00.000Z）]
     * @return {[str]}      [2016年08月04]
     */
    function parseTime(time) {
        var uptimeArr = time.split('T')[0].split('-');
        var uptime = uptimeArr[0] + '年' + uptimeArr[1] + '月' + uptimeArr[2] + '日';
        return uptime;
    }

    /**
     * [formatTime 格式化时间]
     * @param  {[str]} time [从html里取到的时间（2016年08月04）]
     * @return {[str]}      [2016-08-04]
     */
    function formatTime(time) {
        time = time.replace(/年/g,'-').replace(/月/g,'-').replace(/日/g,'').replace(/至/g,'/');
        return time;
    }

    /**
     * [slashTime 格式化时间]
     * @param  {[str]} time [2016-08-04]
     * @return {[str]}      [2016/08/04]
     */
    function slashTime(time) {
        return time.replace(/-/g,'/');
    }

    /**
     * [getLabelColorByID 根据label的ID获取颜色]
     * @param  {[str]} id [label的id]
     * @return {[str]}    [label的颜色rgba]
     */
    function getLabelColorByID(id) {
        var rgb = '';
        // 传进来的id是字符传，需要转换成数字
        var labelID = id * 1;
        for (var a in gVar.labels) {
            if (labelID === gVar.labels[a].id) {
                rgb = gVar.labels[a].color;
            }
        }
        return rgb;
    }

    /**
     * [getLabelNameByID 根据label的ID获取名字]
     * @param  {[str]} id [label的id]
     * @return {[str]}    [label的名字]
     */
    function getLabelNameByID(id) {
        var labelName = '';
        // 传进来的id是字符传，需要转换成数字
        var labelID = id * 1;
        for (var a in gVar.labels) {
            if (labelID === gVar.labels[a].id) {
                labelName = gVar.labels[a].name;
            }
        }
        return labelName;
    }

    /**
     * [getAllLabelToList 拼接所有的label]
     * @return {[str]} [拼接好的html]
     */
    function getAllLabelToList() {
        var labelListHTML = '';
        for (var a in gVar.labels) {
            if ({}.hasOwnProperty.call(gVar.labels, a)) {
                labelListHTML += '<li data-id="' + gVar.labels[a].id + '" data-color="' + gVar.labels[a].color + '">' + gVar.labels[a].name + '</li>';
            }
        }
        return labelListHTML;
    }

    /**
     * [getExistedLabels 提交时获取输入的label]
     * @return {[obj]} [existed是数据库中已经存在的，newAdd是数据库中没有的]
     */
    function getExistedLabels() {
        var existed = [],
            newAdd = [];
        $('.inputFace').find('.tag').each(function () {
            if (!$(this).hasClass('imnew')) {
                existed.push($(this).attr('data-id'));
            }else {
                newAdd.push($(this).html());
            }
        });
        return {
            existed: existed.join(),
            newAdd: newAdd.join()
        };
    }

    /**
     * [isURL 判断是否是标准url]
     * @param  {[str]}  url [要判断的url]
     * @return {Boolean}     [是否是标准的url]
     */
    function isURL(url) {
        // 在JavaScript中，正则表达式只能使用 / 开头和结束，不能使用双引号
        // 判断url地址的正则表达式为:http(s)?://([\w-]+\.)+[\w-]+(/[\w- ./?%&=]*)?
        // 下面的代码中应用了转义字符"\"输出一个字符"/"
        var isUrlExp = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
        return isUrlExp.test(url);
    }

    /**
     * [formatURL 判断url是否带http]
     * @param  {[type]} url [要判断的url]
     * @return {[type]}     [处理好的url]
     */
    function formatURL(url) {
        var curl = url;
        if (curl.indexOf('//') === -1) {
            curl = 'http://' + curl;
        }else if (curl.indexOf('http:') === -1 && curl.indexOf('https:') === -1) {
            curl = 'http:' + curl;
        }
        return curl;
    }

    function init() {
        initLabelSelect();
        bindInfinite();
        listEditBtn();
        listRemoveBtn();
        dropListInit();
        openItem();
        bindPostNew();
        binLogin();
        bindKeyEv();
    }
    init();
});
