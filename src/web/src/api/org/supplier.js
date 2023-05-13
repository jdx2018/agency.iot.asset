const dbClient = require('../db').dbClient;
const table = require('../db/tableEnum').table;
const cache = require('../cache');
/**
 * 获取新增供应商模板
 */
async function getTemplate() {
  let viewDef = cache.view_get().supplier;
  let objTemplate = JSON.parse(JSON.stringify(viewDef.objTemplate));
  return { code: 1, message: 'success', data: objTemplate };
}
/**
 * 获取供应商列表
 * @param {object} filter 高级查询对象
 */
async function getSupplierList(filter, useCache) {
  let viewDef = cache.view_get().supplier;
  let query = { isDelete: 0 };
  let header_main = viewDef.header.main;
  if (filter) {
    Object.keys(filter).forEach((key) => {
      query[key] = filter[key];
    });
  }
  if (useCache && cache.rowsCache.supplier.rows) {
    // console.log("use asset cache.");
    return {
      code: 1,
      message: 'supplier use cache success',
      data: { header: header_main, rows: cache.rowsCache.supplier.rows, filter: viewDef.filter },
    };
  } else {
    let res = await dbClient.Query(table.tenant_supplier, query);
    if (res.code != 1) {
      return res;
    }
    cache.rowsCache.supplier = {
      stmp: Date.now(),
      rows: res.data,
    };
    return { code: 1, message: 'success', data: { header: header_main, rows: res.data, filter: viewDef.filter } };
  }
}
/**
 * 获取供应商明细
 * @param {string} supplierId
 */
async function getSupplierDetail(supplierId) {
  let objTemplate = JSON.parse(JSON.stringify(cache.view_get().supplier.objTemplate));
  let res = await dbClient.Query(table.tenant_supplier, { supplierId: supplierId });
  if (res.code != 1) {
    return res;
  }
  let obj = res.data[0];
  Object.keys(objTemplate).forEach((key) => {
    objTemplate[key].value = obj[key];
  });
  return { code: 1, message: 'success', data: objTemplate };
}
/**
 * 添加供应商
 * @param {object} supplierObj
 */
async function addSupplier(supplierObj) {
  return await addSupplierList([supplierObj]);
}
/**
 * 供应商
 * @param {array<object>} supplierList
 */
async function addSupplierList(supplierList) {
  let res = await dbClient.InsertMany(table.tenant_supplier, supplierList);
  if (res.code == -1 && res.message.indexOf('ER_DUP_ENTRY') > -1) {
    return { code: -1, message: '重复的供应商编号：' + supplierList[0].supplierId };
  }
  return res;
}
/**
 * 更新供应商信息
 * @param {*} supplierId
 * @param {*} dataContent
 */
async function updateSupplier(supplierId, dataContent) {
  let res = await dbClient.Update(table.tenant_supplier, { supplierId: supplierId }, dataContent);
  return res;
}
/**
 * 删除供应商信息
 * @param {string} supplierId
 */
async function deleteSupplier(supplierId) {
  let res = await dbClient.Update(table.tenant_supplier, { supplierId: supplierId }, { isDelete: 1 });
  return res;
}
module.exports.getTemplate = getTemplate;
module.exports.getSupplierList = getSupplierList;
module.exports.getSupplierDetail = getSupplierDetail;
module.exports.addSupplier = addSupplier;
module.exports.addSupplierList = addSupplierList;
module.exports.updateSupplier = updateSupplier;
module.exports.deleteSupplier = deleteSupplier;
