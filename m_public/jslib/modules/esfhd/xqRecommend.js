/**
 * Created by lina on 2017/3/3.
 */
define('modules/esfhd/xqRecommend', function(require,exports,module){
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        // 下一步按钮
        var $nextStep = $('.arr-btn2');
        var vars = seajs.data.vars;
        var projcode;
        var $more = $('.xq-more');
        // 点击查看更多
        if($more.length){
            $more.on('click',function(){
                $('ul').find('li').each(function(){
                    var $this = $(this);
                    if($this.is(':hidden')){
                        $this.show();
                    }
                });
                $more.hide();
            });
        }
        // 下一步按钮
        var $xq = $('.searbox').find('a');
        // 给下一步按钮添加active标记，否则无法点击
        $nextStep.on('click',function () {
            if($xq.text() === '请输入小区名字') {
                alert('请选择要建设的小区');
                return false;
            }
            projcode = $xq.attr('newcode');
            if(vars.agentType === 'DS'){
                var url = vars.esfSite + '?c=esfhd&a=xqPicPerfect&city=' + vars.city + '&agentType=DS&agentId=' + vars.agentId + '&projCode=' + projcode;
            }else{
                var url = vars.esfSite + '?c=esfhd&a=xqPicPerfect&city=' + vars.city + '&agentId=' + vars.agentId + '&projCode=' + projcode
            }
            window.location.href = url;
        });
    };
});