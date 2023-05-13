const header_common = require('../../mock/view_mock').header_common
const typeDef = {
  comment: '资产列表',
  statusMap: {
    0: '空闲',
    1: '领用中',
    2: '借用',
    10: '处置待确认',
    11: '处置完成',
  },
  useStatusMap: {
    0: '正常',
    2: '维修中',
    11: '处置完成',
  },
  purchaseTypeMap: {
    0: '采购',
    1: '租赁',
    2: '其他',
  },
  isHostedMap: {
    "0": "不代管",
    "1": "代管",
  },
  isMonitorMap: {
    "0": "不监测",
    "1": "监测",
  }
}
const header = {
  main: {
    status: { zh: '资产状态', en: '', width: 100, align: 'center' },
    useStatus: { zh: '使用状态', en: '', width: 100, align: 'center' },
    assetId: header_common.assetId,
    assetName: header_common.assetName,
    useEmployeeName: { zh: '使用人', en: '', width: 120, align: 'center' },
    epc: { zh: 'EPC', en: '', width: 120, align: 'center' },
    barcode: { zh: '条码', en: '', width: 100, align: 'center' },
    className: { zh: '资产分类', en: '', width: 100, align: 'center' },
    brand: { zh: '品牌', en: '', width: 100, align: 'center' },
    model: { zh: '型号', en: '', width: 100, align: 'center' },
    spec: { zh: '规格', en: '', width: 100, align: 'center' },
    ownOrgName: header_common.ownOrgName,
    useOrgName: header_common.useOrgName,
    useDate: header_common.useDate,
    purchaseType: { zh: '购置类型', en: '', width: 150, align: 'center' },
    purchaseDate: { zh: '取得日期', en: '', width: 150, align: 'center' },
    managerName: header_common.manager,
    placeName: header_common.placeName,
    serviceLife: { zh: '使用期限', en: '', width: 150, align: 'center' },
    initialValue: { zh: '资产原值', en: '', width: 150, align: 'center' },
    documentNumber: { zh: '凭证号', en: '', width: 150, align: 'center' },
    documentDate: { zh: '凭证日期', en: '', width: 150, align: 'center' },
    isHosted: { zh: '是否代管', en: '', width: 100, align: 'center' },
    isMonitor: { zh: '是否监测', en: '', width: 100, align: 'center' },
    createPerson: { zh: '创建人', en: '', width: 100, align: 'center' },
    createTime: { zh: '创建时间', en: '', width: 160, align: 'center' },
    updatePerson: { zh: '更新人', en: '', width: 300, align: 'center' },
    // updateTime: { zh: "更新时间", en: "", width: 160, align: "center", },
  },
  billDetail: {
    assetId: header_common.assetId,
    assetName: header_common.assetName,
    status: { zh: '资产状态', en: '', width: 80, align: 'center' },
    ownOrgName: header_common.ownOrgName,
    placeName: header_common.placeName,
    purchaseDate: { zh: '取得日期', en: '', width: 120, align: 'center' },
    className: header_common.className,
    brand: header_common.brand,
    model: header_common.model,
    sn: header_common.sn,
    useOrgName: header_common.useOrgName,
  },
}
/**
 * 资产列表界面高级筛选配置
 */
