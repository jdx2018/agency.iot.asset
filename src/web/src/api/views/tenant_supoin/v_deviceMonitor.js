// 设备监控主界面表头：

const typeDef = {
    comment: "设备数据",
    statusMap: {
        "0": "离线",
        "1": "在线",
        "-1": "异常"
    },
    deviceTypeMap: {
        "10": "PDA",
        "20": "读写器",
        "30": "通道门"
    }
}

const header = {
    main: {
        deviceId: { zh: "设备编号", en: "", width: 200, align: "center", },
        deviceName: { zh: "设备名称", en: "", width: 100, align: "center", },
        placeName: { zh: "设备位置", en: "", width: 100, align: "center", },
        ext1: { zh: "设备IP", en: "", width: 200, align: "center", },
        ext2: { zh: "设备MAC", en: "", width: 200, align: "center", },
        status: { zh: "监控状态", en: "", width: 100, align: "center", },
        lastDateUpdate: { zh: "最近一次更新时间", en: "", width: 180, align: "center", },
        lastHeart: { zh: "最近一次心跳时间", en: "", width: 180, align: "center", },
        remarks: { zh: "备注", en: "", width: 150, align: "center", },
    }
}

// 设备监控高级筛选配置：
var filter = {
    items_input: {
        deviceId: { desc: "设备编号", value: null },
        deviceName: { desc: "设备名称", value: null },
    },
    items_select: {
        status: {
            desc: "设备状态",
            type: "enum",
            value: null,
            dataSource: [
                { value: 0, text: "离线" },
                { value: 1, text: "在线" },
                { value: -1, text: "异常" },
            ]
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

// 设备监控弹出界面(编辑或新增)模板：
// const objTemplate = {
//     tenantId: {
//         required: true,
//         desc: "设备编号",
//         value: null,
//         updateDisable: true
//     },
// }

module.exports.typeDef = typeDef;
module.exports.header = header;
module.exports.filter = filter;