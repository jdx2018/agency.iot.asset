const dbClient = require('../db').dbClient;
const table = require('../db/tableEnum').table;
const billClient = require('./billClient');
const fieldTool = require('../tool/fieldTool');
const selectSource = require('../tool/selectSource');
const asset = require('../asset/asset');
const assetStatus = require('../mock/param_mock').param.assetStatus;
const cache = require('../cache');
const writeAssetBehavior = require('../assetLifeLine').writeAssetBehavior;

/**
 * 查询借用单据列表
 * @example
 * { code:"1",message:"success", data:{  header:{},  rows:{}, filter:{}  }
 */
async function queryBill(filter) {
  // let fieldMap = viewDef.typeDef.fieldMap;
  // let extMap = viewDef.typeDef.extMap;
  let viewDef = cache.view_get().bill_jiechu;
  let user = cache.user_get();
  let billType = viewDef.typeDef.type;
  let header_main = viewDef.header.main;
  let filter_template = viewDef.filter;
  let statusMap = viewDef.typeDef.statusMap;
  // console.log("query bill", statusMap);
  let sortFields = { createTime: 0 };
  //构造查询条件
  let query = { billType: billType, p_orgId: user.manage_orgId };
  if (filter) {
    if (filter.borrowDate_start) {
      query.ext7 = { $gte: filter.borrowDate_start };
      delete filter.borrowDate_start;
    }
    if (filter.borrowDate_end) {
      if (!query.ext7) {
        query.ext7 = {};
      }
      query.ext7.$lte = filter.borrowDate_end;
      delete filter.borrowDate_end;
    }
    // filter = billCommon.field2Ext(filter, fieldMap);
    Object.keys(filter).forEach((key) => {
      query[key] = filter[key];
    });
  }
  // console.log("借出查询", filter, query);
  let fields = fieldTool.header2Fields(header_main, null);
  let res_billList = await dbClient.Query(table.v_bill_jiechu_org, query, fields, null, null, sortFields);
  // let param_proc = {
  //   tenantId: user.tenantId,
  //   userId: user.userId,
  //   query: query,
  //   fields: fields
  // }
  // let res_billList = await dbClient.executeProc(table.p_bill_jiechu_get, param_proc);
  // console.log("query jiechu_bill", res_billList);
  if (res_billList.code != 1) {
    return res_billList;
  }
  await selectSource.fillDataSource(filter_template.items_select);

  let rows = res_billList.data;
  for (let i = 0; i < rows.length; i++) {
    rows[i].status = statusMap[rows[i].status];
  }
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
  let viewDef = cache.view_get().bill_jiechu;
  let user = cache.user_get();
  let header_assetList = viewDef.header.detail;
  let billMain_template = viewDef.billMainTemplate;
  billMain_template.operatePersonId.value = user.employeeName;
  await selectSource.fillDataSource(billMain_template);
  // console.log("bill_jiechu.getMainTemplate", billMain_template);
  let res = {
    code: 1,
    message: 'success',
    data: {
      billMain: billMain_template,
      billDetail: { header: header_assetList, rows: [] },
    },
    method: { getAssetList: asset.getAssetList_jiechu },
  };

  return res;
}
/**
 * 查询派发单据明细
 * @param {*} billNo
 */
async function queryBillDetail(billNo) {
  let viewDef = cache.view_get().bill_jiechu;
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
  let viewDef = cache.view_get().bill_jiechu;
  let billType = viewDef.typeDef.type;
  return await billClient.deleteBill(billNo, billType);
}
/**
 * 保存派发单据
 * @param {*} billMain 单据主表对象
 * @param {*} assetList 资产列表 [{assetId:""}]
 */
async function saveBill(billMain, assetList) {
  let useCheck = cache.tenant_config_get().useCheck;
  let user = cache.user_get();
  let viewDef = cache.view_get().bill_jiechu;
  let billMainTemplate = viewDef.billMainTemplate;
  let fieldMap = viewDef.typeDef.fieldMap;
  let bill_status = viewDef.typeDef.status;
  let status_borrow = assetStatus.enum.borrow.value;
  let prefix = viewDef.typeDef.prefix;
  let billType = viewDef.typeDef.type;
  if (!billMain) {
    return { code: -1, message: '单据主表信息不能为空.' };
  }
  if (!assetList || assetList.length < 1) {
    return { code: -1, message: '资产列表不能为空' };
  }
  Object.keys(billMainTemplate).forEach((key) => {
    if (billMainTemplate[key].required && !billMain[key] && billMain[key] != 0) {
      return { code: -1, message: billMainTemplate[key].desc + '不能为空.' };
    }
  });

  let mainObj = JSON.parse(JSON.stringify(billMain));
  mainObj.billNo = prefix + Date.now(); //生成单据编号
  mainObj.billType = billType;
  mainObj.status = bill_status.initial.value; //初始状态值

  mainObj.manage_orgId = user.manage_orgId; //可以管理单据的部门
  mainObj.operatePersonId = user.employeeId;

  mainObj.borrowNum = assetList.length;
  mainObj.returnNum = 0;
  mainObj = fieldTool.field2Ext(mainObj, fieldMap);

  let asset_updateContent = {
    status: status_borrow,
    useEmployeeId: billMain.employeeId,
    useOrgId: billMain.useOrgId,
    placeId: billMain.placeId,
    useDate: billMain.borrowDate,
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
  return await dbClient.ExecuteTrans(async (con) => {
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

  // return await billClient.saveBill(mainObj, assetList, async (con, assetList) => {

  //   for (let i = 0; i < assetList.length; i++) {
  //     let res_asset = await asset.updateAssetWithCon(con, assetList[i].assetId,
  //       { status: status_borrow, useEmployeeId: billMain.employeeId });
  //     if (res_asset.code != 1) {
  //       throw new Error(res_asset.message);
  //     }

  //   }
  //   return { code: 1, message: "success" };
  // });
}
/**
 * 审核单据 -变更资产状态
 * @param {object} con 数据连接，默认审核时，需要传入保存订单时的con
 * @param {string} billNo 单据编号
 */
async function checkBill(billNo) {
  let viewDef = cache.view_get().bill_jiechu;
  let billType = viewDef.typeDef.type;
  let checked = viewDef.typeDef.status.final.value;
  let status_borrow = assetStatus.enum.borrow.value;
  let res_billDetail = await dbClient.Query(table.v_bill_jiechu_detail, { billNo: billNo, billType: billType });
  if (res_billDetail.code != 1) {
    return res_billDetail;
  }
  if (res_billDetail.data.length < 1) {
    return { code: -1, message: '单据不存或该单据没有关联资产.' };
  }

  let billStatus = res_billDetail.data[0].status;
  if (billStatus >= checked) {
    return { code: -1, message: '该单据已审核，不能再次审核' };
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
      let asset_updateContent = {
        status: status_borrow,
        useEmployeeId: obj.useEmployeeId,
        useOrgId: obj.useOrgId,
        placeId: obj.placeId,
        useDate: obj.borrowDate,
      };
      let res_asset = await asset.updateAssetWithCon(con, assetList[i].assetId, asset_updateContent);
      // console.log("t3 success." + i);
      if (res_asset.code != 1) {
        throw res_asset;
      }
    }
    writeAssetBehavior('1', assetList, billNo);
    return { code: 1, message: '审核成功.' };
  });
  return res;
}
module.exports.queryBill = queryBill;
module.exports.saveBill = saveBill;
module.exports.deleteBill = deleteBill;
module.exports.queryBillDetail = queryBillDetail;
module.exports.getBillMainTemplate = getBillMainTemplate;
module.exports.checkBill = checkBill;
