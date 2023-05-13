const typeDef = {
    comment: "供应商信息",
    supplierType: [{ value: "厂家", text: "厂家" }, { value: "经销商", text: "经销商" }]
}
/**
 * 列标题定义 单据列表/单据明细
 */
const header = {
    main: {
        supplierId: { zh: "供应商编号", en: "", width: 150, align: "center", },
        supplierName: { zh: "供应商名称", en: "", width: 180, align: "center", },
        supplierType: { zh: "类型", en: "", width: 100, align: "center", },
        linkPerson: { zh: "联系人", en: "", width: 100, align: "center", },
        telNo: { zh: "电话", en: "", width: 180, align: "center" },
        email: { zh: "邮箱", en: "", width: 180, align: "center" },
        address: { zh: "地址", en: "", width: 120, align: "center", },
        product: { zh: "供应产品", en: "", width: 180, align: "center", },
        remarks: { zh: "备注", en: "", width: 150, align: "center", },
    }
}
/**
 *  单据主表信息显示、编辑、新增,弹出页面表头使用
 */
const objTemplate = {
    supplierId: { required: true, desc: "供应商编号", value: null, updateDisable: true },
    supplierName: { required: true, desc: "供应商名称", value: null, },
    supplierType: {
        required: true,
        desc: "厂家类型",
        type: "enum",
        value: null,
        dataSource: [{ value: "厂家", text: "厂家" }, { value: "经销商", text: "经销商" }]
    },
    linkPerson: { desc: "联系人", value: null },
    telNo: { desc: "电话", value: null, },
    email: { desc: "邮箱", value: null, },
    address: { desc: "联系地址", value: null, },
    product: { desc: "供应产品", value: null, },
    remarks: { desc: "备注", value: null, type: "longText" }
}
/**
 * 单据列表界面高级筛选配置
 */
var filter = {
    items_input: {
        supplierId: { desc: "供应商编号", value: null },
        supplierName: { desc: "处供应商名称", value: null },
        linkPerson: { desc: "联系人", value: null },
        telNo: { desc: "电话", value: null },
        email: { desc: "邮箱", value: null },
        address: { desc: "联系地址", value: null },

    },

    items_select: {
        supplierType: {
            desc: "供应商类型",
            type: "enum",
            dataSource: [{ value: "厂家", text: "厂家" }, { value: "经销商", text: "经销商" }]
        },
    }
}
module.exports.typeDef = typeDef;
module.exports.header = header;
module.exports.objTemplate = objTemplate;
module.exports.filter = filter;