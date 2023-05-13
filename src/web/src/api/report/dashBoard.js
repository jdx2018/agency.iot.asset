const dbClient = require("../db/db.client").dbClient;
const table = require("../db/tableEnum.js").table;
const cache = require("../cache");
const toDo_function_handle = {
    "query_alarm_todo": query_alarm_todo,
    "query_guihuan_todo": query_guihuan_todo,
    "query_chuzhi_todo": query_chuzhi_todo
}
const report_recent_function_handle = {

    "query_bill_inventory": query_bill_inventory,
    "query_bill_jiechu": query_bill_jiechu,
    "query_bill_guihuan": query_bill_guihuan,
    "query_bill_paifa": query_bill_paifa,
    "query_bill_tuiku": query_bill_tuiku,
    "query_bill_chuzhi": query_bill_chuzhi,
    "query_bill_weixiu": query_bill_weixiu,
    "query_bill_caigou": query_bill_caigou

}
/**
 * 获取代办事项列表
 */
async function getToDoList() {
    let todo_def = cache.view_get().dashBoard.template.toDoList;
    // console.log(todo_def);
    let resData = [];
    for (let key of Object.keys(todo_def)) {
        let obj = todo_def[key];
        let func = obj.execute;
        if (toDo_function_handle[func]) {
            let res = await toDo_function_handle[func]();
            if (res.code == 1) {
                resData.push(res.data);
            }
        }
    }
    return { code: 1, message: "success", data: resData };
    // return {
    //     code: 1, message: "success",
    //     data: [
    //         { title: "报警待处理", content: "12", componentName: "Reminder" },
    //         { title: "到期待归还", content: "10", componentName: "AssetsList" },
    //         { title: "报废待处理", content: "16", componentName: "AssetsList" },
    //     ]
    // }
}
/**
 * 获取快捷入口
 */
async function getQuickMenu() {
    let quickMenu_def = cache.view_get().dashBoard.template.quickMenu;
    // console.log(quickMenu_def);
    // return { code: 1, message: "success", quickMenu_def };
    return {
        code: 1, message: "success",
        data: [
            { componentName: "AssetsList", pageDesc: "资产列表" },
            { componentName: "LendAndReturn", pageDesc: "借出归还" },
            { componentName: "DestributeAndCancelStock", pageDesc: "派发退库" },
            { componentName: "InventoryManager", pageDesc: "盘点" },
        ]
    }
}
/**
 * 获取最近工作统计
 * @param {int} days 3/30/90
 */
async function getReport_recent(days) {
    let report_recent_def = cache.view_get().dashBoard.template.report_recent;
    // console.log(report_recent_def);
    let resData = [];
    Object.keys(report_recent_def).forEach(async (key) => {
        let obj = report_recent_def[key];
        let func = obj.execute;
        if (report_recent_function_handle[func]) {
            let res = await report_recent_function_handle[func]();
            if (res.code == 1) {
                resData.push(res.data);
            }
        }
    })
    return { code: 1, message: "success", data: resData };
    return {
        code: 1, message: "success",
        data: [
            { text: "盘点", qty: 10 },
            { text: "借出", qty: 6 },
            { text: "归还", qty: 1 },
            { text: "派发", qty: 16 },
            { text: "退库", qty: 2 },
            { text: "维修", qty: 1 },
            { text: "处置", qty: 1 }
        ]
    }
}
/**
 * 获取资产状态分布
 */
async function getAsset_distribute_status() {
    const statusMap = cache.view_get().asset.typeDef.statusMap;
    let res = await dbClient.Query(table.v_report_asset_distribute_status);
    // console.log(res)
    if (res.code != 1) { return res };
    if (res.data.length < 1) { return { code: -1, message: '查询结果为空' } };

    let data = res.data.map(each => ({ title: statusMap[each.status], content: each.count }));

    return {
        code: 1, message: "success",
        data
        // data: [
        //     { title: "空闲", content: 900 },
        //     { title: "借用中", content: 108 },
        //     { title: "领用中", content: 800 }
        // ]
    }
}
/**
 * 获取资产位置分布
 */
