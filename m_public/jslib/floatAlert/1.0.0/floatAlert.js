/**
 * Created by lina on 2017/5/17.
 * 弹窗插件，三种类型
 * type 1:黑色自动消失的弹窗
 * type2:白色带一个按钮的弹窗，类似alert弹窗
 * type3:白色带两个按钮的弹窗，类似confirm弹窗
 */
(function(w,f){
    'use strict';
    if (typeof define === 'function') {
        define('floatAlert/1.0.0/floatAlert', ['jquery'], function (require) {
            var $ = require('jquery');
            return f($, require);
        });
    } else if (typeof exports === 'object') {
        module.exports = f(w);
    } else {
        w.floatAlert = f();
    }
})(window,function(){
    /**
     *阻止浏览器默认事件
     * @param e 浏览器默认事件
     */
    function preventDefault(e) {
        e.preventDefault();
    }

    /**
     * 手指滑动时阻止浏览器默认事件(阻止页面滚动）
     */
    function unable() {
        document.addEventListener('touchmove', preventDefault);
    }

    /**
     * 手指滑动恢复浏览器默认事件（恢复滚动
     */
    function enable() {
        document.removeEventListener('touchmove', preventDefault);
    }
    function floatAlert(ops){
        this.option = {
            // 三种弹窗，不传默认第一种
            type:'1',
            // 类型2按钮的回调函数
            callback:'',
            // 类型为3时btn1的回调
            sureCall:'',
            // 类型为3时btn2的回调
            cancelCall:''

        };
        $.extend(this.option,ops);
        this.init();

    }
    floatAlert.prototype.constructor = floatAlert;
    floatAlert.prototype.init = function(){
        var that = this;
        var alertObj = '';
        var type= that.option.type;
        var $floatBox1 = $('.tz-box2');
        var $floatBox2 = $('.alertBox');
        if($floatBox1.length && type === '1'){
            return false;
        }
        if($floatBox2.length && type === '2'){
            return false;
        }
        if(type === '1'){
            alertObj = '<div id="sendFloat" class="tz-box2" style="height: 800.4px;display: none;"><div id="sendText" class="yzm-sta" style="top: 45%;"></div></div>';
            $('body').append(alertObj);
            $('.tz-box2').css({
                position:'fixed',
                width: '100%',
                height: '100%',
                left: '0px',
                top: '0px',
                background: 'rgba(0,0,0,.6)',
                zIndex: '9999'
            });
            $('.yzm-sta').css({
                position: 'fixed',
                width: '150px',
                backgroundColor: 'rgba(0,0,0,.7)',
                borderRadius: '5px',
                color: '#fff',
                fontSize: '16px',
                lineHeight: '1.4',
                textAlign: 'center',
                padding: '12px 10px',
                zIndex: '9999',
                left: '50%',
                marginLeft: '-75px',
                top: '50%',
                marginTop: '-24px'
            });
        }else if(type === '2'){
            alertObj = '<div class="alertBox" id="sendFloat" style="display: none"><div class="alertCon"><div class="alert-txt"><p style="line-height: 18px;color:#565c67" id="sendText">您已经点过赞了</p></div>'
                + '<div class="alert-btn" id="alertBtn"><a href="javascript:void(0);" style="color:#F76565;text-decoration: none">好</a></div></div></div>';
            $('body').append(alertObj);
            $('.alertBox').css({
                position:'fixed',
                width:'100%',
                height:'100%',
                left:'0px',
                top:'0px',
                background:'rgba(0,0,0,.6)',
                zIndex:'999'
            });
            $('.alertCon').css({
                position:'absolute',
                width:'70%',
                left:'15%',
                top:'40%',
                background:'#fff',
                borderRadius:'8px'
            });
            $('.alertCon .alert-txt').css({
                lineHeight:1.2,
                padding:'1rem 1.2rem',
                fontSize:'1rem'
            });
            $('.alertCon .alert-btn').css({
                borderTop:'1px solid #f4f4f4'
            });
            $('.alertCon .alert-btn a').css({
                display:'block',
                textAlign:'center',
                color:'#4b95f2!important',
                fontSize:'1rem',
                lineHeight:'1.8rem'
            });
            $('#alertBtn').on('click',function(){
                if(that.option.callback){
                    that.option.callback();
                }else{
                    $('.alertBox').hide();
                }
                enable();
            });
        }else{
            alertObj = '<div class="alertBox3" style="height: 100%;"><div class="alert"><div class="cont"><p style="text-align: center;padding-top: 10px;padding-bottom: 10px;font-size: 16px">编辑未保存，确定放弃保存？</p></div>'
                + '<div style="display: -webkit-box;border-top: 1px solid #f8f8f8;width:100%;"><a id="sure" style="border-right: none;" href="javascript:void(0);">确定</a><a id="cancel" href="javascript:void(0);">取消</a></div></div></div>';
            $('body').append(alertObj);
            $('.alertBox3').css({
                position: 'fixed',
                top: 0,
                left:0,
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,.6)',
                zIndex: 1000
            });
            $('.alertBox3 .alert').css({
                position: 'absolute',
                top: '50%',
                left: '50%',
                borderRadius: '10px',
                display:'inline-block',
                width: '280px',
                background: '#fff',
                color: '#3c3f46',
                '-webkit-transform': 'translate(-50%, -50%)',
                '-moz-transform': 'translate(-50%, -50%)',
                '-o-transform': 'translate(-50%, -50%)',
                'transform': 'translate(-50%, -50%)'
            });
            $('.alertBox3 .alert .cont').css({
                padding: '20px 24px',
                fontSize:'15px',
                lineHeight:'24px',
                color:'#3c3f46'
            });
            $('.alertBox3  a').css({
                display: 'block',
                textDecoration:'none',
                lineHeight: '44px',
                fontSize: '15px',
                textAlign: 'center',
                color: '#df3031',
                width:'50%'
            });

            $('.alertBox3 a:only-child').css({
                fontSize:'16px',
                width:'100%'
            });
            $('#sure').on('click',function(){
                if(that.option.sureCall){
                    that.option.sureCall();
                }else{
                    window.location.href = window.history.back(-1);
                }
                enable();

            });
            $('#cancel').on('click',function(){
                if(that.option.cancelCall){
                    that.option.cancelCall();
                }else{
                    $('.alertBox3').hide();
                }
                enable();
            })
        }

    };
    floatAlert.prototype.showMsg = function(keyword,time,btn1Txt,btn2Txt){
        var showObj,showCont;
        var type = this.option.type;
        if(type === '1'){
            showObj = $('.tz-box2');
            showCont = $('.tz-box2').find('#sendText');
        }else if(type === '2'){
            showObj = $('.alertBox');
            showCont = showObj.find('p');
        }else{
            showObj = $('.alertBox3');
            showCont = showObj.find('p');
            var sure = $('#sure');
            var cancel = $('#cancel');
            if(btn1Txt && btn1Txt !== sure.text()){
                sure.text(btn1Txt);
            }
            if(btn2Txt && btn2Txt !== cancel.text()){
                cancel.text(btn2Txt);
            }
        }
        showCont.text(keyword);
        if(type === '1'){
            showObj.fadeIn();
        }else{
            showObj.show();
        }
        unable();
        if(type === '1'){
            setTimeout(function(){
                showObj.fadeOut();
                enable();
            },time);
        }
    };
    return floatAlert;

});
