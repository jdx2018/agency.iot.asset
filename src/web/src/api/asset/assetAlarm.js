/**
 * 资产相关数据操作
 */
// const dbClient = require("../db/db.local").db_local_client;
const dbClient = require("../db").dbClient;
const billCommon = require("../bill/billCommon");
const table = require("../db/tableEnum").table;
const cache = require("../cache");

/**
 * 获取分类新增/编辑模板
 */
async function getTemplate() {
    let viewDef = cache.view_get().assetAlarm;
    let objTemplate = JSON.parse(JSON.stringify(viewDef.objTemplate));
    return { code: 1, message: "success", data: objTemplate };
}
/**
 * 获取资产报警记录表：
 * @param {*} filter 
 */
async function getAlaramList(filter) {
    let viewDef = cache.view_get().assetAlarm;
    // 正常情况下，只取报警未处理的：
    let query = { status: 0 };
    let header_main = viewDef.header.main;
    let statusMap = viewDef.typeDef.statusMap;
    if (filter) {
        if (filter.alarmDate_start) {
            query.alarmTime = { $gte: filter.alarmDate_start };
            delete filter.alarmDate_start;
        }
        if (filter.alarmDate_end) {
            if (!query.alarmTime) {
                query.alarmTime = {};
            }
            query.alarmTime.$lte = filter.alarmDate_end;
            delete filter.alarmDate_end;
        }
        Object.keys(filter).forEach((key) => {
            query[key] = filter[key];
        })
    };

    let fields = billCommon.header2Fields(header_main, null);
    console.log(header_main)
    let res_alarm = await dbClient.Query(table.v_asset_alarm, query, fields, null, null, { createTime: 0 });
    console.log(res_alarm)
    if (res_alarm.code != 1) { return res_alarm; };
    let rows = res_alarm.data;
    for (let i = 0; i < rows.length; i++) {
        rows[i].status = statusMap[rows[i].status];
    }
    return {
        code: 1, message: "success",
        data: {
            header: header_main,
            rows: rows,
            filter: viewDef.filter
        }
    };
}
/**
 * 报警处理，添加备注信息
 * @param {int} id 唯一键值
 * @param {*} assetId 资产编号
 * @param {*} remarks 处理备注
 */
async function updateAlarm(id, assetId, remarks) {
    return await dbClient.Update(table.tenant_iot_alarm,
        { id: id, assetId: assetId },
        { status: 1, remarks: remarks })
}
/**
 * 批量处理报警记录
 * @param {array<id,assetId>} assetList 
 * @param {string} remarks 
 */
async function updateAlarmList(assetList, remarks) {
    return await dbClient.ExecuteTrans(async (con) => {
        try {
            for (let i = 0; i < assetList.length; i++) {
                let id = assetList[i].id;
                let assetId = assetList[i].assetId;
                let res = await dbClient.UpdateWithCon(con, table.tenant_iot_alarm,
                    { id: id, assetId: assetId },
                    { status: 1, remarks: remarks });
                if (res.code != 1) {
                    throw res;
                }
            }
            return { code: 1, message: "处理成功" };
        }
        catch (err) {
            throw err;
        }
    });

}
module.exports.getTemplate = getTemplate;
module.exports.getAlaramList = getAlaramList;
module.exports.updateAlarm = updateAlarm;
module.exports.updateAlarmList = updateAlarmList;

