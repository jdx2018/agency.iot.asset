const typeDef = {
    comment: '采购申请单',
    type: 90,
    prefix: 'PO',
    status: {
        initial: { value: 0, desc: '待审核' },
        final: { value: 1, desc: '已审核' }, //领用完成
    },
    statusMap: {
        0: '待审核',
        1: '已审核',
    },
    purchaseTypeMap: {
        0: '采购',
        1: '租赁',
        2: '捐赠',
        3: '划拨',
        4: '借入',
        5: '其他',
    },
    billTypeMap: {
        90: '采购申请单',
    },
    material_statusMap: {
        0: '停用',
        1: '启用',
        11: '处置完成',
    },
    payStatus: {
        initial: { value: 0, desc: '未付款' },
        finish: { value: 1, desc: '已付款' },
    },
    payStatusMap: {
        0: '未付款',
        1: '已付款',
    },
};
/**
 * 列标题定义 单据列表/单据明细
 */
const header = {
    main: {
        status: { zh: "单据状态", en: "", width: 100, align: "center", },
        billNo: { zh: "单据编号", en: "", width: 100, align: "center", },
        reqEmployeeName: { zh: "申请人", en: "", width: 100, align: "center", },
        reqOrgName: { zh: "申请部门", en: "", width: 120, align: "center", },
        reqDate: { zh: "申请日期", en: "", width: 150, align: "center", },
        purchaseType: { zh: "采购类型", en: "", width: 100, align: "center", },
        placeName: { zh: "入库位置", en: "", width: 100, align: "center", },
        amount: { zh: "金额合计", en: "", width: 100, align: "center", },
        operatePersonName: { zh: "经办人", en: "", width: 100, align: "center", },
        createTime: { zh: "创建时间", en: "", width: 150, align: "center" },
    },
    detail: {
        asset: {
            classId: { zh: "分类编号", en: "", width: 100, align: "center", },
            className: { zh: "分类", en: "", width: 100, align: "center", },
            assetName: { zh: "资产名称", en: "", width: 100, align: "center", },
            orderQty: { zh: "采购数量", en: "", width: 100, align: "center", editEnable: true },
            useQty: { zh: "实发数量", en: "", width: 100, align: "center", },
            orderPrice: { zh: "采购单价", en: "", width: 100, align: "center", editEnable: true },

            amount: { zh: '采购金额', en: '', width: 100, align: 'center', editEnable: true },
            brand: { zh: '品牌', en: '', width: 100, align: 'center' },
            spec: { zh: '规格', en: '', width: 100, align: 'center' },
            unit: { zh: '单位', en: '', width: 100, align: 'center' },
            storageQty: { zh: '库存数量', en: '', width: 100, align: 'center' },

            brand: { zh: '品牌', en: '', width: 100, align: 'center' },
            supplierId: { zh: '供应商编号', en: '', width: 100, align: 'center' },
            supplierName: { zh: '供应商名称', en: '', width: 100, align: 'center' },
            serviceLife: { zh: '使用年限', en: '', width: 100, align: 'center' },
            linkPerson: { zh: '联系人', en: '', width: 100, align: 'center' },

            telNo: { zh: '联系方式', en: '', width: 100, align: 'center' },
            invoiceType: { zh: '发票类型', en: '', width: 100, align: 'center' },
            invoiceRate: { zh: '发票税率', en: '', width: 100, align: 'center' },
            useDesc: { zh: '使用说明', en: '', width: 150, align: 'center' },
            remarks: { zh: '备注', en: '', width: 150, align: 'center' },
        },
        material: {
            materialId: { zh: "耗材编号", en: "", width: 100, align: "center", },
            materialClass: { zh: "分类", en: "", width: 100, align: "center", },
            materialName: { zh: "耗材名称", en: "", width: 100, align: "center", },
            orderQty: { zh: "采购数量", en: "", width: 100, align: "center", editEnable: true },
            useQty: { zh: "实发数量", en: "", width: 100, align: "center", },
            orderPrice: { zh: "采购单价", en: "", width: 100, align: "center", editEnable: true },

            amount: { zh: '采购金额', en: '', width: 100, align: 'center', editEnable: true },
            brand: { zh: '品牌', en: '', width: 100, align: 'center' },
            spec: { zh: '规格', en: '', width: 100, align: 'center' },
            unit: { zh: '单位', en: '', width: 100, align: 'center' },
            storageQty: { zh: '库存数量', en: '', width: 100, align: 'center' },

            supplierId: { zh: "供应商编号", en: "", width: 100, align: "center", },
            supplierName: { zh: "供应商名称", en: "", width: 250, align: "center", },
            linkPerson: { zh: "联系人", en: "", width: 100, align: "center", },

            telNo: { zh: "联系方式", en: "", width: 100, align: "center", },
            invoiceType: { zh: "发票类型", en: "", width: 100, align: "center", },
            invoiceRate: { zh: "发票税率", en: "", width: 100, align: "center", },
            useDesc: { zh: "使用说明", en: "", width: 150, align: "center", },
            remarks: { zh: "备注", en: "", width: 150, align: "center", },
        },
        material_origin: {
            status: { zh: "耗材状态", en: "", width: 100, align: "center", },
            materialId: { zh: "耗材编号", en: "", width: 100, align: "center", },
            materialName: { zh: "耗材名称", en: "", width: 100, align: "center", },
            materialClass: { zh: "分类", en: "", width: 100, align: "center", },
            brand: { zh: "品牌", en: "", width: 100, align: "center", },
            spec: { zh: "规格", en: "", width: 100, align: "center", },
            supplierName: { zh: "供应商名称", en: "", width: 250, align: "center", },
            supplierId: { zh: "供应商编号", en: "", width: 100, align: "center", },
            unit: { zh: "计量单位", en: "", width: 100, align: "center", },
            storageQty: { zh: "库存数量", en: "", width: 100, align: "center", },
        }
    },
    priceUpdate: {
        asset: {
            id: { zh: "资产序号", en: "", width: 100, align: "center", },
            billNo: { zh: "单据编号", en: "", width: 100, align: "center", },
            supplierId: { zh: "供应商编号", en: "", width: 100, align: "center", },
            supplierName: { zh: "供应商名称", en: "", width: 100, align: "center", },
            brand: { zh: "品牌", en: "", width: 100, align: "center", },
            assetName: { zh: "资产名称", en: "", width: 100, align: "center", },
            spec: { zh: "规格", en: "", width: 100, align: "center", },
            orderPrice: { zh: "采购单价", en: "", width: 100, align: "center", editEnable: true },
            orderQty: { zh: "采购数量", en: "", width: 100, align: "center", editEnable: true },
        },
        material: {
            id: { zh: "耗材序号", en: "", width: 100, align: "center", },
            billNo: { zh: "单据编号", en: "", width: 100, align: "center", },
            supplierId: { zh: "供应商编号", en: "", width: 100, align: "center", },
            supplierName: { zh: "供应商名称", en: "", width: 100, align: "center", },
            brand: { zh: "品牌", en: "", width: 100, align: "center", },
            materialId: { zh: "耗材编号", en: "", width: 100, align: "center", },
            materialName: { zh: "耗材名称", en: "", width: 100, align: "center", },
            spec: { zh: "规格", en: "", width: 100, align: "center", },
            orderPrice: { zh: "采购单价", en: "", width: 100, align: "center", editEnable: true },
            orderQty: { zh: "采购数量", en: "", width: 100, align: "center", editEnable: true },
        }
    }
}
/**
 *  单据主表信息显示、编辑、新增,弹出页面表头使用
 */
