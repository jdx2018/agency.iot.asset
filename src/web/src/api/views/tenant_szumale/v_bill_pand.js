const view_mock = require("../../mock/view_mock").view_mock;
const typeDef = {
    comment: "盘点单",
    prefix: "PD",
    status: {
        panding: { value: 0, desc: "未盘点" },
        notChecked: { value: 1, desc: "已盘点" },
        finished: { value: 2, desc: "已审核" }
    },
    statusMap: {
        "0": "未盘点",
        "1": "已盘点",
        "2": "已审核"
    },
    checkStatusMap: {
        "0": "待审核",
        "1": "已审核",
    }
}
/**
 * 列标题定义 单据列表/单据明细
 */
const header = {
    main: {

        status: { zh: "盘点单状态", en: "", width: 100, align: "center", },
        billNo: { zh: "盘点单号", en: "", width: 120, align: "center", },
        billName: { zh: "盘点单名称", en: "", width: 150, align: "center" },
        pdLossQty: { zh: "盘亏数量", en: "", width: 100, align: "center", },
        pdPersonName: { zh: "盘点人", en: "", width: 100, align: "center", },
        checkPersonName: { zh: "审核人", en: "", width: 100, align: "center" },
        createPersonName: { zh: "创建人", en: "", width: 120, align: "center", },
        createTime: { zh: "创建时间", en: "", width: 150, align: "center", }
    },
    detail: {
        // checkStatus: { zh: "审核状态", en: "", width: 120, align: "center", },
        // pandStatus: { zh: "盘点状态", en: "", width: 60, align: "center", },
        rowId: { zh: "序号", en: "", width: 100, align: "center" },
        useEmployeeName: { zh: "使用人", en: "", width: 120, align: "center" },
        useOrgName: { zh: "使用部门", en: "", width: 120, align: "center" },
        checkStatus: { zh: "审核状态", en: "", width: 100, align: "center", },
        status: { zh: "盘点状态", en: "", width: 100, align: "center", },
        assetId: { zh: "资产编号", en: "", width: 150, align: "center" },
        assetName: { zh: "资产名称", en: "", width: 150, align: "center" },
        placeName: { zh: "所在位置", en: "", width: 120, align: "center" },
        pdPerson: { zh: "盘点人", en: "", width: 120, align: "center", },
        checkPersonName: { zh: "审核人", en: "", width: 120, align: "center" },
        // checkTime: { zh: "审核时间", en: "", width: 120, align: "center", },
        remarks: { zh: "备注", en: "", width: 120, align: "center", }
    },
    asset: view_mock.header_assetList_all
}
/**
 *  单据主表信息显示、编辑、新增,弹出页面表头使用
 */
const objTemplate = {
    billName: {
        required: true,
        desc: "盘点单名称",
        value: null
    },
    pdPerson: {
        required: true,
        desc: "盘点人",
        value: null,
        field_select: { value: "employeeId", display: "employeeName" },
        type: "list",
        dataSource: [],
        useWidget: { widgetName: "employeePicker" }
    },
    checkPerson: {
        required: true,
        desc: "审核人",
        value: null,
        field_select: { value: "employeeId", display: "employeeName" },
        type: "list",
        dataSource: [],
        useWidget: { widgetName: "employeePicker" }
    },
    useOrgId: {
        required: false,
        desc: "使用部门",
        type: "tree",
        value: null,
        field_select: { value: "orgId", display: "orgName" },
        dataSource: []
    },
    placeId: {
        required: false,
        desc: "所在位置",
        type: "tree",
        value: null,
        field_select: { value: "placeId", display: "placeName" },
        dataSource: []
    },
    classId: {
        required: false,
        desc: "资产分类",
        type: "tree",
        value: null,
        field_select: { value: "classId", display: "className" },
        dataSource: []
    }
}
/**
 * 单据列表界面高级筛选配置
 */
var filter = {
    items_input: {
        billNo: { desc: "盘点单号", value: null },
        billName: { desc: "盘点单名称", value: null }
    },
    items_select: {
        createPerson: {
            desc: "创建人",
            value: null,
            field_select: { value: "employeeId", display: "employeeName" },
            type: "list",
            dataSource: []
        },
        pdPerson: {
            desc: "盘点人",
            value: null,
            field_select: { value: "employeeId", display: "employeeName" },
            type: "list",
            dataSource: []
        },
        checkPerson: {
            desc: "审核人",
            value: null,
            field_select: { value: "employeeId", display: "employeeName" },
            type: "list",
            dataSource: []
        },
        status: {
            desc: "盘点状态", type: "enum", value: null,
            dataSource: [
                { value: 0, text: "盘点中" },
                { value: 1, text: "待审核" },
                { value: 2, text: "审核完成" }
            ]
        },
        createTime_start: {
            desc: "创建时间起",
            type: "dateTime",
            value: null
        },
        createTime_end: {
            desc: "创建时间止",
            type: "dateTime",
            value: null
        }

    }
}
var filterDetail = {
    items_input: {
        assetId: { desc: "资产编号", value: null },
        assetName: { desc: "资产名称", value: null }
    },
    items_select: {
        useEmployeeId: {
            required: false,
            desc: "使用人",
            type: "list",
            value: null,
            field_select: { value: "employeeId", display: "employeeName" },
            dataSource: [],
            setRelated: { objectName: "useOrgId", fieldName: "orgId" }
        },
        useOrgId: {
            desc: "使用部门",
            type: "tree",
            value: null,
            field_select: { value: "orgId", display: "orgName" },
            dataSource: []

        },
        placeId: {
            desc: "资产位置",
            type: "tree",
            value: null,
            field_select: { value: "placeId", display: "placeName" },
            dataSource: []
        },
        classId: {
            desc: "资产分类",
            type: "tree",
            field_select: { value: "classId", display: "className" }
        },
        status: {
            desc: "盘点状态", type: "enum", value: null,
            dataSource: [
                { value: 0, text: "未盘点" },
                { value: 1, text: "已盘点" },
            ]
        }
    }

}
module.exports.typeDef = typeDef;
module.exports.header = header;
module.exports.objTemplate = objTemplate;
module.exports.filter = filter;
module.exports.filterDetail = filterDetail;