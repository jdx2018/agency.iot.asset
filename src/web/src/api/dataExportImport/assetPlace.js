const assetPlace_client = require('../asset/assetPlace');
const utils = require("./utils");
const template = require("./template");
/**
 * 获取导入模板
 */
function getTemplate() {
  const t = template.getTemplateDef().assetPlace;
  return { code: 1, message: 'success', data: t };
}
/**
 * 校验资产位置数据
 * @param {array<placeId,placeName,parentId>} assetPlaceList
 * @returns
 * @example
 * { code:-1,message:"fail",data:[{rowIndex:2,errMessageList:[{columnName:"placeId",message:"位置编号不能为空"}]}]
 */
async function check(assetPlaceList) {
  if (!assetPlaceList || !Array.isArray(assetPlaceList) || assetPlaceList.length < 1) {
    return { code: -1, message: '资产位置列表不能为空.' };
  }
  let res = await assetPlace_client.getPlaceList_list(false);
  if (res.code != 1) {
    return res;
  }
  let objOrigin = utils.list2Obj(res.data, 'placeId');
  let objCurrent = utils.list2Obj(assetPlaceList, 'placeId');
  let code = 1;
  let message = '校验通过.';
  let errorList = [];

  for (let i = 0; i < assetPlaceList.length; i++) {
    let obj = assetPlaceList[i];
    let errObj = { rowIndex: i, errMessageList: [] };

    if (utils.isEmptyVal(obj.placeId)) {
      errObj.errMessageList.push({ columnName: 'placeId', message: '位置编号不能为空' });
    }
    if (utils.isEmptyVal(obj.placeName)) {
      errObj.errMessageList.push({ columnName: 'placeName', message: '位置名称不能为空' });
    }
    if (utils.isEmptyVal(obj.parentId)) {
      errObj.errMessageList.push({ columnName: 'parentId', message: '上级位置不能为空' });
    }
    if (objOrigin[obj.placeId]) {
      errObj.errMessageList.push({ columnName: 'placeId', message: '位置ID与已有的值重复.' });
    }
    if (objCurrent[obj.placeId] && objCurrent[obj.placeId].num > 1) {
      errObj.errMessageList.push({ columnName: 'placeId', message: '位置ID在文件中的值有重复.' });
    }
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
    data: assetPlaceList,
    errorList: errorList,
  };
}
module.exports.getTemplate = getTemplate;
module.exports.check = check;
