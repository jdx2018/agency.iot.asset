const dbClient = require('../db').dbClient;
const table = require('../db/tableEnum').table;
const utils = require('./utils');
const template = require('./template');
const chache = require('../cache');
/**
 * 获取资产列表导入模板
 */
function getTemplate() {
  const t = template.getTemplateDef().asset;
  return { code: 1, message: 'success', data: t };
}
function idCheckAndReplace(objOrigin, objMatch, obj, key, msgTitle, errMessageList) {
  let v_temp = obj[key];
  if (!utils.isEmptyVal(v_temp)) {
    //资产分类不为空时，并且需要校验分类是否有效,ID存在/名称可以匹配到唯一ID是有效
    if (objOrigin[v_temp]) {
      return;
    }
    if (objMatch[v_temp] && objMatch[v_temp].num === 1) {
      obj[key] = objMatch[v_temp].value;
      return;
    }
    if (!objMatch[v_temp]) {
      errMessageList.push({ columnName: key, message: msgTitle + '无效' });
      return;
    }
    if (objMatch[v_temp] && objMatch[v_temp].num > 1) {
      errMessageList.push({ columnName: key, message: msgTitle + '对应多个ID,无法自动匹配' });
      return;
    }
  }
}
async function check(assetList) {
  if (!assetList || !Array.isArray(assetList) || assetList.length < 1) {
    return { code: -1, message: '资产列表不能为空.' };
  }

  const purchaseTypeMap = chache.view_get().asset.typeDef.purchaseTypeMap;
  const purchaseTypeMapList = Object.keys(purchaseTypeMap).reduce(
    (acc, cur) => [...acc, { key: cur, value: purchaseTypeMap[cur] }],
    []
  );

  let res_class = await dbClient.Query(table.tenant_asset_class, null, { classId: 1, className: 1 });
  if (res_class.code != 1) {
    return res_class;
  }

  let res_place = await dbClient.Query(table.tenant_asset_place, null, { placeId: 1, placeName: 1 });
  if (res_place.code != 1) {
    return res_place;
  }

  let res_org = await dbClient.Query(table.tenant_org, null, { orgId: 1, orgName: 1 });
  if (res_org.code != 1) {
    return res_org;
  }

  let res_employee = await dbClient.Query(table.tenant_employee, null, { employeeId: 1, employeeName: 1 });
  if (res_employee.code != 1) {
    return res_employee;
  }

  let res_asset = await dbClient.Query(table.tenant_asset, null, { assetId: 1 });
  if (res_asset.code != 1) {
    return res_asset;
  }

  let objClassOrigin = utils.list2Obj(res_class.data, 'classId');
  let objClassIDMatch = utils.list2Obj(res_class.data, 'className', 'classId');

  let objPlaceOrigin = utils.list2Obj(res_place.data, 'placeId');
  let objPlaceIDMatch = utils.list2Obj(res_place.data, 'placeName', 'placeId');

  let objOrgOrigin = utils.list2Obj(res_org.data, 'orgId');
  let objOrgIDMatch = utils.list2Obj(res_org.data, 'orgName', 'orgId');

  let objEmployeeOrigin = utils.list2Obj(res_employee.data, 'employeeId');
  let objEmployeeIDMatch = utils.list2Obj(res_employee.data, 'employeeName', 'employeeId');

  let objAssetOrigin = utils.list2Obj(res_asset.data, 'assetId');
  let objAssetCurrent = utils.list2Obj(assetList, 'assetId');

  let objPurchaseTypeOrigin = utils.list2Obj(purchaseTypeMapList, 'key');
  let objPurchaseTypeIDMatch = utils.list2Obj(purchaseTypeMapList, 'value', 'key');

  let code = 1;
  let message = '校验通过.';
  let errorList = [];
  for (let i = 0; i < assetList.length; i++) {
    let obj = assetList[i];
    let errObj = { rowIndex: i, errMessageList: [] };

    if (utils.isEmptyVal(obj.assetName)) {
      //校验资产名称
      errObj.errMessageList.push({ columnName: 'assetName', message: '资产名称不能为空.' });
    }

    if (!utils.isEmptyVal(obj.assetId)) {
      if (objAssetOrigin[obj.assetId]) {
        errObj.errMessageList.push({ columnName: 'assetId', message: '资产ID与已有的值重复.' });
      }
      if (objAssetCurrent[obj.assetId] && objAssetCurrent[obj.assetId].num > 1) {
        errObj.errMessageList.push({ columnName: 'assetId', message: '资产ID在文件中的值有重复.' });
      }
    }
    if (utils.isEmptyVal(obj.assetId)) {
      //资产编号为空，记录行索引。需要自动生成资产编号
    }
    if (utils.isEmptyVal(obj.epc)) {
      //epc编号为空，记录行索引，需要自动生成epc编号
    }
    //ID校验匹配
    idCheckAndReplace(objClassOrigin, objClassIDMatch, obj, 'classId', '资产分类', errObj.errMessageList);
    idCheckAndReplace(objPlaceOrigin, objPlaceIDMatch, obj, 'placeId', '资产位置', errObj.errMessageList);
    idCheckAndReplace(objOrgOrigin, objOrgIDMatch, obj, 'ownOrgId', '所属机构', errObj.errMessageList);
    idCheckAndReplace(objOrgOrigin, objOrgIDMatch, obj, 'useOrgId', '使用机构', errObj.errMessageList);
    idCheckAndReplace(objEmployeeOrigin, objEmployeeIDMatch, obj, 'useEmployeeId', '使用人', errObj.errMessageList);
    idCheckAndReplace(objEmployeeOrigin, objEmployeeIDMatch, obj, 'manager', '管理员', errObj.errMessageList);
    idCheckAndReplace(
      objPurchaseTypeOrigin,
      objPurchaseTypeIDMatch,
      obj,
      'purchaseType',
      '购置类型',
      errObj.errMessageList
    );

    if (errObj.errMessageList.length > 0) {
      errorList.push(errObj);
    }
  }

  if (errorList.length > 0) {
    code = -1;
    message = '校验不通过.';
  }

  return {
    code: code,
    message: message,
    data: assetList,
    errorList: errorList,
  };
}
module.exports.getTemplate = getTemplate;
module.exports.check = check;
