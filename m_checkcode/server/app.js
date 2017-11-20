let app = require('express')();

// 处理post
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
}));

// 模板引擎
let path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// 路由
let index = require('./routes/index');
let api = require('./routes/api');
app.use('/', index);
app.use('/api', api);

// 监听端口
let chalk = require('chalk');
app.listen(20176, function () {
    console.log(chalk.green('running on port 20176'));
});