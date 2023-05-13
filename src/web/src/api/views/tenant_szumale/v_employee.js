const typeDef = {
    comment: "员工列表",
    statusMap: {
        "0": "停用",
        "1": "启用",
    },
}
const header = {
    main: {
        orgId: { zh: "部门编号", en: "", width: 120, align: "center", },
        orgName: { zh: "部门名称", en: "", width: 150, align: "center", },
        employeeId: { zh: "员工编号", en: "", width: 120, align: "center", },
        employeeName: { zh: "员工名称", en: "", width: 120, align: "center", },
        status: { zh: "员工状态", en: "", width: 100, align: "center" },
        telNo: { zh: "电话号码", en: "", width: 150, align: "center" },
        email: { zh: "邮箱", en: "", width: 150, align: "center" },

    }
}
const objTemplate = {
    orgId: {
        required: true,
        type: "tree",
        desc: "机构编号",
        field_select: { value: "orgId", display: "orgName" }
    },
    employeeId: {
        required: true,
        desc: "员工编号",
        value: null
    },
    employeeName: {
        required: true,
        desc: "员工名称",
        value: null
    },
    status: {
        required: true,
        type: "enum",
        desc: "员工状态",
        value: 1,
        dataSource: [{ value: 1, text: "启用" }, { value: 0, text: "停用" }]
    },
    telNo: {
        required: false,
        desc: "电话号码",
        value: null
    },
    email: {
        required: false,
        desc: "邮箱",
        value: null
    },
    remarks: {
        required: false,
        desc: "备注",
        value: null
    }
}
module.exports.typeDef = typeDef;
module.exports.objTemplate = objTemplate;
module.exports.header = header;