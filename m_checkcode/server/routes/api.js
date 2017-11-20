'use strict';
// const axios = require('axios');
const qs = require('qs');
const http = require('http');
const zlib = require('zlib');
const chalk = require('chalk');
const express = require('express');
const router = express.Router();

const key = 'ca0313bc6a50f76d200a900c02062b7d';

// 接口
router.post('/init', function (req, res) {
    console.log(chalk.green('防刷初始化'));
    let params = {
        c: 'checkcode',
        a: 'codeInit',
        key: key
    };
    let reqData = qs.stringify(params);
    let request = http.request({
        hostname: 'm.test.fang.com',
        path: '/public/?' + reqData,
        method: 'get',
        encoding: null
    }, (response) => {
        let resData = '';
        let encoding = response.headers['content-encoding'];
        response.on('data', (chunk) => {
            if (encoding === 'gzip') {
                resData += zlib.gunzipSync(chunk);
            } else {
                resData += chunk;
            }
        });
        response.on('end', () => {
            res.send(resData);
        });
    });
    request.on('error', (e) => {
        res.send(e);
    });
    request.end();
});

// 验证
router.post('/login', function (req, res) {
    let query = req.body;
    let params = {
        c: 'checkcode',
        a: 'codeCheck',
        key: key,
        gt: query.fc_gt,
        challenge: query.fc_challenge,
        validate: query.fc_validate
    };

    let reqData = qs.stringify(params);;
    let request = http.request({
        hostname: 'm.test.fang.com',
        path: '/public/?' + reqData,
        method: 'get',
        encoding: null
    }, (response) => {
        let resData = '';
        let encoding = response.headers['content-encoding'];
        response.on('data', (chunk) => {
            if (encoding === 'gzip') {
                resData += zlib.gunzipSync(chunk);
            } else {
                resData += chunk;
            }
        });
        response.on('end', () => {
            res.send(resData);
        });
    });
    request.on('error', (e) => {
        res.send(e);
    });
    request.end();
});

module.exports = router;