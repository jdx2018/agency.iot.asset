/**
 * 资产相关数据操作
 */
const dayjs = require('dayjs');
const dbClient = require('../db').dbClient;
const table = require('../db/tableEnum').table;
const param = require('../mock/param_mock').param;
const cache = require('../cache');
const { create_log } = require('../sysLog');
const fieldTool = require('../tool/fieldTool');
const selectSource = require('../tool/selectSource');
const utility = require('../utility');
const codeGeneration = require('../codeGeneration.js').codeGeneration;

/**
 * 获取分类新增/编辑模板
 */
async function getTemplate() {
  let viewDef = cache.view_get().asset;
  let objTemplate = viewDef.objTemplate;
  // console.log("asset.getTemplate", objTemplate);
  await selectSource.fillDataSource(objTemplate);
  return { code: 1, message: 'success', data: objTemplate };
}
/**
 * 获取资产列表-可派发使用 status:空闲 useStatus:正常
 * @returns
 */
async function getAssetList_paifa() {
  return await getAssetList_forBill({
    status: param.assetStatus.enum.free.value,
    useStatus: param.assetUseStatus.enum.normal.value,
  });
}
/**
 * 获取资产列表- 可退库 status:领用
 */
async function getAssetList_tuiku() {
  return await getAssetList_forBill({ status: param.assetStatus.enum.use.value });
}
/**
 * 获取资产列表-可借出 status 空闲
 */
async function getAssetList_jiechu() {
  return await getAssetList_forBill({
    status: param.assetStatus.enum.free.value,
    useStatus: param.assetUseStatus.enum.normal.value,
  });
}
/**
 * 获取资产列表-可归还 status 借出
 */
async function getAssetList_guihuan() {
  return await getAssetList_forBill({ status: param.assetStatus.enum.borrow.value });
}
/**
 * 获取资产列表-可处置 status 空闲
 */
async function getAssetList_chuzhi() {
  return await getAssetList_forBill({ status: param.assetStatus.enum.free.value });
}

/**
 * 获取资产列表 业务单据操作公用 传入查询条件、字段【默认为10个】
 * @param {*} query
 * @param {*} fields
 */
async function getAssetList_forBill(query) {
  let viewDef = cache.view_get().asset;
  let user = cache.user_get();
  let statusMap = viewDef.typeDef.statusMap;
  query.p_orgId = user.manage_orgId;
  // let proc_param = {
  //     tenantId: user.tenantId,
  //     userId: user.userId,
  //     query: query,
  //     fields: {}
  // };
  // console.log("query asset for bill", proc_param);
  let res_asset = await dbClient.Query(table.v_asset_org, query);
  // let res_asset = await dbClient.executeProc(table.p_asset_get, proc_param);
  // console.log("查询资产列表结果.", query,res_asset.data);
  if (res_asset.code != 1) {
    return res_asset;
  }
  let rows = res_asset.data;
  for (let i = 0; i < rows.length; i++) {
    rows[i].status = statusMap[rows[i].status];
  }
  return {
    code: 1,
    message: 'success.',
    data: { header: viewDef.header.billDetail, rows: rows },
  };
}
/**
 * 根据采购单获取资产列表
 * @param {string} billNo
 */
async function getAssetList_purchase(billNo) {
  if (!billNo) {
    return { code: -1, message: '采购单号不能为空.' };
  }
  let viewDef = cache.view_get().asset;
  let billType = cache.view_get().bill_purchase.typeDef.type;
  let query = { billNo: billNo, billType: billType, status: 0 };
  let header_main = viewDef.header.main;
  let statusMap = viewDef.typeDef.statusMap;
  let fields = fieldTool.header2Fields(header_main);
  let res_asset = await dbClient.Query(table.v_asset_purchase_flow, query, fields);
  if (res_asset.code != 1) {
    return res_asset;
  }
  let rows = res_asset.data;
  for (let i = 0; i < rows.length; i++) {
    rows[i].status = statusMap[rows[i].status];
  }
  return { code: 1, message: 'success', data: { header: header_main, rows: rows } };
}


/**
 * 获取超过使用年限的资产：
 */
