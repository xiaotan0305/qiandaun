!(function(g, i) {
   var d = g.navigator.userAgent;
        if(/MiuiYellowPage/i.test(d)) {
            //隐藏页面头尾
            var hideList = ['header','.down-btn-c','.bandown','#app','footer'];
            for(a in hideList){
                var hideCon = document.querySelector(hideList[a]);
                if(hideCon) {
                    hideCon.style.display = 'none';
                }
            }
            function callNative(fn) {
                (function(e) {
                    var t = "MiuiYellowPageApi",
                        n = function(t) {
                            try {
                                e(t)
                            } catch (n) {
                                alert(n.message)
                            }
                        },
                        r = window,
                        i = r[t];
                    i ? n(i) : document.addEventListener("yellowpageApiReady", function(e) {
                        setTimeout(function() {
                            n(r[t])
                        }, 1)
                    })
                })
                (function(api) {
                    fn(api);
                });
            }
            callNative(function(api) {
                api.call('setBottomBarVisible', false);

            });
            callNative(function(api) {
                api.call('setTitle', document.title);
            });
            callNative(function(api) {
                api.on('backPressed', function() {
                    api.call('goBack');
                });
            });
        }
})(window, document);