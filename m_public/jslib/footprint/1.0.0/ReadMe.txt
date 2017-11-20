footprint.js Release 说明文档

1.功能

    足迹组件

2.用法

    require.async("footprint/1.0.0/footprint", function (run) {
        if (vars.purpose =="住宅") {
            run.push('二手房', vars.esfSite+vars.city+'/', vars.city);
        } else if (vars.purpose =="商铺") {
            run.push('商铺出售', vars.mainSite+'esf_sp/'+vars.city+'/', vars.city);
        } else if (vars.purpose == "写字楼") {
            run.push('写字楼出售', vars.mainSite+'esf_xzl/'+vars.city+'/', vars.city);
        }
    });