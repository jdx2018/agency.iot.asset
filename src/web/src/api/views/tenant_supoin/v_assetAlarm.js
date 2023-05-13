const typeDef = {
    comment: "报警记录",

    statusMap: {
        "0": "未处理",
        "1": "已处理"
    },
} 
const header = {
    main: {
        id: { zh: "数据序号", en: "", width: 120, align: "center", },
        status: { zh: "处理状态", en: "", width: 120, align: "center" },
        assetId: { zh: "资产编号", en: "", width: 120, align: "center", },
        assetName: { zh: "资产名称", en: "", width: 120, align: "center", },
        placeName: { zh: "所在位置", en: "", width: 120, align: "center", },
        useOrgName: { zh: "使用部门", en: "", width: 120, align: "center", },
        useEmployeeName: { zh: "使用人", en: "", width: 120, align: "center", },
        deviceId: { zh: "报警设备", en: "", width: 160, align: "center" },
        deviceName: { zh: "设备名称", en: "", width: 120, align: "center" },
        devicePlaceName: { zh: "设备位置", en: "", width: 120, align: "center" },
        alarmTime: { zh: "报警时间", en: "", width: 160, align: "center" },
        epc: { zh: "EPC", en: "", width: 150, align: "center" },
        remarks: { zh: "处理内容", en: "", width: 200, align: "center" },

    }
}
/**
 * 资产列表界面高级筛选配置
 */
var filter = {
    items_input: {
        assetId: { desc: "资产编号", value: null },
        assetName: { desc: "资产名称", value: null }
    },
    items_select: {
        status: {
            desc: "处理状态", type: "enum", value: null,
            dataSource: [
                { value: 0, text: "未处理" },
                { value: 1, text: "已处理" }
            ]
        },
        alarmDate_start: {
            desc: "报警时间起",
            type: "dateTime",
            value: null
        },
        alarmDate_end: {
            desc: "报警时间止",
            type: "dateTime",
            value: null
        }
    }
}
const objTemplate = {
    remarks: {
        required: false,
        desc: "处理说明",
        type:"longText",
        value: null
    }
}
module.exports.header = header;
module.exports.filter = filter;
module.exports.objTemplate = objTemplate;
module.exports.typeDef = typeDef;