async function getAssetList_dashboard_asset_overdate() {
  let viewDef = cache.view_get().asset;
  let user = cache.user_get();
  let query = { tenantId: user.tenantId, p_orgId: user.manage_orgId };
  let header_main = viewDef.header.main;
  let statusMap = viewDef.typeDef.statusMap;
  let useStatusMap = viewDef.typeDef.useStatusMap;
  let purchaseTypeMap = viewDef.typeDef.purchaseTypeMap;
  let isHostedMap = viewDef.typeDef.isHostedMap;
  let isMonitorMap = viewDef.typeDef.isMonitorMap;
  let sortFields = { createTime: 0 };

  let res_assetList = await dbClient.executeProc('p_dashboard_asset_overdate', query)
  if (res_assetList.code != 1) {
    return res_assetList;
  }
  let rows = res_assetList.data;
  for (let i = 0; i < rows.length; i++) {
    rows[i].status = statusMap[rows[i].status];
    rows[i].useStatus = useStatusMap[rows[i].useStatus];
    rows[i].purchaseType = purchaseTypeMap[rows[i].purchaseType];
    rows[i].isHosted = isHostedMap[rows[i].isHosted];
    rows[i].isMonitor = isMonitorMap[rows[i].isMonitor];
  }
  if (res_assetList.code != 1) {
    return res_assetList;
  }
  // console.log(res_assetList)
  return {
    code: 1,
    message: 'success',
    data: {
      header: header_main,
      rows: rows,
    },
  };
}



/**
 * 查询所有资产列表
 */
async function getAssetList(filter) {
  // console.log("asset.getAssetList", filter);
  let viewDef = cache.view_get().asset;
  let user = cache.user_get();
  await selectSource.fillDataSource(viewDef.filter.items_select);
  let query = { p_orgId: user.manage_orgId };
  let header_main = viewDef.header.main;
  let statusMap = viewDef.typeDef.statusMap;
  let useStatusMap = viewDef.typeDef.useStatusMap;
  let purchaseTypeMap = viewDef.typeDef.purchaseTypeMap;
  let isHostedMap = viewDef.typeDef.isHostedMap;
  let isMonitorMap = viewDef.typeDef.isMonitorMap;
  let sortFields = { createTime: 0 };

  if (filter) {
    if (filter.purchaseDate_start) {
      query.purchaseDate = { $gte: filter.purchaseDate_start };
      delete filter.purchaseDate_start;
    }
    if (filter.purchaseDate_end) {
      if (!query.purchaseDate) {
        query.purchaseDate = {};
      }
      query.purchaseDate.$lte = filter.purchaseDate_end;
      delete filter.purchaseDate_end;
    }
    if (filter.createTime_start) {
      query.createTime = { $gte: filter.createTime_start + ' 00:00:00' };
      delete filter.createTime_start;
    }
    if (filter.createTime_end) {
      if (!query.createTime) {
        query.createTime = {};
      }
      query.createTime.$lte = filter.createTime_end + ' 23:59:59';
      delete filter.createTime_end;
    }
    if (filter.documentDate_start) {
      query.documentDate = { $gte: filter.documentDate_start };
      delete filter.documentDate_start;
    }
    if (filter.documentDate_end) {
      if (!query.documentDate) {
        query.documentDate = {};
      }
      query.documentDate.$lte = filter.documentDate_end;
      delete filter.documentDate_end;
    }
    Object.keys(filter).forEach((key) => {
      query[key] = filter[key];
    });
  }
  let fields = fieldTool.header2Fields(header_main, null);
  // console.log(fields)
  let table_name = query.classId ? table.v_asset_org_class : table.v_asset_org;
  let res_assetList = await dbClient.Query(table_name, query, fields, null, null, sortFields)
  // console.log(res_assetList)
  // let proc_param = {
  //     tenantId: userInfo.tenantId,
  //     userId: userInfo.userId,
  //     query: query,
  //     fields: fields
  // };

  // let res_assetList = await dbClient.executeProc(table.p_asset_get, proc_param);

  if (res_assetList.code != 1) {
    return res_assetList;
  }
  let rows = res_assetList.data;
  for (let i = 0; i < rows.length; i++) {
    rows[i].status = statusMap[rows[i].status];
    rows[i].useStatus = useStatusMap[rows[i].useStatus];
    rows[i].purchaseType = purchaseTypeMap[rows[i].purchaseType];
    rows[i].isHosted = isHostedMap[rows[i].isHosted];
    rows[i].isMonitor = isMonitorMap[rows[i].isMonitor];
  }
  if (res_assetList.code != 1) {
    return res_assetList;
  }
  // console.log("asset-getList.filter:",viewDef.filter);
  return {
    code: 1,
    message: 'success',
    data: {
      header: header_main,
      rows: rows,
      filter: viewDef.filter,
    },
  };
}
/**s
 * 获取资产明细信息
 * @param {string} assetId 资产编号
 */
