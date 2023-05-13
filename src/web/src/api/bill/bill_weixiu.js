const dbClient = require('../db').dbClient;
const table = require('../db/tableEnum').table;
const billClient = require('./billClient');
const fieldTool = require('../tool/fieldTool');
const selectSource = require('../tool/selectSource');
const asset = require('../asset/asset');
const assetUseStatus = require('../mock/param_mock').param.assetUseStatus;
const writeAssetBehavior = require('../assetLifeLine').writeAssetBehavior;

const utility = require('../utility');
const cache = require('../cache');

/**
 * 查询借用单据列表
 * @example
 * { code:"1",message:"success", data:{  header:{},  rows:{}, filter:{}  }
 */
async function queryBill(filter) {
  let viewDef = cache.view_get().bill_weixiu;
  let user = cache.user_get();
  let fieldMap = viewDef.typeDef.fieldMap;
  let billType = viewDef.typeDef.type;
  let header_main = viewDef.header.main;
  let filter_template = viewDef.filter;
  let statusMap = viewDef.typeDef.statusMap;

  let sortFields = { createTime: 0 };
  //构造查询条件
  let query = { billType: billType, p_orgId: user.manage_orgId };
  if (filter) {
    if (filter.reportDate_start) {
      query.reportDate = { $gte: filter.reportDate_start };
      delete filter.reportDate_start;
    }
    if (filter.reportDate_end) {
      if (!query.reportDate) {
        query.reportDate = {};
      }
      query.reportDate.$lte = filter.reportDate_end;
      delete filter.reportDate_end;
    }

    if (filter.finishDate_start) {
      query.finishDate = { $gte: filter.finishDate_start };
      delete filter.finishDate_start;
    }
    if (filter.finishDate_end) {
      if (!query.finishDate) {
        query.finishDate = {};
      }
      query.finishDate.$lte = filter.finishDate_end;
      delete filter.finishDate_end;
    }

    Object.keys(filter).forEach((key) => {
      query[key] = filter[key];
    });
  }

  let fields = fieldTool.header2Fields(header_main, null);
  // console.log("报修查询", query, fields);
  // let param_proc = {
  //     tenantId: user.tenantId,
  //     userId: user.userId,
  //     query: query,
  //     fields: fields
  // }
  // let res_billList = await dbClient.executeProc(table.p_bill_weixiu_get, param_proc);

  let res_billList = await dbClient.Query(table.v_bill_weixiu_org, query, fields, null, null, sortFields);

  // console.log("报修查询结果", res_billList);
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
  let useCheck = cache.tenant_config_get().useCheck;
  let viewDef = cache.view_get().bill_weixiu;
  let user = cache.user_get();
  let header_assetList = viewDef.header.detail;
  let billMain_template = viewDef.billMainTemplate;
  billMain_template.operatePersonId.value = user.employeeName;
  billMain_template.reportDate.value = utility.getDateTime('YYYY-MM-dd');
  billMain_template.status.value = viewDef.typeDef.status.initial.value;
  if (useCheck) {
    delete billMain_template.status;
  }

  await selectSource.fillDataSource(billMain_template);
  let res = {
    code: 1,
    message: 'success',
    data: { billMain: billMain_template, billDetail: { header: header_assetList, rows: [] } },
    method: { getAssetList: asset.getAssetList },
  };
  return res;
}
/**
 * 查询维修单据明细
 * @param {*} billNo
 */
async function queryBillDetail(billNo) {
  let viewDef = cache.view_get().bill_weixiu;
  let extMap = viewDef.typeDef.extMap;
  let billType = viewDef.typeDef.type;
  let billMain_template = viewDef.billMainTemplate;
  let detailHeader = viewDef.header.detail;
  return await billClient.queryBillDetail(billNo, billType, extMap, detailHeader, billMain_template);
}
/**
 * 删除单据
 * @param {*} billNo
 */
async function deleteBill(billNo) {
  let viewDef = cache.view_get().bill_weixiu;
  let billType = viewDef.typeDef.type;
  return await billClient.deleteBill(billNo, billType);
}
/**
 * 保存单据
 * @param {*} billMain 单据主表对象
 * @param {*} assetList 资产列表 [{assetId:""}]
 */
