/**
 * 员工数据操作业务逻辑
 */
const dbClient = require("../db").dbClient;
const billCommon = require("../bill/billCommon");

const table = require("../db/tableEnum").table;
const cache = require("../cache");

/**
 * 获取分类新增/编辑模板
 */
async function getTemplate() {
       const viewDef = cache.view_get().employee;
    let objTemplate = JSON.parse(JSON.stringify(viewDef.objTemplate));
    await billCommon.fillDataSource(objTemplate);
    return { code: 1, message: "success", data: objTemplate };
}
/**
 * 获取所有员工列表
 * @returns
 * @example
 * { code:1,message:"success",data:[{orgId:"001",employeeId:"",employeeName:""}] 
 */
async function getEmployeeList_list(useCache) {
    let viewDef = cache.view_get().employee;
    let statusMap = viewDef.typeDef.statusMap;
    let res = null;
    if (useCache && cache.rowsCache.employee.rows) {
        // console.log("use asset cache.");
        res = { code: 1, message: "employee use cache success", data: cache.rowsCache.employee.rows };
    }
    else {
        res = await await dbClient.Query(table.v_employee, {},
            { orgId: 1, orgName: 1, employeeId: 1, employeeName: 1, status: 1, telNo: 1, email: 1, });
        for (let i = 0; i < res.data.length; i++) {
            res.data[i].status = statusMap[res.data[i].status];
        }
        cache.rowsCache.employee = {
            stmp: Date.now(),
            rows: res.data
        };
        // console.log("use db query for assetClass");
    }

    return res;
    // return await dbClient.Query(table.tenant_employee, { },
    //     { orgId: 1, employeeId: 1, employeeName: 1, status: 1, telNo: 1, email: 1, });
}

/**
 * 获取所有员工列表 带header
 * @returns
 * @example
 * { code:1,message:"success",data:{header:{},rows:[{orgId:"001",employeeId:"",employeeName:""}] }
 */
async function getEmployeeList_all(useCache) {
    const viewDef = cache.view_get().employee;
    let header = viewDef.header.main;
    let res = await getEmployeeList_list(useCache);
    // console.log("employee.getEmployeeList",res);
    if (res.code != 1) { return res; }
    return { code: 1, message: "success", data: { header: header, rows: res.data } };
}
/**
 * 增加员工
 */
async function addEmployee(employeeObj) {
    if (!employeeObj) {
        return { code: -1, message: "员工信息不能为空." };
    }
    if (!employeeObj.employeeId) {
        return { code: -1, message: "员工编号不能为空" }
    }
    return await addEmployeeList([employeeObj]);
}
/**
 * 增加员工列表
 * @param {array<object>} employeeList 
 */
async function addEmployeeList(employeeList) {
    if (!employeeList || employeeList.length < 1) {
        return { code: -1, message: "员工数据不能为空." };
    }
    let res = await dbClient.InsertMany(table.tenant_employee, employeeList);
    if (res.code == -1 && res.message.indexOf("ER_DUP_ENTRY") > -1) {
        return { code: -1, message: "重复的员工编号：" + employeeList[0].employeeId }
    }
    return res;
}
/**
 * 更新员工信息
 * @param {string} employeeId 
 * @param {obj} dataContent 
 */
async function updateEmployee(employeeId, dataContent) {
    console.log(employeeId, dataContent);
    if (!dataContent) {
        return { code: -1, message: "员工对象不能为空." };
    }
    if (!employeeId) {
        return { code: -1, mesage: "员工编号不能为空" };
    }
    delete dataContent.tenantId;
    delete dataContent.employeeId;
    return await dbClient.Update(table.tenant_employee, { employeeId: employeeId }, dataContent)
}

/**
 * 删除员工
 * @param {object} employeeId 
 */
async function deleteEmployee(employeeId) {
    if (String(employeeId) === "em_001") {
        return { code: -1, message: "资产管理员账号不能删除." }
    }
    return await dbClient.Delete(table.tenant_employee, { employeeId: employeeId });

}
module.exports.getTemplate = getTemplate;
module.exports.getEmployeeList_list = getEmployeeList_list;
module.exports.getEmployeeList_all = getEmployeeList_all;
module.exports.addEmployee = addEmployee;
module.exports.addEmployeeList = addEmployeeList;
module.exports.deleteEmployee = deleteEmployee;
module.exports.updateEmployee = updateEmployee;