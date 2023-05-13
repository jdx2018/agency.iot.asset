const t_sys=require("./template_sys");
const templateDef = {
    asset: {
        columns: [
            { key: 'assetId', desc: '资产编号', required: false },
            { key: 'assetName', desc: '资产名称', required: true },
            { key: 'barcode', desc: '条码', required: false },
            { key: 'epc', desc: 'EPC', required: false },
            { key: 'classId', desc: '资产分类', required: false },
            { key: 'placeId', desc: '资产位置', required: false },
            { key: 'manager', desc: '管理员', required: false },
            { key: 'ownOrgId', desc: '所属部门', required: false },
            { key: 'useOrgId', desc: '使用部门', required: false },
            { key: 'useEmployeeId', desc: '使用人', required: false },
            { key: 'amount', desc: '金额', required: false },
            { key: 'serviceLife', desc: '使用期限', required: false },
            { key: 'purchaseType', desc: '购置类型', required: false },
            { key: 'purchaseDate', desc: '购置日期', required: false },
            { key: 'supplierId', desc: '供应商编号', required: false },
            { key: 'unit', desc: '计量单位', required: false },
            { key: 'brand', desc: '品牌', required: false },
            { key: 'spec', desc: '规格', required: false },
        ],
        waringTextList: [],
    },
    assetPlace: t_sys.templateDef.assetPlace,
    assetClass: t_sys.templateDef.assetClass,
    org:t_sys.templateDef.org ,
    employee:t_sys.templateDef.employee
}
module.exports.templateDef = templateDef;