// import dbClient from "db-client";
// const dbClient = require('../db/db.local').db_local_client;
const dbClient = require('../db/db.client').dbClient;
const table = require('../db/tableEnum').table;
const cache = require('../cache');
const viewPool = require('../views/viewPool').viewDef;
const tenantConfig = require('../config').tenant_config;
const { create_log } = require('../sysLog');

async function login(tenantId, userId, pwd) {
  try {
    // console.log("login.para", userId, pwd);
    let res_login = await dbClient.login(tenantId, userId, pwd);
    if (res_login.code != 1) {
      return res_login;
    }
    // 登录成功，记录日志：
    await create_log(res_login.data.user.userId, 'login', 'login', 'login')

    let user = res_login.data.user;
    user.userName = user.employeeName;
    cache.access_token_set(res_login.data.access_token);
    cache.user_set(user);
    if (viewPool[user.tenantId]) {
      cache.view_set(viewPool[user.tenantId]);
    } else {
      cache.view_set(viewPool.sys);
    }
    if (tenantConfig[user.tenantId]) {
      cache.tenant_config_set(tenantConfig[user.tenantId]);
    } else {
      cache.tenant_config_set(tenantConfig.sys);
    }

    // console.log("login.view",cache.view_get())
    let pList = res_login.data.permission;
    // console.log("login.p", pList);
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
        pObj[obj.pageId].funcObj[obj.funcId] = {
          funcId: obj.funcId,
          funcDesc: obj.funcDesc,
          funcStatus: obj.funcStatus,
        };
      }
    }
    let pages = [];
    Object.keys(pObj).forEach((key) => {
      pages.push(pObj[key]);
    });
    // console.log("login.res", pages);
    // 清空缓存数据：
    Object.keys(cache.rowsCache).forEach((key) => {
      cache.rowsCache[key].rows = null;
    });
    let res = { code: 1, message: 'success', data: { userinfo: user, page: pages } };
    return res;
  } catch (err) {
    console.log(err);
    return { code: -1, message: err.message, data: null };
  }
}

module.exports.login = login;
