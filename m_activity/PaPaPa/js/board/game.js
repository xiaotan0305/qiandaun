/* background.js */
'use strict';
(function (w) {
    'use strict';
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    // 根据前缀判断是否存在requestAnimationFrame方法
    for (var x = 0; x < vendors.length && !w.requestAnimationFrame; ++x) {
        w.requestAnimationFrame = w[vendors[x] + 'RequestAnimationFrame'];
        // Webkit中此取消方法的名字变了
        w.cancelAnimationFrame = w[vendors[x] + 'CancelAnimationFrame'] || w[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    // 如果没有requestAnimationFrame方法设置setTimeout方法代替
    if (!w.requestAnimationFrame) {
        w.requestAnimationFrame = function (callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            var id = w.setTimeout(function () {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    // 如果没有取消requestAnimationFrame方法设置clearTimeout方法代替
    if (!w.cancelAnimationFrame) {
        w.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    }
})(window);

$(document).on('touchmove', function (e) {
    e.preventDefault();
});

var config = {
    width: 320,
    height: 568,
    imgUrlPrefix: document.getElementById('path').value,
    indexUrl: '//' + window.location.hostname + '/activityshow/paPaPa/index.jsp',
    resultUrl: '//' + window.location.hostname + '/activityshow/paPaPa/result.jsp',
    level: 0
}

var windowWidth = $(window).width(),
    windowHeight = $(window).height();

var scale = {
    width: windowWidth / config.width,
    height: windowHeight / config.height
}

var canvas = document.getElementById('canvas');
canvas.width = windowWidth;
canvas.height = windowHeight;
var context = canvas.getContext('2d');

var gameImage = {},
    gameAudio = {};
var timer = null,
    djs = $('.djs'),
    cover = $('.zhe').show(),
    $text = $('.gang_zi').hide(),
    $loading = $('.jindu').show();

djs.text('15');
$loading.find('.huil').height('1.35rem');

var bg = null, rail = null, ball = null, bricks = [], game = null;
function Background(options) {
    this.offCanvas = document.createElement('canvas');
    this.init();
}

Background.prototype.init = function() {
    this.offContext = this.offCanvas.getContext('2d');
    this.offCanvas.width = canvas.width;
    this.offCanvas.height = canvas.height;
    this.objects = [{
        x: 0,
        y: 0,
        width: 320,
        height: 568,
        imgKey: 'gangqiu1'
    }, {
        x: 0,
        y: 0,
        width: 320,
        height: 99,
        imgKey: 'ding'
    }, {
        x: 0,
        y: 327,
        width: 28,
        height: 242,
        imgKey: 'lanl'
    }, {
        x: (320 - 28),
        y: 327,
        width: 28,
        height: 242,
        imgKey: 'lanr'
    }]
}

Background.prototype.draw = function () {
    var ctx = this.offContext,
        cv = this.offCanvas,
        objects = this.objects;
    var length = objects.length;
    ctx.clearRect(0, 0, cv.width, cv.height);
    for (var i = 0; i < length; i++) {
        var obj = objects[i];
        var image = gameImage[obj.imgKey];
        ctx.drawImage(image, obj.x * scale.width, obj.y*scale.height, obj.width*scale.width, obj.height*scale.height);
    }
}
/* ball.js */
/**
 * 小球对象以 iphone 4s 320 * 480 分辨率为基准
 * @param {[type]} options [description]
 */
function Ball() {
    this.name2image = {
        top: {
            img: 'qiu1',
            width: 35,
            height: 36.5
        },
        down: {
            img: 'qiu2',
            width: 45.5,
            height: 96
        },
        up: {
            img: 'qiu3',
            width: 40.5,
            height: 75
        },
        bottom: {
            img: 'qiu4',
            width: 35,
            height: 37
        }
    }
    // this.x = (320 - 35) / 2;
    this.miu = 0.5;
    this.top = 99 / 2;
    this.state = 'top';
    this.init();
}

Ball.prototype.init = function () {
    this.y = this.top;
    this.power = 0;
    this.vy = 0;
    this.ay = 0;
    this.breakIndex = 0;
}

Ball.prototype.draw = function (ctx) {
    var n2i = this.name2image,
        state = this.state,
        y = this.y;
    var image = gameImage[n2i[state].img],
        width = n2i[state].width,
        height = n2i[state].height,
        x = (config.width - n2i[state].width) / 2;
    ctx.drawImage(image, x * scale.width, y * scale.height, width * scale.width, height * scale.height);
}

Ball.prototype.move = function () {
    // this.vy = this.vy + this.ay * 16 / 1000;
    this.vy = this.ay;
    // 位置变化
    this.y += this.vy;

    var brick = bricks[this.breakIndex];
    var height = this.name2image[this.state].height;
    // 是否到达页面底部
    if (this.state === 'down' && this.y + height > brick.y + 27) {
        // 触发木板碰撞
        if(ball.breakIndex < 4) {
            brick.crack(this.power);
        }

        if (ball.breakIndex === 4 || brick.name !== 'break') {
            this.y = brick.y - 27;
            this.state = 'bottom';

            // 能量损失更改速度和加速度和方向
            this.vy = -this.vy;
            this.ay = -this.ay;
        }
    } else if (this.state === 'up' && this.y < this.top) {
        this.state = 'top';
        this.y = this.top;
        this.vy = -this.vy;
        this.ay = -this.ay;

        game.refresh();
    } else if (this.vy > 0) {
        this.state = 'down';
    } else if (this.vy < 0) {
        this.state = 'up'
    }
}

/* brick.js */
function Brick(number, name) {
    this.nick = {
        new: {
            img: 'muban3',
            width: 300,
            height: 20,
        },
        crack: {
            img: 'muban1',
            width: 300,
            height: 20,
        },
        break: {
            img: 'muban2',
            width: 300,
            height: 60
        }
    };
    this.originalx = 10;
    this.originaly = 344;
    this.gap = 60;
    this.vy = 1;
    this.originalPower = 100;
    this.levelPower = 100;
    this.visible = true;
    this.init(number);
    this.setNick(name);
}

Brick.prototype.init = function (number) {
    this.x = this.originalx;
    this.y = this.originaly + number * this.gap;
    // this.power = this.originalPower + (number + config.level) * this.levelPower;
    this.power = this.originalPower + number * this.levelPower;
}

Brick.prototype.setNick = function (name) {
    this.name = name;
    var name = this.name,
        nick = this.nick;
    this.width = nick[name].width;
    this.height = nick[name].height;
    this.img = nick[name].img;
}

Brick.prototype.crack = function (power) {
    // 击穿 2 块木板
    if (power > this.power) {
        gameAudio.break.play();
        this.setNick('break');
        ball.breakIndex++;
        ball.power -= this.power;
        config.level++;
    } else {
        this.setNick('crack');
    }
}

Brick.prototype.draw = function(ctx) {
    if (this.visible) {
        ctx.drawImage(gameImage[this.img], this.x * scale.width, this.y * scale.height, this.width * scale.width, this.height * scale.height);
    }
}

Brick.prototype.move = function() {
    this.y = this.y - this.vy;
}

/* rail.js */
'use strict';
/**
 * 小球对象以 iphone 4s 320 * 480 分辨率为基准
 * @param {[type]} options [description]
 */
function Rail(options) {
    this.nick = {
        left: {
            img: 'ganl',
            x: 26 - 16.5,
        },
        right: {
            img: 'ganr',
            x: 320 - 26,
        }
    };
    this.width = 16.5;
    this.height = 240;
    this.repeat = 2;
    this.moving = false;
    // this.originaly = 329;
    this.offCanvas = document.createElement('canvas');
    // this.offCanvas = document.getElementById('offCanvas');
    this.vy = 1;
    this.isMoving = false;
    this.hasMoved = false;
    this.init();
}

Rail.prototype.init = function () {
    this.y = 0;
    this.height = canvas.height - 329 * scale.height;
    var offCanvas = this.offCanvas;
    offCanvas.width = canvas.width;
    offCanvas.height = this.height * this.repeat; // 页面中
    this.offContext = offCanvas.getContext('2d');
}

Rail.prototype.draw = function () {
    var ctx = this.offContext;

    var rail = this.nick;
    for (var i = 0; i < this.repeat; i++) {
        // ctx.drawImage(image, 0, this.originaly - rail.y, rail.width, 480, rail.left.x, rail.y + i * rail.height, rail.width, rail.height);
        ctx.drawImage(gameImage[rail.left.img], rail.left.x * scale.width, i * this.height, this.width * scale.width, this.height);
        // ctx.drawImage(image, 0, this.originaly - rail.y, rail.width, 480, rail.right.x, rail.y + i * rail.height, rail.width, rail.height);
        ctx.drawImage(gameImage[rail.right.img], rail.right.x * scale.width, i * this.height, this.width * scale.width, this.height);
    }
}

Rail.prototype.move = function () {
    this.y = this.y - this.vy;
}

/* game.js */
// var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
//     windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;;

function Game() {
    // this.config = {
    //     t: 16 / 1000, // requestAnimationFrame 刷新频率大约为1秒16次
    //     g: 9.8, // 重力
    //     k: 0.5, // 弹力   越大越像皮球
    //     miu: 0.9, // 摩擦力：暂时可以看成风的阻力,
    //     fps: 60
    // }
    this.initStage();
}

// 先画棚顶、木板再画球，保证球在最前面
Game.prototype.initStage = function () {
    bg.draw();
    context.drawImage(bg.offCanvas, 0, 0, canvas.width, canvas.height);

    rail.draw();
    context.drawImage(rail.offCanvas, 0, 0, canvas.width, rail.height, 0, 329 * scale.height, canvas.width, canvas.height - 329 * scale.height);

    ball.draw(context);

    var i = bricks.length;
    while (i--) {
        bricks[i].draw(context);
    }
}

Game.prototype.run = function () {
    this.move();
    this.draw();
    requestAnimationFrame(this.run.bind(this));
}

Game.prototype.levelUp = function () {
    this.level = this.level + 1;
}

Game.prototype.start = function () {
    this.t0 = Date.now();
    this.bindEvent();
    this.run();
}

Game.prototype.draw = function () {
    context.drawImage(bg.offCanvas, 0, 0, canvas.width, canvas.height);

    context.drawImage(rail.offCanvas, 0, -rail.y * scale.height, canvas.width, rail.height, 0, 329 * scale.height, canvas.width, canvas.height - 329 * scale.height);
    // context.drawImage(rail.offCanvas, 0, 329 * scale.height, canvas.width, canvas.height - 329 * scale.height, 0, 329 * scale.height, canvas.width, canvas.height - 329 * scale.height);
    // context.drawImage(rail.offCanvas, 0, 0, canvas.width, canvas.height);

    ball.draw(context);

    var i = bricks.length;
    while (i--) {
        bricks[i].draw(context);
    }
}

Game.prototype.move = function () {
    ball.move();

    if (ball.state === 'up' && ball.y < 329) { //329 * scale.height) {
        rail.move();
        var length = bricks.length;
        for (var i = 0; i < length; i++) {
            var brick = bricks[i];
            brick.move();
            if (brick.name === 'break') {
                if (brick.y < 329) {
                    brick.visible = false;
                }
            } else {
                if (brick.y < brick.originaly) {
                    this.refresh();
                    break;
                }
            }
        }
    }
}

Game.prototype.bindEvent = function () {
    var that = this;

    if (window.DeviceMotionEvent) {
        // Mobile browser support motion sensing events
        window.addEventListener('devicemotion', deviceMotionHandler, false);
    } else {
        // Mobile browser does not support the motion sensing events
        alert('Not Support Device Motion Event!');
    }

    var shakeTimes = 0,
        shakePower = 0,
        t0 = Date.now();

    function deviceMotionHandler(e) {
        config.acceleration = e.acceleration;
        var a = e.acceleration,
            t1 = Date.now();
        var t = t1 - t0,
            power = Math.abs(~~(a.y));


        // document.title = ball.power + ',' + ball.vy + ',' + rail.moving;
        if (power > 5 && power < 200) {
            // 不管向上或向下都会增加能量
            ball.power += power;
            shakeTimes++;
        }

        if (t > 1000) {
            if (shakeTimes > 5) {
                if (shakeTimes > 10) {
                    shakeTimes = 10;
                    if (ball.ay > 0) {
                        ball.ay = shakeTimes;
                    } else {
                        ball.ay = -shakeTimes;
                    }
                } else {
                    if (ball.ay > 0) {
                        ball.ay += shakeTimes;
                        if (ball.ay > 10) {
                            ball.ay = 10;
                        }
                    } else {
                        ball.ay -= shakeTimes;
                        if (ball.ay < -10) {
                            ball.ay = -10;
                        }
                    }
                }
            } else {
                if (ball.ay > 1) {
                    ball.ay -= 1;
                } else if (ball.ay < -1) {
                    ball.ay += 1;
                } else {
                    if (ball.ay > 0) {
                        ball.ay = 1;
                    } else {
                        ball.ay = -1;
                    }
                }
            }
            shakeTimes = 0;
            t0 = t1;
        }
    }

}

Game.prototype.refresh = function () {
    rail.y = 0;

    var newBricks = [],
        state = 'crack',
        length = bricks.length;
    for (var i = 0; i < length; i++) {
        if(i) {
             state = 'new';
        }
        newBricks.push(new Brick(i, state));
    }

    bricks = newBricks;

    ball.breakIndex = 0;
}

/* index.js */
var loadingList = [
    {key: 'break', type: 'audio', ogg: 'break.mp3'},
    {key: 'one', type: 'audio', ogg: 'one.wav'},
    {key: 'two', type: 'audio', ogg: 'two.wav'},
    {key: 'three', type: 'audio', ogg: 'three.wav'},
    {key: 'qiu1', type: 'image', png: 'qiu1.png'},
    {key: 'qiu2', type: 'image', png: 'qiu2.png'},
    {key: 'qiu3', type: 'image', png: 'qiu3.png'},
    {key: 'qiu4', type: 'image', png: 'qiu4.png'},
    {key: 'muban1', type: 'image', png: 'muban1.png'},
    {key: 'muban2', type: 'image', png: 'muban2.png'},
    {key: 'muban3', type: 'image', png: 'muban3.png'},
    {key: 'lanl', type: 'image', png: 'lanl.png'},
    {key: 'lanr', type: 'image', png: 'lanr.png'},
    {key: 'ganl', type: 'image', png: 'ganl.png'},
    {key: 'ganr', type: 'image', png: 'ganr.png'},
    {key: 'ding', type: 'image', png: 'ding.png'},
    {key: 'gangqiu1', type: 'image', png: 'gangqiu1.jpg'}
];

var loadingLength = loadingList.length,
    loadingIndex = 0;

timer = window.setInterval(function(){
    var p = parseInt(loadingIndex / loadingLength * 6);
    $loading.find('.jin:lt(' + p + ')').show();
    $loading.find('.jin:gt(' + p + ')').hide();
}, 100);

function loadAudio () {
    var key = loadingList[loadingIndex].key,
        audio = new Audio();
        // audio = document.createElement('audio');
    // alert(audio);
    audio.src = config.imgUrlPrefix + 'audio/' + loadingList[loadingIndex].ogg;
    audio.load();
    gameAudio[key] = audio;
    ++loadingIndex;
    finish();
    // audio.onloadedmetadata = function() {};
}

function loadImage() {
    var key = loadingList[loadingIndex].key,
        img = document.createElement('img');
    img.src = config.imgUrlPrefix + 'images/' + loadingList[loadingIndex].png;
    img.onload = function () {
        gameImage[key] = img;
        ++loadingIndex;
        finish();
    };
}

function loading() {
    var type = loadingList[loadingIndex].type;
    if (type === 'audio'){
        loadAudio();
    }
    if(type  === 'image') {
        loadImage();
    }
}
loading();
function finish() {
    if(loadingIndex !== loadingLength) {
        loading();
    } else {
        window.clearInterval(timer);
        $text.show();
        $loading.hide();
        init();
    }
}

function init() {
    bg = new Background();
    rail = new Rail();
    ball = new Ball();
    for (var i = 0; i < 8; i++) {
        var brick = new Brick(i, 'new');
        bricks.push(brick);
    }
    game = new Game();

    function countDown() {
        timer = window.setInterval(function () {
            if (!config.acceleration) {
                alert('your browser not support devicemotion!');
                window.location.href = config.indexUrl;
            } else {
                var txt = djs.text();
                djs.text(txt - 1);
                if (txt === '1') {
                    window.clearInterval(timer);
                    var boardRandom = parseInt(Math.random() * 10);
                    var youtuSrc = config.imgUrlPrefix + 'images/type' + boardRandom + '.jpg';
                    window.location.href = config.resultUrl + '?u=' + youtuSrc + '&boardLevel=' + config.level +'&boardRandom=' + boardRandom;
                }
            }
        }, 1000);
    }

    var cover = document.getElementById('js_cover');
    cover.style.display = 'block';
    var N = 3,
        NA = ['one', 'two', 'three'];
    timer = window.setInterval(function () {
        $text.hide();
        if (N < 3) {
            document.getElementById('js_img' + (N + 1)).style.display = 'none';
        }
        if (N < 1) {
            cover.style.display = 'none';
            window.clearInterval(timer);
            countDown();
            game.start();
            return false;
        }
        gameAudio[NA[N - 1]].play();
        document.getElementById('js_img' + N).style.display = 'block';
        N--;
    }, 1000);
}
