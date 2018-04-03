define('modules/zhuanti/datareport', ['jquery', 'swipe/3.10/swiper'],
    function (require, exports, module) {

        module.exports = function () {
            var $ = require('jquery');
            var vars = seajs.data.vars;
            // swiper滚动插件类
            var Swiper = require('swipe/3.10/swiper');
            var winHeight = $(document).height();
            Swiper('.swiper-container', {
                direction: "vertical",
                onTouchEnd: function(swiper){
                  //swiper.activeIndex
                  //滑动结束时，跳转到开盘列表页
                  // if (vars.kaipan && 9 == parseInt(swiper.activeIndex + 1)) {
                  //       //一共9页
                  //       location.href = vars.mainSite + "xf/" + vars.encity + "/kpNew.html?lpdaterange=[20180301,20180331]";
                  // }
                  TR=swiper.translate
                  console.log(TR);
                  var totalHeight = -winHeight * 8
                  if(TR < totalHeight){
                  swiper.setWrapperTranslate(TR);
                  location.href = vars.mainSite + "xf/" + vars.encity + "/kpNew.html?lpdaterange=[20180301,20180331]";
            }
                }
            });
        };
    });