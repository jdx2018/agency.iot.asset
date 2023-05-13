const typeDef = {
    comment: "耗材退库",
    type: 21,
    prefix: "TK",
    extMap: {
        ext1: "materialNum",
        ext7: "returnDate",
        ext11: "returnEmployeeId",
        ext12: "returnOrgId",
    },
    fieldMap: {
        materialNum: "ext1",
        returnDate: "ext7",
        returnEmployeeId: "ext11",
        returnOrgId: "ext12"

    },
    status: {
        initial: { value: 1, desc: "退库完成" }//领用完成
    },
    statusMap: {
        "1": "退库完成"
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
        returnDate: {  zh: "退库日期", en: "", width: 120, align: "center", },
        returnEmployeeName:{ zh: "退库员工", en: "", width: 120, align: "center", },
        returnOrgName:{ zh: "退库部门", en: "", width: 120, align: "center", },
        materialNum: {  zh: "退库物料", en: "", width: 100, align: "center", },
        // materialPlace: {  zh: "退库后位置", en: "", width: 160, align: "center", },
        operatePersonName: { zh: "经办人", en: "", width: 100, align: "center", },
        createTime: { zh: "创建时间", en: "", width: 150, align: "center" },
        remarks: { zh: "备注", en: "", width: 120, align: "center", }
    },
    detail: {
        materialId: { zh: "耗材编号", en: "", width: 100, align: "center", },
        materialName: { zh: "耗材名称", en: "", width: 100, align: "center", },
        qty: { zh: "退库", en: "", width: 100, align: "center", editEnable: true },
        storageQty: { zh: "库存数量", en: "", width: 100, align: "center", },
        materialClass: { zh: "分类", en: "", width: 100, align: "center", },
        materialPlace: { zh: "存放位置", en: "", width: 100, align: "center", },
        brand: { zh: "品牌", en: "", width: 100, align: "center", },
        spec: { zh: "规格", en: "", width: 100, align: "center", },
        supplierName: { zh: "供应商", en: "", width: 100, align: "center", },
        unit: { zh: "计量单位", en: "", width: 100, align: "center", },
    }
}
/**
 *  单据主表信息显示、编辑、新增,弹出页面表头使用
 */
const billMainTemplate = {
    operatePersonId: { desc: "处理人", value: null, forceDisable: true },
    returnDate: {
        required: true,
        desc: "退库日期",
        type: "dateTime",
        value: null
    },
    returnEmployeeId: {
        required: true,
        desc: "退库员工",
        type: "list",
        value: null,
        field_select: { value: "employeeId", display: "employeeName" },
        dataSource: [],
        setRelated: { objectName: "returnOrgId", fieldName: "orgId" },
        useWidget: { widgetName: "employeePicker" }
    },
    returnOrgId: {
        required: true,
        forceDisable: true,
        desc: "退库部门",
        type: "tree",
        value: null,
        field_select: { value: "orgId", display: "orgName" },
        dataSource: []
    },
    // materialPlace: {
    //     required: true,
    //     desc: "退库后位置",
    //     type: "enum_input",
    //     value: null,
    //     dataSource: []
    // },
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
        returnEmployeeId: {
            required: true,
            desc: "退库员工",
            type: "list",
            value: null,
            field_select: { value: "employeeId", display: "employeeName" },
            dataSource: [],
            setRelated: { objectName: "useOrgId", fieldName: "orgId" },
            useWidget: { widgetName: "employeePicker" }
        },
        // materialPlace: {
        //     desc: "所在位置",
        //     type: "enum",
        //     value: null,
        //     dataSource: null
        // },
    }
}
module.exports.typeDef = typeDef;
module.exports.header = header;
module.exports.billMainTemplate = billMainTemplate;
module.exports.filter = filter;