const billMainTemplate = {
    reqEmployeeId: {
        required: true,
        desc: '申请人',
        type: 'list',
        value: null,
        field_select: { value: 'employeeId', display: 'employeeName' },
        dataSource: [],
        setRelated: { objectName: 'reqOrgId', fieldName: 'orgId' },
        useWidget: { widgetName: 'employeePicker' },
    },
    reqOrgId: {
        required: true,
        forceDisable: true,
        desc: '申请部门',
        type: 'tree',
        value: null,
        field_select: { value: 'orgId', display: 'orgName' },
        dataSource: [],
    },

    reqDate: {
        required: true,
        desc: '申请日期',
        type: 'dateTime',
        value: null,
    },
    purchaseDate: {
        required: false,
        desc: '取得日期',
        type: 'dateTime',
        value: null,
    },
    purchaseType: {
        required: true,
        desc: '购置类型',
        type: 'enum',
        value: 0,
        dataSource: [
            { value: 0, text: '采购' },
            { value: 1, text: '租赁' },
            { value: 2, text: '捐赠' },
            { value: 3, text: '划拨' },
            { value: 4, text: '借入' },
            { value: 5, text: '其他' },
        ],
    },
    placeId: {
        required: true,
        desc: '入库位置',
        type: 'tree',
        value: 'C106',
        field_select: { value: 'placeId', display: 'placeName' },
        dataSource: [],
    },
    amount: {
        required: true,
        desc: '合计金额',
        value: null,
        type: 'input_number',
    },
    operatePersonId: { desc: '经办人', value: null, forceDisable: true },
    remarks: { desc: '备注', value: null, width: 2 },
    signImage: {
        required: false,
        desc: '签名图片',
        type: 'image',
        value: null,
    },
};
const template_detail_asset = {
    classId: {
        required: true,
        desc: "分类",
        type: "tree",
        field_select: { value: "classId", display: "className" },
        value: null,
        dataSource: []
    },
    assetName: {
        required: true,
        desc: "资产名称",
        value: null
    },
    orderPrice: {
        required: true,
        desc: "采购单价",
        value: null,
        type: 'input_number'
    },
    orderQty: {
        required: true,
        desc: "采购数量",
        value: null,
        type: 'input_number'
    },
    amount: {
        forceDisable: true,
        desc: "金额",
        value: null,
        type: 'input_number'
    },
    brand: {
        required: false,
        desc: "品牌",
        type: "enum_input",
        value: null,
        dataSource: []
    },
    spec: {
        required: true,
        desc: "规格型号",
        value: null
    },
    serviceLife: {
        required: true,
        desc: "使用年限",
        value: null
    },
    unit: {
        required: false,
        desc: "单位",
        value: null
    },
    storageQty: {
        required: false,
        desc: "库存数量",
        value: null,
        forceDisable: true
    },
    supplierId: {
        required: true,
        desc: "供应商编号",
        type: "list",
        value: null,
        field_select: { value: "supplierId", display: "supplierName" },
        dataSource: [],
    },
    useQty: {
        required: false,
        desc: "实发数量",
        value: 0,
        forceDisable: true
    },
    invoiceType: {
        required: false,
        desc: "发票类型",
        type: "enum",
        value: null,
        dataSource: [
            { value: "增值税普通发票", text: "增值税普通发票" },
            { value: "增值税专用发票", text: "增值税专用发票" },
        ]
    },
    invoiceRate: {
        required: false,
        desc: "发票税率",
        value: null
    },

    useDesc: {
        required: false,
        desc: '使用说明',
        value: null,
    },
    remarks: {
        required: false,
        desc: '备注',
        width: 3,
        value: null,
    },
};
const template_detail_material = {
    materialClass: {
        required: true,
        desc: "分类",
        type: "enum_input",
        value: null,
        dataSource: []
    },
    materialName: {
        required: true,
        desc: "名称",
        value: null,
    },
    orderPrice: {
        required: true,
        desc: "采购单价",
        value: null,
        type: 'input_number'
    },
    orderQty: {
        required: true,
        desc: "采购数量",
        value: null,
        type: 'input_number'
    },
    amount: {
        forceDisable: true,
        desc: "金额",
        value: null,
        type: 'input_number'
    },
    brand: {
        required: false,
        desc: "品牌",
        type: "enum_input",
        value: null,
        dataSource: []
    },
    spec: {
        required: true,
        desc: "规格型号",
        value: null
    },
    unit: {
        required: false,
        desc: "单位",
        value: null
    },
    storageQty: {
        required: false,
        desc: "库存数量",
        value: null,
        forceDisable: true
    },
    supplierId: {
        required: true,
        desc: "供应商编号",
        type: "list",
        value: null,
        field_select: { value: "supplierId", display: "supplierName" },
        dataSource: [],
    },
    useQty: {
        required: false,
        desc: "实发数量",
        value: 0,
        forceDisable: true
    },
    invoiceType: {
        required: true,
        desc: "发票类型",
        type: "enum",
        value: null,
        dataSource: [
            { value: "增值税普通发票", text: "增值税普通发票" },
            { value: "增值税专用发票", text: "增值税专用发票" },
        ]
    },
    invoiceRate: {
        required: false,
        desc: "发票税率",
        value: null
    },

    useDesc: {
        required: false,
        desc: '使用说明',
        value: null,
    },
    remarks: {
        required: false,
        desc: '备注',
        width: 3,
        value: null,
    },
};
/**
 * 单据列表界面高级筛选配置
 */
var filter = {
    items_input: {
        billNo: { desc: '采购单号', value: null },
        // employeeId: { desc: "领用人", value: null }
    },
    items_select: {
        reqEmployeeId: {
            required: true,
            desc: '申请人',
            type: 'list',
            field_select: { value: 'employeeName', display: 'employeeId' },
            value: null,
            dataSource: [],
        },
        reqOrgId: {
            required: true,
            desc: '申请部门',
            type: 'tree',
            value: null,
            field_select: { value: 'orgId', display: 'orgName' },
            dataSource: [],
        },
        reqDate_start: {
            desc: '申请日期起',
            type: 'dateTime',
            value: null,
        },
        reqDate_end: {
            desc: '申请日期止',
            type: 'dateTime',
            value: null,
        },
    },
};
module.exports.typeDef = typeDef;
module.exports.header = header;
module.exports.filter = filter;
module.exports.billMainTemplate = billMainTemplate;
module.exports.template_detail_asset = template_detail_asset;
module.exports.template_detail_material = template_detail_material;
