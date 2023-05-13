/**
 * 机构业务数据操作
 */
const dbClient = require("../db").dbClient;
const billCommon = require("../bill/billCommon");
const table = require("../db/tableEnum").table;
const tree_sub = require("../tool/tree_sub");

const cache = require("../cache");
// const viewDef = cache.view_get().org;
/**
 * 获取所有组织列表
 * @returns
 * @example
 * {code:1,message:"success",data:[{orgId:"01",orgName:"销邦科技",parentId:"0"}]}
 */
async function getOrgList_list(useCache) {


    let res = null;
    if (useCache && cache.rowsCache.org.rows) {
        // console.log("use asset cache.");
        res = { code: 1, message: "employee use cache success", data: cache.rowsCache.org.rows };
    }
    else {
        res = await dbClient.Query(table.tenant_org, {}, { orgId: 1, orgName: 1, parentId: 1 });
        cache.rowsCache.org = {
            stmp: Date.now(),
            rows: res.data
        };
        // console.log("use db query for assetClass");
    }

    return res;
    return await dbClient.Query(table.tenant_org, {}, { orgId: 1, orgName: 1, parentId: 1 });
}
/**
 * 获取所有组织列表 带header 组织管理页面使用
 * @returns
 * @example
 * {code:1,message:"success",data:{header:{},rows:[]}
 */
async function getOrgList_all(useCache) {
    const viewDef = cache.view_get().org;
    let header = viewDef.header.main;
    let res = await getOrgList_list(useCache);
    if (!res.code == 1) {
        return res;
    }
    return { code: 1, message: "success", data: { header: header, rows: res.data } };
}
/**
 * 更新组织名称
 * @param {string} orgId 
 * @param {object<orgId,orgName,parentId>} 组织object 
 */
async function updateOrg(orgId, orgObj) {
    // delete orgObj.orgId;
    let orgT = JSON.parse(JSON.stringify(orgObj));
    delete orgT.orgId;
    // console.log("更新组织",orgId,orgObj);
    return await dbClient.Update(table.tenant_org, { orgId: orgId }, orgT)
}
/**
 * 删除组织
 * @param {string} orgId 
 */
async function deleteOrg(orgId) {
    if (String(orgId) === "1") {
        return { code: -1, message: "顶级机构无法删除." }
    }
    let res = await dbClient.executeProc(table.p_org_delete, { orgId })
    return { code: 1, message: "删除成功" }
}
/**
 * 增加组织
 * @param {object<orgId,orgName,parentId>} 机构对象
 */
async function addOrg(orgObj) {
    return await addOrgList([orgObj]);
}
/**
 * 获取机构新增/编辑模板
 */
async function getTemplate() {
    const viewDef = cache.view_get().org;
    let objTemplate = JSON.parse(JSON.stringify(viewDef.objTemplate));
    await billCommon.fillDataSource(objTemplate);
    return { code: 1, message: "success", data: objTemplate };
}
/**
 * 批量增加组织
 * @param {array<orgId,orgName,parentId>} orgList 
 */