async function saveBill(billMain, assetList) {
  let useCheck = cache.tenant_config_get().useCheck;
  let user = cache.user_get();
  let viewDef = cache.view_get().bill_weixiu;
  let billMainTemplate = viewDef.billMainTemplate;
  let fieldMap = viewDef.typeDef.fieldMap;
  let bill_status = viewDef.typeDef.status;
  let useStaus_weixiu = assetUseStatus.enum.maintain.value;
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

  mainObj = fieldTool.field2Ext(mainObj, fieldMap);

  let asset_updateContent = {
    useStatus: useStaus_weixiu,
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
}
/**
 *
 * @param {string} 单据编号
 * @param {object}更新内容
 */
async function updateBill(billNo, mainObj) {
  // return { code: 1, message: "success" };
  // console.log("更新维修单", billNo, mainObj);
  let viewDef = cache.view_get().bill_weixiu;
  let billType = viewDef.typeDef.type;
  let status = mainObj.status;
  let finishDate = mainObj.finishDate;
  let remarks = mainObj.remarks;
  if (!billNo) {
    return { code: -1, message: '单据编号不能为空.' };
  }
  if (status == undefined || status == null) {
    return { code: -1, message: '维修状态不能为空' };
  }
  if (status == 1 && !finishDate) {
    return { code: -1, message: '维修完成，请选择完成日期.' };
  }
  let res_assetList = await dbClient.Query(
    table.tenant_bill_detail,
    { billNo: billNo, billType: billType },
    { assetId: 1 }
  );
  // console.log("维修单查询资产", res_assetList);
  if (res_assetList.code != 1) {
    return res_assetList;
  }
  let assetList = res_assetList.data;
  let res_udapte = await dbClient.ExecuteTrans(async (con) => {
    let res_1 = await dbClient.UpdateWithCon(
      con,
      table.tenant_bill,
      { billNo: billNo, billType },
      { status: status, remarks: remarks }
    );
    // console.log("更新主表-维修单成功", res_1);
    if (res_1.code != 1) {
      throw res_1;
    }
    let asset_status = assetUseStatus.enum.normal.value;
    if (status == 0) {
      asset_status = assetUseStatus.enum.maintain.value;
    }
    for (let i = 0; i < assetList.length; i++) {
      let res_2 = await dbClient.UpdateWithCon(
        con,
        table.tenant_asset,
        { assetId: assetList[i].assetId },
        { useStatus: asset_status }
      );
      if (res_2.code != 1) {
        throw res_2;
      }
    }
    return { code: 1, message: 'success' };
  });
  // console.log("更新维修工单result", res_udapte);
  return res_udapte;
}
/**
 * 审核维修单
 * @param {string} billNo
 */
async function checkBill(billNo) {
  let viewDef = cache.view_get().bill_weixiu;
  let billType = viewDef.typeDef.type;
  let checked = viewDef.typeDef.status.checked.value;
  let useStatus_weixiu = assetUseStatus.enum.maintain.value;
  let res_billDetail = await dbClient.Query(table.v_bill_weixiu_detail, { billNo: billNo, billType: billType });
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
      let asset_updateContent = { useStatus: useStatus_weixiu };
      console.log('维修审核', assetList[i], asset_updateContent);
      let res_asset = await asset.updateAssetWithCon(con, assetList[i].assetId, asset_updateContent);
      // console.log("t3 success." + i);
      if (res_asset.code != 1) {
        throw res_asset;
      }
    }
    writeAssetBehavior('3', assetList, billNo);
    return { code: 1, message: '审核成功.' };
  });
  return res;
}
module.exports.queryBill = queryBill;
module.exports.saveBill = saveBill;
module.exports.deleteBill = deleteBill;
module.exports.queryBillDetail = queryBillDetail;
module.exports.getBillMainTemplate = getBillMainTemplate;
module.exports.updateBill = updateBill;
module.exports.checkBill = checkBill;
