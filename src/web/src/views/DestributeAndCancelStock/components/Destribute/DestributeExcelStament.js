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

const remarkStyle = {
  font: font,
  border: border,
  alignment: {
    horizontal: "left",
    vertical: "center",
    wrapText: 1,
  },
};

const remarkLabelStyle = {
  font: font,
  border: border,
  alignment: {
    horizontal: "center",
    vertical: "center",
    wrapText: 1,
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

export function exportDestributeExcleStament(mainLendInfo = {}, subLendInfo = {}, excelName = "借用申请表") {
  let {
    billNo = "",
    useEmployeeName = "",
    useDate = "",
    useOrgName = "",
    placeName = "",
    operatePersonId = "",
    remarks = "",
  } = mainLendInfo;
  let { assetList = [], template = [] } = subLendInfo;
  let lendBill = [
    ["A1", "A1", { value: "记录编号: ", style: billNoLabelStyle }],
    ["B1", "C1", { value: billNo, style: billNoStyle }],

    ["A2", "J2", { value: "中远海运（青岛）有限公司固定资产(物品)派发申请表", style: billTitleStyle }],

    ["A3", "A3", { value: "领用人", style: defaultStyle }],
    ["B3", "C3", { value: useEmployeeName, style: defaultStyle }],
    ["D3", "D3", { value: "领用日期", style: defaultStyle }],
    ["E3", "F3", { value: useDate, style: defaultStyle }],
    ["G3", "G3", { value: "领用后位置", style: defaultStyle }],
    ["H3", "J3", { value: placeName, style: defaultStyle }],

    ["A4", "A4", { value: "使用部门", style: defaultStyle }],
    ["B4", "C4", { value: useOrgName, style: defaultStyle }],
    ["D4", "D4", { value: "处理人", style: defaultStyle }],
    ["E4", "F4", { value: operatePersonId, style: defaultStyle }],
    ["G4", "J4", { value: "" }],

    ["A5", "A7", { value: "领用备注", style: remarkLabelStyle }],
    ["B5", "J7", { value: remarks, style: remarkStyle }],

    ["A8", "A9", { value: "审批", style: remarkLabelStyle }],
    ["B8", "D9", { value: "", style: remarkStyle }],
    ["E8", "E9", { value: "申请人", style: remarkLabelStyle }],
    ["F8", "J9", { value: "", style: remarkStyle }],
  ];
  let extraDataConfig = {
    insertFlag: 8,
    extraData: assetList,
    template,
  };
  let tranMergeConfig = transformMergeConfig(lendBill);
  let colConfig = [
    { wpx: 65 },
    { wpx: 85 },
    { wpx: 85 },
    { wpx: 65 },
    { wpx: 65 },
    { wpx: 65 },
    { wpx: 75 },
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
