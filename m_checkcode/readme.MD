
## 路径介绍
```
├── build
│   └── js
│       ├── entry.js
│       └── entry.js.map
├── dev
│   └── js
│       ├── action.js
│       ├── default.js
│       ├── encryptors.js
│       ├── entry.js
│       ├── imgAction.js
│       ├── login.js
│       ├── main.js
│       ├── request.js
│       ├── util
│       │   └── tool.js
│       └── verify
│           └── verify.js
├── gulpfile.js
├── node_modules
├── package.json
├── readme.MD
└── server
    ├── app.js
    ├── package.json
    ├── routes
    │   ├── api.js
    │   └── index.js
    └── views
        └── login.html
```
/build

* 基于/dev/js/entry.js打包的文件存放路径

/dev

* 开发路径
* 其中main.js是php测试站用
* entry.js是给node测试站用

/server

* node代码
* 主要用于模拟第三方页面调用PHP接口

## 访问方法

**PHP测试站：**

* http://m.test.fang.com/public/?c=checkcode&a=index

**Node测试站**

* http://drag.test.fang.com/login/
* 需要配置本地环境硬解，并运行/server内的代码

## 运行并访问Node测试服务器

1.进入/server

2.运行npm install

3.node app.js

4.http://drag.test.fang.com/login/

## TODO

* 提供一个方法，把key和自己的后台地址传进去后就完成初始话
* js根据ajax返回路径加载
* 验证逻辑的准确性