/**
 * [modal ItemInfo]
 */

function Modal(imgUrl) {
    this.imgUrl = imgUrl;
    this.defaults = {
        // 显示标题
        title: '提示',
        // 显示内容
        text: '',
        // 确定按钮文字
        buttonOK: '确定',
        // 取消按钮文字
        buttonCancel: '取消',
        // 需要传入哪些按钮
        buttons: [{
            text: '确定',
            className: 'primary'
        }],
        autoClose: true
    };
}

Modal.prototype = {
    closeModal: function (cls) {
        $('#' + cls).removeClass('boxVisible zui_dialog_visible').transitionEnd(function () {
            $(this).remove();
        });
        $('#mask_' + cls).removeClass('maskVisible').transitionEnd(function () {
            $(this).remove();
        });
    },
    alert: function (title,text,onOk) {
        var that = this;
        var defaults = jsonClone(that.defaults);
        defaults = {
            title: title,
            text: text,
            buttons: [{
                onClick: onOk,
                text: defaults.buttonOK,
                className: 'primary'
            }]
        };
        var buttons = defaults.buttons;

        var buttonsHtml = buttons.map(function (d, i) {
            return '<a href="javascript:;" class="zui_btn_dialog ' + d.className + '">' + d.text + '</a>';
        }).join('');

        var time = new Date().getTime();
        var tpl = '<div class="zui_dialog" id="' + time + '">'
                    + '<div class="zui_dialog_hd"><strong class="zui_dialog_title">' + title + '</strong></div>'
                    + (text ? '<div class="zui_dialog_bd">' + text + '</div>' : '')
                    + '<div class="zui_dialog_ft">' + buttonsHtml + '</div>'
                + '</div>';
        var $tpl = $(tpl);
        $('<div class="mask" style="z-index:102" id="mask_' + time + '"></div>').appendTo(document.body).show().addClass('maskVisible');
        $tpl.appendTo('body').show().addClass('zui_dialog_visible');
        $tpl.find('.zui_btn_dialog').each(function (i,e) {
            var el = $(e);
            el.click(function () {
                that.closeModal(time);
                if (buttons[i].onClick) {
                    buttons[i].onClick.call($tpl);
                }
            });
        });
    },
    // ItemInfo: function (title,prodURL,tech,pm,frontEnd,backEnd,startTime,endTime,upTime,testURL,intro,qrCode) {
    postNew: function (callback,title,prodURL,tech,pm,frontEnd,backEnd,startTime,endTime,upTime,testURL,intro,id,isEdit) {
        var that = this;
        title = title || '';
        prodURL = prodURL || '';
        tech = tech || '';
        pm = pm || '';
        frontEnd = frontEnd || '';
        backEnd = backEnd || '';
        startTime = startTime || '';
        endTime = endTime || '';
        upTime = upTime || '';
        testURL = testURL || '';
        intro = intro || '';
        var to = '';
        if (startTime && endTime) {
            to = '至'
        }
        var btnTxt = '发布';
        if (id) {
            btnTxt = '修改';
        }
        var show = '<img src="' + that.imgUrl + 'actMng/images/demoTip.png"/>';
        if (isEdit) {
            show = '<iframe src="' + prodURL + '" width="280" height="498"></iframe>';
        }
        // console.log(startTime)
        // console.log(endTime)
        // console.log(upTime)
        var time = new Date().getTime();
        var tpl = '<div class="itemShowBox addNew" id="' + time + '">'
                    + '<div class="showBoxInner">'
                        + '<div class="showBoxHeader">'
                            + '<h3>输入活动地址：</h3>'
                            + '<input type="text" placeholder="活动的正式地址，要带上 http:// 哟" style="width:500px" id="viewURL" value="' + prodURL + '">'
                            + '<span class="btn" id="view">预览</span>'
                            + '<span class="btn" style="float:right;cursor:pointer" id="post" data-id="' + id + '">' + btnTxt + '</span>'
                            + '<span class="closeBtn btn disable">取消</span>'
                        + '</div>'
                        + '<div class="showBoxBody">'
                            + '<div class="showBox">'
                                + show
                            + '</div>'
                            + '<div class="showInfo">'
                                + '<div class="mb1em">活动名称：<input type="" name="" placeholder="活动名称" value="' + title + '" id="actName"></div>'
                                + '<div class="showBoxTags mb1em">技术框架：'
                                    + '<div class="inputFace">'
                                        // + '<input class="zuiCheck" type="checkbox" id="CSS3"/>'
                                        // + '<label for="CSS3" class="changeColor" data-color="08c">CSS3</label>'
                                        // + '<input class="zuiCheck" type="checkbox" id="Canvas"/>'
                                        // + '<label for="Canvas" class="changeColor" data-color="33cc33">Canvas</label>'
                                        // + '<input class="zuiCheck" type="checkbox" id="orientation"/>'
                                        // + '<label for="orientation" class="changeColor" data-color="66cc33">重力感应</label>'
                                        // + '<input class="zuiCheck" type="checkbox" id="css1"/>'
                                        // + '<label for="css1" class="changeColor" data-color="08c">css1</label>'
                                        // + '<input class="zuiCheck" type="checkbox" id="css2"/>'
                                        // + '<label for="css2" class="changeColor" data-color="33cc33">css2</label>'
                                        // + '<input class="zuiCheck" type="checkbox" id="css4"/>'
                                        // + '<label for="css4" class="changeColor" data-color="66cc33">css4</label>'
                                        // + '<input class="zuiCheck" type="checkbox" id="css5"/>'
                                        // + '<label for="css5" class="changeColor" data-color="08c">css5</label>'
                                        // + '<input class="zuiCheck" type="checkbox" id="666666666666"/>'
                                        // + '<label for="666666666666" class="changeColor" data-color="33cc33">666666666666</label>'
                                        // + '<input class="zuiCheck" type="checkbox" id="12123131123131"/>'
                                        // + '<label for="12123131123131" class="changeColor" data-color="66cc33">12123131123131</label>'
                                        // + '<input class="zuiCheck" type="checkbox" id="css8"/>'
                                        // + '<label for="css8" class="changeColor" data-color="08c">css8</label>'
                                        // + '<input class="zuiCheck" type="checkbox" id="css9"/>'
                                        // + '<label for="css9" class="changeColor" data-color="33cc33">css9</label>'
                                        // + '<input class="zuiCheck" type="checkbox" id="css0"/>'
                                        // + '<label for="css0" class="changeColor" data-color="cc66cc">css0</label>'
                                        + tech
                                        + '<span class="dropInput"><input type="text" id="inputFilter" style="border: 0;height: 18px;margin-right:0;" placeholder="输入或选择"><ul id="labelSelect"></ul></span>'
                                    + '</div>'
                                + '</div>'
                                + '<div class="mb1em">产品策划：<input type="" name="" id="pm" style="width:150px;" placeholder="产品经理" value="' + pm + '"></div>'
                                + '<div class="mb1em">前端开发：<input type="" name="" id="fe" style="width:150px;" placeholder="前端开发" value="' + frontEnd + '"><span style="margin-left:1rem;">后台开发：<input type="" name="" id="be" style="width:150px;" placeholder="后台开发" value="' + backEnd + '"></span></div>'
                                + '<div class="mb1em">测试地址：<input type="" name="" id="testURL" placeholder="测试地址" style="width:525px" value="' + testURL + '"></div>'
                                + '<div class="mb1em">开发时长：<div class="ta_date"><span class="date_title" id="devTime">' + startTime + to + endTime + '</span><a class="opt_sel" id="devTimeTrigger" href="#"><i class="i_orderd"></i></a></div></div>'
                                + '<div class="mb1em">上线日期：<div class="ta_date"><span class="date_title" id="pubTime">' + upTime + '</span><a class="opt_sel" id="pubTimeTrigger" href="#"><i class="i_orderd"></i></a></div></div>'
                                + '<div class="infoContent">'
                                    + '技术介绍：<textarea name="" id="introduction" style="vertical-align: top;width: 525px" rows="8" placeholder="填写活动介绍（支持markdown哟~）" value="">' + intro + '</textarea>'
                                + '</div>'
                                // + '<div class="showInfoMore">'
                                //     + '<ul class="moreInfoTab">'
                                //         + '<li class="active">技术实现</li>'
                                //         + '<li>策划细节</li>'
                                //         + '<li>设计思路</li>'
                                //     + '</ul>'
                                //     + '<div class="moreInfoBox">'
                                //         + '<div class="moreItem active">'
                                //             + '<textarea name="" placeholder="技术实现"></textarea>'
                                //         + '</div>'
                                //         + '<div class="moreItem">'
                                //             + '<textarea name="" placeholder="策划细节"></textarea>'
                                //         + '</div>'
                                //         + '<div class="moreItem">'
                                //             + '<textarea name="" placeholder="设计思路"></textarea>'
                                //         + '</div>'
                                //     + '</div>'
                                // + '</div>'
                            + '</div>'
                        + '</div>'
                    + '</div>'
                + '</div>';
        var $tpl = $(tpl);

        $('<div class="mask" id="mask_' + time + '"></div>').appendTo(document.body).show().addClass('maskVisible');
        $tpl.appendTo('body').show().addClass('boxVisible');

        $('.closeBtn,.mask').on('click', function (event) {
            // event.preventDefault();
            event.stopPropagation();
            that.closeModal(time);
        });

        callback && callback();
    },
    loginBox: function () {
        var that = this;
        var time = new Date().getTime();
        var tpl = '<div class="loginBox" id="' + time + '">'
                    + '<div class="loginHeader">'
                        + '<h2>登录</h2>'
                    + '</div>'
                    + '<div class="loginBody">'
                        + '<input type="text" name="sfusername" placeholder="用户名">'
                        + '<input type="text" name="sfpassword" placeholder="密码">'
                        + '<div class="forget"><span class="lightBlue">忘记密码？</span></div>'
                    + '</div>'
                    + '<div class="loginFooter activeBtn">立即登录</div>'
                + '</div>';
        var $tpl = $(tpl);
        $('<div class="mask" id="mask_' + time + '"></div>').appendTo(document.body).show().addClass('maskVisible');
        $tpl.appendTo('body').show().addClass('boxVisible');

        $('.mask').on('click', function (event) {
            // event.preventDefault();
            event.stopPropagation();
            that.closeModal(time);
        });

        $('.forget').find('span').on('click', function (event) {
            // event.preventDefault();
            event.stopPropagation();
            $.showLoading('去找小谭子！',true);
        });
    },
    prompt: function (title,text,onOk,onCancel) {
        var that = this;
        var defaults = jsonClone(that.defaults);
        var time = new Date().getTime();
        defaults = {
            title: title,
            text: text,
            buttons: [{
                onClick: onCancel,
                text: defaults.buttonCancel,
                className: 'default'
            },{
                onClick: onOk,
                text: defaults.buttonOK,
                className: 'primary'
            }]
        };
        var buttons = defaults.buttons;

        var buttonsHtml = buttons.map(function (d, i) {
            return '<a href="javascript:;" class="zui_btn_dialog ' + d.className + '">' + d.text + '</a>';
        }).join('');

        text = '<p class="zui-prompt-text">' + (defaults.text || '') + '</p><input type="password" class="zui_input zui-prompt-input" id="zui-prompt-input" value="' + (defaults.input || '') + '" />';

        var tpl = '<div class="zui_dialog" id="' + time + '">'
                    + '<div class="zui_dialog_hd"><strong class="zui_dialog_title">' + title + '</strong></div>'
                    + (text ? '<div class="zui_dialog_bd">' + text + '</div>' : '')
                    + '<div class="zui_dialog_ft">' + buttonsHtml + '</div>'
                + '</div>';
        var $tpl = $(tpl);
        $('<div class="mask" id="mask_' + time + '" style="z-index:102"></div>').appendTo(document.body).show().addClass('maskVisible');
        $tpl.appendTo('body').show().addClass('zui_dialog_visible boxVisible');
        $tpl.find('.zui_btn_dialog').each(function (i,e) {
            var el = $(e);
            el.click(function () {
                var input = $('#zui-prompt-input').val();
                that.closeModal(time);
                if (buttons[i].onClick) {
                    buttons[i].onClick.call($tpl, input);
                }
            });
        });
    },
    ItemInfo: function (title,prodURL,tech,pm,frontEnd,backEnd,startTime,endTime,upTime,testURL,intro,qrCode) {
        var that = this;
        var time = new Date().getTime();
        var tpl = '<div class="itemShowBox" id="' + time + '">'
                    + '<div class="showBoxInner">'
                    + '<div class="showBoxHeader">'
                        + '<h3>' + title + '</h3>'
                        + '<span class="closeBtn">X</span>'
                    + '</div>'
                    + '<div class="showBoxBody">'
                        + '<div class="showBox">'
                            + '<iframe src="' + prodURL + '" width="280" height="498"></iframe>'
                        + '</div>'
                        + '<div class="showInfo">'
                            + '<h3>' + title + '</h3>'
                            + '<div class="showBoxTags">'
                                + '技术框架：'
                                + tech
                                // + '<span class="tag redTag">Canvas</span>'
                                // + '<span class="tag greenTag">重力感应</span>'
                                // + '<span class="tag yellowTag">拖拽</span>'
                            + '</div>'
                            + '<p>产品策划：' + pm + '</p>'
                            + '<p>前端开发：' + frontEnd + '</p>'
                            + '<p>后台开发：' + backEnd + '</p>'
                            + '<p>开发时间：' + startTime + ' 至 ' + endTime
                            + '<p>上线日期：' + upTime + '</p>'
                            + '<p>测试地址：' + testURL
                            + '<div class="infoContent" style="height: 210px;">'
                            + '技术介绍：' + intro
                            + '</div>'
                            // + '<div class="qrCodeBox"><div class="qrCode"><img src="http://u.fang.com/qrcode.php?url=http%3A%2F%2Fm.test.fang.com%2Fh5market%2Fnocopyb4dff12ffe39fb0f6ec87ab6e1%2F%3Fcity%3Dbj%26channel%3Dindustry%26source%3Dffdsdf&type=market&resize=180"></div><p class="hasClip" data-clipboard-text="' + iframe + '">蹩说话，点我</p></div>'
                            + '<div class="qrCodeBox"><div class="qrCode"><img src="http://u.fang.com/qrcode.php?url=' + qrCode + '&type=market&resize=180"></div><p class="hasClip" data-clipboard-text="' + prodURL + '">蹩说话，点我</p></div>'
                            // + '<div class="showInfoMore">'
                            //     + '<ul class="moreInfoTab">'
                            //         + '<li class="active">技术实现</li>'
                            //         + '<li>策划细节</li>'
                            //         + '<li>设计思路</li>'
                            //     + '</ul>'
                            //     + '<div class="moreInfoBox">'
                            //         + '<div class="moreItem active"><p>技术实现技术实现技术实现技术实现技术实现技术实现技术实现</p><p>技术实现技术实现技术实现技术实现技术实现技术实现技术实现</p><p>技术实现技术实现技术实现技术实现技术实现技术实现技术实现</p><p>技术实现技术实现技术实现技术实现技术实现技术实现技术实现</p><p>技术实现技术实现技术实现技术实现技术实现技术实现技术实现</p><p>技术实现技术实现技术实现技术实现技术实现技术实现技术实现</p><p>技术实现技术实现技术实现技术实现技术实现技术实现技术实现</p><p>技术实现技术实现技术实现技术实现技术实现技术实现技术实现</p><p>技术实现技术实现技术实现技术实现技术实现技术实现技术实现</p><p>技术实现技术实现技术实现技术实现技术实现技术实现技术实现</p><p>技术实现技术实现技术实现技术实现技术实现技术实现技术实现</p><p>技术实现技术实现技术实现技术实现技术实现技术实现技术实现</p><p>技术实现技术实现技术实现技术实现技术实现技术实现技术实现</p></div>'
                            //         + '<div class="moreItem"><p>策划细节策划细节策划细节策划细节策划细节策划细节策划细节</p><p>策划细节策划细节策划细节策划细节策划细节策划细节策划细节</p><p>策划细节策划细节策划细节策划细节策划细节策划细节策划细节</p></div>'
                            //         + '<div class="moreItem"><p>设计思路设计思路设计思路设计思路设计思路设计思路设计思路</p><p>设计思路设计思路设计思路设计思路设计思路设计思路设计思路</p></div>'
                            //     + '</div>'
                            // + '</div>'
                        + '</div>'
                    + '</div>'
                + '</div>'
                + '</div>';
        var $tpl = $(tpl);
        $('<div class="mask" id="mask_' + time + '"></div>').appendTo(document.body).show().addClass('maskVisible');
        $tpl.appendTo('body').show().addClass('boxVisible');

        $('.closeBtn,.mask').on('click', function (event) {
            // event.preventDefault();
            event.stopPropagation();
            that.closeModal(time);
        });


        // tab切换
        // $('.moreInfoTab').on('click', 'li', function (event) {
            // event.preventDefault();
        //     event.stopPropagation();
        //     var infoItem = $('.moreInfoBox').find('.moreItem');
        //     $(this).addClass('active').siblings().removeClass('active');
        //     var index = $(this).index();
        //     // infoItem.hide().eq(index).fadeIn();
        //     infoItem.removeClass('active').eq(index).addClass('active');
        // });

        // 复制链接
        var clipboard = new Clipboard('.hasClip');
        clipboard.on('success', function () {
            $.showLoading('活动地址复制成功',true);
        });
    }
};

/**
 * [jsonClone 比较tricky的伪深复制]
 * @param  {[type]} obj [被复制对象]
 * @return {[type]}     [复制完成对象]
 */
function jsonClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}