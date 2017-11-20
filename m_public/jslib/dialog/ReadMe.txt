artDialog 说明文档

1.功能

    对话框弹出

2.用法

  一 对话框无拖拽功能
    var dialog = require('dialog/6.0.4/dialog');
    var d = dialog({
            title: '消息',
            content: '风吹起的青色衣衫，夕阳里的温暖容颜，你比以前更加美丽，像盛开的花<br>——许巍《难忘的一天》',
            okValue: '确 定',
            ok: function () {
            }
        });
     d.show();

  二 对话框可以拖拽
    var dialog = require('dialog/6.0.4/dialog-plus');
    var d = dialog({
            title: '消息',
            content: '风吹起的青色衣衫，夕阳里的温暖容颜，你比以前更加美丽，像盛开的花<br>——许巍《难忘的一天》',
            okValue: '确 定',
            ok: function () {
            }
        });
    d.show();

3.对话框有千变万化的形态，依据自己需求可以从github中搜寻。
  http://aui.github.io/artDialog/doc/index.html