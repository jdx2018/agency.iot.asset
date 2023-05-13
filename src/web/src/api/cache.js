const db_mock = require('./mock/db_mock');
const v_sys = require('./views/viewPool').viewDef.sys;
const isDebug = false; //true:不用localstorage false：使用localstorage
const expired_time_rows = 5 * 60 * 1000;
var cache_local = {
  db_local: db_mock.db_mock,
  access_token: '',
  user: {
    tenantId: 'supdatas01',
    userId: 'admin',
    userName: '-1',
    employeeId: '',
    employeeName: '',
    orgId: '',
    manage_orgId: '1',
    orgId_top: '', //租户顶级机构ID
    assetClassId_top: '', //租户顶级资产分类ID
    assetPlaceId_top: '', //租户顶级资产位置ID
  },
  /**
   * 租户参数配置
   */
  tenant_config: {
    /**
     * 启用审核流程
     */
    useCheck: true,
  },
  viewDef: {
    asset: { typeDef: {}, header: { main: {}, detail: {} }, filter: {}, objTemplate: {} },
    asset_material: { typeDef: {}, header: { main: {}, detail: {} }, filter: {}, objTemplate: {} },
    assetAlarm: { typeDef: {}, header: { main: {}, detail: {} }, filter: {}, objTemplate: {} },
    assetClass: { typeDef: {}, header: { main: {}, detail: {} }, filter: {}, objTemplate: {} },
    assetMonitor: { typeDef: {}, header: { main: {}, detail: {} }, filter: {}, objTemplate: {} },
    assetPlace: { typeDef: {}, header: { main: {}, detail: {} }, filter: {}, objTemplate: {} },
    assetHistory: { typeDef: {}, header: { main: {}, detail: {} }, filter: {}, objTemplate: {} },

    device: { typeDef: {}, header: { main: {}, detail: {} }, filter: {}, objTemplate: {} },
    deviceMonitor: { typeDef: {}, header: { main: {}, detail: {} }, filter: {}, objTemplate: {} },
    deviceAlarm: { typeDef: {}, header: { main: {}, detail: {} }, filter: {}, objTemplate: {} },
    deviceOffline: { typeDef: {}, header: { main: {}, detail: {} }, filter: {}, objTemplate: {} },
    org: { typeDef: {}, header: { main: {}, detail: {} }, filter: {}, objTemplate: {} },
    employee: { typeDef: {}, header: { main: {}, detail: {} }, filter: {}, objTemplate: {} },
    user: { typeDef: {}, header: { main: {}, detail: {} }, filter: {}, objTemplate: {} },

    user_permission: { typeDef: {}, header: { main: {}, detail: {} }, filter: {}, objTemplate: {} },
    bill_jiechu: { typeDef: {}, header: { main: {}, detail: {} }, filter: {}, objTemplate: {} },
    bill_guihuan: { typeDef: {}, header: { main: {}, detail: {} }, filter: {}, objTemplate: {} },
    bill_paifa: { typeDef: {}, header: { main: {}, detail: {} }, filter: {}, objTemplate: {} },
    bill_tuiku: { typeDef: {}, header: { main: {}, detail: {} }, filter: {}, objTemplate: {} },
    bill_weixiu: { typeDef: {}, header: { main: {}, detail: {} }, filter: {}, objTemplate: {} },
    bill_chuzhi: { typeDef: {}, header: { main: {}, detail: {} }, filter: {}, objTemplate: {} },
    bill_pand: { typeDef: {}, header: { main: {}, detail: {} }, filter: {}, objTemplate: {} },
    supplier: { typeDef: {}, header: { main: {}, detail: {} }, filter: {}, objTemplate: {} },
    bill_chuku_material: { typeDef: {}, header: { main: {}, detail: {} }, filter: {}, objTemplate: {} },
    bill_tuiku_material: { typeDef: {}, header: { main: {}, detail: {} }, filter: {}, objTemplate: {} },
    bill_ruku_material: { typeDef: {}, header: { main: {}, detail: {} }, filter: {}, objTemplate: {} },
    bill_purchase: { typeDef: {}, header: { main: {}, detail: {} }, filter: {}, objTemplate: {} },
    bill_pay: { typeDef: {}, header: { main: {}, detail: {} }, filter: {}, template: {} },
    supplier_payable: { typeDef: {}, header: { main: {}, detail: {} }, filter: {}, template: {} },
    dashboard: { template: {} },
  },
  exportImportDef: {
    asset: {},
    assetClass: {},
    assetPlace: {},
    org: {},
    employee: {},
  },

  /**
   * 记录缓存 默认缓存有效时间5分钟，
   */
  rowsCache: {
    org: { stmp: 0, rows: null },
    employee: { stmp: 0, rows: null },
    assetPlace: { stmp: 0, rows: null },
    assetClass: { stmp: 0, rows: null },
    brand: { stmp: 0, rows: null },
    device: { stmp: 0, rows: null },
    supplier: { stmp: 0, rows: null },
  },
};
/**
 * 获取本地缓存token
 * @return{string} 登陆后缓存的access_token
 */
