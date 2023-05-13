const typeDef = {
    comment: "付款列表",
    type: 100,
    prefix: "FK",
    status: {
        initial: { value: 0, desc: "待审核" },
        final: { value: 1, desc: "已审核" }//领用完成
    },
    statusMap: {
        "0": "待审核",
        "1": "已审核"
    },
    billTypeMap: {
        "100": "付款列表"
    },
}
/**
 * 列标题定义 单据列表/单据明细
 */
const header = {
    main: {
        // status: { zh: "单据状态", en: "", width: 100, align: "center", },
        billNo: { zh: "付款单编号", en: "", width: 150, align: "center", },
        supplierId: { zh: "供应商编号", en: "", width: 150, align: "center", },
        supplierName: { zh: "供应商名称", en: "", width: 200, align: "center", },
        linkPerson: { zh: "联系人", en: "", width: 100, align: "center", },
        payableAmount: { zh: "应付金额", en: "", width: 100, align: "center", },
        amount: { zh: "本次付款金额", en: "", width: 150, align: "center", },
        payDate: { zh: "付款日期", en: "", width: 100, align: "center" },
        remarks: { zh: "备注", en: "", width: 150, align: "center", },

    }
}
/**
 *  单据主表信息显示、编辑、新增,弹出页面表头使用
 */
const objTemplate = {
    supplierId: {
        required: true,
        forceDisable: true,
        desc: "供应商",
        type: "list",
        value: null,
        field_select: { value: "supplierId", display: "supplierName" },
        dataSource: [],
        setRelated: { objectName: "payableAmount", fieldName: "payableAmount" },
    },
    payableAmount: {
        required: true,
        forceDisable: true,
        desc: "应付金额",
        value: null,
    },
    amount: {
        required: true,
        desc: "本次付款金额",
        value: null,
    },
    payDate: {
        required: true,
        desc: "付款日期",
        type: "dateTime",
        value: null
    },
    operatePersonId: { desc: "经办人", value: null, forceDisable: true },
    remarks: { desc: "备注", value: null },

}

/**
 * 单据列表界面高级筛选配置
 */
var filter = {
    items_input: {
        billNo: { desc: "付款日期", value: null },
        linkPerson: { desc: "联系人", value: null },
        // employeeId: { desc: "领用人", value: null }
    },
    items_select: {
        supplierId: {
            required: true,
            desc: "供应商",
            type: "list",
            value: null,
            field_select: { value: "supplierId", display: "supplierName" },
            dataSource: [],
        },
        payDate_start: {
            required: true,
            desc: "付款日期-起",
            type: "dateTime",
            value: null,
        },
        payDate_end: {
            required: true,
            desc: "付款日期-止",
            type: "dateTime",
            value: null,
        },

    }
}
module.exports.typeDef = typeDef;
module.exports.header = header;
module.exports.filter = filter;
module.exports.objTemplate = objTemplate;