async function getAsset_detail(assetId) {
  let res_asset = await dbClient.Query(table.v_asset, { assetId: assetId });
  if (res_asset.code != 1) {
    return res_asset;
  }
  if (!res_asset.data || res_asset.data.length < 1) {
    return { code: -1, message: '该资产不存在.' };
  }
  console.log('getasset_detail', res_asset.data[0]);
  return { code: 1, message: 'success.', data: res_asset.data[0] };
}
/**
 * 添加资产
 * @param {object} asset 
 * {
                    assetId: "ZC00100000001", barcode: "", epc: "", assetName: "笔记本电脑",
                    classId: "C00101", className: "笔记本电脑", manager: "张治金", brand: "apple",
                    model: "X3", sn: "", ownOrgId: "supoin01", ownOrgName: "销邦科技", useOrgId: "supoin01",
                    useOrgName: "销邦科技", status: 1, useDate: "", placeId: "P001", placeName: "英龙大厦",
                    serviceLife: 12, amount: 7999, purchaseDate: "2020-06-01", purchaseType: '采购', orderNo: "",
                    unit: "台", image: null, supplier: "", linkPerson: "张治金", telNo: "13826598771",
                    expired: "2021-10-01", mContent: ""
                }
 */
async function addAsset(asset) {
  if (!asset.assetId) {
    asset.assetId = 'ZC' + Date.now();
  }
  // console.log("添加单个资产:");
  // console.log(asset);
  return await addAssetList([asset]);
}
/**
 * 添加多个资产 
 * @param {object} assetList
 */
async function addAssetList(assetList) {
  let user = cache.user_get();
  if (!assetList || assetList.length < 1) {
    return { code: -1, message: '资产列表不能为空' };
  }
  assetList = await assetsListCodeCompletion(assetList);

  let res = await dbClient.ExecuteTrans(async (con) => {
    for (let i = 0; i < assetList.length; i++) {
      let t = assetList[i];
      t.documentDate = t.documentDate ? t.documentDate : dayjs().format('YYYY-MM-DD HH:mm:ss');
      t.isHosted = 0;
      t.isMonitor = 0;
      if (!t.ownOrgId) {
        t.ownOrgId = user.orgId;
      }
      let res_insert = await dbClient.InsertWithCon(con, table.tenant_asset, t);
      if (res_insert.code != 1) {
        if (res_insert.message.indexOf("ER_DUP_ENTRY") > -1) {
          return { code: 0, message: "重复的资产编号：" + assetList[i].assetId }
        }
        return { code: 0, message: `第${i + 1}行插入异常,请检查数据。 ` + res_insert.message };
      }
    }

    return { code: 1, message: '导入资产成功' };
  });

  // 新增资产成功，记录日志：
  if (assetList && assetList.length === 1) {
    await create_log(user.userId, 'assetList', 'add', JSON.stringify(assetList[0]))
  }
  if (assetList && assetList.length > 1) {
    await create_log(user.userId, 'assetList', 'addMany', `总共导入资产数量【${assetList.length}】个，分别为${assetList.map(e => e.assetId).slice(0, 3).join(',') + '...'}`)
  }

  return res;
}
let asset_list = [
  {
    amount: '',
    assetId: '2017000901',
    assetName: '',
    barcode: '',
    brand: '',
    classId: '',
    createPerson: '',
    documentDate: '',
    documentNumber: '',
    epc: '',
    initialValue: '',
    invoiceType: '',
    manager: '',
    model: '',
    ownOrgId: '',
    placeId: '',
    purchaseDate: '',
    purchasePerson: '',
    purchaseType: '',
    serviceLife: '',
    sn: '',
    spec: '',
    status: '',
    supplier: '',
    useDate: '',
    useEmployeeId: '',
    useOrgId: '',
    useStatus: 0,
    wareHouse: '',
    isHosted: '去',
  },
];

// test(asset_list)
async function test(asset_list) {
  let res = await checkAssetList(asset_list);
  console.log('最终返回结果：');
  console.log(res);
}
/**
 * 检测数据合法性
 * @param {list} assetList
 */
