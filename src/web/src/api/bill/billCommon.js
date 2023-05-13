const assetPlace = require('../asset/assetPlace');
const assetClass = require('../asset/assetClass');
const org = require('../org/org');
const employee = require('../org/employee');
const assetBrand = require('../asset/assetBrand');
const fillEnum = {
  placeId: 'placeId',
  classId: 'classId',
  orgId: 'orgId',
  ownOrgId: 'ownOrgId',
  useOrgId: 'useOrgId',
  employeeId: 'employeeId',
  createPerson: 'createPerson',
  managerId: 'managerId',
  manager: 'manager',
  useEmployeeId: 'useEmployeeId',
  pdPerson: 'pdPerson',
  checkPerson: 'checkPerson',
  brand: 'brand',
  reportPersonId: 'reportPersonId', //报修人
  operatePersonId: 'operatePersonId', //处理人
  manage_orgId: 'manage_orgId', //管理的数据权限-资产所属部门
  returnEmployeeId: 'returnEmployeeId', //归还人
};
/**
 * 单据操作公用方法
 */

/**
 * table标题行定义生成fields对象 用户query对应的字段
 * 传入billType是为了将单据业务字段转换为扩展字段【数据库中存储的单据真实字段为ext扩展字段】
 * @param {object} header
 * @param {int} typeDef  单据类型结构定义
 */
function header2Fields(header, fieldMap) {
  let fields = null;
  if (header) {
    fields = {};
    Object.keys(header).forEach((key) => {
      let fieldName = header[key].isExt && fieldMap && fieldMap[key] ? fieldMap[key] : key;
      fields[fieldName] = 1; //设置需要选择的列
    });
  }
  // console.log("header 字段拼装", fields);
  return fields;
}

/**
 * 扩展字段转换为业务字段 根据单据类型中的扩展字段定义进行转换
 * @param {object} billMain
 */
function ext2Field(sourceObj, extMap) {
  let sourceTemp = {};
  if (sourceObj && extMap) {
    Object.keys(sourceObj).forEach((key) => {
      let v = sourceObj[key] || sourceObj[key] == 0 ? sourceObj[key] : null;
      if (extMap[key]) {
        sourceTemp[extMap[key]] = v;
      } else {
        sourceTemp[key] = v;
      }
    });
  }
  return sourceTemp;
}
/**
 * 业务字段转换为扩展字段
 * @param {*} sourceObj
 * @param {*} typeDef
 */
function field2Ext(sourceObj, fieldMap) {
  let sourceTemp = {};
  if (sourceObj && fieldMap) {
    Object.keys(sourceObj).forEach((key) => {
      let v = sourceObj[key] || sourceObj[key] == 0 ? sourceObj[key] : null;
      if (fieldMap[key]) {
        sourceTemp[fieldMap[key]] = v;
      } else {
        sourceTemp[key] = v;
      }
    });
  }
  return sourceTemp;
}
async function fillDataSource(items_select) {
  // console.log("高级筛选填充", items_select);
  if (items_select) {
    if (items_select[fillEnum.classId]) {
      let res_class = await assetClass.getAssetClass_all(true);
      if (res_class.code == 1) {
        items_select[fillEnum.classId].dataSource = res_class.data.rows;
      }
    }
    if (items_select[fillEnum.placeId]) {
      let res_place = await assetPlace.getPlaceList_all(true);
      if (res_place.code == 1) {
        items_select[fillEnum.placeId].dataSource = res_place.data.rows;
      }
    }
    if (items_select[fillEnum.orgId]) {
      let res_org = await org.getOrgList_all(true);
      if (res_org.code == 1) {
        items_select[fillEnum.orgId].dataSource = res_org.data.rows;
      }
    }
    if (items_select[fillEnum.ownOrgId]) {
      let res_org = await org.getOrgList_all(true);
      if (res_org.code == 1) {
        items_select[fillEnum.ownOrgId].dataSource = res_org.data.rows;
      }
    }
    if (items_select[fillEnum.useOrgId]) {
      let res_org = await org.getOrgList_all(true);
      if (res_org.code == 1) {
        items_select[fillEnum.useOrgId].dataSource = res_org.data.rows;
      }
    }
    if (items_select[fillEnum.managerId]) {
      let res_employee = await employee.getEmployeeList_all(true);
      if (res_employee.code == 1) {
        items_select[fillEnum.managerId].dataSource = res_employee.data.rows;
      }
    }
    if (items_select[fillEnum.manager]) {
      let res_employee = await employee.getEmployeeList_all(true);
      if (res_employee.code == 1) {
        items_select[fillEnum.manager].dataSource = res_employee.data.rows;
      }
    }
    if (items_select[fillEnum.employeeId]) {
      let res_employee = await employee.getEmployeeList_all(true);
      if (res_employee.code == 1) {
        items_select[fillEnum.employeeId].dataSource = res_employee.data.rows;
      }
    }
    if (items_select[fillEnum.useEmployeeId]) {
      let res_employee = await employee.getEmployeeList_all(true);
      if (res_employee.code == 1) {
        items_select[fillEnum.useEmployeeId].dataSource = res_employee.data.rows;
      }
    }
    if (items_select[fillEnum.createPerson]) {
      let res_employee = await employee.getEmployeeList_all(true);
      if (res_employee.code == 1) {
        items_select[fillEnum.createPerson].dataSource = res_employee.data.rows;
      }
    }
    if (items_select[fillEnum.pdPerson]) {
      let res_employee = await employee.getEmployeeList_all(true);
      if (res_employee.code == 1) {
        items_select[fillEnum.pdPerson].dataSource = res_employee.data.rows;
      }
    }
    if (items_select[fillEnum.checkPerson]) {
      let res_employee = await employee.getEmployeeList_all(true);
      if (res_employee.code == 1) {
        items_select[fillEnum.checkPerson].dataSource = res_employee.data.rows;
      }
    }
    if (items_select[fillEnum.reportPersonId]) {
      let res_employee = await employee.getEmployeeList_all(true);
      if (res_employee.code == 1) {
        items_select[fillEnum.reportPersonId].dataSource = res_employee.data.rows;
      }
    }
    if (items_select[fillEnum.operatePersonId]) {
      // console.log("fill opetateperson.");
      let res_employee = await employee.getEmployeeList_all(true);
      // console.log(res_employee);
      if (res_employee.code == 1) {
        items_select[fillEnum.operatePersonId].dataSource = res_employee.data.rows;
        // console.log("fill operate success.");
      }
    }
    if (items_select[fillEnum.brand]) {
      let res_brand = await assetBrand.getBrand(true);
      if (res_brand.code == 1) {
        items_select[fillEnum.brand].dataSource = res_brand.data;
      }
    }

    if (items_select[fillEnum.manage_orgId]) {
      // console.log("数据权限赋值-org");
      let res_org = await org.getOrgList_all(true);
      if (res_org.code == 1) {
        items_select[fillEnum.manage_orgId].dataSource = res_org.data.rows;
      }
    }
    if (items_select[fillEnum.returnEmployeeId]) {
      // console.log("fill opetateperson.");
      let res_employee = await employee.getEmployeeList_all(true);
      // console.log(res_employee);
      if (res_employee.code == 1) {
        items_select[fillEnum.returnEmployeeId].dataSource = res_employee.data.rows;
        // console.log("fill operate success.");
      }
    }
  }
  // console.log("高级筛选填充结束", items_select);
  return items_select;
}
module.exports.header2Fields = header2Fields;
module.exports.ext2Field = ext2Field;
module.exports.field2Ext = field2Ext;
module.exports.fillDataSource = fillDataSource;
