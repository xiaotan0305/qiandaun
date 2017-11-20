(function (w, $) {
    var $con = $('.NewsTab');
    var downTime = 0;
    var target = '';
    var $nav = $('#nav2');
    var l = $nav.find('a').length;
    var startX = 0;
    var startY = 0;
    var portW = $con.width() / l;
    $con.css({
        position: 'relative',
        'z-index': 1
    });
    $nav.on('touchstart', tStart);
    $nav.on('touchend', tEnd);
    $(document).on('touchmove', tMove);
    function tStart(e) {
        e.preventDefault();
        var $target = $(e.target).closest('a');
        if ($target.length > 0) {
            target = $target;
            downTime = new Date().getTime();
            var p = e.originalEvent.touches[0];
            startX = p.pageX;
            startY = p.pageY;
        }
    }

    function tMove(e) {
        if (downTime) {
            e.preventDefault();
            var p = e.originalEvent.touches[0];
            var ax = p.pageX - startX;
            var ay = p.pageY - startY;
            target.css({
                'transform': 'translate(' + ax + 'px,' + ay + 'px)',
                '-o-Transform': 'translate(' + ax + 'px,' + ay + 'px)',
                '-ms-Transform': 'translate(' + ax + 'px,' + ay + 'px)',
                '-moz-Transform': 'translate(' + ax + 'px,' + ay + 'px)'
            });
        }
    }

    function tEnd(e) {
        e.preventDefault();
        var now = new Date();
        if (now - downTime <= 200) {
            w.location = target.attr("data-url");
            downTime = 0;
        } else {
            downTime = 0;
            setPosition(target);
            // 在这里进行localstorage写入获取nav之后的结果
            var lanmu_str = '';
            $('#nav2 a').each(function () {
                lanmu_str += this.id + ',';
            });
            localStorage.lanmu = lanmu_str;
        }
    }

    /**
     * 正则匹配获取transform矩阵的各项值
     * @param o
     * @returns {Array|string[]}
     */
    function transfromToNumber(o) {
        // 匹配matrix(中间值),去掉matrix()获取其中间值，通过分割符，获取矩阵的六个值
        var matrix = o.css('transform').split(',');
        var x = +parseInt(matrix[12] || matrix[4]);
        var y = +parseInt(matrix[13] || matrix[5]);
        return {
            x: x,
            y: y
        };
    }

    function setPosition(el) {
        var flag = true;
        for (var i = 0; i < l; i++) {
            var transArr = transfromToNumber(el);
            var moveX = parseInt(transArr.x) + startX;
            if (moveX < (i + 1) * portW) {
                $nav.find('a').eq(i).before(el);
                el.attr('style', '');
                flag = false;
                break;
            }
        }
        if (flag) {
            $nav.append(el);
            el.attr('style', '');
        }
    }
})(window, jQuery);