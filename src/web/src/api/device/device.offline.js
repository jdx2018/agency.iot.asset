const dbClient = require("../db").dbClient;
const table = require("../db/tableEnum").table;
const billCommon = require("../bill/billCommon");
const cache = require("../cache");


/**
 * 资产报警邮件提醒：
 * 查询所有设备邮件报警记录列表：
 */
async function getDeviceOfflineRecord(filter) {
    const viewDef = cache.view_get().deviceOffline;
    let header_main = viewDef.header.main;
    let messageMap = viewDef.typeDef.messageMap;
    let notifyTypeMap = viewDef.typeDef.notifyTypeMap;

    let query = { notifyType: '2' };
    if (filter) {
        if (filter.createTime_start) {
            query.createTime = { $gte: filter.createTime_start };
            delete filter.createTime_start;
        }
        if (filter.createTime_end) {
            if (!query.createTime) {
                query.createTime = {};
            }
            query.createTime.$lte = filter.createTime_end;
            delete filter.createTime_end;
        }
        Object.keys(filter).forEach((key) => {
            query[key] = filter[key];
        })
    };
    let fields = billCommon.header2Fields(header_main, null);
    let res_List = await dbClient.Query(table.tenant_log_email, query, null, null, null, { createTime: 0 });
    if (res_List.code != 1) { return res_List; }
    let rows = res_List.data;
    for (let i = 0; i < rows.length; i++) {
        rows[i].message = messageMap[rows[i].message];
        rows[i].notifyType = notifyTypeMap[rows[i].notifyType];
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

module.exports.getDeviceOfflineRecord = getDeviceOfflineRecord;

