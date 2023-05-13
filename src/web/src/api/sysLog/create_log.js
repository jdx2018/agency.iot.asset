const dayjs = require('dayjs'); 
const dbClient = require('../db/db.client').dbClient;
const table = require('../db/tableEnum').table;

module.exports = async function (opUserId, opTarget, opType, opContent) {
    try {
        let res = await dbClient.Insert(table['tenant_sys_log'], {
            opUserId, opTarget, opType, opContent,
            opTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
        })
    } catch (error) {
        return { code: -1, message: '日志记录失败：' + error.messsage, data: null }
    }
}