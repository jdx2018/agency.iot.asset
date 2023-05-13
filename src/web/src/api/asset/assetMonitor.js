/**
 * 资产相关数据操作
 */
// const dbClient = require("../db/db.local").db_local_client;
const dbClient = require("../db").dbClient;
const billCommon = require("../bill/billCommon");
const table = require("../db/tableEnum").table;
const cache = require("../cache");


async function getAssetList_monitor(filter) {
    let viewDef = cache.view_get().assetMonitor;
    let query = { };
    let header_main = viewDef.header.main;
    if (filter) {
        if (filter.collectTime_start) {
            query.collectTime = { $gte: filter.collectTime_start };
            delete filter.collectTime_start;
        }
        if (filter.collectTime_end) {
            if (!query.collectTime) {
                query.collectTime = {};
            }
            query.collectTime.$lte = filter.collectTime_end;
            delete filter.collectTime_end;
        }
        Object.keys(filter).forEach((key) => {
            query[key] = filter[key];
        })
    };

    let fields = billCommon.header2Fields(header_main, null);
    let res_monitor = await dbClient.Query(table.v_asset_monitor, query, fields, 1, 1000,{createTime:0});
    // console.log("监控数据查询");
    // console.log(res_monitor.data)
    // console.log(query);
    if (res_monitor.code != 1) { return res_monitor; };
    let rows = res_monitor.data;
    return {
        code: 1, message: "success",
        data: {
            header: header_main,
            rows,
            filter: viewDef.filter
        }
    };
}
module.exports.getAssetList_monitor = getAssetList_monitor;