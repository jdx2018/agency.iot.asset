const typeDef = {
    comment: "耗材出库单",
    type: 11,
    prefix: "CK",
    extMap: {
        ext1: "materialNum",
        ext7: "useDate",
        ext10: "useEmployeeId",
        ext11: "useOrgId",
    },
    fieldMap: {
        materialNum: "ext1",
        useDate: "ext7",
        useEmployeeId: "ext10",
        useOrgId: "ext11"
    },
    status: {
        initial: { value: 1, desc: "出库完成" }//领用完成
    },
    statusMap: {
        "1": "出库完成"
    },
    billTypeMap: {
        "11": "出库单"
    }
}
/**
 * 列标题定义 单据列表/单据明细
 */
const header = {
    main: {
        status: { zh: "单据状态", en: "", width: 90, align: "center", },
        billNo: { zh: "出库单号", en: "", width: 100, align: "center", },
        useDate: { zh: "领用日期", en: "", width: 120, align: "center", },
        useEmployeeName: { zh: "领用人", en: "", width: 120, align: "center", },
        useOrgName: { zh: "领用部门", en: "", width: 120, align: "center", },
        materialNum: { zh: "领用物料", en: "", width: 100, align: "center", },
        operatePersonName: { zh: "经办人", en: "", width: 100, align: "center", },
        createTime: { zh: "创建时间", en: "", width: 150, align: "center" },
    },
    detail: {
        billNo: { zh: "采购单号", en: "", width: 100, align: "center", },
        materialId: { zh: "耗材编号", en: "", width: 100, align: "center", },
        materialName: { zh: "耗材名称", en: "", width: 100, align: "center", },
        qty: { zh: "领用数量", en: "", width: 100, align: "center", editEnable: true },
        storageQty: { zh: "库存数量", en: "", width: 100, align: "center", },
        orderQty: { zh: "采购数量", en: "", width: 100, align: "center", },
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
    useEmployeeId: {
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
    useOrgId: {
        required: true,
        desc: "使用部门",
        type: "tree",
        value: null,
        field_select: { value: "orgId", display: "orgName" },
        dataSource: []
    },
    operatePersonId: { desc: "经办人", value: null, forceDisable: true },
    remarks: { desc: "备注", value: null, type: "longText" }
}
/**
 * 单据列表界面高级筛选配置
 */
var filter = {
    items_input: {
        billNo: { desc: "出库单号", value: null },
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
        useEmployeeId: {
            desc: "领用人",
            type: "list",
            value: null,
            field_select: { value: "employeeId", display: "employeeName" },
            dataSource: [],
        }



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