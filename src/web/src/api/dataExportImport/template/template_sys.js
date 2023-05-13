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
            { key: 'serviceLife', desc: '使用期限', required: true },
            { key: 'purchaseType', desc: '购置类型', required: false },
            { key: 'purchaseDate', desc: '购置日期', required: false },
            { key: 'supplierId', desc: '供应商编号', required: false },
            { key: 'unit', desc: '计量单位', required: false },
            { key: 'brand', desc: '品牌', required: false },
            { key: 'spec', desc: '规格', required: false },
        ],
        waringTextList: [],
    },
    assetPlace: {
        columns: [
            { key: 'placeId', desc: '位置编号', required: true },
            { key: 'placeName', desc: '位置名称', required: true },
            { key: 'parentId', desc: '上级位置', required: true },
        ],
        warnningTextList: ['顶级位置的上级位置请设置为0'],
    },
    assetClass: {
        columns: [
            { key: 'classId', desc: '分类编号', required: true },
            { key: 'className', desc: '分类名称', required: true },
            { key: 'parentId', desc: '上级编号', required: true },
        ],
        warnningTextList: ['顶级分类的上级分类请设置为0'],

    },
    org: {
        columns: [
            { key: 'orgId', desc: '机构编号', required: true },
            { key: 'orgName', desc: '机构名称', required: true },
            { key: 'parentId', desc: '上级机构', required: true },
        ],
        warnningTextList: ['顶级机构的上级机构编号请设置为0'],
    },
    employee: {
        columns: [
            { key: 'orgId', desc: '部门编号', required: true },
            { key: 'employeeId', desc: '员工编号', required: true },
            { key: 'employeeName', desc: '员工名称', required: true },
            { key: 'telNo', desc: '电话号码', required: false },
            { key: 'email', desc: '邮箱', required: false },
        ],
    }
}
module.exports.templateDef = templateDef;