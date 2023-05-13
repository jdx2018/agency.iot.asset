const v_asset = require('./v_asset');
const v_assetAlarm = require('./v_assetAlarm');
const v_assetClass = require('./v_assetClass');
const v_assetMonitor = require('./v_assetMonitor');
const v_assetPlace = require('./v_assetPlace');
const v_assetHistory = require('./v_assetHistory');

const v_device = require('./v_device');
const v_deviceMonitor = require('./v_deviceMonitor');
const v_deviceAlarm = require('./v_deviceAlarm');

const v_org = require('./v_org');

const v_employee = require('./v_employee');
const v_user = require('./v_user');
const v_user_permission = require('./v_user_permission');

const v_bill_jiechu = require('./v_bill_jiechu');
const v_bill_guihuan = require('./v_bill_guihuan');
const v_bill_paifa = require('./v_bill_paifa');
const v_bill_tuiku = require('./v_bill_tuiku');
const v_bill_chuzhi = require('./v_bill_chuzhi');
const v_bill_weixiu = require('./v_bill_weixiu');
const v_bill_pand = require('./v_bill_pand');
const v_dashBoard = require('./v_dashBoard');

const viewDef = {
  asset: v_asset,
  assetAlarm: v_assetAlarm,
  assetClass: v_assetClass,
  assetMonitor: v_assetMonitor,
  assetPlace: v_assetPlace,
  assetHistory: v_assetHistory,

  device: v_device,
  deviceMonitor: v_deviceMonitor,
  deviceAlarm: v_deviceAlarm,
  org: v_org,
  employee: v_employee,
  user: v_user,

  user_permission: v_user_permission,
  bill_jiechu: v_bill_jiechu,
  bill_guihuan: v_bill_guihuan,
  bill_paifa: v_bill_paifa,
  bill_tuiku: v_bill_tuiku,

  bill_chuzhi: v_bill_chuzhi,
  bill_weixiu: v_bill_weixiu,
  bill_pand: v_bill_pand,
  dashBoard: v_dashBoard,
};
module.exports.viewDef = viewDef;