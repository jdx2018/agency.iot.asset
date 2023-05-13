const dbClient = require('./db/db.client').dbClient;
const table = require('./db/tableEnum').table;
const cache = require('./cache');
const dayjs = require('dayjs');

const getCurTime = () => dayjs().format('YYYY-MM-DD HH:mm:ss');

/**
 * 编码流水生成
 * @params interface assetList {
 *     assetId: string;
 * }[]
 * @params billNo 单据编号
 * @params behavior 行为
 * @example
 * { code: 1, message: '资产变更记录成功'}
 */
async function writeAssetBehavior(behavior, assetList, billNo) {
  const { userId } = cache.user_get();
  const curTime = getCurTime();
  const content = assetList.map((asset) => ({
    assetId: asset.assetId,
    billNo,
    behavior,
    actionPerson: userId,
    actionTime: curTime,
  }));
  const res_insert = await dbClient.InsertMany(table.tenant_asset_lifeline, content);

  if (res_insert.code !== 1) throw res_insert;
  return { code: 1, message: '资产变更记录成功' };
}

module.exports.writeAssetBehavior = writeAssetBehavior;
