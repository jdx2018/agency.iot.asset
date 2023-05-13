const token = require("../auth/token");
const dbClient = require("../db/db.mysql");
const login = require('./login');
const sendEmail = require('../utility/sendMail').sendEmail;

const sendAddress_config = {
    user: '3588103616@qq.com',
    pass: 'ooetamtlabrecida'
}
// const sendAddress_config = {
//     user: '2574650379@qq.com',
//     pass: 'ilgdrlwvzxaadjcg'
// }
const notifyTypeEnum = {
    "placeShift": "1",
    "deviceOffline": "2"
}

// 验证登录接口：
async function iotData_login(reqParams) {
    try {
        let reqObj = validatePostRequestBody(reqParams);
        let res = await login.authUser(reqObj.body.tenantId, reqObj.body.userId, reqObj.body.pwd);
        if (res.code == 1) {
            res.message = "登录成功";
            res.data.user = {
                "tenantId": res.data.user.tenantId,
                "userName": "",
                "telNo": "",
                "mobile": "",
                "email": ""
            }
            return res;
        } else {
            res.code = -1001;
            return res;
        };
    } catch (err) {
        return { code: -1001, message: "登录失败：" + err.message }
    }
}

// 上传数据接口：
async function iotData_put(reqParams) {
    try {
        // console.log(reqParams)
        let reqObj = validatePostRequestBody(reqParams);
        let body = reqObj.body;
        // 1. 先验证token：
        // let res_tokenVerify = await token.verify(body.userId, reqObj.access_token);
        // if (res_tokenVerify.code != 1) {
        //     throw new Error(res_tokenVerify.message);
        // }
        // 2. 再查询这个设备是否已注册:
        const device_res = await dbClient.Query('tenant_device', { tenantId: body.tenantId, deviceId: body.deviceId });
        if (device_res.results.length < 1) {
            throw new Error('该设备尚未注册。')
        }
        // 3. 保存设备上传的数据：
        await dbClient.Insert("tenant_iot_data_raw", body);

        // 4. 需返回报警字段的数据：
        const res_asset = await dbClient.Query("tenant_asset", { tenantId: body.tenantId, epc: body.epc });
        // console.log(res_asset.results)
        /**
         * 报警逻辑：
         * 前提条件是资产受监测，即isMonitor=1
         * 1. 资产空闲状态下，经过任一监测点，出馆方向都实现报警。
         * 2. 资产使用状态下，有设置了资产的使用位置，在经过资产位置区域内的监测点，且是出馆方向数据就实现报警。
         */
        if (body.tenantId !== "union" && body.direction == 2 && res_asset.results.length > 0) {
            let target_asset = res_asset.results[0];
            if ((target_asset.status == 0 && target_asset.isMonitor == 1)
                || (target_asset.status != 0 && target_asset.isMonitor == 1 && target_asset.placeId && target_asset.status != 2)
            ) {
                const alarmRecord = {
                    tenantId: body.tenantId,
                    assetId: res_asset.results[0].assetId,
                    deviceId: body.deviceId,
                    epc: body.epc,
                    alarmTime: new Date()
                };
                // console.log(alarmRecord);
                // 保存报警记录：
                await dbClient.Insert("tenant_iot_alarm", alarmRecord);
                // 发送报警邮件：
                await executeSendEmail(res_asset.results[0], body.deviceId);

                return { "code": 1, "message": "上传成功", data: { alarm: true } }
            }
        }

        // 逻辑：只要租户为【union】的资产，经过通道门，即进行报警：
        if (body.tenantId === "union" && res_asset.results.length > 0) {
            let target_asset = res_asset.results[0];
            if ((target_asset.status == 0 && target_asset.isMonitor == 1)
                || (target_asset.status != 0 && target_asset.isMonitor == 1 && target_asset.placeId && target_asset.status != 2)
            ) {
                const alarmRecord = {
                    tenantId: body.tenantId,
                    assetId: res_asset.results[0].assetId,
                    deviceId: body.deviceId,
                    epc: body.epc,
                    alarmTime: new Date()
                };
                // console.log(alarmRecord);
                // 保存报警记录：
                await dbClient.Insert("tenant_iot_alarm", alarmRecord);
                // 发送报警邮件：
                await executeSendEmail(res_asset.results[0], body.deviceId);

                return { "code": 1, "message": "上传成功", data: { alarm: true } }
            }
        }

        return { "code": 1, "message": "上传成功" };
    } catch (error) {
        // console.log(error)
        return { code: -1101, message: "数据保存失败： " + error.message }
    }
}

function validatePostRequestBody(reqParams) {
    if (!reqParams) {
        throw new Error("请求参数不能为空");
    }
    let reqParams_obj = JSON.parse(reqParams);
    if (!reqParams_obj.body) {
        throw new Error("请求body不能为空");
    };
    if (reqParams_obj.access_token) {
        if (!reqParams_obj.body.tenantId) { throw new Error("请求body的tenantId字段不能为空。") };
        if (!reqParams_obj.body.userId) { throw new Error("请求body的userId字段不能为空。") };
        // if (!reqParams_obj.body.epc) { throw new Error("请求body的epc字段不能为空。") };
        if (!reqParams_obj.body.deviceId) { throw new Error("请求body的deviceId字段不能为空。") };
    }
    return reqParams_obj;
}
// 发送报警邮件逻辑：
async function executeSendEmail(assetInfo, deviceId) {
    try {
        let asset_name_res = await dbClient.Query("v_asset_name_collect", { tenantId: assetInfo.tenantId, assetId: assetInfo.assetId });
        let device_info_res = await dbClient.Query("tenant_device", { tenantId: assetInfo.tenantId, deviceId })
        let deviceInfo = device_info_res.results[0];
        let { useOrgName, placeName, managerEmail, assetName, useEmployeeName } = asset_name_res.results[0];
        let emailAddress = managerEmail;
        if (!emailAddress) {
            throw new Error("该账号的邮箱不存在，请检查结果。")
        }
        const title = `资产异常报警提醒-[报警类型]-[资产编号: ${assetInfo.assetId}/资产名称:${assetName}]`;
        const content = `您好，【资产编号：${assetInfo.assetId}/资产名称: ${assetName}/使用部门: ${useOrgName}/使用人：${useEmployeeName}/所在位置: ${placeName}】产生报警记录，
                         报警设备：【设备编号: ${deviceId}/设备名称：${deviceInfo.deviceName}/设备位置：${deviceInfo.placeName}】`;
        // console.log(content)
        let res = await sendEmail(sendAddress_config, emailAddress, title, content);
        const emailSendRecord = {
            tenantId: assetInfo.tenantId,
            notifyType: notifyTypeEnum.placeShift,
            fromAddr: sendAddress_config.user,
            toAddr: emailAddress,
            ccAddr: '', // 抄送
            bcAddr: '', // 密送
            title,
            content,
            code: res.code,
            message: res.code === 1 ? 'success' : 'failure',
            createTime: new Date(),
            createPerson: 'system',
            remarks: ''
        };
        await dbClient.Insert("tenant_log_email", emailSendRecord);
    } catch (error) {
        // console.log(error)
        throw new Error("邮件发送失败：" + error.message)
    }
}

module.exports.iotData_login = iotData_login;
module.exports.iotData_put = iotData_put;


// executeSendEmail({ tenantId: "union", assetId: "PENI114" }, '00-14-97-2D-67-7B')