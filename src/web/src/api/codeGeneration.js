const dbClient = require('./db/db.client').dbClient;
// const dbClient = require('./db/db.local').db_local_client;
const table = require('./db/tableEnum').table;
const dayjs = require('dayjs');

const getCurTime = () => dayjs().format('YYYY-MM-DD HH:mm:ss');

const error_response = {
  code: -1,
  message: '获取编码失败，请稍后再试',
};
const START_CODE = 1;

// const LOCK_TIMEOUT = 1 * 60;

/**
 * 编码流水生成
 * interface Task {
 *     codeType: string;
 *     codeStart: number
 * }
 * @params Task<Array>
 * @example
 * { code: 1, data: {asset: 76, epc: 88}
 */
async function codeGeneration(taskList) {
  const res = dbClient.ExecuteTrans(async (con) => {
    let result = { code: 1, data: {} };
    for (let i = 0; i < taskList.length; i++) {
      let res_code = await getStartCodeByCodeType(con, taskList[i]);
      result.data = { ...result.data, ...res_code };
    }

    return result;
  });
  return res;
}

async function getStartCodeByCodeType(con, { codeType, count = 1 }) {
  const lock_query = { codeType, locked: 0 };
  const lock_content = { locked: 1, lockedTime: getCurTime() };
  const res_lock_update = await dbClient.UpdateWithCon(con, table.tenant_code, lock_query, lock_content);
  if (res_lock_update.code !== 1) throw res_lock_update;
  const res_lock_query = await dbClient.QueryWithCon(con, table.tenant_code, { codeType });
  if (res_lock_query.code !== 1) throw res_lock_query;
  let lockSuccess = res_lock_update.data.affectedRows > 0; // 锁定成功
  let codeExists = res_lock_query.data.length > 0; // 编码类型存在
  if (codeExists && !lockSuccess) {
    throw error_response;
  }
  if (!codeExists) {
    const content = {
      codeStart: START_CODE,
      locked: 0,
      lockedTime: getCurTime(),
      codeType,
    };
    const res_lock_insert = await dbClient.InsertWithCon(con, table.tenant_code, content);
    if (res_lock_insert.code !== 1) throw res_lock_insert;
    return { [codeType]: START_CODE };
  }
  const nextCode = res_lock_query.data[0].codeStart + count;
  const res_code_update = await dbClient.UpdateWithCon(
    con,
    table.tenant_code,
    { codeType },
    {
      codeStart: nextCode,
      locked: 0,
      lockedTime: null,
    }
  );
  if (res_code_update.code !== 1) throw res_code_update;
  return { [codeType]: nextCode };
}

module.exports.codeGeneration = codeGeneration;
