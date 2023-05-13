const table = {
  tenant: 'tenant', //租户集合
  tenant_device: 'tenant_device', //设备数据
  tenant_device_monitor: 'tenant_device_monitor', //设备监控数据
  tenant_log_email: 'tenant_log_email', //设备报警数据
  tenant_org: 'tenant_org', //租户组织机构
  tenant_org_sub: 'tenant_org_sub', //租户子级关系数据表
  tenant_sys_log: 'tenant_sys_log', //系统日志记录

  tenant_code: 'tenant_code', //编码生成表
  tenant_asset_lifeline: 'tenant_asset_lifeline', //资产变动历史表

  tenant_user: 'tenant_user', //租户用户
  tenant_employee: 'tenant_employee', //员工列表
  tenant_org_permission: 'tenant_org_permission', //租户权限，控制到页面和页面上的CRUD

  tenant_page: 'tenant_page', //租户页面集合
  tenant_collection: 'tenant_collection', //租户数据集
  tenant_collection_fields: 'tenant_collection_fields', //租户字段配置

  tenant_asset: 'tenant_asset', //资产列表
  tenant_asset_place: 'tenant_asset_place', //资产位置
  tenant_asset_place_sub: 'tenant_asset_place_sub', //资产位置子级数据
  tenant_asset_class: 'tenant_asset_class', //资产分类
  tenant_asset_class_sub: 'tenant_asset_class_sub', //资产分类子级数据
  tenant_asset_material: 'tenant_asset_material', //耗材列表
  tenant_asset_delete_log: 'tenant_asset_delete_log', //资产删除日志

  tenant_bill: 'tenant_bill', //业务单据主表
  tenant_bill_detail: 'tenant_bill_detail', //业务单据明细
  tenant_bill_material: 'tenant_bill_material', //耗材业务单据主表
  tenant_bill_material_detail: 'tenant_bill_material_detail', //耗材业务单据明细
  tenant_bill_purchase: 'tenant_bill_purchase', //采购申请单主表

  tenant_bill_purchase_detail_asset: 'tenant_bill_purchase_detail_asset', //采购申请单明细-资产
  tenant_bill_purchase_detail_material: 'tenant_bill_purchase_detail_material', //采购申请单明细-耗材
  tenant_bill_pay_flow: 'tenant_bill_pay_flow',
  tenant_supplier_payable: 'tenant_supplier_payable',

  tenant_inventory: 'tenant_inventory', //盘点主表
  tenant_inventory_detail: 'tenant_inventory_detail', //盘点明细表,
  tenant_iot_alarm: 'tenant_iot_alarm', //报警记录
  tenant_user_permission_page: 'tenant_user_permission_page', //用户页面权限表
  // "tenant_user_permission_data_org": "tenant_user_permission_data_org",//用户数据权限表
  tenant_supplier: 'tenant_supplier',
  tenant_bill_purchase_asset_flow: 'tenant_bill_purchase_asset_flow', //采购入库资产流水记录
  tenant_bill_purchase_asset_price_flow: 'tenant_bill_purchase_asset_price_flow', //采购资产价格流水记录
  tenant_bill_purchase_material_flow: 'tenant_bill_purchase_material_flow', //采购入库耗材流水记录
  tenant_bill_purchase_material_price_flow: 'tenant_bill_purchase_material_price_flow', //采购耗材价格流水记录

  v_asset: 'v_asset', //资产列表视图 关联className orgName 等
  v_asset_org: 'v_asset_org', //机构下属资产，包含子级机构
  "v_asset_org_class": "v_asset_org_class", // 机构下属资产，分类下属分类资产查询
  v_asset_org_pand: 'v_asset_org_pand', //获取可盘点资产列表，区分使用部门、所属部门、分类、位置
  v_asset_purchase_flow: 'v_asset_purchase_flow', //资产采购流水明细
  v_asset_material: 'v_asset_material', //耗材视图
  v_asset_material_enum: 'v_asset_material_enum', //耗材枚举属性视图
  v_bill_purchase_material_detail_chuku: 'v_bill_purchase_material_detail_chuku', //耗材采购明细
  v_asset_storage_assetName: 'v_asset_storage_assetName',
  v_asset_material_storage_materialName: 'v_asset_material_storage_materialName',
  v_report_asset_distribute_status: 'v_report_asset_distribute_status', //概览看板，资产状态分布
  v_report_asset_distribute_place: 'v_report_asset_distribute_place', // 概览看板，资产位置分布
  v_report_asset_alarm_todo: 'v_report_asset_alarm_todo', // 概览看板，资产报警待处理资产数量。
  v_report_asset_status_todo: 'v_report_asset_status_todo', // 概览看板，资产不同状态资产数量。
  v_report_asset_chuzhi_todo: 'v_report_asset_chuzhi_todo', // 概览看板，待处置资产数量。

  v_inventory: 'v_inventory', //盘点主表视图
  v_inventory_org: 'v_inventory_org', //盘点单按权限获取单据列表
  v_inventory_detail: 'v_inventory_detail', //盘点明细视图
  v_asset_monitor: 'v_asset_monitor', //监控日期

  v_asset_alarm: 'v_asset_alarm', //资产监控
  v_brand: 'v_brand', //品牌列表
  v_bill_paifa: 'v_bill_paifa', //派发单主表视图
  v_bill_paifa_org: 'v_bill_paifa_org', //派发单按权限获取单据列表
  v_bill_paifa_detail: 'v_bill_paifa_detail', //派发单明细视图

  v_bill_tuiku: 'v_bill_tuiku', //退库单主表视图
  v_bill_tuiku_org: 'v_bill_tuiku_org', //退库单按权限获取单据列表
  v_bill_tuiku_detail: 'v_bill_tuiku_detail', //退库单明细视图
  v_bill_jiechu: 'v_bill_jiechu', //借出单主表视图
  v_bill_jiechu_org: 'v_bill_jiechu_org', //借出单按权限获取单据列表
  v_bill_jiechu_detail: 'v_bill_jiechu_detail', //借出明细视图
  v_bill_guihuan: 'v_bill_guihuan', //归还单主表视图
  v_bill_guihuan_org: 'v_bill_guihuan_org', //归还单主表-按权限获取
  v_bill_guihuan_detail: 'v_bill_guihuan_detail',

  v_bill_weixiu: 'v_bill_weixiu', //维修单主表视图
  v_bill_weixiu_org: 'v_bill_weixiu_org', //按权限获取维修单据列表
  v_bill_weixiu_detail: 'v_bill_weixiu_detail', //维修单明细视图
  v_bill_chuzhi: 'v_bill_chuzhi', //处置单主表视图
  v_bill_chuzhi_org: 'v_bill_chuzhi_org', //处置单按权限获取单据列表
  v_bill_chuzhi_detail: 'v_bill_chuzhi_detail', //处置单明细视图
  v_user: 'v_user', //处置单主表视图
  v_employee: 'v_employee', //员工视图

  v_user_permission: 'v_user_permission',
  v_user_premission_tree: 'v_user_premission_tree',
  v_user_permission_page: 'v_user_permission_page',
  v_device: 'v_device', //设备主表视图

  v_bill_chuku_material: 'v_bill_chuku_material', //耗材出库单
  v_bill_tuiku_material: 'v_bill_tuiku_material', //耗材退库单
  v_bill_ruku_material: 'v_bill_ruku_material', //入库单明细

  v_bill_chuku_material_detail: 'v_bill_chuku_material_detail', //耗材出库明细
  v_bill_tuiku_material_detail: 'v_bill_tuiku_material_detail', //耗材退库单明细
  v_bill_ruku_material_detail: 'v_bill_ruku_material_detail', //入库单明细
  v_bill_purchase: 'v_bill_purchase', //采购单主表视图
  v_bill_purchase_paifa: 'v_bill_purchase_paifa', //可派发的采购单
  v_bill_purchase_chuku: 'v_bill_purchase_chuku',
  v_bill_purchase_detail_asset: 'v_bill_purchase_detail_asset', //采购单明细 资产视图
  v_bill_purchase_detail_material: 'v_bill_purchase_detail_material', //采购单明细 耗材视图
  v_bill_pay_flow: 'v_bill_pay_flow', //付款单
  v_supplier_payable: 'v_supplier_payable', //应付款视图
  v_supplier_payable_detail: 'v_supplier_payable_detail', //应付款视图
  v_device_monitor: 'v_device_monitor',

  v_org_top: 'v_org_top', //租户顶级机构ID视图
  v_asset_class_top: 'v_asset_class_top', //租户顶级资产分类ID视图
  v_asset_place_top: 'v_asset_place_top', //租户顶级位置ID视图

  // "p_asset_get": "p_asset_get",//获取资产列表 按用户获取-弃用，改用视图
  // "p_bill_jiechu_get": "p_bill_jiechu_get",//获取借出单列表-弃用，改用视图
  // "p_bill_guihuan_get": "p_bill_guihuan_get",//获取归还单列表-弃用，改用视图
  // "p_bill_paifa_get": "p_bill_paifa_get",//获取派发单列表-弃用，改用视图
  // "p_bill_tuiku_get": "p_bill_tuiku_get",//获取退库单列表-弃用，改用视图
  // "p_bill_weixiu_get": "p_bill_weixiu_get",//获取维修单列表-弃用，改用视图
  // "p_bill_chuzhi_get": "p_bill_chuzhi_get",//获取处置单列表-弃用，改用视图
  // "p_inventory_get": "p_inventory_get",//获取盘点单列表-弃用，改用视图
  p_org_delete: "p_org_delete", // 删除组织
  p_org_getChilds: 'p_org_getChilds',
  p_org_updateUserPermission: 'p_org_updateUserPermission', //增加机构时更改用户权限
  p_bill_pand_detail_save: 'p_bill_pand_detail_save', //生成盘点明细
};
module.exports.table = table;
