const login_f = require('./login/login');
const asset = require('./asset/asset');
const assetPlace = require('./asset/assetPlace');
const assetClass = require('./asset/assetClass');
const brand = require('./asset/assetBrand');
const assetMonitor = require('./asset/assetMonitor');
const assetHistory = require('./asset/assetHistory');
const paifa = require('./bill/bill_paifa');
const tuiku = require('./bill/bill_tuiku');
const jiechu = require('./bill/bill_jiechu');
const guihuan = require('./bill/bill_guihuan');
const chuzhi = require('./bill/bill_chuzhi');
const weixiu = require('./bill/bill_weixiu');
const pand = require('./bill/bill_pand');
const org = require('./org/org');
const employee = require('./org/employee');
const user = require('./org/user');
const assetAlarm = require('./asset/assetAlarm');
const device = require('./device/device');
const deviceAlarm = require('./device/device.alarm');
const deviceOffline = require('./device/device.offline');
const user_permission = require('./org/user_permission');
const supplier = require('./org/supplier');
const asset_material = require('./asset/asset_material');
const chuku_material = require('./bill/bill_chuku_material');
const tuiku_material = require('./bill/bill_tuiku_material');
const ruku_material = require('./bill/bill_ruku_material');
const bill_purchase = require('./bill/bill_purchase');
const bill_pay = require('./bill/bill_pay');
const supplier_payable = require('./report/supplier_payable');
const page = require('./page');
const dashBoard = require('./report/dashBoard');
const asset_export_import = require('./dataExportImport/asset');
const assetClass_export_import = require('./dataExportImport/assetClass');
const assetPlace_export_import = require('./dataExportImport/assetPlace');
const org_export_import = require('./dataExportImport/org');
const employee_export_import = require('./dataExportImport/employee');
const sys_log = require('./sysLog/sysLog')
/**
 * 业务方法封装对象
 */
