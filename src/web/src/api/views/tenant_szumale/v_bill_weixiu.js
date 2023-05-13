const view_mock = require("../../mock/view_mock").view_mock;
const typeDef = {
    comment: "维修单",
    type: 31,
    prefix: "WX",
    extMap: {
        ext1: "assetNum",
        ext7: "reportDate",
        ext8: "finishDate",
        ext10: "placeId",
        ext11: "reportPersonId",
        ext13: "content",

    },
    fieldMap: {
        assetNum: "ext1",
        reportDate: "ext7",
        finishDate: "ext8",
        placeId: "ext10",
        reportPersonId: "ext11",
        content: "ext13",

    },
    status: {
        initial: { value: 0, desc: "待审核" },
        checked: { value: 1, desc: "维修中" },
        final: { value: 1, desc: "维修完成" }
    },
    statusMap: {
        "0": "待审核",
        "1": "维修中",
        "2": "维修完成"
    },
    billTypeMap: {
        "31": "维修单"
    }
}
/**
 * 列标题定义 单据列表/单据明细
 */
const header = {
    main: {
        status: { zh: "状态", en: "", width: 100, align: "center", },
        billNo: { zh: "维修单号", en: "", width: 120, align: "center", },
        reportDate: { isExt: true, zh: "报修日期", en: "", width: 150, align: "center", },
        reportPersonName: { isExt: true, zh: "报修人", en: "", width: 120, align: "center", },
        assetNum: { isExt: true, zh: "报修数量", en: "", width: 100, align: "center", },
        operatePersonName: { zh: "经办人", en: "", width: 120, align: "center", },
        placeName: { isExt: true, zh: "送修位置", en: "", width: 120, align: "center", },
        finishDate: { isExt: true, zh: "完成日期", en: "", width: 150, align: "center", },
        content: { zh: "报修内容", width: 180, align: "center" },
    },
    detail: view_mock.header_assetList_billDetail
}
/**
 *  单据主表信息显示、编辑、新增,弹出页面表头使用
 */
const billMainTemplate = {
    reportPersonId: {
        required: true,
        desc: "报修人",
        type: "list",
        value: null,
        field_select: { value: "employeeId", display: "employeeName" },
        dataSource: [],
        updateDisable: true,
        useWidget: { widgetName: "employeePicker" }
    },
    operatePersonId: { desc: "经办人", value: null, forceDisable: true },
    reportDate: { desc: "报修日期", value: null, forceDisable: true },

    placeId: {
        required: true,
        desc: "送修地点",
        type: "tree",
        value: null,
        field_select: { value: "placeId", display: "placeName" },
        dataSource: [],
        updateDisable: true
    },
    status: {
        required: true,
        desc: "状态",
        type: "enum",
        value: null,
        dataSource: [
            { value: 0, text: "待审核" },
            { value: 1, text: "维修中" },
            { value: 2, text: "维修完成" }
        ]
    },
    finishDate: {
        desc: "完成日期",
        type: "dateTime",
        value: null
    },
    content: {
        required: true,
        desc: "报修内容",
        value: null,
        width: 2,
        updateDisable: true
    },
    remarks: {
        desc: "备注",
        value: null,
        type: "longText"
    }
}
/**
 * 单据列表界面高级筛选配置
 */
var filter = {
    items_input: {
        billNo: { desc: "报修单号", value: null },
    },
    items_select: {
        reportDate_start: {
            desc: "报修日期起",
            type: "dateTime",
            value: null
        },
        reportDate_end: {
            desc: "报修日期止",
            type: "dateTime",
            value: null
        },
        finishDate_start: {
            desc: "完成日期起",
            type: "dateTime",
            value: null
        },
        finishDate_end: {
            desc: "完成日期止",
            type: "dateTime",
            value: null
        },
        reportPersonId: {
            required: true,
            desc: "报修人",
            type: "list",
            value: null,
            field_select: { value: "employeeId", display: "employeeName" },
            dataSource: [],
        },
        operatePersonId: {
            required: true,
            desc: "经办人",
            type: "list",
            value: null,
            field_select: { value: "employeeId", display: "employeeName" },
            dataSource: [],
        },
        placeId: {
            desc: "送修位置",
            type: "tree",
            value: null,
            field_select: { value: "placeId", display: "placeName" },
            dataSource: null
        },
        status: {
            desc: "状态", type: "enum", value: null,
            dataSource: [
                { value: 0, text: "待审核" },
                { value: 1, text: "维修中" },
                { value: 2, text: "维修完成" }
            ]
        }
    }
}
module.exports.typeDef = typeDef;
module.exports.header = header;
module.exports.billMainTemplate = billMainTemplate;
module.exports.filter = filter;