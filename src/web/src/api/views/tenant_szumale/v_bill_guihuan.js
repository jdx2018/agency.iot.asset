const view_mock = require("../../mock/view_mock").view_mock;
const typeDef = {
    comment: "归还单",
    type: 22,
    prefix: "GH",
    extMap: {
        ext1: "assetNum",
        ext7: "returnDate",
        ext10: "placeId",
        ext11: "returnEmployeeId",
        ext12: "ownOrgId",
    },
    fieldMap: {
        assetNum: "ext1",
        returnDate: "ext7",
        placeId: "ext10",
        returnEmployeeId: "ext11",
        ownOrgId: "ext12"
    },
    status: {
        initial: { value: 0, desc: "待审核" },
        final: { value: 1, desc: "已完成" },
    },
    statusMap: {
        "0": "待审核",
        "1": "已完成"
    },
    billTypeMap: {
        "22": "归还单"
    }
}
/**
 * 列标题定义 单据列表/单据明细
 */
const header = {
    main: {
        status: { zh: "单据状态", en: "", width: 100, align: "center" },
        billNo: { zh: "单据编号", en: "", width: 150, align: "center", },
        assetNum: { zh: "归还数量", en: "", width: 100, align: "center", },
        returnDate: { zh: "归还日期", en: "", width: 100, align: "center" },
        employeeName: { zh: "归还人", en: "", width: 150, align: "center", },
        placeName: { zh: "归还后位置", en: "", width: 150, align: "center", },
        ownOrgName: { zh: "所属部门", en: "", width: 160, align: "center" },
        createTime: { zh: "创建时间", en: "", width: 150, align: "center" },
        remarks: { zh: "备注", en: "", width: 200, align: "center", }
    },
    detail: view_mock.header_assetList_billDetail
}
/**
 *  单据主表信息显示、编辑、新增,弹出页面表头使用
 */
const billMainTemplate = {
    returnEmployeeId: {
        required: true,
        desc: "归还人",
        type: "list",
        value: null,
        field_select: { value: "employeeId", display: "employeeName" },
        dataSource: [],
        useWidget: { widgetName: "employeePicker" }
    },
    returnDate: {
        required: true,
        desc: "归还日期",
        type: "dateTime",
        value: null
    },
    ownOrgId: {
        required: true,
        desc: "归还后部门",
        type: "tree",
        value: null,
        field_select: { value: "orgId", display: "orgName" },
        dataSource: []
    },
    placeId: {
        required: true,
        desc: "归还后位置",
        type: "tree",
        value: null,
        field_select: { value: "placeId", display: "placeName" },
        dataSource: []
    },

    operatePersonId: { desc: "处理人", value: null, forceDisable: true },
    remarks: { desc: "备注", value: null, type: "longText" }
}
/**
 * 单据列表界面高级筛选配置
 */
var filter = {
    items_input: {
        billNo: { desc: "归还单号", value: null }
    },
    items_select: {
        returnDate_start: {
            desc: "归还日期起",
            type: "dateTime",
            value: null
        },
        returnDate_end: {
            desc: "归还日期止",
            type: "dateTime",
            value: null
        },
        returnEmployeeId: {
            desc: "归还人",
            type: "list",
            value: null,
            field_select: { value: "employeeId", display: "employeeName" },
            dataSource: [],
        },
        ownOrgId: {
            desc: "所属部门",
            type: "tree",
            value: null,
            field_select: { value: "orgId", display: "orgName" },
            dataSource: null
        },
        placeId: {
            desc: "归还后位置",
            type: "tree",
            value: null,
            field_select: { value: "placeId", display: "placeName" },
            dataSource: null
        }
    }
}
module.exports.typeDef = typeDef;
module.exports.header = header;
module.exports.billMainTemplate = billMainTemplate;
module.exports.filter = filter;