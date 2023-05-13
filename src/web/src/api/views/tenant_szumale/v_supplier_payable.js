const typeDef = {
    comment: "应付列表",
    type: 99,
    prefix: "PB",
    status: {
        initial: { value: 0, desc: "待审核" },
        final: { value: 1, desc: "已审核" }//领用完成
    },
    statusMap: {
        "0": "待审核",
        "1": "已审核"
    },
    billTypeMap: {
        "99": "应付款列表"
    },
}
/**
 * 列标题定义 单据列表/单据明细
 */
const header = {
    main: {
        supplierId: { zh: "供应商编号", en: "", width: 150, align: "center", },
        supplierName: { zh: "供应商名称", en: "", width: 150, align: "center", },
        linkPerson: { zh: "联系人", en: "", width: 100, align: "center", },
        payableAmount: { zh: "应付金额", en: "", width: 120, align: "center", },
        remarks: { zh: "备注", en: "", width: 150, align: "center", },
        updateTime: { zh: "更新时间", en: "", width: 150, align: "center" },
    },
    detail: {

        supplierId: { zh: "供应商编号", en: "", width: 150, align: "center", },
        supplierName: { zh: "供应商名称", en: "", width: 150, align: "center", },
        linkPerson: { zh: "联系人", en: "", width: 100, align: "center", },
        billNo: { zh: "采购单号", en: "", width: 150, align: "center", },
        payableAmount: { zh: "应付金额", en: "", width: 120, align: "center", },
        reqEmployeeName: { zh: "申请人", en: "", width: 150, align: "center", },
        reqDate: { zh: "申请日期", en: "", width: 150, align: "center", },
        remarks: { zh: "备注", en: "", width: 150, align: "center", },
    }
}

/**
 * 单据列表界面高级筛选配置
 */
var filter = {
    items_input: {
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

    }
}
module.exports.typeDef = typeDef;
module.exports.header = header;
module.exports.filter = filter;