var clientService = {
  login: login_f.login,
  asset: {
    getTemplate: asset.getTemplate,
    getAssetList: asset.getAssetList,
    getAssetList_paifa: asset.getAssetList_paifa,
    getAssetList_guihuan: asset.getAssetList_guihuan,

    getAssetList_jiechu: asset.getAssetList_jiechu,
    getAssetList_tuiku: asset.getAssetList_tuiku,
    addAsset: asset.addAsset,

    addAssetList: asset.addAssetList,
    updateAsset: asset.updateAsset,
    deleteAsset: asset.deleteAsset,

    getAsset_detail: asset.getAsset_detail,
    getAssetList_purchase: asset.getAssetList_purchase,
    getStorageQtyByAssetName: asset.getStorageQtyByAssetName,
    checkAssetList: asset.checkAssetList,
    
    getAssetList_dashboard_asset_overdate: asset.getAssetList_dashboard_asset_overdate,
  },
  assetBrand: {
    getBrand: brand.getBrand,
  },
  assetClass: {
    getTemplate: assetClass.getTemplate,
    getAssetClass_list: assetClass.getAssetClass_list,
    getAssetClass_all: assetClass.getAssetClass_all,

    addClass: assetClass.addClass,
    addClassList: assetClass.addClassList,
    updateClass: assetClass.updateClass,

    deleteClass: assetClass.deleteClass,
  },
  assetHistory: {
    getAssetHistory: assetHistory.getAssetHistory,
  },
  assetMonitor: {
    getAssetList_monitor: assetMonitor.getAssetList_monitor,
  },
  assetPlace: {
    getTemplate: assetPlace.getTemplate,
    getPlaceList_all: assetPlace.getPlaceList_all,
    getPlaceList_list: assetPlace.getPlaceList_list,

    addPlace: assetPlace.addPlace,
    addPlaceList: assetPlace.addPlaceList,
    updatePlace: assetPlace.updatePlace,

    deletePlace: assetPlace.deletePlace,
  },
  bill_paifa: {
    getBillMainTemplate: paifa.getBillMainTemplate,
    queryBill: paifa.queryBill,
    queryBillDetail: paifa.queryBillDetail,

    saveBill: paifa.saveBill,
    deleteBill: paifa.deleteBill,
    checkBill: paifa.checkBill,
  },
  bill_tuiku: {
    getBillMainTemplate: tuiku.getBillMainTemplate,
    queryBill: tuiku.queryBill,
    queryBillDetail: tuiku.queryBillDetail,

    saveBill: tuiku.saveBill,
    deleteBill: tuiku.deleteBill,
    checkBill: tuiku.checkBill,
  },
  bill_jiechu: {
    getBillMainTemplate: jiechu.getBillMainTemplate,
    queryBill: jiechu.queryBill,
    queryBillDetail: jiechu.queryBillDetail,

    saveBill: jiechu.saveBill,
    deleteBill: jiechu.deleteBill,
    checkBill: jiechu.checkBill,
  },
  bill_guihuan: {
    getBillMainTemplate: guihuan.getBillMainTemplate,
    queryBill: guihuan.queryBill,
    queryBillDetail: guihuan.queryBillDetail,

    saveBill: guihuan.saveBill,
    deleteBill: guihuan.deleteBill,
    checkBill: guihuan.checkBill,
  },
  bill_chuzhi: {
    getBillMainTemplate: chuzhi.getBillMainTemplate,
    queryBill: chuzhi.queryBill,
    queryBillDetail: chuzhi.queryBillDetail,

    saveBill: chuzhi.saveBill,
    deleteBill: chuzhi.deleteBill,
    unDisposedBill: chuzhi.unDisposedBill,
    checkBill: chuzhi.checkBill,
  },
  bill_weixiu: {
    getBillMainTemplate: weixiu.getBillMainTemplate,
    queryBill: weixiu.queryBill,
    queryBillDetail: weixiu.queryBillDetail,

    saveBill: weixiu.saveBill,
    deleteBill: weixiu.deleteBill,
    updateBill: weixiu.updateBill,
    checkBill: weixiu.checkBill,
  },
  bill_pand: {
    getTemplate: pand.getTemplate,
    queryBill: pand.queryBill,
    queryBillDetail: pand.queryBillDetail,

    saveBill: pand.saveBill,
    checkBill: pand.checkBill,
    deleteBill: pand.deleteBill,

    checkDetail: pand.checkDetail,
    unCheckDetail: pand.unCheckDetail,
  },
  org: {
    getTemplate: org.getTemplate,
    getOrgList_list: org.getOrgList_list,
    getOrgList_all: org.getOrgList_all,

    addOrg: org.addOrg,
    addOrgList: org.addOrgList,
    updateOrg: org.updateOrg,

    deleteOrg: org.deleteOrg,
  },
  employee: {
    getTemplate: employee.getTemplate,
    getEmployeeList_list: employee.getEmployeeList_list,
    getEmployeeList_all: employee.getEmployeeList_all,

    addEmployee: employee.addEmployee,
    addEmployeeList: employee.addEmployeeList,
    updateEmployee: employee.updateEmployee,

    deleteEmployee: employee.deleteEmployee,
  },
  user: {
    getTemplate: user.getTemplate,
    getUserList: user.getUserList,
    getUserDetail: user.getUserDetail,
    addUser: user.addUser,

    addUserList: user.addUserList,
    updateUser: user.updateUser,
    updateUserPassword: user.updateUserPassword,
    deleteUser: user.deleteUser,
  },
  user_permission: {
    getPermission_page: user_permission.getPermission_page,
    savePermission_page: user_permission.savePermission_page,
  },
  assetAlarm: {
    getTemplate: assetAlarm.getTemplate,
    getAlarmList: assetAlarm.getAlaramList,
    updateAlarm: assetAlarm.updateAlarm,

    updateAlarmList: assetAlarm.updateAlarmList,
  },
  device: {
    getTemplate: device.getTemplate,
    getDeviceList: device.getDeviceList,
    addDevice: device.addDevice,

    addDeviceList: device.addDeviceList,
    updateDevice: device.updateDevice,
    deleteDevice: device.deleteDevice,
  },
  deviceAlarm: {
    getDeviceAlarmList: deviceAlarm.getDeviceAlarmList,
  },
  deviceOffline: {
    getDeviceOfflineRecord: deviceOffline.getDeviceOfflineRecord,
  },
  supplier: {
    getTemplate: supplier.getTemplate,
    getSupplierList: supplier.getSupplierList,
    getSupplierDetail: supplier.getSupplierDetail,

    addSupplier: supplier.addSupplier,
    addSupplierList: supplier.addSupplierList,
    updateSupplier: supplier.updateSupplier,

    deleteSupplier: supplier.deleteSupplier,
  },
  asset_material: {
    getTemplate: asset_material.getTemplate,
    getMaterialList: asset_material.getMaterialList,
    getMaterialList_chuku: asset_material.getMaterialList_chuku,
    getMaterialList_all: asset_material.getMaterialList_all,
    getMaterialDetail: asset_material.getMaterialDetail,

    addMaterial: asset_material.addMaterial,
    addMaterialList: asset_material.addMaterialList,
    updateMaterial: asset_material.updateMaterial,
    deleteMaterial: asset_material.delteMaterial,
    getStorageQtyByMaterialName: asset_material.getStorageQtyByMaterialName,
    getMaterialList_purchase: asset_material.getMaterialList_purchase,
  },
  bill_chuku_material: {
    getBillMainTemplate: chuku_material.getBillMainTemplate,
    queryBill: chuku_material.queryBill,
    queryBillDetail: chuku_material.queryBillDetail,

    saveBill: chuku_material.saveBill,
    deleteBill: chuku_material.deleteBill,
    // checkBill: paifa.checkBill,
  },
  bill_tuiku_material: {
    getBillMainTemplate: tuiku_material.getBillMainTemplate,
    queryBill: tuiku_material.queryBill,
    queryBillDetail: tuiku_material.queryBillDetail,

    saveBill: tuiku_material.saveBill,
    deleteBill: tuiku_material.deleteBill,
    // checkBill: paifa.checkBill,
  },
  bill_ruku_material: {
    getBillMainTemplate: ruku_material.getBillMainTemplate,
    queryBill: ruku_material.queryBill,
    queryBillDetail: ruku_material.queryBillDetail,

    saveBill: ruku_material.saveBill,
    deleteBill: ruku_material.deleteBill,
    updateBill: ruku_material.updateBill,
    checkBill: ruku_material.checkBill,
    cancelBill: ruku_material.cancelBill,
  },
  bill_purchase: {
    getTemplate_asset: bill_purchase.getTemplate_asset,
    getTemplate_material: bill_purchase.getTemplate_material,
    getBillMainTemplate: bill_purchase.getBillMainTemplate,
    queryBill: bill_purchase.queryBill,
    queryBillDetail: bill_purchase.queryBillDetail,

    saveBill: bill_purchase.saveBill,
    deleteBill: bill_purchase.deleteBill,
    updateBill: bill_purchase.updateBill,
    checkBill: bill_purchase.checkBill,
    getAssetList_forPriceUpdate: bill_purchase.getAssetList_forPriceUpdate,
    getMaterialList_forPriceUpdate: bill_purchase.getMaterialList_forPriceUpdate,
    updatePrice: bill_purchase.updatePrice,
    queryBill_paifa: bill_purchase.queryBill_paifa,
    queryBill_materialchuku: bill_purchase.queryBill_materialchuku,
  },
  bill_pay: {
    getTemplate: bill_pay.getTemplate,
    queryBill: bill_pay.queryBill,
    saveBill: bill_pay.saveBill,
  },
  supplier_payable: {
    queryPayableList: supplier_payable.queryPayableList,
    queryPayableDetailList: supplier_payable.queryPayableDetailList,
    queryPayableDetailList_all: supplier_payable.queryPayableDetailList_all,
  },
  page: {
    updatePage: page.updatePage,
  },
  dashBoard: {
    getToDoList: dashBoard.getToDoList,
    getReport_recent: dashBoard.getReport_recent,
    getQuickMenu: dashBoard.getQuickMenu,
    getAsset_distribute_status: dashBoard.getAsset_distribute_status,
    getAsset_distribute_place: dashBoard.getAsset_distribute_place,
    get_dashboard_data: dashBoard.get_dashboard_data,
  },
  /**
   * 导出导入操作 每个数据类别一个操作对象
   */
  exportImport: {
    asset: {
      getTemplate: asset_export_import.getTemplate,
      check: asset_export_import.check,
    },
    assetClass: {
      getTemplate: assetClass_export_import.getTemplate,
      check: assetClass_export_import.check,
    },
    assetPlace: {
      getTemplate: assetPlace_export_import.getTemplate,
      check: assetPlace_export_import.check,
    },
    org: {
      getTemplate: org_export_import.getTemplate,
      check: org_export_import.check,
    },
    employee: {
      getTemplate: employee_export_import.getTemplate,
      check: employee_export_import.check,
    },
  },
  sys_log: {
    getSysLogList: sys_log.getSysLogList,
  }
};
module.exports = clientService;
