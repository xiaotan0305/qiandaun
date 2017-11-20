/**
 * Created by user on 2015/5/29.
 */
function cartoon(ele,menu,fn){//元素、菜单、回调
    if(!ele || typeof ele !== "object" || ele.nodeType !== 1)return;//不存在输入元素则放弃
    var _  = this;
        _.show = "block";       //显示
        _.hide = "none";        //隐藏状态
        _.startX = "";          //开始横坐标
        _.startY = "";          //开始坐标
        _.status = 0;           //当前状态，决定是否绑定事件和事件类型 “”空状态是为阻止过快时的重叠,1向下划，2向上划
        _.next = ele.nextElementSibling;//上一个
        _.previous = ele.previousElementSibling;//下一个
        _.scaleTop = "sctr1";//上划手势
        _.scaleBottom = "sctr2";//下划手势
    //寻找当前元素,看是否为当前元素，为菜单提供方法
    _.searp = function (string){
        var pr = document.querySelectorAll(".page");
        for(var i = 0 ; i < pr.length ; i++){
            if(pr[i].style.display === "block"){
                return i;
            }
        }
   };
    //deal with class name function
    _.strd = function(ele,str){
        var cll = ele.className;
        if(str){
           var reg =  new RegExp(str);
            cll.replace(reg,"");
        }
        return cll.replace(/^\s+|\s+$/g, "");
    };
    _.touchstart = function(e){
        if(_.status === "")return;//动画未完返回
        //e.preventDefault();//阻止默认事件，会屏蔽click，慎用
        var sa = e.changedTouches[0];
        _.startX = sa.pageX;
        _.startY = sa.pageY;
    };

    _.touchmove = function(e){
        if(_.status === "")return;//动画未完返回
        e.preventDefault();//阻止默认事件
        //基于移动尺寸的移动方位
        var moveX = e.changedTouches[0].pageX -  _.startX;
        var moveY = e.changedTouches[0].pageY - _.startY;

        if ( Math.abs(moveX) > Math.abs(moveY) && moveX > 0 ) {
            //left 2 right";
            return
        }
        else if ( Math.abs(moveX) > Math.abs(moveY) && moveX < 0 ) {
            //right 2 left.
            return
        }
        else if ( Math.abs(moveY) > Math.abs(moveX) && moveY > 0) {
            //top 2 bottom.
            if(_.previous) {
                _.status = 1;
            }
            return function(){ return _.status;}
        }
        else if ( Math.abs(moveY) > Math.abs(moveX) && moveY < 0 ) {
            //bottom 2 top
            if(_.next) {
                _.status = 2;
            }
            return function(){ return _.status;}
        }
        else{
            //can't recognize movement
            return
        }
    };
    //划动结束
    _.touchend = function(e){
        if(_.status === "")return;//动画未完返回
        var pr;//className list
        var endY = e.changedTouches[0].clientY;//当前鼠标位置
        if(Math.abs(endY - _.startY) < 60)return;//过短滑动无效
        pr = _.strd(ele,_.scaleTop); //处理字符串1
        pr = _.strd(ele,_.scaleBottom); //处理字符串2
        var n = _.searp();//当前菜单配置
        if(_.status == 1 && _.previous){//下滑/无上一个
            // deal className
            if(pr){
                ele.className = pr;
            }else{
                ele.className = "";//定制元素可忽略
            }
            //处理文档
            ele.className = pr + " " + _.scaleBottom;//下滑放大
            _.menu(n,_.status-2);//菜单
            setTimeout(function(){
                ele.className = pr;
                ele.style.display = _.hide;
                _.previous.style.display = _.show;
                ele.className = pr;//清理
            },400);

        }else if(_.status == 2 && _.next ){//上滑/无下一个
            //处理class
            if(pr){
                _.next.className = pr
            }else{
                _.next.className = "";
            }
            ele.className = pr + " " + _.scaleTop;//上滑缩小
            _.menu(n,_.status - 1);//菜单
            //deal DOM
            setTimeout(function(){
                ele.className = pr;
                ele.style.display = _.hide;
                _.next.style.display = _.show;
                ele.className = pr;//清理
            },400);
        }
        //reset部分
        setTimeout(function(){
            _.status = 0;//重置滑动效果
            return function(){return _.status;}
        },1000);//1000为了阻止滑动
        _.status = "";//清空滑动效果
        return function(){return _.status;}
    };

//菜单操作 参数 当前元素所处index ，手势状态转化的菜单位置操作
    _.menu = function(n,s){
        var me = document.querySelector(".searfj-menu");
        if(!me)return;
        var is = me.querySelectorAll("li img");
        var con1 = "scmenu2",       //缩小动画
            con2 = "scmenu1 menu-k";//放大动画
        //  不显示菜单页面，可定制移动到滑动层处理比较好
        if( s > 0 ){
            if( n > 10 && n != 14){
                setTimeout(function(){me.style.display = _.hide;},500);
            }else{
                setTimeout(function(){me.style.display = _.show;},500);
            }
        }else if( s < 0 ){
            if( n > 12){
                setTimeout(function(){me.style.display = _.hide;},500);
            }else{
                setTimeout(function(){me.style.display = _.show;},500);
            }
        }
        //    注意，通过修改n值操作当前菜单选项
        if(is[n])is[n].className = con1;
        if(is[n + s])is[n + s].className = con2;
    };
    //bind
    _.atach = function(e,handler){
      return ele.addEventListener ? ele.addEventListener(e,handler,false) : ele.attachEvent(e,handler,false);
    };
    //unbind
    _.detach = function(e,handler){
        return ele.removeEventListener ? ele.removeEventListener(e,handler,false) : ele.detachEvent(e,handler,false);
    };
    //init
    _.init = function(){
        _.atach("touchstart",_.touchstart);
        _.atach("touchmove",_.touchmove);
        _.atach("touchend",_.touchend);
        return fn ? fn : null;//回调
    };
}
function o(e) {return document.querySelector(e)}
function u(e) {return document.querySelectorAll(e)}
var preload = function(progress, items, config) {
    if (!items || !Array.isArray(items) || !items.length)
        return;
    this.progress = progress;
    this.items = items;
    this.prefix = config.prefix || "";
    this.complete = config.complete || false
};
preload.prototype.load = function() {
    var e = 0;
    var items = this.items;
    var n = this.items.length;
    var r = this.complete;
    var that = this;
    items.forEach(function(cell) {
        var img = new Image;
        img.onload = img.onerror = img.onabort = function() {
            if (++e === n && typeof r === "function")
                r.call(that);
            that.progress.innerText = Math.floor(100 * e / n) + "%"
        };
        img.src = that.prefix + cell
    })
};
//识别终端类型
function detectTerminal() {
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
        //Android
        return 1;
    } else if (u.indexOf('iPhone') > -1) {
        //iPhone
        return 2;
    } else if (u.indexOf('Windows Phone') > -1) {
        //WP
        return 3;
    }
}