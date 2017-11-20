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

    function deviceMotionHandler(event) {
        var a = event.acceleration,
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

    var newBricks = [];
    var length = bricks.length;
    var newLength = 0;
    for (var i = 0; i < length; i++) {
        var brick = bricks[i];
        newLength = newBricks.length;
        if (brick.name !== 'break') {
            brick.init(newLength);
            newBricks.push(brick);
        }
    }

    for (var i = newLength + 1; i < 8; i++) {
        newBricks.push(new Brick(newLength, 'new'))
    }
    bricks = newBricks;

    ball.breakIndex = 0;
}
