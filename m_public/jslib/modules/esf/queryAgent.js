define('modules/esf/queryAgent',['jquery'],function (require,exports,module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        $('#agent').on('click',function () {
            $(this).attr('placeholder','');
        });
        $('#verify').on('click',verify);
        function verify() {
            var agent = $('#agent').val();
            window.location = vars.esfSite + '?c=esf&a=subAgentInfo&city=' + vars.city + '&agent=' + agent;
        }
        var i;
        //点击经纪人模块进入经纪人店铺页面;
        $('.arr-rt').on('click', function(){
            i = $(this).attr('id');
            window.location = vars.agentSite + vars.city + '/1_' + vars['AgentID'+i] + '.html';
        });
    };
});