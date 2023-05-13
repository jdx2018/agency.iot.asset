const assetClass_client = require('../asset/assetClass');
const utils = require('./utils');
const template = require("./template");
/**
 * 获取导入模板
 */
function getTemplate() {
  const t = template.getTemplateDef().assetClass;
  return { code: 1, message: 'success', data: t };
}
/**
 * 校验资产分类数据
 * @param {array<classId,className,parentId>} assetClassList
 * @returns
 * @example
 * { code:-1,message:"fail",data:[{rowIndex:2,errMessageList:[{columnName:"classId",message:"分类编号不能为空"}]}]
 */
async function check(assetClassList) {
  if (!assetClassList || !Array.isArray(assetClassList) || assetClassList.length < 1) {
    return { code: -1, message: '资产分类列表不能为空.' };
  }
  let res = await assetClass_client.getAssetClass_list(false);
  if (res.code != 1) {
    return res;
  }
  let objOrigin = utils.list2Obj(res.data, 'classId');
  let objCurrent = utils.list2Obj(assetClassList, 'classId');
  let code = 1;
  let message = '校验通过.';
  let errorList = [];

  for (let i = 0; i < assetClassList.length; i++) {
    let obj = assetClassList[i];
    let errObj = { rowIndex: i, errMessageList: [] };

    if (utils.isEmptyVal(obj.classId)) {
      errObj.errMessageList.push({ columnName: 'classId', message: '分类编号不能为空' });
    }
    if (utils.isEmptyVal(obj.className)) {
      errObj.errMessageList.push({ columnName: 'className', message: '分类名称不能为空' });
    }
    if (utils.isEmptyVal(obj.parentId)) {
      errObj.errMessageList.push({ columnName: 'parentId', message: '上级编号不能为空' });
    }
    if (objOrigin[obj.classId]) {
      errObj.errMessageList.push({ columnName: 'classId', message: '分类ID与已有的值重复.' });
    }
    if (objCurrent[obj.classId] && objCurrent[obj.classId].num > 1) {
      errObj.errMessageList.push({ columnName: 'classId', message: '分类ID在文件中的值有重复.' });
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
    data: assetClassList,
    errorList: errorList,
  };
}
module.exports.getTemplate = getTemplate;
module.exports.check = check;
