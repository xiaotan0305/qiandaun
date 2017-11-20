/**
 *问答UI改版 回答提交页
 * modified by zdl 2016-1-11
 * 邮箱地址（zhangdaliang@fang.com）
 */
define('modules/ask/postAsk',['jquery', 'modules/ask/yhxw'],function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 用于对该的ajax请求加锁 防止用户多次点击提交按钮 重复提交数据
        var flagBool = true;
        // +++++++++++++++++++++++++++++++++++
        // 页面浮沉提示
        // 获取浮层提示div
        var $promptId = $('#prompt');

        /**
         * 隐藏浮层提示函数
         */
        function hidePrompt() {
            setTimeout(function () {
                $promptId.hide();
            }, 2000);
        }

        /**
         * 执行浮层的提示与隐藏操作函数
         * @param content 浮层提示的内容
         */
        function PromptExecution(content) {
            $('#promptContent').html(content);
            $promptId.show();
            hidePrompt();
        }

        $('body').css('background-color', '#fff');
        require.async('https://static.soufunimg.com/common_m/m_recaptcha/js/app.js', function(){
            /*验证码初始化*/
            (function(window, $) {
                // 调用验证控件
                window.fCheck.init({
                    container: '.drag-content',
                    url: vars.askSite + '?c=ask&a=ajaxCodeInit',
                    callback: function() {
                        // 验证成功后的回调
                    }
                });
            })(this, jQuery);
        });

        // 获取用户回答的内容
        var $submitContentId = $('#submitContent');
        var tags = vars.tags;
        $(function () {
            $('.floatApp').css('display','none');
            $('footer').css('display','none');
        });

        /**
         * 设置焦点函数
         * @param obj 包含文本内容的div的id
         * 解决如果文本框中存在类容 焦点定位在文本的前面 而不是文本末尾的问题
         * 在非IE浏览器（Firefox、Safari、Chrome、Opera）下可以使用window.getSelection()获得selection对象
         */
        function getSelectPos(obj) {
            if (typeof obj === 'string') obj = document.getElementById(obj);
            obj.focus();
            // createTextRange ie支持的属性
            if (obj.createTextRange) {
                // ie
                var rtextRange = obj.createTextRange();
                rtextRange.moveStart('character', obj.value.length);
                rtextRange.collapse(true);
                rtextRange.select();
            } else if (obj.selectionStart) {
                // chrome "<input>"、"<textarea>"
                obj.selectionStart = obj.value.length;
            }else if (window.getSelection) {
                var sel = window.getSelection();
                var tempRange = document.createRange();
                tempRange.setStart(obj.firstChild, obj.firstChild.length);
                sel.removeAllRanges();
                sel.addRange(tempRange);
            }
        }
        // 通过localStorage获取上一条回答的数据
        var mycontent = localStorage.getItem('ask_after_content');
        // 如果localStorage里面有值则将内容写入文本狂并把焦点设置在文本内容的末尾
        if (mycontent || mycontent === '请描述您的问题，提高悬赏值，可以更快得到答案') {
            $submitContentId.text(mycontent);
            // 把焦点设置到文本的末尾
            getSelectPos('submitContent');
        } else {
            $submitContentId.one('focus',function () {
                $(this).text('');
            });
        }

        // 检测用户在输入框中输入的数据
        function checkLength() {
            // 获取提示div
            var reminder = $('#reminder');
            // var commentText = $submitContentId.text().trim();
            var textLength = $submitContentId.text().trim().length;
            if (textLength < 1) {
                reminder.html('0字');
            } else if (textLength >= 1 && textLength <= 140) {
                reminder.html(textLength + '字');
            } else if (textLength > 50) {
                var chaochu = textLength - 140;
                reminder.html('已超出' + chaochu + '字');
            }
        }
        $submitContentId.on('input', checkLength);
        // 设置悬赏积分和免费积分值
        var xuanshang = 0;
        var freePoints = 0;
        var finalPoints = 0;
        var $xsScoreId = $('#xuanshang_score');

        // 悬赏输入框获得焦点时清空输入框的数据
        $xsScoreId.on('focus',function () {
            $(this).val('');
        });

        // 悬赏输入框失去焦点时的处理
        $xsScoreId.on('blur',function () {
            // 判断悬赏积分是否为空，为空付值为0
            xuanshang = $xsScoreId.val() === '' ? 0 : parseInt($xsScoreId.val());
            $(this).val(xuanshang);
            // 判断悬赏分用户输入的是不是数字,且不能为负数
            if (xuanshang >= 0) {
                finalPoints = xuanshang + freePoints;
                if (finalPoints > 0) {
                    $('#postButton').html('提交(共悬赏' + finalPoints + '积分)');
                }else {
                    $('#postButton').html('提交');
                }
            } else {
                PromptExecution('积分不可以小于0！');
                $(this).val('0');
            }
        });

        // 选中设为100否则为0
        $(':checkbox').on('click',function () {
            if ($(this)[0].checked === true) {
                freePoints = 100;
            }else {
                freePoints = 0;
            }
            // 判断悬赏分用户输入的是不是数字
            if (xuanshang >= 0) {
                // 计算总的悬赏积分
                finalPoints = xuanshang + freePoints;
                if (finalPoints > 0) {
                    $('#postButton').html('提交(共悬赏' + finalPoints + '分)');
                }else {
                    $('#postButton').html('提交');
                }
            }
        });
        //  悬赏ajax请求
        function xsAjax(askid) {
            // 设置免费悬赏
            $.get(vars.askSite + '?c=ask&a=ajaxBegXuanShang&askId=' + askid,function (msg) {
                if (msg.message) {
                    PromptExecution(msg.message);
                    window.location.href = vars.askSite + 'ask_' + askid + '.html';
                }
            });
        }
        // 提交用户数据
        $('.submit').on('click',function () {
            // 对提交内容进行处理
            var title = $submitContentId.text().trim();
            // 用于存放当用户没有登录时需要传递的参数
            var burl;
            // 如果已经提交过了当再次点击时直接退出 不再进行ajax请求
            if (!flagBool) {
                return false;
            }
            if (title === '' || title === '请描述您的问题，提高悬赏值，可以更快得到答案') {
                PromptExecution('提交问题不能为空');
                return false;
            }
            // 将用户提问的内容存入localStorage
            localStorage.setItem('ask_after_content',title);
            // 验证悬赏输入框中输入的数据是否合法
            var regR = /^(\d)*$/.test(xuanshang);
            if (!regR) {
                // 输入的不是数字或者是负数返回NaN，提示输入错误
                PromptExecution('积分输入有误');
                return false;
            }else if (xuanshang > vars.jifen) {
                // 输入积分超过用户拥有的积分，提示积分不足  改版后error class没有找到
                $xsScoreId.addClass('error');
                PromptExecution('积分不足');
                return false;
            }

            // 判断是否操作了验证组件。
            if (window.fCheck.config.result === null){
                PromptExecution('您尚未完成滚动条验证');
                return false;
            }

            // 进行登录验证
            if (vars.loginid === '') {
                // 没有登录
                burl = vars.askSite + '?c=ask&a=postAsk&tags=' + tags;
                window.location.href = vars.loginUrl + '?burl=' + encodeURIComponent(burl);
            }else if (vars.mobvalid !== '1') {
                // 验证手机号
                burl = vars.askSite + '?c=ask&a=postAsk&tags=' + tags;
                window.location.href = vars.mobileLoginUrl + '?burl=' + encodeURIComponent(burl);
            }else {
                var coderesult = window.fCheck.config.result;
                // 将用户提问的相关数据提交到后台处理
                $.get(vars.askSite + '?c=ask&a=postAsk&tags=' + tags + '&xuanshang=' + xuanshang + '&title='  + title +'&challenge='+coderesult.fc_challenge+'&validate='+coderesult.fc_validate,function (data) {
                    // ajax请求返回的数据  用于验证数据提交状态
                    var jsondata = data;
                    // 注意这里的使用，接口返回问题
                    if (jsondata.code === '100') {
                        // 提交成功加锁
                        flagBool = false;
                        // 点击提交进行跳转
                        localStorage.removeItem('ask_after_content');

                        // 用户行为对象
                        var yhxw = require('modules/ask/yhxw');
                        yhxw({type: 94, pageId: 'maquiz', askid: jsondata.askid, jifen: xuanshang, asktitle: title});

                        // 判断是否点击了免费悬赏
                        if (freePoints === 100) {
                            // 设置免费悬赏
                            xsAjax(jsondata.askid);
                        } else {
                            window.location.href = vars.askSite + 'ask_' + jsondata.askid + '.html';
                        }
                    } else {
                        PromptExecution(jsondata.message);
						// 重新初始化
						window.fCheck.reinit();
                    }
                });
            }
        });

        // 用户行为对象
        var yhxw = require('modules/ask/yhxw');
        yhxw({type: 0, pageId: 'maquiz'});
    };
});
