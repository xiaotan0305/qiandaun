let express = require('express');
let router = express.Router();
let chalk = require('chalk');

// 登录模板页
router.get('/login', function (req, res) {
    console.log(chalk.green('登录模板页'));
    res.render('login', {
        title: '登录'
    });
});

module.exports = router;