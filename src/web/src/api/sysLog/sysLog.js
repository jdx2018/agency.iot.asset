const dbClient = require('../db').dbClient;
const table = require('../db/tableEnum').table;
const fieldTool = require('../tool/fieldTool');
const cache = require('../cache');
/**
 * 查询所有系统日志信息：
 */
async function getSysLogList(filter) {
    // console.log("getSysLogList", filter);
    let viewDef = cache.view_get().sys_log;
    let header_main = viewDef.header.main;
    let sortFields = { opTime: 0 };
    let query = {};

    if (filter) {
        if (filter.opTime_start) {
            query.opTime = { $gte: filter.opTime_start };
            delete filter.opTime_start;
        }
        if (filter.opTime_end) {
            if (!query.opTime) {
                query.opTime = {};
            }
            query.opTime.$lte = filter.opTime_end;
            delete filter.opTime_end;
        }
        Object.keys(filter).forEach((key) => {
            query[key] = filter[key];
        });
    }
    let fields = fieldTool.header2Fields(header_main, null);
    let res = await dbClient.Query(table.tenant_sys_log, query, fields, null, null, sortFields)
    if (res.code != 1) {
        return res;
    }
    return {
        code: 1,
        message: 'success',
        data: {
            header: header_main,
            rows: res.data,
            filter: viewDef.filter,
        },
    };
}

module.exports.getSysLogList = getSysLogList