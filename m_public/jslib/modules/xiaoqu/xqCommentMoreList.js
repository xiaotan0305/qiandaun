/**
 * Created by lina on 2017/4/19.
 * 小区点评列表页，点赞
 */
define('modules/xiaoqu/xqCommentMoreList',function(require,exports,module){
    module.exports = function(){
        var $ = require('jquery');
        // 点击更多的箭头
        var $moreBtn = $('.more_dp');
        var vars = seajs.data.vars;
        var $msgObj = $('#sendFloat');
        var $msg = $('#sendText');
        function show(keywords){
            $msg.text(keywords);
            $msgObj.fadeIn();
            setTimeout(function(){
                $msgObj.fadeOut();
            },2000)
        }
        $moreBtn.each(function(){
            var $this = $(this);
            $comment = $this.prev().find('p');
            $height = parseInt($this.prev().css('max-height'));
            if($comment.height() > $height){
                $this.css('display','block')
            }
        });
        $moreBtn.on('click',function(){
            var $ele = $(this);
            var $comment = $ele.prev();
            if($comment.css('max-height') === '100px'){
                $comment.css('max-height','100%');
                $ele.addClass('up');
            }else{
                $comment.css('max-height','100px');
                $ele.removeClass('up');
            }
        });
        // 在线聊天
        function chatWeituo(zhcity, city, housetype, houseid, newcode, type, phone, channel, uname, aname, agentid, order, photourl, housefrom) {
            if (vars.localStorage) {
                window.localStorage.setItem(String(uname), encodeURIComponent(aname) + ';'
                    + photourl + ';' + encodeURIComponent(vars.district + '的'));
            }
            $.ajax({
                url: '/data.d?m=houseinfotj&zhcity=' + zhcity  +  '&city=' + city + '&housetype=' + housetype + '&houseid=' + houseid
                + '&newcode=' + newcode + '&type=' + type + '&phone=' + phone + '&channel=' + channel + '&agentid='
                + agentid + '&order=' + order + '&housefrom=' + housefrom,
                async: false
            });
            setTimeout(function () {
                window.location = '/chat.d?m=chat&username=' + uname + '&city=' + city;
            }, 500);
        }
        // 点击在线咨询跳转到咨询界面
        $('.mes').on('click', function () {
            var data = $(this).attr('data-chat');
            var dataArr = data.split(',');
            chatWeituo.apply('this', dataArr);
        });
        // 点赞地址
        var url = vars.xiaoquSite + '?c=xiaoqu&a=ajaxXqAgree';
        var param = {};
        // 点赞
        $('.dpinfodz').on('click',function(){
            var $ele = $(this);
            if($ele.find('i').hasClass('cur')){
                show('您已经点过赞了');
                return false;
            }
            param.tid = $ele.attr('data-tid');
            param.newcode = vars.newcode;
            $.ajax({
                url: url,
                data: param,
                success: function(data){
                    if(data){
                        if(data.url){
                            window.location.href = data.url;
                            return false;
                        }
                        // 100的时候表示成功
                        if(data.rescode && data.rescode === '100'){
                            var dzCount = Number($ele.text()) + 1;
                            $ele.html('<i class="cur"></i>' + dzCount);
                        }else{
                            show(data.resmsg);
                        }
                    }
                }
            })
        });
        // 点击我要点评
        $('.dpinfobtn').on('click',function(){
            var param = {
                newcode : vars.newcode,
                city: vars.city
            };
            $.ajax({
                url: vars.xiaoquSite + '?c=xiaoqu&a=ajaxCheckComment',
                data: param,
                success: function(data){
                    if(data){
                        if(data.url){
                            window.location.href = data.url;
                            return false;
                        }
                        if(data.code === '100'){
                            window.location.href = vars.xiaoquSite + '?a=xqWriteComment&city='+ vars.city + '&newcode=' + vars.newcode;
                        }else{
                            show(data.message);
                        }
                    }
                },
                error:function(errmsg){
                    show(errmsg)
                }
            });
        })
    }
});
