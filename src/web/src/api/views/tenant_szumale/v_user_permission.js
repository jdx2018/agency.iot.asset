const objTemplate = {
    userId: {
        required: true,
        desc: "账号",
        value: null
    },
    orgId: {
        required: true,
        desc: "部门",
        type:"tree",
        field_select:{value:"orgId",display:"orgName"},
        value: null,
    }
}
module.exports.objTemplate = objTemplate;