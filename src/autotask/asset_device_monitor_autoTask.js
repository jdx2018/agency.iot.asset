const mysqlClient = require('../http.api/db/db.mysql');
const { sendEmail } = require('../http.api/utility/sendMail');
const LogService = require('./LogService');
/**
 *  设备监控状态判定：通过具体字段 
 *  funcId="00"，代表心跳数据，正常情况是每5min上传一次；
 *  funcId="21"，代表业务数据，当通道门感应到时触发上传；
 */
const funcId_Enum = {
    heart: "00",
    business: "21"
};
const dataType_Enum = {
    heart: "heart",
    business: "business",
}
const status_Enum = {
    online: 1,
    offline: 0,
}
// 邮件发送相关配置
const sendAddress_config = {
    user: '3588103616@qq.com',
    pass: 'ooetamtlabrecida'
}
const notifyTypeEnum = {
    "placeShift": "1",
    "deviceOffline": "2"
}
// 定时任务时间间隔：
const interval = 0.5 * 60 * 1000;

let n = 0;
handleFunc()
async function handleFunc() {
    let result = null;
    try {
        if (n === 0) {
            console.log(new Date() + '--'+'AutoTask is starting......');
            LogService.logDebug('AutoTask is starting......')
            n++;
        }
        let res_device_status = await mysqlClient.Query('v_device_connectstatus');

        // 重新组装设备监控信息：
        let rebuild_device_status_list = [];
        let add_params = {
            remarks: '定时任务生成设备状态',
            createTime: new Date(),
            createPerson: 'autoTask',
            updateTime: new Date(),
            updatePerson: 'autoTask'
        }
        for (let device of res_device_status.results) {
            let new_device = Object.assign({}, device, add_params);
            new_device.lastHeart = new Date(new_device.lastHeart);
            new_device.lastDateUpdate = new Date(new_device.lastDateUpdate)
            rebuild_device_status_list.push(new_device)
        };
        // 根据视图获取到的：‘最后一次心跳’、‘最后一条数据’的上传时间，判断设备是否离线。
        justifyDeviceIsOutLine(rebuild_device_status_list);

        let delete_res = await mysqlClient.Delete("tenant_device_monitor", {});
        let insert_res = await mysqlClient.InsertMany("tenant_device_monitor", rebuild_device_status_list);

        // console.log({ code: 1, message: "定时任务执行成功，数据已更新。" })
        result = { code: 1, message: "定时任务执行成功，数据已更新。"};
        LogService.logDebug(result)
        return result;
    } catch (err) {
        console.log(err)
        result = { code: -1, message: err.message };
        LogService.logError(result)
        return result;
    }
}

// 设定报警时长期限：
const limit_time = 11 * 60 * 1000
// 设备报警的缓存状态，确保一个数据发生离线之后，只发送一条报警邮件
const device_send_mail_cache = {};

async function justifyDeviceIsOutLine(rebuild_device_status_list) {
    console.log('before')
    console.log(device_send_mail_cache)
    for (let i = 0; i < rebuild_device_status_list.length; i++) {
        let c_device = rebuild_device_status_list[i]
        if(c_device.tenantId==='union'){
            // console.log(c_device)
        }
        let c_device_status = limit_time - (Date.now() - new Date(c_device.lastHeart).getTime()) > 0 ? 1 : 0
        c_device.status = c_device_status

        if (!device_send_mail_cache[c_device.deviceId]) {
            device_send_mail_cache[c_device.deviceId] = {
                status: '在线',
                isSend: '未发送'
            }
        }
        // 在线
        if (c_device_status === status_Enum.online) {
            device_send_mail_cache[c_device.deviceId].status = '在线'
            device_send_mail_cache[c_device.deviceId].isSend = '未发送'
        }
        // 离线
        if (c_device_status === status_Enum.offline) {
            device_send_mail_cache[c_device.deviceId].status = '离线'
            // 未发送
            if (['未发送',''].includes(device_send_mail_cache[c_device.deviceId].isSend)) {
                // console.log('发邮件啦-------------')
                // await device_sendEmail(c_device.tenantId, c_device.deviceId);
                device_send_mail_cache[c_device.deviceId].isSend = '已发送'
            }
        }
    }
    console.log('after')
    console.log(device_send_mail_cache)
}

async function device_sendEmail(tenantId, deviceId) {
    let device_info = await mysqlClient.Query('tenant_device', { tenantId, deviceId });
    if (!device_info.results || device_info.results.length < 1) { throw new Error(`设备[${deviceId}]暂未注册`) };

    let device_ownOrgId = device_info.results[0].ownOrgId;
    let device_user_org_info = await mysqlClient.Query('v_user', { tenantId, manage_orgId: device_ownOrgId });
    
    if (!device_user_org_info.results || device_user_org_info.results.length < 1) { 
        LogService.logError(`设备[${deviceId}]的所属组织[${device_ownOrgId}]暂未绑定有管理员`) 
        return;
    };
    if (!device_user_org_info.results[0].email) { 
        LogService.logError(`设备[${deviceId}]的所属组织[${device_ownOrgId}]的管理员邮箱不存在`) 
        return;
    }
    let emailAddress = device_user_org_info.results[0].email;
    let deviceName = device_info.results[0].deviceName;
    let manageOrgName = device_user_org_info.results[0].manage_orgName;

    let title = `设备离线提醒-[设备ID: ${deviceId}/名称: ${deviceName}]`;
    let content = `您好，【设备ID: ${deviceId}/名称: ${deviceName}/使用部门${manageOrgName}】发生离线，请检查并修复。`
    let res = await sendEmail(
        sendAddress_config,
        emailAddress,
        title,
        content
    );
    const emailSendRecord = {
        tenantId: tenantId,
        notifyType: notifyTypeEnum.deviceOffline,
        fromAddr: sendAddress_config.user,
        toAddr: emailAddress,
        ccAddr: '', // 抄送
        bcAddr: '', // 密送
        title,
        content,
        code: res.code,
        message: res.code === 1 ? '1' : '0',
        createTime: new Date(),
        createPerson: 'system',
        remarks: ''
    };
    await mysqlClient.Insert("tenant_log_email", emailSendRecord);
}

setInterval(handleFunc, interval);

// justifyDeviceIsOutLine([{deviceId:'111',lastHeart:'2021-05-19 10:55:00'}]).then(res=>{
//     console.log(res)
// })
// device_sendEmail('uniontech','00-14-97-2D-67-7B')