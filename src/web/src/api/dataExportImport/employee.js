const employee_client = require('../org/employee');
const org_client = require('../org/org');
const utils = require("./utils");

const template = require("./template");
/**
 * 获取导入模板
 */
function getTemplate() {
  const t = template.getTemplateDef().employee;
  return { code: 1, message: 'success', data: t };
}

/**
 * 校验机构数据
 * @param {array<orgId,employeeId,employeeName,status,telNo,email>} employeeList
 * @returns
 * @example
 * { code:-1,message:"fail",data:[{rowIndex:2,errMessageList:[{columnName:"employeeId",message:"员工编号不能为空"}]}]
 */
async function check(employeeList) {
  if (!employeeList || !Array.isArray(employeeList) || employeeList.length < 1) {
    return { code: -1, message: '员工列表不能为空.' };
  }
  let employee_res = await employee_client.getEmployeeList_list(false);
  if (employee_res.code !== 1) {
    return employee_res;
  }
  const org_res = await org_client.getOrgList_list(false);
  if (org_res.code !== 1) {
    return org_res;
  }
  let objOrgExists = utils.list2Obj(org_res.data, 'orgId');
  let objOrgIDReplace = utils.list2Obj(org_res.data, "orgName", "orgId");
  let objOrigin = utils.list2Obj(employee_res.data, 'employeeId');
  let objCurrent = utils.list2Obj(employeeList, 'employeeId');
  let code = 1;
  let message = '校验通过.';
  let errorList = [];

  for (let i = 0; i < employeeList.length; i++) {
    let obj = employeeList[i];
    let errObj = { rowIndex: i, errMessageList: [] };

    if (utils.isEmptyVal(obj.orgId)) {
      errObj.errMessageList.push({ columnName: 'orgId', message: '机构编号不能为空' });
    }
    if (!objOrgExists[obj.orgId] && !objOrgIDReplace[obj.orgId]) {
      errObj.errMessageList.push({ columnName: 'orgId', message: '无效机构编号' });
    }
    if (objOrgIDReplace[obj.orgId] && objOrgIDReplace[obj.orgId].num > 1) {
      errObj.errMessageList.push({ columnName: 'orgId', message: '对应多个机构ID，无法自动匹配' });
    }
    if (objOrgIDReplace[obj.orgId] && objOrgIDReplace[obj.orgId].num === 1) {
      obj.orgId = objOrgIDReplace[obj.orgId].value;//名称匹配为ID
    }
    if (utils.isEmptyVal(obj.employeeId)) {
      errObj.errMessageList.push({ columnName: 'employeeId', message: '员工编号不能为空' });
    }
    if (utils.isEmptyVal(obj.employeeName)) {
      errObj.errMessageList.push({ columnName: 'employeeName', message: '员工名称不能为空' });
    }
    if (objOrigin[obj.employeeId]) {
      errObj.errMessageList.push({ columnName: 'employeeId', message: '员工ID与已有的值重复.' });
    }
    if (objCurrent[obj.employeeId] && objCurrent[obj.employeeId].num > 1) {
      errObj.errMessageList.push({ columnName: 'employeeId', message: '员工ID在文件中的值有重复.' });
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
    data: employeeList,
    errorList: errorList
  };
}
module.exports.getTemplate = getTemplate;
module.exports.check = check;
