const view_mock = require("../../mock/view_mock").view_mock;
const typeDef = {
    comment: "借用单",
    type: 12,
    prefix: "JC",
    extMap: {
        ext1: "borrowNum",
        ext2: "returnNum",
        ext7: "borrowDate",
        ext8: "returnDate",
        ext10: "placeId",
        ext11: "employeeId",
        ext12: "useOrgId"
    },
    fieldMap: {
        borrowNum: "ext1",
        returnNum: "ext2",
        borrowDate: "ext7",
        returnDate: "ext8",
        placeId: "ext10",
        employeeId: "ext11",
        useOrgId: "ext12"
    },

    status: {
        initial: { value: 1, desc: "已完成" },
        // final: { value: 1, desc: "已审核" }
    },
    statusMap: {
        "1": "已完成",
    },
    billTypeMap: {
        "12": "借用单"
    }
}
/**
 * 列标题定义 单据列表/单据明细
 */
const header = {
    main: {
        // isReturn: { isExt: true, zh: "是否归还", en: "", width: 80, align: "center" },
        status: { zh: "单据状态", en: "", width: 100, align: "center" },
        billNo: { zh: "借用单号", en: "", width: 120, align: "center", },
        returnDiff: { zh: "待归还", en: "", width: 100, align: "center" },
        borrowDate: { isExt: true, zh: "借用日期", en: "", width: 150, align: "center" },
        employeeName: { isExt: true, zh: "借用人", en: "", width: 120, align: "center", },
        placeName: { isExt: true, zh: "借用后位置", en: "", width: 150, align: "center", },
        borrowNum: { isExt: true, zh: "借用数量", en: "", width: 100, align: "center" },
        returnNum: { isExt: true, zh: "归还数量", en: "", width: 100, align: "center" },
        remainDay: { zh: "到期天数", en: "", width: 100, align: "center" },
        returnDate: { isExt: true, zh: "预计归还", en: "", width: 150, align: "center" },
        createTime: { zh: "创建时间", en: "", width: 150, align: "center" },
        remarks: { zh: "备注", en: "", width: 160, align: "center", }
    },
    detail: view_mock.header_assetList_billDetail
}
/**
 *  单据主表信息显示、编辑、新增,弹出页面表头使用
 */
const billMainTemplate = {
    employeeId: {
        required: true,
        desc: "借用人",
        type: "list",
        value: null,
        field_select: { value: "employeeId", display: "employeeName" },
        dataSource: [],
        setRelated: { objectName: "useOrgId", fieldName: "orgId" },
        useWidget: { widgetName: "employeePicker" }
    },
    borrowDate: {
        required: true,
        desc: "借用日期",
        type: "dateTime",
        value: null
    },
    returnDate: {
        required: true,
        desc: "预计归还",
        type: "dateTime",
        value: null
    },
    useOrgId: {
        required: true,
        forceDisable: true,
        desc: "使用部门",
        type: "tree",
        value: null,
        field_select: { value: "orgId", display: "orgName" },
        dataSource: []
    },
    placeId: {
        required: true,
        desc: "借用后位置",
        type: "tree",
        value: null,
        field_select: { value: "placeId", display: "placeName" },
        dataSource: []
    },

    operatePersonId: { desc: "处理人", value: null, forceDisable: true },
    remarks: { desc: "借用用备注", value: null, type: "longText" }
}
/**
 * 单据列表界面高级筛选配置
 */
var filter = {
    items_input: {
        billNo: { desc: "借用单号", value: null },
    },
    items_select: {
        borrowDate_start: {
            desc: "借用日期起",
            type: "dateTime",
            value: null
        },
        borrowDate_end: {
            desc: "借用日期止",
            type: "dateTime",
            value: null
        },
        employeeId: {
            required: true,
            desc: "借用人",
            type: "list",
            value: null,
            field_select: { value: "employeeId", display: "employeeName" },
            dataSource: [],
        },
        placeId: {
            desc: "借用后位置",
            type: "tree",
            value: null,
            field_select: { value: "placeId", display: "placeName" },
            dataSource: null
        },
        status: {
            desc: "状态", type: "enum", value: null,
            dataSource: [
                { value: 0, text: "待归还" },
                { value: 1, text: "已归还" }
            ]
        },



    }
}
module.exports.typeDef = typeDef;
module.exports.header = header;
module.exports.billMainTemplate = billMainTemplate;
module.exports.filter = filter;