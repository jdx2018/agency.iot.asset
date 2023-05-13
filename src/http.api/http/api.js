const token = require("../auth/token");
const login = require("../business/login");
const dbOperate = require("../business/db.graphQL");
const iotData = require("../business/iotData")
/**
 * 请求命令枚举
 */
const graphCommand = {
    "login": 100,//登录
    "dbBase": 300,//单表CRUD基本操作
}
/**
 * 需要token验证的请求命令
 */
const needAuthCommand = [300];
/**
 * function封装
 */
let commandHandler = {}

/**
 * 响应http请求，返回请求结果
 * @param {http response} response 
 * @param {返回结果} result 
 */
function actionResponse(response, result) {
    let msg = "not data result."
    if (result) {
        msg = JSON.stringify(result);
    }
    response.writeHead(200,
        {
            'Content-Type': 'application/json; charset=utf-8',
        });
    //console.log(msg)
    response.write(msg);
    response.end();
}
/**
 * 欢迎页面
 * @param {*} data 
 * @param {*} response 
 */
function welcome(req, res, data) {
    let result = { code: 1, message: "hello，welcome!" }
    actionResponse(res, result);
}
/**
 * graph封装请求并响应
 * @param {*} req 
 * @param {*} resp 
 * @param {*} body 
 */
async function graphOperate(req, resp, body) {
    let functionName = "";
    if (!body) {
        actionResponse(resp, { code: -11, message: "请求body不能为空" });
        return;
    }
    let data = JSON.parse(body);
    try {
        Object.keys(graphCommand).forEach(keyName => {
            if (graphCommand[keyName] === data.command) {
                functionName = keyName;
            }
        })
        if (functionName.length < 1) {
            actionResponse(resp, { code: -10, message: "请求的命令不存在，请核对." });
            return;
        }
        // 不需要验证token的请求，可直接执行：
        if (!needAuthCommand.includes(data.command)) {
            commandHandler[functionName](req, resp, data);
            return;
        }
        // 需要验证token的请求
        let res = await token.verify(data.userId, req.headers["access_token"]);
        if (res.code != 1) {
            actionResponse(resp, res);
            return;
        }
        else {
            commandHandler[functionName](req, resp, data);
        }
    }
    catch (err) {
        actionResponse(resp, { code: -13, message: "执行请求错误." + err.message });
        return;
    }
}
/**
 * 登录
 */
commandHandler.login = async function (req, resp, data) {
    let res = await login.authUser(data.tenantId, data.userId, data.pwd);
    actionResponse(resp, res);
}
/**
 * 基础数据库请求
 */
commandHandler.dbBase = async function (req, resp, data) {
    let res = await dbOperate.graphQL(data);
    //console.log("dbBase result.");
    actionResponse(resp, res);
}

// 数据上传登录接口：
async function iotDataLogin(req, resp, reqParams) {
    let res = await iotData.iotData_login(reqParams);
    actionResponse(resp, res);
}

// 数据上传接口：
async function iotDataPut(req, resp, reqParams) {
    let res = await iotData.iotData_put(reqParams);
    actionResponse(resp, res);
}

module.exports.welcome = welcome;
module.exports.graphOperate = graphOperate;
module.exports.iotDataLogin = iotDataLogin;
module.exports.iotDataPut = iotDataPut;
