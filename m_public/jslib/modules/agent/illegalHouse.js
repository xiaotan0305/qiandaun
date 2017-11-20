/**
 * 违规列表类
 * @author  chenhuan 经纪人店铺二期优化需求
 */
define('modules/agent/illegalHouse', ['jquery', 'loadMore/1.0.0/loadMore'], function (require, exports, module) {
    'use strict';
     module.exports = function (){
         var $ = require('jquery');
         var vars = seajs.data.vars;
        if (vars.count <=20) {
            $('.moreList').hide();
        } else {
            // 加载更多类
            var lodeMore = require('loadMore/1.0.0/loadMore');
            lodeMore({
                url: vars.agentSite + '?c=agent&a=ajaxGetillegalHouseByAgent&agentid='+vars.agentid+'city='+vars.city,
                total: vars.count,
                pagesize: 20,
                pageNumber:1 ,
                moreBtnID: '.moreList',
                loadPromptID: 'moreList',
                contentID: '#list',
                firstDragFlag : false,
                loadAgoTxt: '上拉加载更多',
                loadingTxt: '正在加载...'
            }); 
        }
      }
});

