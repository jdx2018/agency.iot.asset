const dbClient = require('../db').dbClient;
const table = require('../db/tableEnum').table;
const billClient = require('./billClient');
const billCommon = require('./billCommon');
const fieldTool = require('../tool/fieldTool');
const selectSource = require('../tool/selectSource');
const asset = require('../asset/asset');
const assetStatus = require('../mock/param_mock').param.assetStatus;
const utility = require('../utility');
const cache = require('../cache');
const writeAssetBehavior = require('../assetLifeLine').writeAssetBehavior;

/**
 * 查询借用单据列表
 * @example
 * { code:"1",message:"success", data:{  header:{},  rows:{}, filter:{}  }
 */
async function queryBill(filter) {
  let viewDef = cache.view_get().bill_chuzhi;
  const user = cache.user_get();
  let fieldMap = viewDef.typeDef.fieldMap;
  let extMap = viewDef.typeDef.extMap;
  let billType = viewDef.typeDef.type;
  let header_main = viewDef.header.main;
  let filter_template = viewDef.filter;
  let statusMap = viewDef.typeDef.statusMap;
  let disposedTypeMap = viewDef.typeDef.disposedTypeMap;
  let sortFields = { createTime: 0 };
  //构造查询条件
  let query = { billType: billType, p_orgId: user.manage_orgId };
  if (filter) {
    if (filter.finishDate_start) {
      query.ext7 = { $gte: filter.finishDate_start };
      delete filter.finishDate_start;
    }
    if (filter.finishDate_end) {
      if (!query.ext7) {
        query.ext7 = {};
      }
      query.ext7.$lte = filter.finishDate_end;
      delete filter.finishDate_end;
    }
    // filter = fieldTool.field2Ext(filter, fieldMap);
    Object.keys(filter).forEach((key) => {
      query[key] = filter[key];
    });
  }

  let fields = fieldTool.header2Fields(header_main, null);

  // let param_proc = {
  //     tenantId: user.tenantId,
  //     userId: user.userId,
  //     query: query,
  //     fields: fields
  // }

  // let res_billList = await dbClient.executeProc(table.p_bill_chuzhi_get, param_proc);

  let res_billList = await dbClient.Query(table.v_bill_chuzhi_org, query, fields, null, null, sortFields);

  // console.log("处置但查询", res_billList);
  if (res_billList.code != 1) {
    return res_billList;
  }
  await selectSource.fillDataSource(filter_template.items_select);

  let rows = res_billList.data;

  for (let i = 0; i < rows.length; i++) {
    rows[i].status = statusMap[rows[i].status];
    rows[i].disposedType = disposedTypeMap[rows[i].disposedType];
  }
  // console.log(rows);
  return {
    code: 1,
    message: 'success',
    data: {
      header: header_main,
      filter: filter_template,
      rows: rows,
    },
  };
}
/**
 * 新增单据时获取主表信息显示模板
 */
async function getBillMainTemplate() {
  let viewDef = cache.view_get().bill_chuzhi;
  let user = cache.user_get();
  let header_assetList = viewDef.header.detail;
  let billMain_template = viewDef.billMainTemplate;
  billMain_template.operatePersonId.value = user.employeeName;
  billMain_template.createTime.value = utility.getDateTime('YYYY-MM-dd');

  await selectSource.fillDataSource(billMain_template);
  let res = {
    code: 1,
    message: 'success',
    data: { billMain: billMain_template, billDetail: { header: header_assetList, rows: [] } },
    method: { getAssetList: asset.getAssetList_chuzhi },
  };
  return res;
}
/**
 * 查询派发单据明细
 * @param {*} billNo
 */
async function queryBillDetail(billNo) {
  let viewDef = cache.view_get().bill_chuzhi;
  let extMap = viewDef.typeDef.extMap;
  let billType = viewDef.typeDef.type;
  let billMain_template = viewDef.billMainTemplate;
  let detailHeader = viewDef.header.detail;

  return await billClient.queryBillDetail(billNo, billType, extMap, detailHeader, billMain_template);
}
/**
 * 删除派发单据
 * @param {*} billNo
 */
async function deleteBill(billNo) {
  let viewDef = cache.view_get().bill_chuzhi;
  let billType = viewDef.typeDef.type;
  return await billClient.deleteBill(billNo, billType);
}
/**
 * 保存处置单据
 * @param {*} billMain 单据主表对象
 * @param {*} assetList 资产列表 [{assetId:""}]
 */
