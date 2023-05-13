const view_mock = require("../../mock/view_mock").view_mock;
const typeDef = {
    comment: "领用单",
    type: 11,
    prefix: "PF",
    extMap: {
        ext1:"assetNum",
        ext7: "useDate",
        ext10: "placeId",
        ext11: "employeeId",
        ext12: "useOrgId",
    },
    fieldMap: {
        assetNum:"ext1",
        useDate: "ext7",
        placeId: "ext10",
        employeeId: "ext11",
        useOrgId: "ext12",
    },
    status: {
        initial: { value: 1, desc: "已完成" }//领用完成
    },
    statusMap: {
        "1": "已完成"
    },
    billTypeMap: {
        "11": "领用单"
    }
}
/**
 * 列标题定义 单据列表/单据明细
 */
const header = {
    main: {
        status: { zh: "单据状态", en: "", width: 90, align: "center", },
        billNo: { zh: "领用单号", en: "", width: 100, align: "center", },
        useDate: { isExt: true, zh: "领用日期", en: "", width: 120, align: "center", },
        employeeName: { isExt: true, zh: "领用人", en: "", width: 120, align: "center", },
       
        placeName: { isExt: true, zh: "领用后位置", en: "", width: 120, align: "center", },
        assetNum:{isExt:true,zh: "资产数量", en: "", width: 100, align: "center", },
        createTime:{ zh: "创建时间", en: "", width: 150, align: "center" },
    },
    detail: view_mock.header_assetList_billDetail
}
/**
 *  单据主表信息显示、编辑、新增,弹出页面表头使用
 */
const billMainTemplate = {
    employeeId: {
        required: true,
        desc: "领用人",
        type: "list",
        value: null,
        field_select: { value: "employeeId", display: "employeeName" },
        dataSource: [],
        setRelated: { objectName: "useOrgId", fieldName: "orgId" },
        useWidget: { widgetName: "employeePicker" }
    },
    useDate: {
        required: true,
        desc: "领用日期",
        type: "dateTime",
        value: null
    },
    placeId: {
        required: true,
        desc: "领用后位置",
        type: "tree",
        value: null,
        field_select: { value: "placeId", display: "placeName" },
        dataSource: []
    },
    useOrgId: {
        required: true,
        forceDisable:true,
        desc: "使用部门",
        type: "tree",
        value: null,
        field_select: { value: "orgId", display: "orgName" },
        dataSource: []
    },
    operatePersonId: { desc: "处理人", value: null, forceDisable: true },
    remarks: { desc: "领用备注", value: null, type: "longText" }
}
/**
 * 单据列表界面高级筛选配置
 */
var filter = {
    items_input: {
        billNo: { desc: "领用单号", value: null },
        // employeeId: { desc: "领用人", value: null }
    },
    items_select: {
        useDate_start: {
            desc: "领用日期起",
            type: "dateTime",
            value: null
        },
        useDate_end: {
            desc: "领用日期止",
            type: "dateTime",
            value: null
        },
        employeeId:{
            desc: "领用人",
            type: "list",
            value: null,
            field_select: { value: "employeeId", display: "employeeName" },
            dataSource: [],
        },
        placeId: {
            desc: "领用后位置",
            type: "tree",
            value: null,
            field_select: { value: "placeId", display: "placeName" },
            dataSource: null
        },
  
        // status: {
        //     desc: "状态", type: "enum", value: null,
        //     dataSource: [
        //         { value: 0, text: "待审批" },
        //         { value: 1, text: "领用完成" }
        //     ]
        // }
    }
}
module.exports.typeDef = typeDef;
module.exports.header = header;
module.exports.billMainTemplate = billMainTemplate;
module.exports.filter = filter;