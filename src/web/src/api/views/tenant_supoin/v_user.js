const typeDef = {
    comment: "用户列表",
    statusMap: {
        "0": "未启用",
        "1": "启用",
    }
}
const header = {
    main: {
        status: { zh: "账号状态", en: "", width: 120, align: "center", },
        userId: { zh: "账号", en: "", width: 120, align: "center", },
        employeeId: { zh: "员工编号", en: "", width: 120, align: "center", },
        employeeName: { zh: "员工姓名", en: "", width: 120, align: "center", },
        orgName: { zh: "部门", en: "", width: 120, align: "center", },
        manage_orgName: { zh: "数据权限", en: "", width: 120, align: "center", },
        telNo: { zh: "手机号", en: "", width: 150, align: "center" },
        email: { zh: "邮箱", en: "", width: 150, align: "center" },

    }
}
/**
 * 资产列表界面高级筛选配置
 */
var filter = {
    items_input: {
        userId: { desc: "账号", value: null },
        employeeId: { desc: "员工编号", value: null },
        employeeName: { desc: "姓名", value: null },

    },
    items_select: {
        status: {
            desc: "账户状态", type: "enum", value: null,
            dataSource: [
                { value: 0, text: "禁用" },
                { value: 1, text: "启用" }
            ]
        }

    }
}
const objTemplate = {
    userId: {
        required: true,
        desc: "账号",
        value: null
    },
    password: {
        required: true,
        desc: "密码",
        value: null,
        type: "input_pwd"
    },
    password_confirm: {
        required: true,
        desc: "确认密码",
        value: null,
        type: "input_pwd"
    },
    employeeId: {
        required: true,
        type: "list",
        desc: "员工姓名",
        value: null,
        field_select: { value: "employeeId", display: "employeeName" },
        dataSource: []
    },
    status: {
        required: true,
        type: "enum",
        desc: "账号状态",
        value: 1,
        dataSource: [{ value: 1, text: "正常" }, { value: 0, text: "停用" }]
    },
    manage_orgId: {
        required: true,
        desc: "数据权限",
        type: "tree",
        field_select: { value: "orgId", display: "orgName" },
        value: null,
        dataSource: []
    }


}
module.exports.objTemplate = objTemplate;
module.exports.header = header;
module.exports.filter = filter;
module.exports.typeDef = typeDef;