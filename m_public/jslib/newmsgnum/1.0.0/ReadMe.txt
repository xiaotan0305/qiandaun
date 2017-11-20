newsmsgnum Release 说明文档

1.功能

    消息数量及时显示组件

2.用法

    require.async(["newmsgnum/1.0.0/newmsgnum"],function(NewMsgNum){
        new NewMsgNum(vars.mainSite,vars.city).getMsg(newMsgDom);
    });