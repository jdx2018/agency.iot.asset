const header = {
    main: {
        id: { zh: "数据序号", en: "", width: 120, align: "center", },
        assetId: { zh: "资产编号", en: "", width: 120, align: "center", },
        assetName: { zh: "资产名称", en: "", width: 120, align: "center", },
        placeName: { zh: "所在位置", en: "", width: 120, align: "center", },
        useOrgName: { zh: "使用部门", en: "", width: 120, align: "center", },
        epc: { zh: "EPC", en: "", width: 150, align: "center" },
        deviceId: { zh: "采集设备", en: "", width: 120, align: "center" },
        deviceName: { zh: "设备名称", en: "", width: 120, align: "center" },
        devicePlaceName: { zh: "设备位置", en: "", width: 120, align: "center" },
        collectTime: { zh: "采集时间", en: "", width: 160, align: "center" }
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
        collectTime_start: {
            desc: "采集时间起",
            type: "dateTime",
            value: null
        },
        collectTime_end: {
            desc: "采集时间止",
            type: "dateTime",
            value: null
        }
    }
}
module.exports.header = header;
module.exports.filter = filter;