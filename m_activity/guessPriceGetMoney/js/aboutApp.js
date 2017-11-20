$(function(){
    $("#js_APPDown").on("click",function(e){
        openOrDownloadApp(e);
    });
    function openOrDownloadApp(e){

        e=e||event;


        window.appurl = 'waptoapp/{"destination":"index"}';
        (function(win){
            var doc = document,$ = win.$,k = function(){this.listen();};
            k.prototype = {
                listen:function(){
                    var that = this;

                    var u,l,url = "http://js.soufunimg.com/common_m/m_public/jslib/app/1.0.2/appopen.js",
                        weiXinUrl="http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&g_f=991653",callback = function(openApp){
                            typeof win.openApp === "function" && (openApp = win.openApp);
                            var oa = openApp({
    //	url:"http://client.3g.fang.com/http/DownloadBy2weima.jsp?company=1095",
                                url:"http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&g_f=991653",
    //	appstoreUrl:"https://itunes.apple.com/cn/app/fang-tian-xia-zhuang-xiu/id966474506?mt=8",
                                appstoreUrl:"https://itunes.apple.com/cn/app/soufun/id413993350?8&ls=1",
                                weiXinUrl:"http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&g_f=991653",
    //href:'fangtxzx://',
                                log:that.log
                            });
                            oa.openApp();
                        };
                    e.preventDefault();
                    e.stopPropagation();

                    if (typeof win.seajs === 'object') {
                        win.seajs.use(url, callback);
                    } else {
                        u = doc.createElement("script"), l = doc.getElementsByTagName("head")[0], u.async = true, u.src = url, u.onload = callback, l.appendChild(u);
                    }
                    return false;

                },
                log:function(type){
                    try{
                        $.get("/public/?c=public&a=ajaxOpenAppData", {
                            type:type,
                            rfurl:doc.referrer
                        });
                    }catch(e){}

                }
            };
            new k();
        })(window);
    }
    $('.close').on('click',function(){
        $('.floatApp').hide();
    })
});