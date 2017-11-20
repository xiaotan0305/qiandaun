(function(w, $) {
    var nowLi = {};
    var pressFlag = false;
    var judgePress = null;
    
    $(function(){
        $("#nav2 a").on("touchstart", tStart);
        $(document).on("touchend", tEnd);
        $(document).on("touchmove", tMove);
    });

    function tStart(e) {
        nowLi.el = $(this);
        judgePress = setTimeout(pressGo, 500, e);
        e.preventDefault();
        e.stopPropagation();
    }

    function pressGo(e) {
        pressFlag = true;
        var p = e.originalEvent.touches[0];
        var ofL = nowLi.el.offset().left;
        var ofT = nowLi.el.offset().top;
        nowLi.left = p.pageX - ofL;
        nowLi.top = p.pageY - ofT;
        nowLi.el.css("position", "absolute");
        nowLi.el.css("left", "0px");
        nowLi.el.css("top", "0px");
        nowLi.el.css("transform", 'translate(' + ofL + 'px,' + ofT + 'px)');
        nowLi.el.css("-webkit-Transform", 'translate(' + ofL + 'px,' + ofT + 'px)');
        nowLi.el.css("-o-Transform", 'translate(' + ofL + 'px,' + ofT + 'px)');
        nowLi.el.css("-ms-Transform", 'translate(' + ofL + 'px,' + ofT + 'px)');
        nowLi.el.css("-moz-Transform", 'translate(' + ofL + 'px,' + ofT + 'px)');
    }

    function tMove(e) {
        if(pressFlag){
            var p = e.originalEvent.touches[0];
            var ax = p.pageX - nowLi.left;
            var ay = p.pageY - nowLi.top;
            nowLi.el.css("transform", 'translate(' + ax + 'px,' + ay + 'px)');
            e.preventDefault();
            e.stopPropagation();
        }
    }

    function tEnd(e) {
        if (pressFlag) {
            setPosition(nowLi.el);
            e.preventDefault();
            e.stopPropagation();
            pressFlag = false;
            //在这里进行localstorage写入获取nav之后的结果
            var lanmu_str = '';
            $('#nav2 a').each(function(){
                //alert(this.id);
                lanmu_str += (this.id)+',';
            });
            localStorage.lanmu = lanmu_str;
        } else {
            w.location = nowLi.el.attr("data-url");
            if(judgePress)clearTimeout(judgePress);
        }
    }

    function transfromToNumber(o) {
        var reg2 = /\-?[0-9]+\.?[0-9]*/g;
        var obj=o.style;
        if(obj.hasOwnProperty("transform")){
            obj=obj.transform;
        }else if(obj.hasOwnProperty("webkitTransform")){
            obj=obj.webkitTransform;
        }else if(obj.hasOwnProperty("oTransform")){
            obj=obj.oTransform;
        }else if(obj.hasOwnProperty("msTransform")){
            obj=obj.msTransform;
        }else if(obj.hasOwnProperty("mozTransform")){
            obj=obj.mozTransform;
        }else{
            alert("警告无法获取transform值");
        }
        var arr = obj.match(reg2);
        return arr;
    }

    function setPosition(el) {
        var arr = $("#nav2 a");
        var l = arr.length;
        var longS = true;
        for (var i = 0; i < l; i++) {

                if (arr[i] != el[0]) {
                    var transArr = transfromToNumber(el[0]);
                    if (transArr[0] < $(arr[i]).offset().left) {
                        $(arr[i]).before(el);
                        try{
                            el.removeAttr("style");
                        }catch(e){
                            alert(e);
                        }
                        longS = false;
                        break;
                    }
                }

        }
        if (longS) {
            $("#nav2").append(el);
            el.removeAttr("style");
        }
}
})(window, jQuery);