const header = {
    main: {
        orgId: { zh: "机构编号", en: "", width: 120, align: "center", },
        orgName: { zh: "机构名称", en: "", width: 120, align: "center", },
        parentId: { zh: "上级机构", en: "", width: 120, align: "center", },
        employeeNum: { zh: "员工数量", en: "", width: 100, align: "center" },
        assetNum: { zh: "资产数量", en: "", width: 100, align: "center" }
    }
}
const objTemplate = {
    currentorgId: {
        required: true,
        desc: "组织编号",
        value: null,
        updateDisable: true
    },
    currentorgName: {
        required: true,
        desc: "组织名称",
        value: null
    },
    orgId: {
        required: true,
        type: "tree",
        desc: "上级组织",
        field_select: { value: "orgId", display: "orgName" },
        dataSource: []
    }
}
module.exports.objTemplate = objTemplate;
module.exports.header = header;