async function addOrgList(orgList) {
    try {
        if (!orgList || orgList.length < 1) {
            return { code: -1, message: "组织列表不能为空." };
        }
        let res = await dbClient.InsertMany(table.tenant_org, orgList);
        if (res.code == -1 && res.message.indexOf("ER_DUP_ENTRY") > -1) {
            return { code: -1, message: "重复的机构编号：" + orgList[0].orgId }
        }
        if (res.code != 1) { return res; }
        //添加机构时，影响父级机构，需要将权限设置为父级机构的用户插入本级机构
        // for (let i = 0; i < orgList.length; i++) {
        //     let proc_param = { orgId: orgList[i].orgId };
        //     let res_t = await dbClient.executeProc(table.p_org_updateUserPermission, proc_param);
        //     if (res_t.code != 1) {
        //         res_t.message = "为用户赋权限失败" + res_t.message;
        //         return res_t;
        //     }
        // }
        let res2 = await initial_subList();
        return res2;


    }
    catch (err) {
        return { code: -201, message: err.message };
    }
}
async function initial_subList() {
    let fields = { orgId: 1, parentId: 1 };
    let res_org = await dbClient.Query(table.tenant_org, null, fields);
    if (res_org.code != 1) { return res_org; }
    let rows = res_org.data;
    let subList = tree_sub.treeToSubList(rows, "orgId", "parentId", "orgId_sub");
    // console.log(subList);
    let res = await dbClient.ExecuteTrans(async (con) => {
        let res1 = await dbClient.DeleteWithCon(con, table.tenant_org_sub);
        // console.log(res1);
        if (res1.code != 1) { throw res1; }
        let res2 = await dbClient.InsertManyWithCon(con, table.tenant_org_sub, subList);
        if (res2.code != 1) { throw res2; }
        return { code: 1, message: "success." };
    })
    return res;
}
/**
 * 生成机构节点数据
 */
// async function initialOrg_sub_all() {
//     let fields = { orgId: 1, parentId: 1 };
//     let res_org = await dbClient.Query(table.tenant_org, null, fields);
//     if (res_org.code != 1) { return res_org; }

//     let rows = res_org.data;
//     // rows = [
//     //     { orgId: "A", parentId: 0 },
//     //     { orgId: "A1", parentId: "A" },
//     //     { orgId: "A2", parentId: "A" },
//     //     { orgId: "A3", parentId: "A1" },
//     //     // { orgId: "A4", parentId: "A3" },

//     // ]
//     let orgPool = {};
//     for (let i = 0; i < rows.length; i++) {
//         let t = rows[i];

//         if (!orgPool[t.orgId]) {
//             orgPool[t.orgId] = { orgId: t.orgId, parentId: t.parentId };
//         }
//         // let v = { orgId: t.orgId, orgId_sub: t.orgId, isSub: 0 };
//         // orgPool[t.orgId].subList.push(v);

//     }
//     let orgList = [];
//     let i = 0;
//     Object.keys(orgPool).forEach((key) => {
//         i++;
//         let v = { orgId: key, orgId_sub: key, isSub: 0 };
//         orgList.push(v);
//         let t = orgPool[key];
//         let orgId_sub_start = t.orgId;
//         while (t && t.parentId) {
//             i++;
//             // console.log("遍历", t);
//             let v_temp = { orgId: t.parentId, orgId_sub: orgId_sub_start, isSub: 1 };
//             if (v_temp.orgId != 0) {
//                 orgList.push(v_temp);
//             }
//             t = orgPool[t.parentId];
//         }
//     })

//     let res = await dbClient.ExecuteTrans(async (con) => {
//         let res1 = await dbClient.DeleteWithCon(con, table.tenant_org_sub);
//         console.log(res1);
//         if (res1.code != 1) { throw res1; }
//         let res2 = await dbClient.InsertManyWithCon(con, table.tenant_org_sub, orgList);
//         if (res2.code != 1) { throw res2; }
//         return { code: 1, message: "success." };
//     })
//     return res;
//     // orgList.sort((a, b) => {
//     //     return a.orgId.localeCompare(b.orgId);
//     //     // if (a.orgId >= b.orgId) {
//     //     //     return 1;
//     //     // }
//     //     // return -1;
//     // })
//     console.log(i);
//     console.log(orgPool);
//     console.log(orgList);

// }
module.exports.getTemplate = getTemplate;
module.exports.getOrgList_list = getOrgList_list;
module.exports.getOrgList_all = getOrgList_all;
module.exports.updateOrg = updateOrg;
module.exports.addOrg = addOrg;
module.exports.addOrgList = addOrgList;
module.exports.deleteOrg = deleteOrg;
// module.exports.initialOrg_sub_all = initialOrg_sub_all;
module.exports.initial_subList = initial_subList;