async function getAsset_distribute_place() {
    let res = await dbClient.Query(table.v_report_asset_distribute_place)
    if (res.code != 1) { return res };
    if (res.data.length < 1) { return { code: -1, message: '查询结果为空' } };

    let data = res.data.map(each => ({ title: each.placeName, content: each.count }));
    return {
        code: 1, message: "success",
        data
        // data: [
        //     { title: "一楼", content: 900 },
        //     { title: "二楼", content: 108 },
        //     { title: "三楼", content: 800 }
        // ]
    }
}
async function query_alarm_todo() {
    let alarm_status = undefined;
    let statusMap = cache.view_get().assetAlarm.typeDef.statusMap;

    Object.keys(statusMap).forEach(key => {
        if (statusMap[key] === '未处理') {
            alarm_status = parseInt(key)
        }
    })
    let res = await dbClient.Query(table.v_report_asset_alarm_todo, { status: alarm_status });
    if (res.code != 1) { return res };
    if (res.data.length < 1) {
        return {
            code: 1, message: 'success',
            data: { title: "报警待处理", content: "0", componentName: "AssetMonitor" }
        }
    };

    return {
        code: 1, message: "success",
        data: { title: "报警待处理", content: res.data[0].count.toString(), componentName: "AssetMonitor" }
    }
}
async function query_guihuan_todo() {
    let jieyong_status = undefined;
    let statusMap = cache.view_get().asset.typeDef.statusMap;

    Object.keys(statusMap).forEach(key => {
        if (statusMap[key] === '借用') {
            jieyong_status = parseInt(key);
        }
    })
    let res = await dbClient.Query(table.v_report_asset_status_todo, { status: jieyong_status });
    if (res.code != 1) { return res };

    if (res.data.length < 1) {
        return {
            code: 1, message: 'success',
            data: { title: "待归还", content: "0", componentName: "LendAndReturn" }
        }
    };
    return {
        code: 1, message: "success",
        data: { title: "待归还", content: res.data[0].count.toString(), componentName: "LendAndReturn" }
    }
}

async function query_chuzhi_todo() {
    let chuzhi_status = undefined;
    let statusMap = cache.view_get().asset.typeDef.statusMap;

    Object.keys(statusMap).forEach(key => {
        if (statusMap[key] === '处置待确认') {
            chuzhi_status = parseInt(key);
        }
    })
    let res = await dbClient.Query(table.v_report_asset_chuzhi_todo);
    if (res.code != 1) { return res };

    if (res.data.length < 1) {
        return {
            code: 1, message: 'success',
            data: { title: "待处置", content: "0", componentName: "AssetsList" }
        }
    };

    return {
        code: 1, message: "success",
        data: { title: "待处置", content: res.data[0].assetNum.toString(), componentName: "AssetsList" }
    }
}
async function query_bill_inventory() {
    return { code: 1, message: "success", data: { title: "盘点", content: "6" } }
}
async function query_bill_jiechu() {
    return { code: 1, message: "success", data: { title: "借出", content: "6" } }
}
async function query_bill_guihuan() {
    return { code: 1, message: "success", data: { title: "归还", content: "6" } }
}
async function query_bill_paifa() {
    return { code: 1, message: "success", data: { title: "派发", content: "6" } }
}
async function query_bill_tuiku() {
    return { code: 1, message: "success", data: { title: "退库", content: "6" } }
}
async function query_bill_chuzhi() {
    return { code: 1, message: "success", data: { title: "处置", content: "6" } }
}
async function query_bill_weixiu() {
    return { code: 1, message: "success", data: { title: "维修", content: "6" } }
}
async function query_bill_caigou() {
    return { code: 1, message: "success", data: { title: "采购", content: "6" } }
}

// 获取概览看板各项数据：
async function get_dashboard_data() {
    const asset_status_map = {
        '0': '空闲',
        '1': '领用中',
        '2': '借用',
        '10': '处置待确认',
        '10': '处置完成',
    }
    const bill_type_map = {
        '12': '借出', '22': '归还',
        '11': '派发', '21': '退库',
        '31': '维修', '32': '处置',
    }
    let user = cache.user_get();
    let res = await dbClient.executeProc('p_dashboard', { p_manage_orgId: user.manage_orgId })
    if (res.code != 1) { return res };
    let dashBoard_data = res.data;
    for (let i = 0; i < dashBoard_data.length; i++) {
        // 资产状态的转化：
        if (dashBoard_data[i].dimension === 'asset_status') {
            dashBoard_data[i]['dName'] = asset_status_map[dashBoard_data[i]['dValue']]
        }
        // 单据类型的转化：
        if (dashBoard_data[i].dimension === 'bill_detail_every_month_checked') {
            dashBoard_data[i]['dName'] = bill_type_map[dashBoard_data[i]['dName']]
        }
    }
    return {
        code: 1,
        message: "success",
        data: dashBoard_data
    }
}

// (async () => { 
//     let res = await get_dashboard_data(); 
//     console.log(res) 
// })()

module.exports.getToDoList = getToDoList;
module.exports.getQuickMenu = getQuickMenu;
module.exports.getReport_recent = getReport_recent;
module.exports.getAsset_distribute_status = getAsset_distribute_status;
module.exports.getAsset_distribute_place = getAsset_distribute_place;
module.exports.get_dashboard_data = get_dashboard_data;