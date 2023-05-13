const dbClient = require('../db').dbClient;
const table = require('../db/tableEnum').table;
const billClient = require('./billClient');
const fieldTool = require('../tool/fieldTool');
const selectSource = require('../tool/selectSource');
const asset = require('../asset/asset');
const assetStatus = require('../mock/param_mock').param.assetStatus;
const writeAssetBehavior = require('../assetLifeLine').writeAssetBehavior;

const cache = require('../cache');
/**
 * 查询派发单据列表
 * @example
 * { code:"1",message:"success", data:{  header:{},  rows:{}, filter:{}  }
 */
async function queryBill(filter) {
  let viewDef = cache.view_get().bill_paifa;
  const user = cache.user_get();
  let header_main = viewDef.header.main;
  let filter_template = viewDef.filter;
  let billType = viewDef.typeDef.type;
  let statusMap = viewDef.typeDef.statusMap;
  let billTypeMap = viewDef.typeDef.billTypeMap;
  let sortFields = { createTime: 0 };
  //构造查询条件
  let query = { billType: billType, p_orgId: user.manage_orgId };
  if (filter) {
    if (filter.useDate_start) {
      query.ext7 = { $gte: filter.useDate_start };
      delete filter.useDate_start;
    }
    if (filter.useDate_end) {
      if (!query.ext7) {
        query.ext7 = {};
      }
      query.ext7.$lte = filter.useDate_end;
      delete filter.useDate_end;
    }
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
  // // console.log("paifa-procparam",param_proc)
  // let res_billList = await dbClient.executeProc(table.p_bill_paifa_get, param_proc);
  let res_billList = await dbClient.Query(table.v_bill_paifa_org, query, fields, null, null, sortFields);

  if (res_billList.code != 1) {
    return res_billList;
  }
  await selectSource.fillDataSource(filter_template.items_select);
  // console.log("bill_paifa", filter_template.items_select);
  let rows = res_billList.data;
  for (let i = 0; i < rows.length; i++) {
    rows[i].status = statusMap[rows[i].status];
    rows[i].billType = billTypeMap[rows[i].billType];
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
  let viewDef = cache.view_get().bill_paifa;
  let user = cache.user_get();
  let header_assetList = viewDef.header.detail;
  let billMain_template = viewDef.billMainTemplate;
  billMain_template.operatePersonId.value = user.employeeName;
  await selectSource.fillDataSource(billMain_template);
  let res = {
    code: 1,
    message: 'success',
    data: { billMain: billMain_template, billDetail: { header: header_assetList, rows: [] } },
    method: { getAssetList: asset.getAssetList_paifa },
  };
  return res;
}
/**
 * 查询派发单据明细
 * @param {*} billNo
 */
async function queryBillDetail(billNo) {
  let viewDef = cache.view_get().bill_paifa;
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
  let viewDef = cache.view_get().bill_paifa;
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
  let viewDef = cache.view_get().bill_paifa;
  let billMainTemplate = viewDef.billMainTemplate;
  let fieldMap = viewDef.typeDef.fieldMap;
  let bill_status = viewDef.typeDef.status;
  let status_used = assetStatus.enum.use.value;
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
  mainObj.status = bill_status.initial.value;

  mainObj.manage_orgId = user.manage_orgId; //可以管理单据的部门
  mainObj.operatePersonId = user.employeeId;
  mainObj.assetNum = assetList.length;
  // console.log("派发对象", mainObj);
  mainObj = fieldTool.field2Ext(mainObj, fieldMap);
  let asset_updateContent = {
    status: status_used,
    useEmployeeId: billMain.employeeId,
    useOrgId: billMain.useOrgId,
    placeId: billMain.placeId,
    useDate: billMain.useDate,
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
  // console.log("映射转换后对象", mainObj, asset_updateContent);
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
}
/**
 * 审核派发单
 * @param {string} billNo
 */
async function checkBill(billNo) {
  let viewDef = cache.view_get().bill_paifa;
  let billType = viewDef.typeDef.type;
  let checked = viewDef.typeDef.status.final.value;
  let status_use = assetStatus.enum.use.value;
  let res_billDetail = await dbClient.Query(table.v_bill_paifa_detail, { billNo: billNo, billType: billType });
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
  let flag = false;
  let assetId_isUse = '';
  for (let i = 0; i < assetList.length; i++) {
    let t = assetList[i];
    if (t.status != 0) {
      flag = true;
      assetId_isUse += ',' + t.assetId;
    }
  }

  if (flag) return { code: -1, message: `审核失败，部分资产:${assetId_isUse}已被领用，请重新核对。` };

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
        status: status_use,
        useEmployeeId: obj.useEmployeeId,
        useOrgId: obj.useOrgId,
        placeId: obj.placeId,
        useDate: obj.useDate,
      };
      let res_asset = await asset.updateAssetWithCon(con, assetList[i].assetId, asset_updateContent);
      // console.log("t3 success." + i);
      if (res_asset.code != 1) {
        throw res_asset;
      }
    }
    writeAssetBehavior('2', assetList, billNo);
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
