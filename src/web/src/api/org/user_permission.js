/**
 * 用户权限操作业务逻辑
 */
const dbClient = require('../db').dbClient;
const table = require('../db/tableEnum').table;
const cache = require('../cache');
/**
 * 获取用户页面权限
 * @param {string} userId 用户编号
 */
async function getPermission_page(userId) {
  let res = await dbClient.Query(table.v_user_permission, { userId: userId });
  if (res.code != 1) {
    return res;
  }
  let pList = res.data;
  let pObj = {};
  for (let i = 0; i < pList.length; i++) {
    let obj = pList[i];
    if (!pObj[obj.pageId]) {
      pObj[obj.pageId] = {
        id: obj.id,
        pageId: obj.pageId,
        parentId: obj.parentId,
        pageName: obj.pageName,
        pageDesc: obj.pageDesc,
        componentName: obj.componentName,
        icon: obj.icon,
        showIndex: obj.showIndex,
        status: obj.status,
        funcObj: {},
      };
    }
    if (obj.funcId) {
      pObj[obj.pageId].funcObj[obj.funcId] = { funcId: obj.funcId, funcDesc: obj.funcDesc, funcStatus: obj.funcStatus };
    }
  }
  let pages = [];
  Object.keys(pObj).forEach((key) => {
    pages.push(pObj[key]);
  });

  console.log('getP', pages);
  return { code: 1, message: 'success', data: pages };
}
/**
 * 保存用户页面权限
 * @param {array<pageId,parentId,status,isFunction>} permissionList
 */
async function savePermission_page(userId, permissionList) {
  if (userId === 'admin') {
    return { code: -1, message: 'admin用户的权限不能修改！' }
  }
  if (!permissionList || permissionList.length < 1) {
    return { code: -1, message: '权限列表不能为空.' };
  }
  let res_p = await getPermission_page(userId);

  if (res_p.code != 1) {
    return res_p;
  }
  let pList = [];
  let p_sourceObj = {}; //页面传过来的权限对象结果
  for (let i = 0; i < permissionList.length; i++) {
    let obj_s = permissionList[i];
    let p_s_key = obj_s.pageId + '.' + obj_s.parentId + '.' + '0'; //pagekey
    p_sourceObj[p_s_key] = obj_s.status ? 1 : 0;
    if (obj_s.funcObj) {
      Object.keys(obj_s.funcObj).forEach((key) => {
        let p_f_key = obj_s.funcObj[key].funcId + '.' + obj_s.pageId + '.' + '1';
        p_sourceObj[p_f_key] = obj_s.funcObj[key].funcStatus ? 1 : 0;
      });
    }
  }
  // console.log("save.p-source", p_sourceObj);
  for (let j = 0; j < res_p.data.length; j++) {
    let obj_t = res_p.data[j];
    let p_t_key = obj_t.pageId + '.' + obj_t.parentId + '.' + '0';
    let p_page = {
      userId: userId,
      pageId: obj_t.pageId,
      parentId: obj_t.parentId,
      isFunction: 0,
      status: p_sourceObj[p_t_key] ? 1 : 0,
    };
    if (obj_t.funcObj) {
      Object.keys(obj_t.funcObj).forEach((key) => {
        let p_t_f_key = obj_t.funcObj[key].funcId + '.' + obj_t.pageId + '.' + '1';
        let p_func = {
          userId: userId,
          pageId: obj_t.funcObj[key].funcId,
          parentId: obj_t.pageId,
          isFunction: 1,
          status: p_sourceObj[p_t_f_key] ? 1 : 0,
        };
        pList.push(p_func);
      });
    }
    pList.push(p_page);
  }
  // console.log("save.p", pList);
  return await dbClient.ExecuteTrans(async (con) => {
    // console.log("savePer-1");
    let res_delete = await dbClient.DeleteWithCon(con, table.tenant_user_permission_page, { userId: userId });
    if (res_delete.code != 1) {
      throw res_delete;
    }
    let res_insert = await dbClient.InsertManyWithCon(con, table.tenant_user_permission_page, pList);
    // console.log("savePer-2");
    if (res_insert.code != 1) {
      throw res_insert;
    }
    // console.log("savePer-3");
    return { code: 1, message: '权限保存成功.' };
  });
}
// /**
//  * 保存数据授权-机构
//  * @param {string} userId
//  * @param {string} orgId
//  */
// async function savePermission_data_org(userId, orgId) {
//     return savePermission_data_orgList(userId, [{ orgId: orgId }]);
// }
// /**
//  * 保存数据授权-机构
//  * @param {string} userId
//  * @param {array<orgId>} orgList
//  */
// async function savePermission_data_orgList(userId, orgList) {
//     // let user_login = cache.user_get();
//     if (!orgList || orgList.length < 1) {
//         return { code: -1, message: "机构列表不能为空." };
//     }
//     let orgPool = {};
//     for (let i = 0; i < orgList.length; i++) {
//         let orgId = orgList[i].orgId;
//         let proc_param = { orgId: orgId };
//         let res_org = await dbClient.executeProc(table.p_org_getChilds, proc_param);
//         // console.log("savep_d_org", res_org, proc_param);
//         if (res_org.code != 1) { return res_org; }
//         for (let j = 0; j < res_org.data.length; j++) {
//             let org = res_org.data[j];
//             orgPool[org.orgId] = 1;
//         }
//     }
//     let org_t_list = [];
//     Object.keys(orgPool).forEach((key) => {
//         org_t_list.push({ userId: userId, orgId: key });
//     });
//     let res = await dbClient.ExecuteTrans(async (con) => {
//         let res_delete = await dbClient.DeleteWithCon(con,
//             table.tenant_user_permission_data_org,
//             { userId: userId });
//         if (res_delete.code != 1) { throw res_delete; }
//         let res_insert = await dbClient.InsertManyWithCon(con, table.tenant_user_permission_data_org, org_t_list);
//         if (res_insert.code != 1) { throw res_insert; }
//         return { code: 1, message: "success." };
//     });
//     // console.log("save_d_org", res);
//     return res;
// }
module.exports.getPermission_page = getPermission_page;
module.exports.savePermission_page = savePermission_page;
// module.exports.savePermission_data_org = savePermission_data_org;
// module.exports.savePermission_data_orgList = savePermission_data_orgList;
