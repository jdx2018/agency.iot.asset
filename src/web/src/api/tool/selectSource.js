const assetPlace = require("../asset/assetPlace");
const assetClass = require("../asset/assetClass");
const org = require("../org/org");
const employee = require("../org/employee");
const assetBrand = require('../asset/assetBrand');
const supplier = require("../org/supplier");
const fillEnum = {
    placeId: "placeId",
    classId: "classId",
    orgId: "orgId",
    ownOrgId: "ownOrgId",
    useOrgId: "useOrgId",
    employeeId: "employeeId",
    createPerson: "createPerson",
    managerId: "managerId",
    manager:"manager",
    useEmployeeId: "useEmployeeId",
    pdPerson: "pdPerson",
    checkPerson: "checkPerson",
    brand: "brand",
    reportPersonId: "reportPersonId",//报修人
    operatePersonId: "operatePersonId",//报修人
    manage_orgId: "manage_orgId",//管理的数据权限-资产所属部门
    supplierId: "supplierId",//供应商信息
    returnEmployeeId: "returnEmployeeId",
    returnOrgId: "returnOrgId",
    reqEmployeeId: "reqEmployeeId",//申请员工
    reqOrgId: "reqOrgId"//申请部门
}
/**
 * 单据操作公用方法
 */
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
        if (items_select[fillEnum.supplierId]) {
            let res_supplier = await supplier.getSupplierList(null, true);
            if (res_supplier.code == 1) { items_select[fillEnum.supplierId].dataSource = res_supplier.data.rows };
        }
        if (items_select[fillEnum.returnEmployeeId]) {
            let res_employee = await employee.getEmployeeList_all(true);
            if (res_employee.code == 1) {
                items_select[fillEnum.returnEmployeeId].dataSource = res_employee.data.rows;
            }
        }
        if (items_select[fillEnum.returnOrgId]) {
            // console.log("数据权限赋值-org");
            let res_org = await org.getOrgList_all(true);
            if (res_org.code == 1) {
                items_select[fillEnum.returnOrgId].dataSource = res_org.data.rows;
            }
        }
        if (items_select[fillEnum.reqEmployeeId]) {
            let res_employee = await employee.getEmployeeList_all(true);
            if (res_employee.code == 1) {
                items_select[fillEnum.reqEmployeeId].dataSource = res_employee.data.rows;
            }
        }
        if (items_select[fillEnum.reqOrgId]) {
            // console.log("数据权限赋值-org");
            let res_org = await org.getOrgList_all(true);
            if (res_org.code == 1) {
                items_select[fillEnum.reqOrgId].dataSource = res_org.data.rows;
            }
        }
    }
    // console.log("高级筛选填充结束", items_select);
    return items_select;

}

module.exports.fillDataSource = fillDataSource;