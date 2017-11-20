(function(window){
    var d = window.navigator.userAgent.toLowerCase();
    if(/(miuiyellowpage|NewsArticle)/i.test(d)) {
        document.write('<style>#foot,#album_top,header,.down-btn-c,.bandown,#app,footer,.xq-app-d,.center,.mBox{display:none}</style>');
    }

})(window);