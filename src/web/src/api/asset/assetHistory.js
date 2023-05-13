const dbClient = require('../db').dbClient;
const billCommon = require('../bill/billCommon');
const table = require('../db/tableEnum').table;
const cache = require('../cache');

async function getAssetHistory(filter) {
  let viewDef = cache.view_get().assetHistory;
  let actionMap = viewDef.typeDef.actionMap;
  let query = {};
  let header_main = viewDef.header.main;
  if (filter) {
    if (filter.actionTime_start) {
      query.actionTime = { $gte: filter.actionTime_start };
      delete filter.actionTime_start;
    }
    if (filter.actionTime_end) {
      if (!query.actionTime) {
        query.actionTime = {};
      }
      query.actionTime.$lte = filter.actionTime_end;
      delete filter.actionTime_end;
    }
    Object.keys(filter).forEach((key) => {
      query[key] = filter[key];
    });
  }
  let fields = billCommon.header2Fields(header_main, null);
  let res_history = await dbClient.Query(table.tenant_asset_lifeline, query, fields, 1, 1000, { createTime: 0 });
  if (res_history.code !== 1) {
    return res_history;
  }

  let rows = res_history.data.map((_) => ({
    ..._,
    billNo: Buffer.from(_.billNo).toString(),
    behavior: actionMap[_.behavior],
  }));

  return {
    code: 1,
    message: 'success',
    data: {
      header: header_main,
      rows,
      filter: viewDef.filter,
    },
  };
}
module.exports.getAssetHistory = getAssetHistory;
