const header_common = {
  useStatus: { zh: "使用状态", en: "", width: 60, align: "center" },
  assetId: { zh: "资产编号", en: "", width: 160, align: "center", },
  assetName: { zh: "资产名称", en: "", width: 150, align: "center", },
  className: { zh: "分类名称", en: "", width: 120, align: "center", },
  placeName: { zh: "位置", en: "", width: 100, align: "center", },
  ownOrgName: { zh: "所属部门", en: "", width: 150, align: "center", },
  useOrgName: { zh: "使用部门", en: "", width: 150, align: "center", },
  brand: { zh: "品牌", en: "", width: 130, align: "center", },
  model: { zh: "型号", en: "", width: 200, align: "center", },
  useDate: { zh: "借用/领用日期", en: "", width: 160, align: "center", },
  purchaseDate: { zh: "购置日期", en: "", width: 160, align: "center", },
  manager: { zh: "管理员", en: "", width: 100, align: "center", },
  sn: { zh: "序列号", en: "", width: 100, align: "center", },
  billNo: { zh: "领用单号", en: "", width: 120, align: "center", }
};
const view_mock = {
  header_assetList_all: {
    status: { zh: "资产状态", en: "", width: 60, align: "center", },
    assetId: header_common.assetId,
    assetName: header_common.assetName,
    className: header_common.className,
    brand: header_common.brand,
    model: header_common.model,
    ownOrgName: header_common.ownOrgName,
    useOrgName: header_common.useOrgName,
    useDate: header_common.useDate,
    purchaseDate: header_common.purchaseDate,
    manager: header_common.manager,
  },
  header_assetList_billDetail: {
    assetId: header_common.assetId,
    assetName: header_common.assetName,
    status: { zh: "资产状态", en: "", width: 100, align: "center", },
    placeName: header_common.placeName,
    useOrgName: header_common.useOrgName,
    className: header_common.className,
    brand: header_common.brand,
    model: header_common.model,
    sn: header_common.sn,
    ownOrgName: header_common.ownOrgName,
  },
  header_tuiku_billList: {
    status: { zh: "单据状态", en: "", width: 60, align: "center", },
    billNo: { zh: "退库单号", en: "", width: 120, align: "center", },
    returnDate: { isExt: true, zh: "退库日期", en: "", width: 120, align: "center", },
    useOrgId: { isExt: true, zh: "退库后使用部门", en: "", width: 120, align: "center", },
    placeId: { isExt: true, zh: "退库后所在位置", en: "", width: 120, align: "center", },
    remarks: { zh: "备注", en: "", width: 120, align: "center", }
  },
  header_jiechu_billList: {
    employeeName: { zh: "借用人", en: "", width: 120, align: "center", },
    employeeId: { isExt: true, zh: "人员编号", en: "", width: 120, align: "center", },
    mobile: { zh: "手机号", en: "", width: 120, align: "center" },
    borrowDate: { isExt: true, zh: "借用时间", width: 150, align: "center" },
    currentPlaceName: { zh: "借用后所在位置", width: 150, align: "center" },
    billNo: { zh: "借用单号", width: 150, align: "center" },
    className: { zh: "资产分类", width: 100, align: "center" },
    prePlaceName: { zh: "借用前所在位置", width: 100, align: "center" }
  },
  header_guihuan_billList: {
    employeeName: { zh: "借用人", en: "", width: 120, align: "center", },
    employeeId: { isExt: true, zh: "人员编号", en: "", width: 120, align: "center", },
    mobile: { zh: "手机号", en: "", width: 120, align: "center" },
    borrowDate: { isExt: true, zh: "借用时间", width: 150, align: "center" },
    returnDate: { isExt: true, zh: "归还时间", width: 150, align: "center" },
    billNo: { zh: "归还单号", width: 150, align: "center" },
    currentPlaceName: { zh: "归还后所在位置", width: 150, align: "center" },
    className: { zh: "资产分类", width: 100, align: "center" },
    remarks: { zh: "归还备注", en: "", width: 120, align: "center", }
  }
};
module.exports.view_mock = view_mock;
module.exports.header_common = header_common;
