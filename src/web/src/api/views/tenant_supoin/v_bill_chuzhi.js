const view_mock = require("../../mock/view_mock").view_mock;
const typeDef = {
    comment: "处置单",
    type: 32,
    prefix: "CZ",
    extMap: {
        ext1: "assetNum",
        ext7: "finishDate",
        ext10: "disposedType",
        ext11: "employeeId",//处置人
    },
    fieldMap: {
        assetNum: "ext1",
        finishDate: "ext7",
        disposedType: "ext10",
        employeeId: "ext11",
    },
    status: {
        initial: { value: 1, desc: "处置完成" },
        canceled: { value: 9, desc: "已取消" },

    },
    statusMap: {
        "1": "处置完成",
        "9": "已取消"
    },
    disposedTypeMap: {
        "0": "报废清理",
        "1": "损坏清理"
    },
    billTypeMap: {
        "32": "处置单"
    }
}
/**
 * 列标题定义 单据列表/单据明细
 */
const header = {
    main: {
        status: { zh: "处置状态", en: "", width: 100, align: "center", },
        billNo: { zh: "处置单号", en: "", width: 120, align: "center", },
        disposedType: { isExt: true, zh: "处置类型", en: "", width: 100, align: "center", },
        assetNum: { isExt: true, zh: "处置数量", en: "", width: 100, align: "center", },
        remarks: { zh: "处置说明", width: 180, align: "center" },
        operatePerson: { zh: "经办人", en: "", width: 120, align: "center", },
        disposedPerson: { zh: "处置人", en: "", width: 120, align: "center", },
        finishDate: { isExt: true, zh: "完成日期", en: "", width: 150, align: "center", },
    },
    detail: view_mock.header_assetList_billDetail
}
/**
 *  单据主表信息显示、编辑、新增,弹出页面表头使用
 */
const billMainTemplate = {
    employeeId: {
        required: true,
        desc: "处置人",
        type: "list",
        value: null,
        field_select: { value: "employeeId", display: "employeeName" },
        dataSource: [],
        setRelated: { objectName: "useOrgId", fieldName: "orgId" },
        useWidget: { widgetName: "employeePicker" }
    },
    createTime: { desc: "创建日期", value: null, forceDisable: true },
    disposedType: {
        required: true,
        desc: "处置类型",
        type: "enum",
        dataSource: [
            { value: "0", text: "报废清理" },
            { value: "1", text: "损坏清理" }
        ]
    },
    operatePersonId: { desc: "经办人", value: null, forceDisable: true },
    finishDate: {
        required: true,
        desc: "处置日期",
        type: "dateTime",
        value: null
    },
    remarks: { required: false, desc: "处置说明", value: null, type: "longText" }
}
/**
 * 单据列表界面高级筛选配置
 */
var filter = {
    items_input: {
        billNo: { desc: "处置单号", value: null },

    },

    items_select: {
        finishDate_start: {
            desc: "处置日期起",
            type: "dateTime",
            value: null
        },
        finishDate_end: {
            desc: "处置日期止",
            type: "dateTime",
            value: null
        },
        operatePersonId: {
            required: true,
            desc: "经办人",
            type: "list",
            value: null,
            field_select: { value: "employeeId", display: "employeeName" },
            dataSource: [],
        },
        employeeId: {
            required: true,
            desc: "处置人",
            type: "list",
            value: null,
            field_select: { value: "employeeId", display: "employeeName" },
            dataSource: [],
        },
        disposedType: {
            required: true,
            desc: "处置类型",
            type: "enum",
            dataSource: [
                { value: "0", text: "报废清理" },
                { value: "1", text: "损坏清理" }
            ]
        },
    }
}
module.exports.typeDef = typeDef;
module.exports.header = header;
module.exports.billMainTemplate = billMainTemplate;
module.exports.filter = filter;