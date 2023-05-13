/**
 * 资产分类操作
 */
const dbClient = require("../db").dbClient;
const billCommon = require("../bill/billCommon");
const table = require("../db/tableEnum").table;
const cache = require("../cache");
const tree_sub = require("../tool/tree_sub");

/**
 * 获取分类新增/编辑模板
 */
async function getTemplate() {
    let viewDef = cache.view_get().assetClass;
    let objTemplate = viewDef.objTemplate;
    await billCommon.fillDataSource(objTemplate);
    return { code: 1, message: "success", data: objTemplate };
}
/**
 * 获取资产分类信息 一般，下拉列表使用
 *  @returns
 * @example 返回示例
 * {
    * code:1, * message:"success", data:[]
 */
async function getAssetClass_list(useCache) {
    let res = null;
    if (useCache && cache.rowsCache.assetClass.rows) {
        // console.log("use asset cache.");
        res = { code: 1, message: "assetClass use cache success", data: cache.rowsCache.assetClass.rows };
    }
    else {
        res = await dbClient.Query(table.tenant_asset_class,
            {}, { classId: 1, className: 1, parentId: 1 });
        cache.rowsCache.assetClass = {
            stmp: Date.now(),
            rows: res.data
        };
        // console.log("use db query for assetClass", res);
    }

    return res;
}
/**
 * 获取所有资产分类信息
 * @returns
 * @example 返回示例
 * {
 * code:1, * message:"success", data:{header:{},rows:[]}
 */
async function getAssetClass_all(useCache) {
    let viewDef = cache.view_get().assetClass;
    let header = viewDef.header.main;
    let res = await getAssetClass_list(useCache);
    if (!res.code == 1) {
        return res;
    }
    // console.log("查询资产类别；");
    // console.log(res);
    return { code: 1, message: "success", data: { header: header, rows: res.data } };
}
/**
 * 增加分类
 * @param {object<classId,className,parentId>} 资产分类对象 
 */
async function addClass(classObj) {
    return await addClassList([classObj]);
}

/**
 * 批量增加分类
 * @param {array<classId,className,parentId>} orgList 
 */
async function addClassList(classList) {
    if (!classList || classList.length < 1) {
        return { code: -1, message: "分类列表不能为空." };
    }
    let res1 = await dbClient.InsertMany(table.tenant_asset_class, classList);
    if (res1.code != 1) {
        return res1;
    }
    let res2 = await initial_subList();
    return res2;
}

/**
 * 更新分类名称
 * @param {string} classId 
 * @param {object<classId,className,parentId>} className 
 */
async function updateClass(classId, classObj) {
    // delete classObj.classId;
    let classT = JSON.parse(JSON.stringify(classObj));
    delete classT.classId;
    return await dbClient.Update(table.tenant_asset_class, { classId: classId }, classT);
}
/**
 * 删除分类
 * @param {string} classId 
 */
async function deleteClass(classId) {
    if (String(classId) === "1") {
        return { code: -1, message: "顶级资产分类不能删除." }
    }
    return await dbClient.Delete(table.tenant_asset_class,
        { classId: classId });
}
async function initial_subList() {
    let fields = { classId: 1, parentId: 1 };
    let res_place = await dbClient.Query(table.tenant_asset_class, null, fields);
    if (res_place.code != 1) { return res_place; }
    let rows = res_place.data;
    let subList = tree_sub.treeToSubList(rows, "classId", "parentId", "classId_sub");
    let res = await dbClient.ExecuteTrans(async (con) => {
        let res1 = await dbClient.DeleteWithCon(con, table.tenant_asset_class_sub);
        // console.log(res1);
        if (res1.code != 1) { throw res1; }
        let res2 = await dbClient.InsertManyWithCon(con, table.tenant_asset_class_sub, subList);
        if (res2.code != 1) { throw res2; }
        return { code: 1, message: "success." };
    })
    return res;
}

module.exports.getAssetClass_list = getAssetClass_list;
module.exports.getAssetClass_all = getAssetClass_all;
module.exports.updateClass = updateClass;
module.exports.deleteClass = deleteClass;
module.exports.addClass = addClass;
module.exports.addClassList = addClassList;
module.exports.getTemplate = getTemplate;
module.exports.initial_subList = initial_subList;