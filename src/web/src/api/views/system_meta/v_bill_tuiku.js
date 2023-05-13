const view_mock = require("../../mock/view_mock").view_mock;
const typeDef = {
    comment: "退库",
    type: 21,
    prefix: "TK",
    extMap: {
        ext1: "assetNum",
        ext7: "returnDate",
        ext10: "placeId",
        ext11: "managerId",
        ext12: "ownOrgId",
    },
    fieldMap: {
        assetNum: "ext1",
        returnDate: "ext7",
        placeId: "ext10",
        managerId: "ext11",
        ownOrgId: "ext12",
    },
    status: {
        initial: { value: 0, desc: "待审核" },//领用完成
        final: { value: 1, desc: "已完成" }
    },
    statusMap: {
        "0": "待审核",
        "1": "已完成"
    },
    billTypeMap: {
        "21": "退库单"
    }
}
/**
 * 列标题定义 单据列表/单据明细
 */
const header = {
    main: {
        status: { zh: "单据状态", en: "", width: 100, align: "center", },
        billNo: { zh: "退库单号", en: "", width: 100, align: "center", },
        assetNum: { isExt: true, zh: "退库数量", en: "", width: 100, align: "center", },
        returnDate: { isExt: true, zh: "退库日期", en: "", width: 120, align: "center", },

        employeeName: { zh: "管理员", en: "", width: 100, align: "center", },
        ownOrgName: { isExt: true, zh: "所属部门", en: "", width: 120, align: "center", },
        placeName: { isExt: true, zh: "所在位置", en: "", width: 120, align: "center", },
        createTime: { zh: "创建时间", en: "", width: 150, align: "center" },
        remarks: { zh: "备注", en: "", width: 120, align: "center", }
    },
    detail: view_mock.header_assetList_billDetail
}
/**
 *  单据主表信息显示、编辑、新增,弹出页面表头使用
 */
const billMainTemplate = {
    operatePersonId: { desc: "处理人", value: null, forceDisable: true },
    managerId: {
        required: true,
        desc: "管理员",
        type: "list",
        value: null,
        field_select: { value: "employeeId", display: "employeeName" },
        dataSource: [],
        useWidget: { widgetName: "employeePicker" }
    },
    returnDate: {
        required: true,
        desc: "退库日期",
        type: "dateTime",
        value: null
    },
    ownOrgId: {
        required: true,
        desc: "退库后部门",
        type: "tree",
        value: null,
        field_select: { value: "orgId", display: "orgName" },
        dataSource: []
    },
    placeId: {
        required: true,
        desc: "退库后位置",
        type: "tree",
        value: null,
        field_select: { value: "placeId", display: "placeName" },
        dataSource: []
    },

    remarks: { desc: "退库备注", value: null, type: "longText" }
}
/**
 * 单据列表界面高级筛选配置
 */
var filter = {
    items_input: {
        billNo: { desc: "退库单号", value: null }
    },
    items_select: {
        returnDate_start: {
            desc: "退库日期起",
            type: "dateTime",
            value: null
        },
        returnDate_end: {
            desc: "退库日期止",
            type: "dateTime",
            value: null
        },
        employeeId: {
            required: true,
            desc: "管理员",
            type: "list",
            value: null,
            field_select: { value: "employeeId", display: "employeeName" },
            dataSource: []
        },
        placeId: {
            desc: "所在位置",
            type: "tree",
            value: null,
            field_select: { value: "placeId", display: "placeName" },
            dataSource: null
        },
        ownOrgId: {
            desc: "所属部门",
            type: "tree",
            value: null,
            field_select: { value: "orgId", display: "orgName" },
            dataSource: null
        }
    }
}
module.exports.typeDef = typeDef;
module.exports.header = header;
module.exports.billMainTemplate = billMainTemplate;
module.exports.filter = filter;