async function checkAssetList(assetList) {
  if (!assetList || assetList.length < 1) {
    return { code: -1, message: '资产列表不能为空' };
  }

  try {
    let viewDef = cache.view_get().asset;
    let rules = viewDef.checkRule.rules;
    // let use = cache.user_get();
    // let orgList = await org.getOrgList_list(use);
    // let orgIdList = orgList.data.map(each => each.orgId);

    // let placeList = await assetPlace.getPlaceList_list(use);
    // let placeIdList = placeList.data.map(each => each.placeId);

    // let classList = await assetClass.getAssetClass_list(use);
    // let classIdList = classList.data.map(each => each.classId);

    let result = [];
    for (let i = 0; i < assetList.length; i++) {
      for (let key of Object.keys(assetList[i])) {
        let colValue = assetList[i][key];

        let rule = '';
        for (let j = 0; j < rules.length; j++) {
          if (rules[j].key == key) {
            rule = rules[j].rule;
            break;
          }
        }
        if (rule) {
          let reason = '';
          if (rule.required && (colValue === '' || colValue === null)) {
            reason += '不能为空 ';
          }

          // if (colValue && rule.dataType == 'string' && !(typeof colValue === 'string')) {
          //   reason += '字符串格式错误 '
          // };

          // if (colValue && rule.dataType == 'number' && !(typeof colValue === 'number')) {
          //   reason += '数字格式错误 '
          // };

          if (colValue && rule.dataType == 'datetime' && !dayjs(colValue).isValid()) {
            reason += '时间格式错误 ';
          }

          // 暂时不做是否包含的逻辑，影响性能：
          // if (rule.isIncluded) {
          //   if (key === 'ownOrgId' && !orgIdList.includes(colValue)) { reason += '机构id错误 | ' };
          //   if (key === 'placeId' && !placeIdList.includes(colValue)) { reason += '位置id错误 | ' };
          //   if (key === 'classId' && !classIdList.includes(colValue)) { reason += '资产类型ID错误 | ' };
          // }
          // if (rule.isMainKey) {
          //   let res_assetIdList = await dbClient.Query(table.tenant_asset, { [key]: colValue }, { [key]: 1 })
          //   let assetIdList = res_assetIdList.data.map(each => each.assetId);

          //   if (assetIdList.includes(colValue)) { reason += '资产编号重复 | ' }
          // };

          if (reason) {
            let resultRow = {
              rowNum: i + 1,
              columnName: key,
              reason: reason,
            };

            result.push(resultRow);
          }
        }
      }
    }
    if (result.length > 0) {
      return { code: -1, message: '数据校验失败：', data: result };
    } else {
      return { code: 1, message: '数据校验成功。' };
    }
  } catch (e) {
    return { code: -1, message: '数据校验流程失败：' + e.message };
  }
}

/**
 * 修改资产信息
 * @param {*} assetId
 */
async function updateAsset(assetId, dataContent) {
  return await updateAssetWithCon(null, assetId, dataContent);
}
/**
 * 修改资产信息
 * @param {*} con
 * @param {*} assetId
 * @param {*} dataContent
 */
async function updateAssetWithCon(con, assetId, dataContent) {
  try {
    if (!assetId || !dataContent) return { code: -1, message: '资产编号/修改内容不能为空.' };
    delete dataContent.tenantId;
    delete dataContent.assetId;
    // console.log("修改资产信息", dataContent);
    let res = await dbClient.UpdateWithCon(con, table.tenant_asset, { assetId: assetId }, dataContent);

    let user = cache.user_get();
    // 删除资产成功，记录日志：
    await create_log(user.userId, 'assetList', 'update', `资产编号【${assetId}】，更新内容：${JSON.stringify(dataContent)}`)

    return res
  } catch (err) {
    return { code: -1, message: '更新资产失败：' + err.message, data: null }
  }
}


async function deleteAsset(assetId) {
  if (!assetId) return { code: -1, message: 'assetId不能为空' }
  try {
    let res = await dbClient.ExecuteTrans(async (con) => {
      let res1 = await dbClient.InsertWithCon(con, table.tenant_asset_delete_log, { assetId });
      if (res1.code !== 1) throw res1;
      let res2 = await dbClient.DeleteWithCon(con, table.tenant_asset, { assetId });
      if (res2.code !== 1) throw res2;
      return { code: 1, message: '删除资产成功！' }
    })

    let user = cache.user_get();
    // 删除资产成功，记录日志：
    await create_log(user.userId, 'assetList', 'delete', assetId || '')

    return res;
  } catch (err) {
    return { code: -1, message: '删除资产失败：' + err.message, data: null }
  }
}
/**
 * 根据资产名称获取库存数量
 * @param {string} assetName
 */
