const typeDef = {
    comment: "设备数据",
    statusMap: {
        "0": "未启用",
        "1": "启用",
        "-1": "授权过期"
    },
    deviceTypeMap: {
        "10": "PDA",
        "20": "读写器",
        "30": "通道门"
    }
}
const header = {
    main: {
        status: { zh: "状态", en: "", width: 80, align: "center", },
        deviceId: { zh: "设备编号", en: "", width: 160, align: "center", },
        deviceName: { zh: "设备名称", en: "", width: 120, align: "center", },
        placeName: { zh: "所在位置", en: "", width: 160, align: "center" },
        deviceType: { zh: "设备类型", en: "", width: 120, align: "center", },
        groupName: { zh: "设备组", en: "", width: 120, align: "center", },
        ownOrgName: { zh: "所属部门", en: "", width: 160, align: "center" },
        model: { zh: "型号", en: "", width: 160, align: "center" },
        ext1: { zh: "设备IP", en: "", width: 160, align: "center" },
        ext2: { zh: "设备MAC", en: "", width: 160, align: "center" },
        version: { zh: "版本", en: "", width: 100, align: "center" },
        remarks: { zh: "备注", en: "", width: 160, align: "center" },
        createPerson: { zh: "创建人", en: "", width: 100, align: "center", },
        createTime: { zh: "创建时间", en: "", width: 160, align: "center", },
        updatePerson: { zh: "更新人", en: "", width: 260, align: "center", },
        updateTime: { zh: "更新时间", en: "", width: 160, align: "center", },
    }
}
/**
 * 资产列表界面高级筛选配置
 */
var filter = {
    items_input: {
        deviceId: { desc: "设备编号", value: null },
        deviceName: { desc: "设备名称", value: null },
    },
    items_select: {
        ownOrgId: {
            desc: "所属部门",
            type: "tree",
            value: null,
            field_select: { value: "orgId", display: "orgName" },
            dataSource: []
        },
        placeName: {
            desc: "所在位置",
            type: "enum",
            value: null,
            dataSource: []
        },
        groupName: {
            desc: "设备组",
            type: "enum",
            value: null,
            dataSource: []
        },
        status: {
            desc: "设备状态", type: "enum", value: null,
            dataSource: [
                { value: 0, text: "未启用" },
                { value: 1, text: "启用" }
            ]
        },
        deviceType: {
            desc: "设备类型",
            type: "enum",
            value: null,
            dataSource: [
            ]
        },
        model: {
            desc: "型号",
            type: "enum",
            value: null,
            dataSource: [
            ]
        },
        version: {
            desc: "版本",
            type: "enum",
            value: null,
            dataSource: [
            ]
        },
        createPerson: {
            desc: "创建人",
            type: "list",
            value: null,
            field_select: { value: "employeeId", display: "employeeName" },
            dataSource: []
        },
        createTime_start: {
            desc: "创建时间-起",
            type: "dateTime",
            value: null
        },
        createTime_end: {
            desc: "创建时间-止",
            type: "dateTime",
            value: null
        },
    }
}
const objTemplate = {
    deviceId: {
        required: true,
        desc: "设备编号",
        value: null
    },
    deviceName: {
        required: false,
        desc: "设备名称",
        value: null,

    },
    placeName: {
        desc: "所在位置",
        type: "enum_input",
        value: null,
        dataSource: []
    },
    deviceType: {
        desc: "设备类型",
        type: "enum",
        value: null,
        dataSource: []
    },
    groupName: {
        desc: "设备组",
        type: "enum_input",
        value: null,
        dataSource: []
    },
    ownOrgId: {
        desc: "所属部门",
        type: "tree",
        value: null,
        dataSource: [],
        field_select: { value: "orgId", display: "orgName" },
    },
    model: {
        desc: "型号",
        type: "enum",
        value: null,
        dataSource: []
    },
    version: {
        desc: "版本",
        type: "enum",
        value: null,
        dataSource: [
        ]
    },
    ext1: {
        desc: "设备IP",
        value: null,
    },
    ext2: {
        desc: "设备MAC",
        value: null,
    },
    status: {
        desc: "设备状态",
        type: "enum",
        value: null,

        dataSource: [
            { value: 0, text: "未启用" },
            { value: 1, text: "启用" }
        ]

    },
    remarks: {
        desc: "备注",
        value: null
    },

    // isHosted: {
    //     required: false,
    //     type: "enum",
    //     desc: "代管",
    //     dataSource: [
    //         { value: 0, text: "否" },
    //         { value: 1, text: "是" }
    //     ]
    // }
}
module.exports.typeDef = typeDef;
module.exports.filter = filter;
module.exports.header = header;
module.exports.objTemplate = objTemplate;