# FangPlayer

> 房天下视频播放器，PC端和移动端通用，兼容IE9及以上。

## 简介

[示例Demo](http://dev.brofen.cn/Fang/fangPlayer/)

[使用文档](http://dev.brofen.cn/Fang/fangPlayer/docs)

**HTML5播放器**
![image](http://7xih9g.com1.z0.glb.clouddn.com/XPlayer.jpg)

**FLASH播放器**
![image](http://7xih9g.com1.z0.glb.clouddn.com/XPlayer-Flash.jpg)

## 快速上手

> 可通过AMD、CMD模块化调用，也支持script直接引入。

```js
var fp = new fangPlayer({
    // debug 模式，可选
    debug: true,
    // 插入播放器的DOM，必填
    holder: '#v-box',
    // flash视频id，必填
    Vinfoid: '2b70d4415e7a411885eb342ad91d3a3a',
    // html5视频封面图，可选
    poster: 'http://7xih9g.com1.z0.glb.clouddn.com/countdown-clock.png',
    // html5视频播放地址，必填
    src: 'http://106.38.250.142/xdispatch/7xp6cu.dl1.z0.glb.clouddn.com/360.mp4',
    // 优先级，可选，有flash、html5、Vinfoid
    // 但仍然取决于浏览器支持情况
    type: 'flash'
});
```
## 相关项目

本项目基于[XPlayer](http://git.brofen.cn/fenglinzeng/XPlayer)进行二次定制。

## 开源协议

基于[WTFPL](http://en.wikipedia.org/wiki/WTFPL)协议开源