const typeDef = {
    comment: "耗材列表",
    statusMap: {
        "0": "停用",
        "1": "启用",
        "11": "处置完成"
    }
}
const header = {
    main: {
        status: { zh: "耗材状态", en: "", width: 100, align: "center", },
        materialId: { zh: "耗材编号", en: "", width: 100, align: "center", },
        materialName: { zh: "耗材名称", en: "", width: 100, align: "center", },
        materialClass: { zh: "分类", en: "", width: 100, align: "center", },
        materialPlace: { zh: "存放位置", en: "", width: 100, align: "center", },
        brand: { zh: "品牌", en: "", width: 100, align: "center", },
        spec: { zh: "规格", en: "", width: 100, align: "center", },
        supplierName: { zh: "供应商", en: "", width: 100, align: "center", },
        unit: { zh: "计量单位", en: "", width: 100, align: "center", },
        storageQty: { zh: "库存数量", en: "", width: 100, align: "center", },
        safeQty: { zh: "安全库存", en: "", width: 100, align: "center", },
        createPerson: { zh: "创建人", en: "", width: 100, align: "center", },
        createTime: { zh: "创建时间", en: "", width: 160, align: "center", },
        updatePerson: { zh: "更新人", en: "", width: 300, align: "center", },
        updateTime: { zh: "更新时间", en: "", width: 160, align: "center", },
    },
    detail: {
        materialId: { zh: "耗材编号", en: "", width: 100, align: "center", },
        materialName: { zh: "耗材名称", en: "", width: 100, align: "center", },
        qty: { zh: "数量", en: "", width: 100, align: "center", editEnable: true },
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
 * 资产列表界面高级筛选配置
 */
var filter = {
    items_input: {
        materialId: { desc: "耗材编号", value: null },
        materialName: { desc: "耗材名称", value: null },
    },
    items_select: {
        createPerson: {
            desc: "创建人",
            type: "list",
            value: null,
            field_select: { value: "employeeId", display: "employeeName" },
            dataSource: []
        },
        materialClass: {
            desc: "耗材分类",
            type: "enum",
            value: null,
            dataSource: []
        },
        materialPlace: {
            desc: "存放位置",
            type: "enum",
            value: null,
            dataSource: []
        },
        brand: {
            desc: "品牌",
            type: "enum",
            value: null,
            dataSource: []
        },
        status: {
            desc: "状态", type: "enum", value: null,
            dataSource: [
                { value: 0, text: "停用" },
                { value: 1, text: "启用" },
                { value: 11, text: "处置完成" },

            ]
        },

    }
}
const objTemplate = {
    materialId: {
        required: false,
        desc: "耗材编号",
        value: null,
    },
    materialName: {
        required: true,
        desc: "名称",
        value: null,
    },
    materialClass: {
        required: true,
        desc: "分类",
        type: "enum_input",
        value: null,
        dataSource: []
    },
    materialPlace: {
        required: true,
        desc: "存放位置",
        type: "enum_input",
        value: null,
        dataSource: []
    },
    supplierId: {
        required: true,
        desc: "供应商",
        type: "list",
        value: null,
        field_select: { value: "supplierId", display: "supplierName" },
        dataSource: [],
    },
    brand: {
        required: false,
        desc: "品牌",
        type: "enum_input",
        value: null,
        dataSource: []
    },
    spec: {
        required: false,
        desc: "规格",
        value: null,
    },
    unit: {
        required: false,
        desc: "计量单位",
        value: null,
    },
    storageQty: {
        required: false,
        desc: "库存数量",
        value: null,
        updateDisable: true,
    },
    safeQty: {
        required: false,
        desc: "安全库存",
        value: null,
    },
    status: {
        required: true,
        desc: "状态",
        type: "enum",
        value: 1,
        dataSource: [
            { value: 0, text: "停用" },
            { value: 1, text: "启用" },
            { value: 11, text: "处置完成" },

        ]
    },
}
module.exports.typeDef = typeDef;
module.exports.filter = filter;
module.exports.header = header;
module.exports.objTemplate = objTemplate;