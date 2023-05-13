const dbClient = require("../db").dbClient;
const table = require("../db/tableEnum").table;
const fieldTool = require("../tool/fieldTool");
const selectSource = require("../tool/selectSource");
const cache = require("../cache");

/**
 * 查询单据列表
 * @example
 * { code:"1",message:"success", data:{  header:{},  rows:{}, filter:{}  }
 */
async function queryPayableList(filter) {
    let viewDef = cache.view_get().supplier_payable;
    let header_main = viewDef.header.main;
    let filter_template = viewDef.filter;

    //构造查询条件
    let query = {};
    if (filter) {
        Object.keys(filter).forEach((key) => {
            query[key] = filter[key];
        });
    }
    let fields = fieldTool.header2Fields(header_main);
    let res_payable = await dbClient.Query(table.v_supplier_payable, query, fields);

    if (res_payable.code != 1) { return res_payable };
    await selectSource.fillDataSource(filter_template.items_select);
    let rows = res_payable.data;
    return {
        code: 1,
        message: "success",
        data: {
            header: header_main,
            filter: filter_template,
            rows: rows,
        },
    };
}
/**
 * 查询应付明细列表
 * @param {string} 供应商编号
 */
async function queryPayableDetailList_all() {
    let viewDef = cache.view_get().supplier_payable;
    let header_payable = viewDef.header.detail;
    let res_pay = await dbClient.Query(table.v_supplier_payable_detail);
    if (res_pay.code != 1) { return res_pay; }
    let rows = res_pay.data;
    return { code: 1, message: "success.", data: { header: header_payable, rows: rows } };
}
/**
 * 查询应付明细列表
 * @param {string} 供应商编号
 */
async function queryPayableDetailList(supplierId) {
    let viewDef = cache.view_get().supplier_payable;
    let header_payable = viewDef.header.detail;
    let query = { supplierId: supplierId };
    let res_pay = await dbClient.Query(table.v_supplier_payable_detail, query);
    if (res_pay.code != 1) { return res_pay; }
    let rows = res_pay.data;
    return { code: 1, message: "success.", data: { header: header_payable, rows: rows } };
}
module.exports.queryPayableList = queryPayableList;
module.exports.queryPayableDetailList = queryPayableDetailList;
module.exports.queryPayableDetailList_all = queryPayableDetailList_all;

