const fs = require('fs');
const path = require('path');
const url = require('url');
const qs = require('querystring');
const router = require('./router');
const api = require('./api');
// Handle your routes here, put static pages in ./public and they will server
const Action = {
    'rootPage': '/',
    'graphOperate': "/iot/graphOperate",
    'iotDataLogin': '/v1.0/user/login',
    'iotDataPut': '/v1.0/iot/data/put'

};

const ContentTypeEnum = {
    'text': { 'Content-Type': 'text/plain; charset=utf-8' },
    'json': { 'Content-Type': 'application/json; charset=utf-8' }
};

//响应客户端请求，状态码枚举
const StatusCodeEnum = {
    'error': 405,
    'success': 200
};

/*响应客户端请求 */
function actionExecute(req, res, func) {
    let reqBody = [];
    req.on('data', (chunk) => {
        reqBody.push(chunk);
    }).on('end', () => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "access_token,api_version,Accept-Language,x-requested-with,content-type");
        res.setHeader('Access-Control-Expose-Headers', 'access_token');
        res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS")
        if (req.method === "OPTIONS") {
            res.writeHead(StatusCodeEnum.success, ContentTypeEnum.json);
            res.end();
        }
        else {
            let data = Buffer.concat(reqBody).toString();
            func(req, res, data);
        }
    });
}

//注册路由 响应客户端请求
module.exports.registAction = function () {
    //默认页面
    router.register(Action.rootPage, (req, res) => { actionExecute(req, res, api.welcome) });
    router.register(Action.graphOperate, (req, res) => { actionExecute(req, res, api.graphOperate) });
    router.register(Action.iotDataLogin, (req, res) => { actionExecute(req, res, api.iotDataLogin) });
    router.register(Action.iotDataPut, (req, res) => { actionExecute(req, res, api.iotDataPut) });
};