async function saveBill(billMain, assetList) {
  let useCheck = cache.tenant_config_get().useCheck;
  let user = cache.user_get();
  let viewDef = cache.view_get().bill_chuzhi;
  // console.log("保存处置单.");
  let fieldMap = viewDef.typeDef.fieldMap;
  let bill_status = viewDef.typeDef.status;
  let status_disposed = assetStatus.enum.disposed.value;
  let prefix = viewDef.typeDef.prefix;
  let billType = viewDef.typeDef.type;
  if (!billMain) {
    return { code: -1, message: '单据主表信息不能为空.' };
  }
  if (!billMain.disposedType && billMain.disposedType != 0) {
    return { code: -1, message: '处置类型不能为空' };
  }
  if (!billMain.remarks) {
    return { code: -1, message: '处置内容不能为空.' };
  }
  if (!assetList || assetList.length < 1) {
    return { code: -1, message: '资产列表不能为空' };
  }
  let mainObj = JSON.parse(JSON.stringify(billMain));
  mainObj.billNo = prefix + Date.now(); //生成单据编号
  mainObj.billType = billType;
  mainObj.status = bill_status.initial.value;

  mainObj.manage_orgId = user.manage_orgId; //可以管理单据的部门
  mainObj.operatePersonId = user.employeeId;
  mainObj.assetNum = assetList.length;

  mainObj = billCommon.field2Ext(mainObj, fieldMap);
  delete mainObj.createTime;
  let asset_updateContent = {
    useStatus: status_disposed,
  };

  let assetList_t = [];
  for (let i = 0; i < assetList.length; i++) {
    let assetT = {
      assetId: assetList[i].assetId,
      tenantId: user.tenantId,
      billNo: mainObj.billNo,
      billType: mainObj.billType,
      status: mainObj.status,
    };
    assetList_t.push(assetT);
  }

  let res = await dbClient.ExecuteTrans(async (con) => {
    let res1 = await dbClient.InsertWithCon(con, table.tenant_bill, mainObj);
    if (res1.code != 1) {
      throw res1;
    }

    let res2 = await dbClient.InsertManyWithCon(con, table.tenant_bill_detail, assetList_t);
    if (res2.code != 1) {
      throw res2;
    }

    if (!useCheck) {
      for (let i = 0; i < assetList.length; i++) {
        let res_asset = await asset.updateAssetWithCon(con, assetList[i].assetId, asset_updateContent);
        if (res_asset.code != 1) {
          throw res_asset;
        }
      }
    }
    return { code: 1, message: 'success' };
  });
  return res;
  return await billClient.saveBill(mainObj, assetList, async (con, assetList) => {
    // console.log("更新资产处置状态");
    for (let i = 0; i < assetList.length; i++) {
      let res_asset = await asset.updateAssetWithCon(con, assetList[i].assetId, asset_updateContent);
      if (res_asset.code != 1) {
        throw new Error(res_asset.message);
      }
    }
    return { code: 1, message: 'success' };
  });
}

/**
 * 取消处置
 * @param {string} billNo
 */
async function unDisposedBill(billNo) {
  let viewDef = cache.view_get().bill_chuzhi;
  let status_canceled = viewDef.typeDef.status.canceled.value;
  let status_free = 0;
  let query = { billNo: billNo, billType: viewDef.typeDef.type };
  let res_bill = await dbClient.Query(table.tenant_bill, query);
  if (res_bill.code != 1) {
    return res_bill;
  }
  if (res_bill.data[0].status == status_canceled) {
    return { code: -1, message: '该单据已取消，不能重复取消.' };
  }
  let res_bill_detail = await dbClient.Query(table.tenant_bill_detail, query, { assetId: 1 });
  if (res_bill_detail.code != 1) {
    return res_bill_detail;
  }
  let assetList = res_bill_detail.data;
  return dbClient.ExecuteTrans(async (con) => {
    try {
      let res = await dbClient.UpdateWithCon(con, table.tenant_bill, query, { status: status_canceled });
      if (res.code != 1) {
        throw res;
      }
      for (let i = 0; i < assetList.length; i++) {
        let res1 = await dbClient.UpdateWithCon(
          con,
          table.tenant_bill_detail,
          { billNo: billNo, assetId: assetList[i].assetId },
          { status: status_canceled }
        );
        if (res1.code != 1) {
          throw res;
        }

        let res2 = await dbClient.UpdateWithCon(
          con,
          table.tenant_asset,
          { assetId: assetList[i].assetId },
          { status: status_free, useStatus: 0 }
        );
        if (res2.code != 1) {
          throw res2;
        }
      }
      return { code: 1, message: '取消处置成功.' };
    } catch (err) {
      throw err;
    }
  });
}
/**
 * 审核处置单
 * @param {string} billNo
 */
async function checkBill(billNo) {
  let viewDef = cache.view_get().bill_chuzhi;
  let billType = viewDef.typeDef.type;
  let checked = viewDef.typeDef.status.final.value;
  let status_disposed = assetStatus.enum.disposed.value;
  let res_billDetail = await dbClient.Query(table.v_bill_chuzhi_detail, { billNo: billNo, billType: billType });
  if (res_billDetail.code != 1) {
    return res_billDetail;
  }
  if (res_billDetail.data.length < 1) {
    return { code: -1, message: '单据不存或该单据没有关联资产.' };
  }

  let billStatus = res_billDetail.data[0].status;
  if (billStatus >= checked) {
    return { code: -1, message: '该单据已审核/取消，不能再次审核' };
  }
  let assetList = res_billDetail.data;
  let res = await dbClient.ExecuteTrans(async (con) => {
    let res1 = await dbClient.UpdateWithCon(
      con,
      table.tenant_bill,
      { billNo: billNo, billType: billType },
      { status: checked }
    );
    // console.log(res1);
    if (res1.code != 1) {
      throw res1;
    }
    // console.log("t1 success.");
    let res2 = await dbClient.UpdateWithCon(
      con,
      table.tenant_bill_detail,
      { billNo: billNo, billType: billType },
      { status: checked }
    );
    if (res2.code != 1) {
      throw res2;
    }
    // console.log("t2 success.");
    for (let i = 0; i < assetList.length; i++) {
      let obj = assetList[i];
      let asset_updateContent = { useStatus: status_disposed };
      let res_asset = await asset.updateAssetWithCon(con, assetList[i].assetId, asset_updateContent);
      // console.log("t3 success." + i);
      if (res_asset.code != 1) {
        throw res_asset;
      }
    }
    writeAssetBehavior('4', assetList, billNo);
    return { code: 1, message: '审核成功.' };
  });
  return res;
  return { code: 1, message: 'success.' };
}
module.exports.getBillMainTemplate = getBillMainTemplate;
module.exports.queryBill = queryBill;
module.exports.queryBillDetail = queryBillDetail;
module.exports.saveBill = saveBill;
module.exports.deleteBill = deleteBill;
module.exports.unDisposedBill = unDisposedBill;
module.exports.checkBill = checkBill;
