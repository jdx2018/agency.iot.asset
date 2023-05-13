const dbClient = require("../db").dbClient;
const table = require("../db/tableEnum").table;
const cache = require("../cache");
/**
 *
 * @param {品牌信息} classId
 * @returns
 * @example
 * { code:1,message:"success",data:[{ value: 0, text: "IBM" }]}
 */
async function getBrand(useCache) {

  let res = null;
    if (useCache && cache.rowsCache.brand.rows) {
        // console.log("use asset brand cache.");
        res = { code: 1, message: "assetBrand use cache success", data: cache.rowsCache.brand.rows };
    }
    else {
        res = await dbClient.Query(table.v_brand, { }, { value: 1, text: 1 })
        cache.rowsCache.brand = {
            stmp: Date.now(),
            rows: res.data
        };
        // console.log("use db query for assetBrand");
    }

    return res;
  // return await dbClient.Query(table.v_brand, { }, { value: 1, text: 1 })

}
module.exports.getBrand = getBrand;
