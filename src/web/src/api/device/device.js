/**
 * 设备维护操作
 */
// const dbClient = require("../db/db.local").db_local_client;
const dbClient = require("../db").dbClient;
const table = require("../db/tableEnum").table;
const fieldTool = require("../tool/fieldTool");
const selectSource = require("../tool/selectSource");
const cache = require("../cache");

const deviceTypeList = [
    { value: 10, text: "PDA" },
    { value: 20, text: "读写器" },
    { value: 30, text: "通道门" }
]
var deviceEnum = {
    model: { pool: {}, list: [] },
    version: { pool: {}, list: [] },
    groupName: { pool: {}, list: [] },
    className: { pool: {}, list: [] },
    placeName: { pool: {}, list: [] },
}
/**
 * 获取分类新增/编辑模板
 */
async function getTemplate() {
    let viewDef = cache.view_get().device;
    let objTemplate = viewDef.objTemplate;
    let res = await fillDataSource(objTemplate, true);
    if (res.code != 1) { return res };
    await selectSource.fillDataSource(objTemplate, true)

    return { code: 1, message: "success", data: objTemplate };
}
function cacheField(sourceObj, fieldName) {
    // console.log("cachefield", sourceObj, fieldName);
    if (sourceObj && fieldName) {
        let v = sourceObj[fieldName];
        let targetObj = deviceEnum[fieldName];
        // console.log("v,target", v, targetObj);
        if (v && targetObj && !targetObj.pool[v]) {
            // console.log("cache field success.");
            targetObj.pool[v] = 1;
            targetObj.list.push({ value: v, text: v });
        }
    }
}
async function fillDataSource(obj, useCache) {
    let rowsSource = null;
    if (useCache && cache.rowsCache.device.rows) {
        rowsSource = cache.rowsCache.device.rows;
    }
    else {
        let res = await dbClient.Query(table.tenant_device);
        if (res.code != 1) { return res; }
        rowsSource = res.data;
    }
    if (rowsSource && rowsSource.length > 0) {
        for (let i = 0; i < rowsSource.length; i++) {
            let t = rowsSource[i];
            Object.keys(deviceEnum).forEach((key) => {
                cacheField(t, key);
            });

        }
    }
    // console.log("device enum", deviceEnum);
    //对象赋值
    Object.keys(obj).forEach((key) => {
        if (deviceEnum[key] && deviceEnum[key].list.length > 0) {
            obj[key].dataSource = deviceEnum[key].list;
        }
    })
    obj.deviceType.dataSource = deviceTypeList;
    // console.log("device.fill", obj);
    return { code: 1, message: "fill success" };
}
/**
 * 查询所有设备列表
 */
async function getDeviceList(filter) {
    const viewDef = cache.view_get().device;
    let query = {};
    let header_main = viewDef.header.main;
    let statusMap = viewDef.typeDef.statusMap;
    let deviceTypeMap = viewDef.typeDef.deviceTypeMap;

    if (filter) {
        if (filter.createTime_start) {
            query.createTime = { $gte: filter.createTime_start };
            delete filter.createTime_start;
        }
        if (filter.createTime_end) {
            if (!filter.createTime) {
                filter.createTime = {};
            }
            query.createTime.$lte = filter.createTime_end;
            delete filter.createTime_end;
        }
        Object.keys(filter).forEach((key) => {
            query[key] = filter[key];
        })
    };
    // console.log("查询设备-query,filter",query,filter);
    let fields = fieldTool.header2Fields(header_main, null);
    let res_List = await dbClient.Query(table.v_device, query, fields);
    if (res_List.code != 1) { return res_List; }
    let rows = res_List.data;
    for (let i = 0; i < rows.length; i++) {
        rows[i].status = statusMap[rows[i].status];
        rows[i].deviceType = deviceTypeMap[rows[i].deviceType];
    }

    //缓存设备数据
    cache.rowsCache.device = {
        stmp: Date.now(),
        rows: JSON.parse(JSON.stringify(rows))
    };
    let res = await fillDataSource(viewDef.filter.items_select, true);
    if (res.code != 1) { return res; }
    await selectSource.fillDataSource(viewDef.filter.items_select)
    // console.log("asset-getList.filter:",viewDef.filter);
    return {
        code: 1, message: "success",
        data: {
            header: header_main,
            rows: rows,
            filter: viewDef.filter
        }
    };
}
/**
 * 增加设备
 * @param {object} device-object 
 */
async function addDevice(deviceObj) {
    return await addDeviceList([deviceObj]);
}

/**
 * 批量增加设备
 * @param {array<device>} deviceList 
 */
async function addDeviceList(deviceList) {
    if (!deviceList || deviceList.length < 1) {
        return { code: -1, message: "设备列表不能为空." };
    }
    return await dbClient.InsertMany(table.tenant_device, deviceList);
}

/**
 * 更新设备信息
 * @param {object} device 
 */
async function updateDevice(deviceId, dataContent) {
    // console.log("设备更新", deviceId, dataContent);
    if (!deviceId || !dataContent) {
        return { code: -1, message: "设备编号/更新内容不能为空." };
    }
    delete dataContent.tenantId;
    delete dataContent.deviceId;
    return await dbClient.Update(table.tenant_device, { deviceId: deviceId }, dataContent);
}
/**
 * 删除分类
 * @param {string} deviceId 
 */
async function deleteDevice(deviceId) {
    return await dbClient.Delete(table.tenant_device, { deviceId: deviceId });
}
/**
 * 获取设备类型列表
 */
async function getTypeList() {
    let typeList = [{
        value: "10", text: "PDA",
        value: "20", text: "读写器",
        value: "30", text: "通道门"
    }];
    return { code: 1, message: "success", data: deviceTypeList };
}

// async function get
module.exports.getTemplate = getTemplate;
module.exports.getDeviceList = getDeviceList;
module.exports.addDevice = addDevice;
module.exports.addDeviceList = addDeviceList;
module.exports.updateDevice = updateDevice;
module.exports.deleteDevice = deleteDevice;