const dbClient = require('../db').dbClient;
const table = require('../db/tableEnum').table;
const fieldTool = require('../tool/fieldTool');
const selectSource = require('../tool/selectSource');
const asset_material = require('../asset/asset_material');
const cache = require('../cache');
const utility = require('../utility');
const { cloneDeep } = require('lodash');
const assetsListCodeCompletion = require('../asset/asset').assetsListCodeCompletion;

async function queryBill_paifa() {
  let viewDef = cache.view_get().bill_purchase;
  let header_main = viewDef.header.main;
  let filter_template = viewDef.filter;
  let statusMap = viewDef.typeDef.statusMap;
  let billTypeMap = viewDef.typeDef.billTypeMap;
  let purchaseTypeMap = viewDef.typeDef.purchaseTypeMap;
  let sortFields = { createTime: 0 };
  //构造查询条件
  let query = {};
  // console.log("paifa-procparam",param_proc)
  let fields = fieldTool.header2Fields(header_main, null);
  let res_billList = await dbClient.Query(table.v_bill_purchase_paifa, query, fields, null, null, sortFields);
  if (res_billList.code != 1) {
    return res_billList;
  }
  await selectSource.fillDataSource(filter_template.items_select);
  // console.log("bill_paifa", filter_template.items_select);
  let rows = res_billList.data;
  for (let i = 0; i < rows.length; i++) {
    rows[i].status = statusMap[rows[i].status];
    rows[i].billType = billTypeMap[rows[i].billType];
    rows[i].purchaseType = purchaseTypeMap[rows[i].purchaseType];
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
 * 耗材出库关联采购单
 */
async function queryBill_materialchuku() {
  let viewDef = cache.view_get().bill_purchase;
  let header_main = viewDef.header.main;
  let filter_template = viewDef.filter;
  let statusMap = viewDef.typeDef.statusMap;
  let billTypeMap = viewDef.typeDef.billTypeMap;
  let purchaseTypeMap = viewDef.typeDef.purchaseTypeMap;
  let sortFields = { createTime: 0 };
  //构造查询条件
  let query = {};
  // console.log("paifa-procparam",param_proc)
  let fields = fieldTool.header2Fields(header_main, null);
  let res_billList = await dbClient.Query(table.v_bill_purchase_chuku, query, fields, null, null, sortFields);
  if (res_billList.code != 1) {
    return res_billList;
  }
  await selectSource.fillDataSource(filter_template.items_select);
  // console.log("bill_paifa", filter_template.items_select);
  let rows = res_billList.data;
  for (let i = 0; i < rows.length; i++) {
    rows[i].status = statusMap[rows[i].status];
    rows[i].billType = billTypeMap[rows[i].billType];
    rows[i].purchaseType = purchaseTypeMap[rows[i].purchaseType];
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
 * 查询采购单据
 * @param {object} filter
 */
async function queryBill(filter) {
  let viewDef = cache.view_get().bill_purchase;
  let header_main = viewDef.header.main;
  let filter_template = viewDef.filter;
  let statusMap = viewDef.typeDef.statusMap;
  let billTypeMap = viewDef.typeDef.billTypeMap;
  let purchaseTypeMap = viewDef.typeDef.purchaseTypeMap;
  let sortFields = { createTime: 0 };
  //构造查询条件
  let query = {};
  if (filter) {
    if (filter.reqDate_start) {
      query.reqDate = { $gte: filter.reqDate_start };
      delete filter.reqDate_start;
    }
    if (filter.reqDate_end) {
      if (!query.reqDate) {
        query.reqDate = {};
      }
      query.reqDate.$lte = filter.reqDate_end;
      delete filter.reqDate_end;
    }
    Object.keys(filter).forEach((key) => {
      query[key] = filter[key];
    });
  }
  let fields = fieldTool.header2Fields(header_main, null);

  // console.log("paifa-procparam",param_proc)
  let res_billList = await dbClient.Query(table.v_bill_purchase, query, fields, null, null, sortFields);
  if (res_billList.code != 1) {
    return res_billList;
  }
  await selectSource.fillDataSource(filter_template.items_select);
  // console.log("bill_paifa", filter_template.items_select);
  let rows = res_billList.data;
  for (let i = 0; i < rows.length; i++) {
    rows[i].status = statusMap[rows[i].status];
    rows[i].billType = billTypeMap[rows[i].billType];
    rows[i].purchaseType = purchaseTypeMap[rows[i].purchaseType];
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
 * 获取新增资产模板
 */
async function getTemplate_asset() {
  let viewDef = cache.view_get().bill_purchase;
  let objTempalte = viewDef.template_detail_asset;
  await selectSource.fillDataSource(objTempalte);
  return { code: 1, message: 'success', data: objTempalte };
}

/**
 * 获取采购单耗材原始列表：
 */
async function getTemplate_material() {
  let viewDef = cache.view_get().bill_purchase;
  let header_material_origin = viewDef.header.detail.material_origin;
  let material_statusMap = viewDef.typeDef.material_statusMap;

  let query = {};
  let fields = fieldTool.header2Fields(header_material_origin, null);
  let res_materialList = await dbClient.Query(table.v_asset_material, query, fields);

  if (res_materialList.code != 1) {
    return res_materialList;
  }
  let rows = res_materialList.data;
  for (let i = 0; i < rows.length; i++) {
    rows[i].status = material_statusMap[rows[i].status];
  }
  return {
    code: 1,
    message: 'success',
    data: {
      header: header_material_origin,
      rows: rows,
    },
  };
}
/**
 * 获取新增采购单模板
 */
async function getBillMainTemplate() {
  let viewDef = cache.view_get().bill_purchase;
  let user = cache.user_get();
  let header_materialList = viewDef.header.detail.material;
  let header_assetList = viewDef.header.detail.asset;
  let billMain_template = viewDef.billMainTemplate;
  billMain_template.operatePersonId.value = user.employeeId;
  await selectSource.fillDataSource(billMain_template);
  let res = {
    code: 1,
    message: 'success',
    data: {
      billMain: billMain_template,
      billDetail: {
        asset: { header: header_assetList, rows: [] },
        material: { header: header_materialList, rows: [] },
      },
    },
    method: { getMaterialList: asset_material.getMaterialList_all },
  };
  return res;
}
/**
 * 查询单据明细
 * @param {string} billNo
 */
async function queryBillDetail(billNo) {
  let viewDef = cache.view_get().bill_purchase;
  let billType = viewDef.typeDef.type;
  let billMain_template = viewDef.billMainTemplate;
  let detailHeader = viewDef.header.detail;
  let header_asset = detailHeader.asset;
  let header_material = detailHeader.material;
  // console.log("查询单据明细",billMain_template,billMain);
  let fields_asset = fieldTool.header2Fields(header_asset);
  let fiedls_material = fieldTool.header2Fields(header_material);
  let query = { billNo: billNo, billType: billType };
  //查询主表信息
  let res_billMain = await dbClient.Query(table.v_bill_purchase, query);
  if (res_billMain.code != 1) {
    return res_billMain;
  }
  if (!res_billMain.data || res_billMain.data.length < 1) {
    return { code: -1, message: '该单据不存在.' };
  }
  //查询资产明细
  let res_billDetail_asset = await dbClient.Query(table.v_bill_purchase_detail_asset, query, fields_asset);
  if (res_billDetail_asset.code != 1) {
    return res_billDetail_asset;
  }

  let res_billDetail_material = await dbClient.Query(table.v_bill_purchase_detail_material, query, fiedls_material);
  // console.log(res_billDetail_material)
  if (res_billDetail_material.code != 1) {
    return res_billDetail_material;
  }

  let billMain = res_billMain.data[0]; //取得主表数据
  let rows_asset = res_billDetail_asset.data; //取得明细资产数据
  let rows_material = res_billDetail_material.data;
  await selectSource.fillDataSource(billMain_template); //填充下拉列表
  Object.keys(billMain_template).forEach((key) => {
    billMain_template[key].value = billMain[key];
  });
  let res = {
    code: 1,
    message: 'success',
    data: {
      billMain: billMain_template,
      billDetail: {
        asset: { header: header_asset, rows: rows_asset },
        material: { header: header_material, rows: rows_material },
      },
      method: { getMaterialList: asset_material.getMaterialList_all },
    },
  };
  // console.log("purachese.query billdetail", res);
  return res;
}
/**
 *
 * @param {object} billMain 单据主表对象
 * @param {array<object>} assetList 资产列表
 * @param {array<object>} materialList 耗材列表
 */
async function saveBill(billMain, assetList, materialList) {
  // return;
  // console.log("purchase save bill", billMain, assetList, materialList);
  let user = cache.user_get();
  let viewDef = cache.view_get().bill_purchase;
  let bill_status = viewDef.typeDef.status;
  let prefix = viewDef.typeDef.prefix;
  let billType = viewDef.typeDef.type;

  if ((!materialList || materialList.length < 1) && (!assetList || assetList.length < 1)) {
    return { code: -1, message: '耗材/资产列表不能为空' };
  }
  let mainObj = JSON.parse(JSON.stringify(billMain));
  mainObj.billNo = prefix + Date.now(); //生成单据编号
  mainObj.billType = billType;
  mainObj.status = bill_status.initial.value;
  mainObj.assetNum = assetList.length;
  mainObj.materialNum = materialList.length;

  mainObj.manage_orgId = user.manage_orgId; //可以管理单据的部门
  mainObj.operatePersonId = user.employeeId;

  for (let i = 0; i < assetList.length; i++) {
    let assetT = assetList[i];
    assetT.billNo = mainObj.billNo;
    assetT.billType = mainObj.billType;
    assetT.status = mainObj.status;
    delete assetT.supplierName;
  }
  for (let i = 0; i < materialList.length; i++) {
    if (!materialList[i].supplierId) {
      return { code: -1, message: '供应商Id不能为空。' };
    }
    if (!materialList[i].orderQty) {
      return { code: -1, message: '采购数量不能为 0。' };
    }
    let materialT = materialList[i];
    materialT.materialId = materialList[i].materialId;
    materialT.billNo = mainObj.billNo;
    materialT.billType = mainObj.billType;
    materialT.status = mainObj.status;
    delete materialT.supplierName;
    delete materialT.materialPlace;
  }
  let res = await dbClient.ExecuteTrans(async (con) => {
    let res1 = await dbClient.InsertWithCon(con, table.tenant_bill_purchase, mainObj);
    if (res1.code != 1) {
      throw res1;
    }

    if (assetList && assetList.length > 0) {
      let res2 = await dbClient.InsertManyWithCon(con, table.tenant_bill_purchase_detail_asset, assetList);
      if (res2.code != 1) {
        throw res2;
      }
    }
    if (materialList && materialList.length > 0) {
      let res3 = await dbClient.InsertManyWithCon(con, table.tenant_bill_purchase_detail_material, materialList);
      if (res3.code != 1) {
        throw res3;
      }
    }

    return { code: 1, message: '保存单据成功' };
  });
  return res;
}
/**
 * 更新单据-未审核前更新使用的方法
 * @param {string} billNo
 * @param {object} billMain
 * @param {array<object>} assetList
 * @param {array<object>} materialList
 */
async function updateBill(billNo, billMain, assetList, materialList) {
  let viewDef = cache.view_get().bill_purchase;
  let billType = viewDef.typeDef.type;
  let template_asset = viewDef.template_detail_asset;
  let template_material = viewDef.template_detail_material;
  let bill_status = viewDef.typeDef.status;
  if ((!materialList || materialList.length < 1) && (!assetList || assetList.length < 1)) {
    return { code: -1, message: '耗材/资产列表不能为空' };
  }
  let mainObj = JSON.parse(JSON.stringify(billMain));

  mainObj.assetNum = assetList.length;
  mainObj.materialNum = materialList.length;

  let assetList_t = [];
  for (let i = 0; i < assetList.length; i++) {
    let assetT = JSON.parse(JSON.stringify(template_asset));
    Object.keys(assetT).forEach((key) => {
      assetT[key] = assetList[i][key];
    });
    assetT.billNo = billNo;
    assetT.billType = billType;
    assetT.status = bill_status.initial.value;
    assetList_t.push(assetT);
  }
  let materialList_t = [];
  for (let i = 0; i < materialList.length; i++) {
    let materialT = JSON.parse(JSON.stringify(template_material));
    Object.keys(materialT).forEach((key) => {
      materialT[key] = materialList[i][key] ?? null;
    });
    materialT.materialId = materialList[i].materialId;
    materialT.billNo = billNo;
    materialT.billType = billType;
    materialT.status = bill_status.initial.value;
    materialList_t.push(materialT);
    console.log('update purchase detail', materialT);
  }
  console.log('update purchase', mainObj, assetList, materialList_t);
  delete mainObj.billNo;
  delete mainObj.bilType;
  let query = { billNo: billNo, billType: billType };
  let res = await dbClient.ExecuteTrans(async (con) => {
    // console.log("bill_purchase", mainObj);
    let res1 = await dbClient.UpdateWithCon(con, table.tenant_bill_purchase, query, mainObj);
    if (res1.code != 1) {
      throw res1;
    }
    let res_d1 = await dbClient.DeleteWithCon(con, table.tenant_bill_purchase_detail_asset, query);
    if (res_d1.code != 1) {
      throw res_d1;
    }
    let res_d2 = await dbClient.DeleteWithCon(con, table.tenant_bill_purchase_detail_material, query);
    if (res_d2.code != 1) {
      throw res_d2;
    }

    if (assetList && assetList.length > 0) {
      let res2 = await dbClient.InsertManyWithCon(con, table.tenant_bill_purchase_detail_asset, assetList_t);
      if (res2.code != 1) {
        throw res2;
      }
    }
    if (materialList && materialList.length > 0) {
      let res3 = await dbClient.InsertManyWithCon(con, table.tenant_bill_purchase_detail_material, materialList_t);
      if (res3.code != 1) {
        throw res3;
      }
    }

    return { code: 1, message: '保存单据成功' };
  });
  return res;
}
/**
 * @param {string} billNo 单据编号
 */
async function deleteBill(billNo) {
  let viewDef = cache.view_get().bill_purchase;
  let billType = viewDef.typeDef.type;
  let res_check = await checkBeforeUpdateOrDelete(billNo);
  if (res_check.code != 1) {
    return res_check;
  }
  let query_bill = { billNo: billNo, billType: billType };
  let res = await dbClient.ExecuteTrans(async (con) => {
    let res1 = await dbClient.DeleteWithCon(con, table.tenant_bill_purchase, query_bill);
    if (res1.code != 1) {
      throw res1;
    }
    let res2 = await dbClient.DeleteWithCon(con, table.tenant_bill_purchase_detail_asset, query_bill);
    if (res2.code != 1) {
      throw res2;
    }
    let res3 = await dbClient.Delete(con, table.tenant_bill_purchase_detail_material, query_bill);
    if (res2.code != 1) {
      throw res3;
    }
    return { code: 1, message: 'success' };
  });
  return res;
}
// 获取资产入库流水：
function getAssetList_flow(assetList, mainObj) {
  let assetList_f = [];
  if (assetList && assetList.length > 0 && mainObj) {
    for (let i = 0; i < assetList.length; i++) {
      let asset_f = { assetId: assetList[i].assetId };
      asset_f.billNo = mainObj.billNo;
      asset_f.billType = mainObj.billType;
      assetList_f.push(asset_f);
    }
  }
  // console.log("bill_purchase.getAssetList.flow", assetList_f);
  return assetList_f;
}
// 获取资产价格流水：
function getAssetList_price_flow(assetList, mainObj) {
  let assetList_price_f = [];
  if (assetList && assetList.length > 0 && mainObj) {
    for (let i = 0; i < assetList.length; i++) {
      let asset_price_f = {};
      asset_price_f.billNo = mainObj.billNo;
      asset_price_f.billType = mainObj.billType;
      asset_price_f.assetName = assetList[i].assetName;
      asset_price_f.brand = assetList[i].brand;
      asset_price_f.spec = assetList[i].spec;
      asset_price_f.unit = assetList[i].unit;
      asset_price_f.supplierId = assetList[i].supplierId;
      asset_price_f.orderPrice = assetList[i].orderPrice;

      assetList_price_f.push(asset_price_f);
    }
  }
  // console.log("bill_purchase.getAssetList.flow", assetList_price_f);
  return assetList_price_f;
}

// 获取耗材更新流水：
function getMaterialList_flow(materialList, mainObj) {
  let materialList_f = [];
  if (materialList && materialList.length > 0 && mainObj) {
    for (let i = 0; i < materialList.length; i++) {
      let material_f = { materialId: materialList[i].materialId };
      material_f.billNo = mainObj.billNo;
      material_f.billType = mainObj.billType;
      materialList_f.push(material_f);
    }
  }
  return materialList_f;
}
// 获取耗材价格流水：
function getMaterialList_price_flow(materialList, mainObj) {
  let materialList_price_f = [];
  if (materialList && materialList.length > 0 && mainObj) {
    for (let i = 0; i < materialList.length; i++) {
      let material_price_f = { materialId: materialList[i].materialId };
      material_price_f.orderPrice = materialList[i].orderPrice;
      material_price_f.billNo = mainObj.billNo;
      material_price_f.billType = mainObj.billType;
      materialList_price_f.push(material_price_f);
    }
  }
  return materialList_price_f;
}

/**
 * 采购的资产转化为可入库资产列表
 * @param {array} assetList
 */
function getAssetList(assetList, mainObj) {
  let assetList_n = [];
  if (assetList && assetList.length > 0) {
    for (let i = 0; i < assetList.length; i++) {
      let t = assetList[i];
      let assetId_start = 'A' + utility.getDateTime('YYMMddhhmmss');
      for (let j = 0; j < t.orderQty; j++) {
        let asset = {};
        asset.assetId = '1' + utility.hashCode(assetId_start + i + j);
        asset.assetName = t.assetName;
        asset.classId = t.classId;
        asset.ownOrgId = mainObj.reqOrgId;
        asset.useOrgId = mainObj.reqOrgId;
        asset.brand = t.brand;
        asset.spec = t.spec;
        asset.supplier = t.supplierId;
        asset.unit = t.unit;
        asset.placeId = mainObj.placeId;
        asset.initialValue = t.orderPrice;
        asset.orderPrice = t.orderPrice;
        asset.serviceLife = t.serviceLife;
        asset.purchaseDate = mainObj.purchaseDate;
        assetList_n.push(asset);
      }
    }
  }
  return assetList_n;
}
/**
 * 采购的耗材转化为可入库耗材列表
 * @param {array} materialList
 */
function getMaterialList(materialList) {
  let materialList_n = [];
  if (materialList && materialList.length > 0) {
    for (let i = 0; i < materialList.length; i++) {
      let t = materialList[i];
      // let materialId_start = "M" + utility.getDateTime("YYMMddhhmmss");
      let material = {};
      material.materialId = t.materialId;
      material.materialName = t.materialName;
      material.materialClass = t.materialClass;
      material.ownOrgId = t.reqOrgId;
      material.brand = t.brand;
      material.spec = t.spec;
      material.supplierId = t.supplierId;
      material.unit = t.unit;
      material.storageQty = t.storageQty;
      material.orderQty = t.orderQty;
      material.orderPrice = t.orderPrice;
      materialList_n.push(material);
    }
  }
  return materialList_n;
}
/**
 * 获取供应商付款列表
 * @param {array} assetList
 * @param {array} materialList
 */
function getPayableList(assetList, materialList) {
  let supplierPool = {};
  for (let i = 0; i < assetList.length; i++) {
    let t1 = assetList[i];
    if (!supplierPool[t1.supplierId]) {
      supplierPool[t1.supplierId] = { payableAmount: t1.orderQty * t1.orderPrice };
    } else {
      supplierPool[t1.supplierId].payableAmount += t1.orderPrice * t1.orderPrice;
    }
  }
  for (let j = 0; j < materialList.length; j++) {
    let t2 = materialList[j];
    if (!supplierPool[t2.supplierId]) {
      supplierPool[t2.supplierId] = { payableAmount: t2.orderQty * t2.orderPrice };
    } else {
      supplierPool[t2.supplierId].payableAmount += t2.orderPrice * t2.orderPrice;
    }
  }
  let supplierList = [];
  Object.keys(supplierPool).forEach((key) => {
    let obj = { supplierId: key, payableAmount: supplierPool[key].payableAmount };
    supplierList.push(obj);
  });
  return supplierList;
}
/**
 * 审核单据
 * @param {string} billNo
 */
async function checkBill(billNo) {
  let user = cache.user_get();
  let viewDef = cache.view_get().bill_purchase;
  let billType = viewDef.typeDef.type;
  let checked = viewDef.typeDef.status.final.value;
  let query = { billNo: billNo, billType: billType };
  let res_bill = await dbClient.Query(table.v_bill_purchase, query);
  // console.log("bill purchase check", res_bill);
  if (res_bill.code != 1) {
    return res_bill;
  }
  let mainObj = res_bill.data[0];
  let billStatus = res_bill.data[0].status;
  if (billStatus >= checked) {
    return { code: -1, message: '该单据已审核/取消，不能再次审核' };
  }

  //查询采购单-资产明细【不含资产编号，尚未生成】
  let res_billDetail_asset = await dbClient.Query(table.v_bill_purchase_detail_asset, query);
  if (res_billDetail_asset.code != 1) {
    return res_billDetail_asset;
  }

  //查询采购单-耗材明细【需要修改，此处已包含耗材编号，耗材添加采购时修改为从耗材列表中获取】
  let res_billDetail_material = await dbClient.Query(table.v_bill_purchase_detail_material, query);
  if (res_billDetail_material.code != 1) {
    return res_billDetail_material;
  }

  let assetList = res_billDetail_asset.data; //采购的资产列表  需要生成资产明细
  let materialList = res_billDetail_material.data;

  let query_bill = { billNo: billNo, billType: billType };
  let update_content = { status: checked };
  let res = await dbClient.ExecuteTrans(async (con) => {
    //资产审核后入库

    //生成待入库的资产列表
    let assetList_in = getAssetList(assetList, mainObj);
    //生成待入库的耗材列表
    let materialList_in = getMaterialList(materialList);
    //生成应付款列表
    let payableList = getPayableList(assetList, materialList);
    //为资产生成EPC值
    assetsListCodeCompletion(assetList_in);

    /**
     * 1. 生成流水记录：资产入库流水，资产价格流水，耗材更新流水，耗材价格流水：
     */
    if (assetList_in && assetList_in.length > 0) {
      //生成资产入库流水记录
      let assetList_in_f = getAssetList_flow(assetList_in, mainObj);
      let res_asset_in_f = await dbClient.InsertManyWithCon(con, table.tenant_bill_purchase_asset_flow, assetList_in_f);
      if (res_asset_in_f.code != 1) {
        throw res_asset_in_f;
      }
      //生成资产价格流水记录
      let assetList_price_f = getAssetList_price_flow(assetList_in, mainObj);
      let res_asset_price_f = await dbClient.InsertManyWithCon(
        con,
        table.tenant_bill_purchase_asset_price_flow,
        assetList_price_f
      );
      if (res_asset_price_f.code != 1) {
        throw res_asset_price_f;
      }
    }
    if (materialList_in && materialList_in.length > 0) {
      //生成耗材入库流水记录
      let material_list_in_f = getMaterialList_flow(materialList_in, mainObj);
      let res_material_in_f = await dbClient.InsertManyWithCon(
        con,
        table.tenant_bill_purchase_material_flow,
        material_list_in_f
      );
      if (res_material_in_f.code != 1) {
        throw res_material_in_f;
      }
      //生成耗材价格流水记录
      let material_list_price_f = getMaterialList_price_flow(materialList_in, mainObj);
      let res_material_price_f = await dbClient.InsertManyWithCon(
        con,
        table.tenant_bill_purchase_material_price_flow,
        material_list_price_f
      );
      if (res_material_price_f.code != 1) {
        throw res_material_price_f;
      }
    }

    /**
     * 2. 新增基础表数据：插入新增资产，更新耗材库存：
     */
    if (assetList_in && assetList_in.length > 0) {
      //审核后资产入库，保存资产入库流水表，资产编号自动生成
      let assetList_in_clone = cloneDeep(assetList_in);
      for (let i = 0; i < assetList_in_clone.length; i++) {
        delete assetList_in_clone[i].orderPrice;
      }
      let res_asset_in = await dbClient.InsertManyWithCon(con, table.tenant_asset, assetList_in_clone);
      if (res_asset_in.code != 1) {
        throw res_asset_in;
      }
    }
    if (materialList_in && materialList_in.length > 0) {
      //审核后更新耗材库存：
      for (let i = 0; i < materialList_in.length; i++) {
        let query = { materialId: materialList_in[i].materialId };
        let updateContent = { storageQty: materialList_in[i].storageQty + materialList_in[i].orderQty };
        let res_material_storage_update = await dbClient.UpdateWithCon(
          con,
          table.tenant_asset_material,
          query,
          updateContent
        );
        if (res_material_storage_update.code != 1) {
          throw res_material_storage_update;
        }
      }
    }
    /**
     * 3. 生成应付款列表：
     */
    for (let i = 0; i < payableList.length; i++) {
      //生成应付款列表
      let p_obj = {
        supplierId: payableList[i].supplierId,
        billNo: billNo,
        billType: billType,
        payableAmount: payableList[i].payableAmount,
      };
      p_obj.operatePersonId = user.employeeId;
      p_obj.manage_orgId = user.orgId;
      //保存应付款列表信息
      let res_payable_insert = await dbClient.InsertWithCon(con, table.tenant_supplier_payable, p_obj);
      if (res_payable_insert.code != 1) {
        throw res_payable_insert;
      }
    }
    /**
     * 4. 更新三表状态：主表、资产明细表、耗材明细表。
     */
    //更新采购单主表状态为已审核
    let res1 = await dbClient.UpdateWithCon(con, table.tenant_bill_purchase, query_bill, update_content);
    if (res1.code != 1) {
      throw res1;
    }

    //更新采购单明细-资产状态为已审核
    let res2 = await dbClient.UpdateWithCon(con, table.tenant_bill_purchase_detail_material, query, update_content);
    if (res2.code != 1) {
      throw res2;
    }

    //更新采购单明细-耗材状态为已审核
    let res3 = await dbClient.UpdateWithCon(con, table.tenant_bill_material_detail, query, update_content);
    if (res3.code != 1) {
      throw res3;
    }

    return { code: 1, message: '审核成功.' };
  });
  return res;
}

/**
 * 更新校验，是否可以更新/删除单据
 * @param {string} billNo
 */
async function checkBeforeUpdateOrDelete(billNo) {
  let user = cache.user_get();
  let viewDef = cache.view_get().bill_purchase;
  let bill_status_initial = viewDef.typeDef.status.initial.value;
  let billType = viewDef.typeDef.type;
  let query = { billNo: billNo, billType: billType };
  let res_bill = await dbClient.Query(table.tenant_bill_purchase, query, { status: 1 });
  if (res_bill.code != 1) {
    return res_bill;
  }
  let billStatus = res_bill.data[0].status;
  if (billStatus != bill_status_initial) {
    return { code: -1, message: '已处理单据，不能编辑/删除.' };
  }
  return { code: 1, message: 'success.' };
}
/**
 * 根据采购单号，获取采购单中的资产列表，用于修改价格
 * @param {string} billNo
 */
async function getAssetList_forPriceUpdate(billNo) {
  let user = cache.user_get();
  let viewDef = cache.view_get().bill_purchase;
  let billType = viewDef.typeDef.type;
  let payStatusMap = viewDef.typeDef.payStatusMap;

  let header_asset_update = viewDef.header.priceUpdate.asset;

  let query = { billNo, billType };
  let fields = fieldTool.header2Fields(header_asset_update);
  // 查询采购单的资产明细：
  let res_assetList = await dbClient.Query(table.v_bill_purchase_detail_asset, query, fields);
  if (res_assetList.code != 1) {
    return res_assetList;
  }

  let header_asset_update_clone = cloneDeep(header_asset_update);
  header_asset_update_clone.payStatus = { zh: '付款状态', en: '', width: 100, align: 'center' };
  header_asset_update_clone.modifyPrice = { zh: '修改价格', en: '', width: 100, align: 'center', editEnable: true };
  let rows = res_assetList.data;
  for (let i = 0; i < rows.length; i++) {
    // console.log(rows[i])
    let payStatus = undefined;
    let query_payRecord = { billNo: rows[i].billNo, supplierId: rows[i].supplierId };
    // 查询该采购单的当前资产的供应商是否已付款：
    let res_asset_payRecord = await dbClient.Query(table.tenant_supplier_payable, query_payRecord);
    // console.log('asset query_payRecord')
    // console.log(query_payRecord)
    if (res_asset_payRecord.code != 1) {
      return res_asset_payRecord;
    }
    if (
      res_asset_payRecord.data.length == 0 ||
      (res_asset_payRecord.data.length === 1 && res_asset_payRecord.data[0].status === 0)
    ) {
      payStatus = 0;
    } else {
      payStatus = 1;
    }

    rows[i].payStatus = payStatusMap[payStatus];
    rows[i].modifyPrice = rows[i].orderPrice;
  }
  return {
    code: 1,
    message: 'success',
    data: {
      header: header_asset_update_clone,
      rows,
      // rows: [
      //     { id: 1, billNo: '12021314', payStatus: '已付款', assetName: '戒指', spec: '周六福钻戒', supplierName: '周六福', brand: '周六福', orderPrice: 10000, modifyPrice: undefined },
      //     { id: 2, billNo: '12021222', payStatus: '未付款', assetName: '显示器', spec: '27寸', supplierName: '三星', brand: 'sungsang', orderPrice: 2000, modifyPrice: undefined }
      // ]
    },
  };
}
/**
 * 根据采购单号，获取采购单中的耗材列表，用于修改价格
 * @param {string} billNo
 */
async function getMaterialList_forPriceUpdate(billNo) {
  let user = cache.user_get();

  let viewDef = cache.view_get().bill_purchase;
  let billType = viewDef.typeDef.type;
  let payStatusMap = viewDef.typeDef.payStatusMap;

  let header_material_update = viewDef.header.priceUpdate.material;
  let query = { billNo, billType };
  let fields = fieldTool.header2Fields(header_material_update);
  // 查询采购单的耗材明细：
  let res_materialList = await dbClient.Query(table.v_bill_purchase_detail_material, query, fields);

  if (res_materialList.code != 1) {
    return res_materialList;
  }

  let header_material_update_clone = cloneDeep(header_material_update);
  header_material_update_clone.payStatus = { zh: '付款状态', en: '', width: 100, align: 'center' };
  header_material_update_clone.modifyPrice = { zh: '修改价格', en: '', width: 100, align: 'center', editEnable: true };
  let rows = res_materialList.data;
  for (let i = 0; i < rows.length; i++) {
    // console.log(rows[i])
    let payStatus = undefined;
    let query_payRecord = { billNo: rows[i].billNo, supplierId: rows[i].supplierId };
    // 查询该采购单的当前耗材的供应商是否已付款：
    let res_material_payRecord = await dbClient.Query(table.tenant_supplier_payable, query_payRecord);

    if (res_material_payRecord.code != 1) {
      return res_material_payRecord;
    }
    if (
      res_material_payRecord.data.length == 0 ||
      (res_material_payRecord.data.length === 1 && res_material_payRecord.data[0].status === 0)
    ) {
      payStatus = 0;
    } else {
      payStatus = 1;
    }

    rows[i].payStatus = payStatusMap[payStatus];
    rows[i].modifyPrice = rows[i].orderPrice;
  }
  return {
    code: 1,
    message: 'success',
    data: {
      header: header_material_update_clone,
      rows,
      // rows: [
      //     { id: 1, billNo: '12021333', payStatus: '已付款', materialId: "A001", materialName: '纸杯', spec: '50ml容量', supplierName: '农夫山泉', brand: '农夫山泉', orderPrice: 0.5, modifyPrice: undefined },
      //     { id: 2, billNo: '12021555', payStatus: '未付款', materialId: "A002", materialName: '纸巾', spec: '120抽', supplierName: '洁柔', brand: '洁柔', orderPrice: 2.5, modifyPrice: undefined },
      // ]
    },
  };
}
/**
 * 根据采购单号和资产/耗材编号、供应商，修改资产/耗材采购单价
 * 1.检查采购单，供应商是否已付款，已付款不允许修改
 * 2.修改采购单中资产/耗材价格
 * 3.修改应付账款
 * 4.生成修改资产/耗材价格流水记录
 * 修改资产价格
 *  @param {array} assetList  资产列表集合
 *  @param {array} MaterialList  耗材列表集合
 */
async function updatePrice(assetList, MaterialList) {
  let viewDef = cache.view_get().bill_purchase;
  let payStatusMap = viewDef.typeDef.payStatusMap;
  let pay_status_finish = viewDef.typeDef.payStatus.finish;
  let billNo;
  if (assetList && assetList.length > 0) {
    billNo = assetList[0].billNo;
  } else if (MaterialList && MaterialList.length > 0) {
    billNo = MaterialList[0].billNo;
  } else {
    return { code: -1, message: '传入的资产或耗材列表不能为空。' };
  }

  //查询单据状态
  let billType = viewDef.typeDef.type;
  let checked = viewDef.typeDef.status.final.value;
  let query = { billNo, billType };
  let res_bill = await dbClient.Query(table.v_bill_purchase, query);

  if (res_bill.code != 1) {
    return res_bill;
  }

  let billStatus = res_bill.data[0].status;

  let res = await dbClient.ExecuteTrans(async (con) => {
    let supplierArr = [];
    let bill_main_amount = 0;
    if (assetList && assetList.length > 0) {
      for (let i = 0; i < assetList.length; i++) {
        let t = assetList[i];
        bill_main_amount += t.orderQty * t.modifyPrice;
        if (!supplierArr.includes(t.supplierId)) {
          supplierArr.push(t.supplierId);
        }
        //判断状态
        if (t.payStatus === pay_status_finish.desc) continue;
        if (t.orderPrice == t.modifyPrice) continue;
        //插入流水
        let flowobj = {
          billNo: t.billNo,
          billType: billType,
          assetName: t.assetName,
          spec: t.spec,
          supplierId: t.supplierId,
          orderPrice: t.modifyPrice,
        };

        let res_assetprice_insert = await dbClient.InsertWithCon(
          con,
          table.tenant_bill_purchase_asset_price_flow,
          flowobj
        );
        if (res_assetprice_insert.code != 1) {
          throw res_assetprice_insert;
        }
        //更新明细
        let query = { billNo, billType, assetName: t.assetName, spec: t.spec, supplierId: t.supplierId };
        let update_content = { orderPrice: t.modifyPrice, amount: t.orderQty * t.modifyPrice };
        let res_assetdetail_update = await dbClient.UpdateWithCon(
          con,
          table.tenant_bill_purchase_detail_asset,
          query,
          update_content
        );
        if (res_assetdetail_update.code != 1) {
          throw res_assetdetail_update;
        }
        //更新资产原值
        if (billStatus >= checked) {
          let update_asset_query = { assetName: t.assetName, spec: t.spec, brand: t.brand ? t.brand : '' };
          let update_asset_content = { initialValue: t.modifyPrice };
          let res_asset_update = await dbClient.UpdateWithCon(
            con,
            table.tenant_asset,
            update_asset_query,
            update_asset_content
          );
          if (res_asset_update.code != 1) {
            throw res_asset_update;
          }
        }
      }
    }

    if (MaterialList && MaterialList.length > 0) {
      for (let i = 0; i < MaterialList.length; i++) {
        let t = MaterialList[i];
        bill_main_amount += t.orderQty * t.modifyPrice;

        if (!supplierArr.includes(t.supplierId)) {
          supplierArr.push(t.supplierId);
        }
        //判断状态
        if (t.payStatus === pay_status_finish.desc) continue;
        if (t.orderPrice == t.modifyPrice) continue;
        //插入流水
        let flowobj = {
          billNo: t.billNo,
          billType: billType,
          materialId: t.materialId,
          orderPrice: t.modifyPrice,
        };

        let res_assetprice_insert = await dbClient.InsertWithCon(
          con,
          table.tenant_bill_purchase_material_price_flow,
          flowobj
        );
        if (res_assetprice_insert.code != 1) {
          throw res_assetprice_insert;
        }
        //更新明细
        let query = {
          billNo: billNo,
          billType: billType,
          assetName: t.assetName,
          spec: t.spec,
          supplierId: t.supplierId,
        };

        let update_content = { orderPrice: t.modifyPrice, amount: t.orderQty * t.modifyPrice };

        let res_assetdetail_update = await dbClient.UpdateWithCon(
          con,
          table.tenant_bill_purchase_detail_material,
          query,
          update_content
        );
        if (res_assetdetail_update.code != 1) {
          throw res_assetdetail_update;
        }
      }
    }
    // 更新单据主表的总金额：
    let query_main = { billNo, billType };
    let update_bill_main_content = { amount: bill_main_amount };
    let res_update_bill_main = await dbClient.UpdateWithCon(
      con,
      table.tenant_bill_purchase,
      query_main,
      update_bill_main_content
    );
    if (res_update_bill_main.code != 1) {
      throw res_update_bill_main;
    }

    //更新应付账单金额
    if (billStatus >= checked) {
      for (let i = 0; i < supplierArr.length; i++) {
        let supplierId = supplierArr[i];
        let paysum = 0;
        for (let j = 0; j < assetList.length; j++) {
          let t1 = assetList[j];
          if (t1.billNo == billNo && t1.supplierId == supplierId) {
            paysum += t1.orderQty * t1.modifyPrice;
          }
        }

        for (let f = 0; f < MaterialList.length; f++) {
          let t2 = MaterialList[f];
          if (t2.billNo == billNo && t2.supplierId == supplierId) {
            paysum += t2.orderQty * t2.modifyPrice;
          }
        }

        let query = { supplierId: supplierId, billNo: billNo };
        let update_content = { payableAmount: paysum };

        let res_payable_update = await dbClient.UpdateWithCon(
          con,
          table.tenant_supplier_payable,
          query,
          update_content
        );
        if (res_payable_update.code != 1) {
          throw res_payable_update;
        }
      }
    }

    //资产改价成功
    return { code: 1, message: '改价成功.' };
  });
  return res;
}

module.exports.getTemplate_asset = getTemplate_asset;
module.exports.getTemplate_material = getTemplate_material;
module.exports.getBillMainTemplate = getBillMainTemplate;
module.exports.queryBill = queryBill;
module.exports.queryBillDetail = queryBillDetail;
module.exports.saveBill = saveBill;
module.exports.updateBill = updateBill;
module.exports.deleteBill = deleteBill;
module.exports.checkBill = checkBill;
module.exports.getAssetList_forPriceUpdate = getAssetList_forPriceUpdate;
module.exports.getMaterialList_forPriceUpdate = getMaterialList_forPriceUpdate;
module.exports.updatePrice = updatePrice;
module.exports.queryBill_paifa = queryBill_paifa;
module.exports.queryBill_materialchuku = queryBill_materialchuku;