function access_token_get() {
  let access_token = cache_local.access_token;
  if (!isDebug) {
    access_token = localStorage.getItem('access_token');
  }
  return access_token;
}
/**
 * 设置本地缓存token，登陆后设置，与服务端通信时从缓存取出使用
 * @param {string} token
 */
function access_token_set(token) {
  cache_local.access_token = token;
  if (!isDebug) {
    localStorage.setItem('access_token', token);
  }
}
/***
 * 获取页面属性配置对象
 */
function view_get() {
  let viewDef = cache_local.viewDef;
  if (!isDebug) {
    // let time1 = new Date().getTime()
    let viewTemp = localStorage.getItem('view');

    if (viewTemp) {
      viewDef = JSON.parse(viewTemp);
      // console.log("get view local",viewDef);
    }
    // let time2 = new Date().getTime()
    // console.log("读取view耗时", time2 - time1);
  }

  return viewDef;
}
/**
 * 设置页面属性对象，存储到localstorage
 * @param {object} viewDef
 */
function view_set(viewDef) {
  // console.log(viewDef)
  cache_local.viewDef = viewDef;
  if (!isDebug) {
    localStorage.setItem('view', JSON.stringify(viewDef));
  }
}
/**
 * 获取本地缓存用户信息
 * @returns
 * @example
 * {tenantId:"supoin",userId:"admin",userName:"系统管理员"}
 */
/**
 * 获取本地缓存用户信息
 * @returns
 * @example
 * {tenantId:"supoin",userId:"admin",userName:"系统管理员"}
 */
function user_get() {
  let user = cache_local.user;
  if (!isDebug) {
    let userTemp = localStorage.getItem('user');
    // console.log(userTemp);
    if (userTemp) {
      user = JSON.parse(userTemp);
    }
  }
  return user;
}
/**
 *
 * @param {<tenantId,userId,userName>} user 缓存用户信息
 */
function user_set(user) {
  cache_local.user = user;
  // console.log("set user success.");
  if (!isDebug) {
    localStorage.setItem('user', JSON.stringify(user));
  }
}
/**
 * 获取本地演示数据缓存
 */
function local_db_get() {
  if (!isDebug) {
    let dbTemp = localStorage.getItem('db_local');
    if (dbTemp) {
      console.log('read from local.');
      try {
        cache_local.db_local = JSON.parse(dbTemp);
      } catch (err) {
        console.log('parse local db error' + err.message);
      }
    }
  }
  return cache_local.db_local;
}
function local_db_set() {
  if (!isDebug) {
    localStorage.setItem('db_local', JSON.stringify(cache_local.db_local));
  }
}
/**
 * 清理过期的缓存数据-行记录集合
 */
function rows_expired_set() {
  let stmpNow = Date.now();
  //  console.log("assetClass",(stmpNow -cache_local.rowsCache.assetClass.stmp));
  Object.keys(cache_local.rowsCache).forEach((key) => {
    let obj = cache_local.rowsCache[key];
    if (stmpNow - obj.stmp > expired_time_rows) {
      obj.rows = null;
    }
  });
}
/**
 * 获取租户全局配置
 */
function tenant_config_get() {
  let config = cache_local.tenant_config;
  if (!isDebug) {
    let configTemp = localStorage.getItem('tenant_config');
    if (configTemp) {
      config = JSON.parse(configTemp);
    }
  }
  return config;
}
/**
 * 设置用户全局配置 登录后调用
 * @param {object} tconfig
 */
function tenant_config_set(tconfig) {
  if (tconfig) {
    cache_local.tenant_config = tconfig;
    if (!isDebug) {
      localStorage.setItem('tenant_config', JSON.stringify(tconfig));
    }
  }
}
setInterval(() => {
  // local_db_set();
  rows_expired_set();
}, 1000);

function setDebug() {
  if (isDebug) {
    view_set(v_sys);
  }
}
setDebug();
module.exports.access_token_get = access_token_get;
module.exports.access_token_set = access_token_set;
module.exports.user_get = user_get;
module.exports.user_set = user_set;
module.exports.local_db_get = local_db_get;
module.exports.local_db_set = local_db_set;
module.exports.isDebug = isDebug;
module.exports.rowsCache = cache_local.rowsCache;
module.exports.view_get = view_get;
module.exports.view_set = view_set;
module.exports.tenant_config_get = tenant_config_get;
module.exports.tenant_config_set = tenant_config_set;
