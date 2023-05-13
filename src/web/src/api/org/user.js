/**
 * 用户数据操作业务逻辑
 */
const dbClient = require("../db").dbClient;
const table = require("../db/tableEnum").table;
const billCommon = require("../bill/billCommon");
const user_permission = require("./user_permission");
const cache = require("../cache");
// const viewDef = cache.view_get().user;
/**
 * 获取新增/编辑模板
 */
async function getTemplate() {
    const viewDef = cache.view_get().user;
    let objTemplate = JSON.parse(JSON.stringify(viewDef.objTemplate));
    await billCommon.fillDataSource(objTemplate);
    // console.log("user.template", objTemplate);
    return { code: 1, message: "success", data: objTemplate };
}
/**
 * 
 * @param {object<userId,userName>} userObj 
 */
async function getUserDetail(userId) {
    const viewDef = cache.view_get().user;
    let objTemplate = JSON.parse(JSON.stringify(viewDef.objTemplate));
    await billCommon.fillDataSource(objTemplate);
    let res_user = await dbClient.Query(table.v_user, { userId: userId });
    if (res_user.code != 1) { return res_user; }

    let userObj = res_user.data[0];
    Object.keys(objTemplate).forEach((key) => {
        objTemplate[key].value = userObj[key];
    })
    objTemplate.password_confirm.value = userObj.password;

    return { code: 1, message: "success", data: objTemplate };

}
/**
 * 获取用户列表
 * @returns
 * @example
 * { code:1,message:"success",data:[{orgId:"001",employeeId:"",employeeName:""}] }
 */
async function getUserList() {
    const viewDef = cache.view_get().user;
    let header_main = viewDef.header.main; 
    let filter = viewDef.filter;
    let statusMap = viewDef.typeDef.statusMap;
    let fields = billCommon.header2Fields(header_main, null);
    let res = await dbClient.Query(table.v_user, null, fields);
    if (res.code != 1) {
        return res;
    }
    for (let i = 0; i < res.data.length; i++) {
        res.data[i].status = statusMap[res.data[i].status];
    }
    return { code: 1, message: "success", data: { header: header_main, rows: res.data, filter: filter } };
}
/**
 * 添加用户
 * @param {object} userObj 
 */
async function addUser(userObj) {

    // console.log("addUser", userObj);
    if (!userObj || !userObj.userId) {
        return { code: -1, message: "用户Id/用户信息不能为空." };
    }
    if (!userObj.manage_orgId) {
        return { code: -1, message: "数据权限不能为空，请指定管理资产的范围" };
    }
    delete userObj.password_confirm;
    return await addUserList([userObj]);
}
/**
 * 添加多个用户
 * @param {array<object>} userList 
 */
async function addUserList(userList) {
    if (!userList || userList.length < 1) {
        return { code: -1, message: "用户列表不能为空." };
    }
    for (let i = 0; i < userList.length; i++) {
        if (!userList[i].manage_orgId) {
            return { code: -1, message: "用户的数据权限不能为空:" + userList[i].userId }
        }
        // let res = await user_permission.savePermission_data_org(
        //     userList[i].userId,
        //     userList[i].manage_orgId);
        // if (res.code != 1) { return res; }
    }
    let res = await dbClient.InsertMany(table.tenant_user, userList);
    if (res.code == -1 && res.message.indexOf("ER_DUP_ENTRY") > -1) {
        return { code: -1, message: "重复的用户账号：" + userList[0].userId }
    };
    return res;
}
/**
 * 更新用户辛信息
 * @param {string} userId 用户编号
 * @param {object} dataContent 待更新用户内容
 */
async function updateUser(userId, dataContent) {
    if (userId === 'admin') {
        return { code: -1, message: "admin用户不能修改." };
    }
    if (!userId) {
        return { code: -1, message: "用户编号不能为空." };
    }
    if (!dataContent.employeeId) {
        return { code: -1, mesage: "员工编号不能为空" };
    }
    // let res = await user_permission.savePermission_data_org(
    //     userId,
    //     dataContent.manage_orgId);
    // if (res.code != 1) { return res; }
    delete dataContent.tenantId;
    delete dataContent.userId;
    delete dataContent.password_confirm;
    return await dbClient.Update(table.tenant_user, { userId: userId }, dataContent)
}
/**
 * 更新用户密码
 * @param {string} userId 
 * @param {string} pwd 
 */
async function updateUserPassword(userId, oldPwd, newPwd) {
    // console.log("updatpwd start.");
    if (!newPwd && newPwd != "0") {
        return { code: -1, message: "新密码不能为空." }
    }
    let res_user = await dbClient.Query(table.tenant_user, { userId: userId }, { password: 1 });
    if (res_user.code != 1) { return res_user; }
    let pwd = res_user.data[0].password;
    if (pwd != oldPwd) {
        return { code: -1, message: "原密码不正确,请重新输入" };
    }
    // console.log("updatpwd", userId, oldPwd, newPwd);
    return await dbClient.Update(table.tenant_user, { userId: userId }, { password: newPwd });
}
/**
 * 删除用户
 * @param {object} userId 
 */
async function deleteUser(userId) {
    if (String(userId) === "admin") {
        return { code: -1, message: "资产管理员账号不能删除." }
    }
    return await dbClient.Delete(table.tenant_user, { userId: userId });

}
module.exports.getTemplate = getTemplate;
module.exports.getUserDetail = getUserDetail;
module.exports.getUserList = getUserList;
module.exports.addUser = addUser;
module.exports.addUserList = addUserList;
module.exports.deleteUser = deleteUser;
module.exports.updateUser = updateUser;
module.exports.updateUserPassword = updateUserPassword;