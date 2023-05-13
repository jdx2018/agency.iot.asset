/**
 * 资产位置操作相关方法
 */
const dbClient = require("../db").dbClient;
const billCommon = require("../bill/billCommon");
const table = require("../db/tableEnum").table;
const cache = require("../cache");
const tree_sub = require("../tool/tree_sub");

/**
 * 获取所有位置数据
 * @returns 
 * data:
 * [
 *  {placeId:"001",placeName:"会议室",parentId:"0" },
 *  {placeId:"00101",placeName:"会议室A",parentId:"001" }
 * ]
 */
async function getPlaceList_list(useCache) {


    let res = null;
    if (useCache && cache.rowsCache.assetPlace.rows) {
        // console.log("assetPlace use cache .");
        res = { code: 1, message: "assetPlace use cache success", data: cache.rowsCache.assetPlace.rows };
    }
    else {
        res = await await dbClient.Query(table.tenant_asset_place, {}, { placeId: 1, placeName: 1, parentId: 1 });
        cache.rowsCache.assetPlace = {
            stmp: Date.now(),
            rows: res.data
        };
        // console.log("use db query for assetPlace");
    }

    return res;
    // return await dbClient.Query(table.tenant_asset_place, {}, { placeId: 1, placeName: 1, parentId: 1 });
}
/**
 * 获取所有位置数据
 * @returns {code:1,message:"success",data:{header:{},rows:[]}}
 */
async function getPlaceList_all(useCache) {
    let viewDef = cache.view_get().assetPlace;
    let header = viewDef.header.main;
    let res = await getPlaceList_list(useCache);
    if (res.code != 1) {
        return res;
    }
    return { code: 1, message: "success", data: { header: header, rows: res.data } };
}
/**
 * 更新位置名称
 * @param {string} placeId 
 * @param {object<placeId,placeName,parentId>} 父节点
 */
async function updatePlace(placeId, placeObj) {
    // delete placeObj.placeId;
    let placeT = JSON.parse(JSON.stringify(placeObj));
    delete placeT.placeId;
    return await dbClient.Update(table.tenant_asset_place, { placeId: placeId }, placeT);
}
/**
 * 删除w位置
 * @param {string} placeId 
 */
async function deletePlace(placeId) {
    if (String(placeId) === "1") {
        return { code: -1, message: "顶级位置无法删除." }
    }
    return await dbClient.Delete(table.tenant_asset_place, { placeId: placeId });
}
/**
 * 增加位置
 * @param {object<placeId,placeName,parentId} 资产位置对象 
 */
async function addPlace(placeObj) {
    return await addPlaceList([placeObj]);
}
/**
 * 获取位置新增/编辑模板
 */
async function getTemplate() {
    let viewDef = cache.view_get().assetPlace;
    let objTemplate = JSON.parse(JSON.stringify(viewDef.objTemplate));
    await billCommon.fillDataSource(objTemplate);
    return { code: 1, message: "success", data: objTemplate };
}
/**
 * 批量增加位置
 * @param {array<placeId,placeName,parentId>} orgList 
 */
async function addPlaceList(placeList) {
    if (!placeList || placeList.length < 1) {
        return { code: -1, message: "位置列表不能为空." };
    }
    let res1 = await dbClient.InsertMany(table.tenant_asset_place, placeList);
    if (res1.code != 1) {
        if (res1.message.indexOf("ER_DUP_ENTRY") >= 0) {
            return { code: -1, message: "重复的位置Id：" + placeList[0].placeId }
        }
        return res1;
    }
    let res2 = await initial_subList();
    return res2;
}
async function initial_subList() {
    let fields = { placeId: 1, parentId: 1 };
    let res_place = await dbClient.Query(table.tenant_asset_place, null, fields);
    if (res_place.code != 1) { return res_place; }
    let rows = res_place.data;
    let subList = tree_sub.treeToSubList(rows, "placeId", "parentId", "placeId_sub");
    let res = await dbClient.ExecuteTrans(async (con) => {
        let res1 = await dbClient.DeleteWithCon(con, table.tenant_asset_place_sub);
        // console.log(res1);
        if (res1.code != 1) { throw res1; }
        let res2 = await dbClient.InsertManyWithCon(con, table.tenant_asset_place_sub, subList);
        if (res2.code != 1) { throw res2; }
        return { code: 1, message: "success." };
    })
    return res;
}
module.exports.getPlaceList_list = getPlaceList_list;
module.exports.getPlaceList_all = getPlaceList_all;
module.exports.updatePlace = updatePlace;
module.exports.deletePlace = deletePlace;
module.exports.addPlace = addPlace;
module.exports.addPlaceList = addPlaceList;
module.exports.getTemplate = getTemplate;
module.exports.initial_subList = initial_subList;