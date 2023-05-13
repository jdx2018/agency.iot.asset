const typeDef = {
    comment: "耗材入库单",
    type: 10,
    prefix: "RK",
    extMap: {
        ext1: "materialNum",
        ext7: "inDate",
    },
    fieldMap: {
        materialNum: "ext1",
        inDate: "ext7",
    },
    status: {
        initial: { value: 0, desc: "待审核" },
        final: { value: 1, desc: "已入库" },//领用完成
        canceled: { value: 9, desc: "已取消" }
    },
    statusMap: {
        "0": "待入库",
        "1": "已入库",
        "9":"已取消"
    },
    billTypeMap: {
        "10": "耗材入库单"
    }
}
/**
 * 列标题定义 单据列表/单据明细
 */
const header = {
    main: {
        status: { zh: "单据状态", en: "", width: 90, align: "center", },
        billNo: { zh: "入库单号", en: "", width: 100, align: "center", },
        inDate: { zh: "入库日期", en: "", width: 120, align: "center", },
        materialNum: { zh: "入库物料", en: "", width: 100, align: "center", },
        operatePersonName: { zh: "经办人", en: "", width: 100, align: "center", },
        createTime: { zh: "创建时间", en: "", width: 150, align: "center" },
    },
    detail: {
        materialId: { zh: "耗材编号", en: "", width: 100, align: "center", },
        materialName: { zh: "耗材名称", en: "", width: 100, align: "center", },
        qty: { zh: "入库数量", en: "", width: 100, align: "center", editEnable: true },
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
    inDate: {
        required: true,
        desc: "入库日期",
        type: "dateTime",
        value: null
    },
    operatePersonId: { desc: "经办人", value: null, forceDisable: true },
    remarks: { desc: "备注", value: null, type: "longText" }
}
/**
 * 单据列表界面高级筛选配置
 */
var filter = {
    items_input: {
        billNo: { desc: "入库单号", value: null },
        // employeeId: { desc: "领用人", value: null }
    },
    items_select: {
        inDate_start: {
            desc: "入库日期起",
            type: "dateTime",
            value: null
        },
        inDate_end: {
            desc: "入库日期止",
            type: "dateTime",
            value: null
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