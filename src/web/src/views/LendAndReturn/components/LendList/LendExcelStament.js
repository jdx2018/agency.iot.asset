import { transformMergeConfig, exportTableStament } from "utils/common";

let font = { name: "等线", sz: 11, color: { auto: 1 } };
let alignment = { horizontal: "left", vertical: "center" };
let border = {
  top: { style: "thin", color: { auto: 1 } },
  bottom: { style: "thin", color: { auto: 1 } },
  left: { style: "thin", color: { auto: 1 } },
  right: { style: "thin", color: { auto: 1 } },
};

const defaultStyle = {
  font: font,
  alignment: alignment,
  border: border,
};

const lendRemarkStyle = {
  font: font,
  border: border,
  alignment: {
    horizontal: "left",
    vertical: "top",
  },
};

const billNoLabelStyle = {
  font: { name: "等线", sz: 11, color: { auto: 1 }, bold: true },
};

const billNoStyle = {
  font: { name: "等线", sz: 11, color: { auto: 1 } },
};

const billTitleStyle = {
  font: { name: "等线", sz: 16, color: { auto: 1 }, bold: true },
  alignment: { horizontal: "center", vertical: "center" },
};

const userIdeaStyle = {
  font: { name: "等线", sz: 11, color: { auto: 1 } },
  alignment: {
    horizontal: "left",
    vertical: "top",
  },
  border: border,
};

let signatureStyle = {
  font: font,
  border: border,
  alignment: {
    horizontal: "center",
    vertical: "center",
  },
};

export function exportLendExcleStament(mainLendInfo = {}, subLendInfo = {}, excelName = "借用申请表") {
  let {
    billNo = "",
    useEmployeeName = "",
    borrowDate = "",
    returnDate = "",
    useOrgName = "",
    placeName = "",
    operatePersonName = "",
    remarks = "",
  } = mainLendInfo;
  let { assetList = [], template = [] } = subLendInfo;
  let lendBill = [
    ["A1", "A1", { value: "记录编号: ", style: billNoLabelStyle }],
    ["B1", "C1", { value: billNo, style: billNoStyle }],
    ["A2", "J2", { value: "中远海运（青岛）有限公司固定资产(物品)借用申请表", style: billTitleStyle }],
    ["A3", "A3", { value: "借用人", style: defaultStyle }],
    ["B3", "B3", { value: useEmployeeName, style: defaultStyle }],
    ["C3", "C3", { value: "借用日期", style: defaultStyle }],
    ["D3", "F3", { value: borrowDate, style: defaultStyle }],
    ["G3", "G3", { value: "预计归还", style: defaultStyle }],
    ["H3", "J3", { value: returnDate, style: defaultStyle }],
    ["A4", "A4", { value: "使用部门", style: defaultStyle }],
    ["B4", "B4", { value: useOrgName, style: defaultStyle }],
    ["C4", "C4", { value: "借用后位置", style: defaultStyle }],
    ["D4", "F4", { value: placeName, style: defaultStyle }],
    ["G4", "G4", { value: "处理人", style: defaultStyle }],
    ["H4", "J4", { value: operatePersonName, style: defaultStyle }],
    ["A5", "A7", { value: "借用备注", style: lendRemarkStyle }],
    ["B5", "J7", { value: remarks, style: lendRemarkStyle }],
    ["A8", "A9", { value: "审批", style: signatureStyle }],
    ["B8", "D9", { value: "", style: lendRemarkStyle }],
    ["E8", "E9", { value: "借用人", style: signatureStyle }],
    ["F8", "J9", { value: "", style: lendRemarkStyle }],
  ];
  let extraDataConfig = {
    insertFlag: 8,
    extraData: assetList,
    template,
  };
  let tranMergeConfig = transformMergeConfig(lendBill);
  let colConfig = [
    { wpx: 65 },
    { wpx: 65 },
    { wpx: 75 },
    { wpx: 65 },
    { wpx: 65 },
    { wpx: 65 },
    { wpx: 65 },
    { wpx: 65 },
    { wpx: 65 },
    { wpx: 65 },
  ];

  exportTableStament({
    mergeConfig: tranMergeConfig,
    columnsTotal: 99,
    rowTotal: 99,
    extraDataConfig,
    colConfig,
    excelName,
  });
}