var filter = {
  items_input: {
    assetId: { desc: '资产编号', value: null },
    assetName: { desc: '资产名称', value: null },
    epc: { desc: 'EPC', value: null },
    barcode: { desc: '条码', value: null },
    model: { desc: '型号', value: null },
    spec: { desc: '规格', value: null },
    supplier: { desc: '供应商', value: null },
  },
  items_select: {
    createPerson: {
      desc: '创建人',
      type: 'list',
      value: null,
      field_select: { value: 'employeeId', display: 'employeeName' },
      dataSource: [],
    },
    classId: {
      desc: '资产分类',
      type: 'tree',
      value: null,
      field_select: { value: 'classId', display: 'className' },
      dataSource: [],
    },
    createTime_start: {
      desc: '创建时间-起',
      type: 'dateTime',
      value: null,
    },
    createTime_end: {
      desc: '创建时间-止',
      type: 'dateTime',
      value: null,
    },
    placeId: {
      desc: '所在位置',
      type: 'tree',
      value: null,
      field_select: { value: 'placeId', display: 'placeName' },
      dataSource: [],
    },
    ownOrgId: {
      desc: '所属部门',
      type: 'tree',
      value: null,
      field_select: { value: 'orgId', display: 'orgName' },
      dataSource: [],
    },
    manager: {
      required: false,
      desc: '管理员',
      type: 'list',
      value: null,
      field_select: { value: 'employeeId', display: 'employeeName' },
      dataSource: [],
    },
    useEmployeeId: {
      required: false,
      desc: '使用人',
      type: 'list',
      value: null,
      field_select: { value: 'employeeId', display: 'employeeName' },
      dataSource: [],
    },
    useOrgId: {
      desc: '使用部门',
      type: 'tree',
      value: null,
      field_select: { value: 'orgId', display: 'orgName' },
      dataSource: [],
    },
    status: {
      desc: '资产状态',
      type: 'enum',
      value: null,
      dataSource: [
        { value: 0, text: '空闲' },
        { value: 1, text: '领用中' },
        { value: 2, text: '借用' },
        { value: 11, text: '处置待确认' },
        { value: 12, text: '处置完成' },
      ],
    },
    purchaseDate_start: {
      desc: '购置日期-起',
      type: 'dateTime',
      value: null,
    },
    purchaseDate_end: {
      desc: '购置日期-止',
      type: 'dateTime',
      value: null,
    },
    purchaseType: {
      desc: '购置类型',
      type: 'enum',
      value: null,
      dataSource: [
        { value: '0', text: '采购' },
        { value: '1', text: '租赁' },
        { value: '2', text: '其他' },
      ],
    },
    brand: {
      desc: '品牌',
      type: 'enum',
      value: null,
      dataSource: [],
    },
    isHosted: {
      desc: '是否代管',
      type: 'enum',
      value: null,
      dataSource: [
        { value: 0, text: '不代管' },
        { value: 1, text: '代管' },
      ],
    },
    documentDate_start: {
      desc: '凭证日期-起',
      type: 'dateTime',
      value: null,
    },
    documentDate_end: {
      desc: '凭证日期-止',
      type: 'dateTime',
      value: null,
    },
  },
}
const objTemplate = {
  amount: {
    required: true,
    desc: '采购单价',
    value: null,
  },
  serviceLife: {
    required: true,
    desc: '使用年限',
    value: null,
  },
  purchaseType: {
    desc: '购置类型',
    type: 'enum',
    value: null,
    dataSource: [
      { value: '0', text: '采购' },
      { value: '1', text: '租赁' },
      { value: '2', text: '其他' },
    ],
  },
  purchaseDate: {
    desc: '取得日期',
    type: 'dateTime',
    value: null,
  },
  initialValue: {
    required: false,
    desc: '资产原值',
    value: null,
  },
  useOrgId: {
    required: false,
    desc: '使用部门',
    type: 'tree',
    value: null,
    field_select: { value: 'orgId', display: 'orgName' },
    dataSource: [],
  },
  useEmployeeId: {
    required: false,
    desc: '使用人',
    type: 'list',
    value: null,
    field_select: { value: 'employeeId', display: 'employeeName' },
    dataSource: [],
    useWidget: { widgetName: 'employeePicker' },
  },

  invoiceType: {
    required: false,
    desc: '发票类型',
    type: 'enum',
    value: null,
    dataSource: [
      { value: '增值税普通发票', text: '增值税普通发票' },
      { value: '增值税专用发票', text: '增值税专用发票' },
    ],
  },
  documentNumber: {
    required: false,
    desc: '凭证号',
    value: null,
  },
  documentDate: {
    required: false,
    desc: '凭证日期',
    type: 'dateTime',
    value: null,
  },
  supplierId: {
    required: false,
    desc: '供应商',
    type: 'list',
    value: null,
    field_select: { value: 'supplierId', display: 'supplierName' },
    dataSource: [],
  },
  unit: {
    required: false,
    desc: '计量单位',
    value: null,
  },

  brand: {
    required: false,
    desc: '品牌',
    type: 'enum_input',
    value: null,
    dataSource: [],
  },
  model: {
    required: false,
    desc: '型号',
    value: null,
  },
  isHosted: {
    required: false,
    type: 'enum',
    desc: '代管',
    dataSource: [
      { value: 0, text: '不代管' },
      { value: 1, text: '代管' },
    ],
  },
  spec: {
    required: false,
    desc: '规格',
    value: null,
    width: 2,
  },
}

const checkRule = {
  rules: [
    { key: 'assetId', rule: { required: false, dataType: 'string' } },
    { key: 'assetName', rule: { required: true, dataType: 'string' } },
    { key: 'barcode', rule: { required: false, dataType: 'string' } },
    { key: 'epc', rule: { required: false, dataType: 'string' } },
    { key: 'classId', rule: { required: true, dataType: 'string' } },
    { key: 'placeId', rule: { required: true, dataType: 'string' } },
    { key: 'manager', rule: { required: true, dataType: 'string' } },
    { key: 'useStatus', rule: { required: true, dataType: 'number' } },
    { key: 'amount', rule: { required: true, dataType: 'number' } },
    { key: 'serviceLife', rule: { required: true, dataType: 'string' } },
    // { key: "isMonitor", rule: { required: true, dataType: "number", } },
    // { key: "isHosted", rule: { required: true, dataType: "number", } },
    { key: 'purchaseType', rule: { required: false, dataType: 'string' } },
    { key: 'purchaseDate', rule: { required: false, dataType: 'datetime' } },
    { key: 'initialValue', rule: { required: true, dataType: 'number' } },
    { key: 'useOrgId', rule: { required: false, dataType: 'string' } },
    { key: 'useEmployeeId', rule: { required: false, dataType: 'string' } },
    { key: 'invoiceType', rule: { required: false, dataType: 'string' } },
    { key: 'documentNumber', rule: { required: false, dataType: 'string' } },
    { key: 'documentDate', rule: { required: false, dataType: 'datetime' } },
    { key: 'supplierId', rule: { required: false, dataType: 'string' } },
    { key: 'unit', rule: { required: false, dataType: 'string' } },
    { key: 'brand', rule: { required: false, dataType: 'string' } },
    { key: 'model', rule: { required: false, dataType: 'string' } },
    { key: 'spec', rule: { required: false, dataType: 'string' } },
    { key: 'remarks', rule: { required: false, dataType: 'string' } },
    { key: 'image', rule: { required: false, dataType: 'string' } },
  ],
}
module.exports.typeDef = typeDef
module.exports.filter = filter
module.exports.header = header
module.exports.objTemplate = objTemplate
module.exports.checkRule = checkRule