async function getStorageQtyByAssetName(assetName) {
  if (!assetName) {
    return { code: -1, message: '资产名称不能为空.' };
  }
  let storageQty = 0;
  let query = { assetName: assetName };
  let res = await dbClient.Query(table.v_asset_storage_assetName, query);
  // if (res.code != 1) { return res; }
  if (res.data && res.data.length > 0) {
    storageQty = res.data[0].storageQty;
  }
  return { code: 1, message: 'success', data: storageQty };
}

async function getTenantTopId() {
  let res_org_top = await dbClient.Query(table.v_org_top);
  if (res_org_top.code != 1) {
    res_org_top.message = '获取顶级机构失败';
    return res_org_top;
  }
  let res_asset_class_top = await dbClient.Query(table.v_asset_class_top);
  if (res_asset_class_top.code != 1) {
    res_asset_class_top.message = '获取资产分类顶级ID失败';
    return res_asset_class_top;
  }

  let res_asset_place_top = await dbClient.Query(table.v_asset_place_top);
  if (res_asset_place_top.code != 1) {
    res_asset_place_top.message = '获取资产位置顶级ID失败.';
    return res_asset_place_top;
  }
  let orgId_top = res_org_top.data[0].orgId;
  let asset_classId_top = res_asset_class_top.data[0].classId;
  let asset_placeId_top = res_asset_place_top.data[0].placeId;
  let res = { code: 1, message: 'success', data: { orgId_top, asset_classId_top, asset_placeId_top } };
  return res;
}

async function assetsListCodeCompletion(assetList) {
  if (!assetList || assetList.length < 1) {
    return assetList;
  }
  const dateNow = utility.getDateTime('YYYYMMdd');
  const epc_prifix = '010003' + dateNow;
  let assetIdObj = {};
  let totalNullEpcCount = 0;
  assetList.forEach((asset) => {
    if (!asset.assetId) {
      if (assetIdObj[asset.classId]) {
        assetIdObj[asset.classId]++;
      } else {
        assetIdObj[asset.classId] = 1;
      }
    }
    if (!asset.epc) {
      totalNullEpcCount++;
    } else {
      totalNullEpcCount = 1;
    }
  });
  let res_epc_code = await codeGeneration([{ codeType: 'epc', count: totalNullEpcCount }]);
  if (res_epc_code.code !== 1) {
    return assetList;
  }
  const startCodingObject = {};
  const assetIdList = Object.keys(assetIdObj);
  for (let i = 0; i < assetIdList.length; i++) {
    const res = await codeGeneration([{ codeType: assetIdList[i], count: assetIdObj[assetIdList[i]] }]);
    if (res.code !== 1) throw res;
    startCodingObject[assetIdList[i]] = res.data[assetIdList[i]];
  }

  assetList.forEach((asset, index) => {
    if (!asset.epc) asset.epc = epc_prifix + String(res_epc_code.data.epc + index).padStart(10, '0');
    const classId = asset.classId;
    if (!asset.assetId) asset.assetId = classId + String(startCodingObject[classId]).padStart(5, '0');
    startCodingObject[classId]++;
  });
  return assetList;
}


module.exports.getTemplate = getTemplate;
module.exports.getAssetList = getAssetList;
module.exports.getAsset_detail = getAsset_detail;
module.exports.addAsset = addAsset;
module.exports.addAssetList = addAssetList;
module.exports.deleteAsset = deleteAsset;
module.exports.updateAsset = updateAsset;
module.exports.updateAssetWithCon = updateAssetWithCon;
module.exports.getAssetList_paifa = getAssetList_paifa;
module.exports.getAssetList_tuiku = getAssetList_tuiku;
module.exports.getAssetList_jiechu = getAssetList_jiechu;
module.exports.getAssetList_guihuan = getAssetList_guihuan;
module.exports.getAssetList_chuzhi = getAssetList_chuzhi;
module.exports.getAssetList_purchase = getAssetList_purchase;
module.exports.getStorageQtyByAssetName = getStorageQtyByAssetName;
module.exports.checkAssetList = checkAssetList;
module.exports.assetsListCodeCompletion = assetsListCodeCompletion;
module.exports.getAssetList_dashboard_asset_overdate = getAssetList_dashboard_asset_overdate;


