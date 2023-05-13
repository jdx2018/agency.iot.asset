const dbClient = require("../db").dbClient;
const table = require("../db/tableEnum").table;
const billCommon = require("../bill/billCommon");
const cache = require("../cache");


/**
 * 查询所有设备监控数据列表：
 */
async function getDeviceMonitorList(filter) {
    const viewDef = cache.view_get().deviceMonitor;
    let query = {};
    let header_main = viewDef.header.main;
    let statusMap = viewDef.typeDef.statusMap;

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
    // console.log("查询设备-query,filter",query,filter);

    let fields = billCommon.header2Fields(header_main, null);
    let res_List = await dbClient.Query(table.v_device_monitor, query, fields);
    if (res_List.code != 1) { return res_List; }
    let rows = res_List.data;
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

module.exports.getDeviceMonitorList = getDeviceMonitorList;

