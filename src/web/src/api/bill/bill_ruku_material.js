const dbClient = require("../db").dbClient;
const table = require("../db/tableEnum").table;
const fieldTool = require("../tool/fieldTool");
const selectSource = require("../tool/selectSource");
const asset_material = require("../asset/asset_material");
const cache = require("../cache");
/**
 * 查询派发单据列表
 * @example
 * { code:"1",message:"success", data:{  header:{},  rows:{}, filter:{}  }
 */
async function queryBill(filter) {
    let viewDef = cache.view_get().bill_ruku_material;
    const user = cache.user_get();
    let fieldMap = viewDef.typeDef.fieldMap;
    let header_main = viewDef.header.main;
    let filter_template = viewDef.filter;
    let statusMap = viewDef.typeDef.statusMap;
    let billTypeMap = viewDef.typeDef.billTypeMap;
    let sortFields = { createTime: 0 };
    //构造查询条件
    let query = {};
    if (filter) {
        if (filter.inDate_start) {
            query.ext7 = { $gte: filter.inDate_start };
            delete filter.inDate_start;
        }
        if (filter.inDate_end) {
            if (!query.ext7) {
                query.ext7 = {};
            }
            query.ext7.$lte = filter.inDate_end;
            delete filter.inDate_end;
        }
        Object.keys(filter).forEach((key) => {
            query[key] = filter[key];
        });
    }
    let fields = fieldTool.header2Fields(header_main, null);


    // console.log("paifa-procparam",param_proc)
    let res_billList = await dbClient.Query(table.v_bill_ruku_material, query, fields, null, null, sortFields);
    if (res_billList.code != 1) { return res_billList; }
    await selectSource.fillDataSource(filter_template.items_select);
    // console.log("bill_paifa", filter_template.items_select);
    let rows = res_billList.data;
    for (let i = 0; i < rows.length; i++) {
        rows[i].status = statusMap[rows[i].status];
        rows[i].billType = billTypeMap[rows[i].billType];
    }
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
 * 新增单据时获取主表信息显示模板
 */
async function getBillMainTemplate() {
    let viewDef = cache.view_get().bill_ruku_material;
    let user = cache.user_get();
    let header_materialList = viewDef.header.detail;
    let billMain_template = JSON.parse(JSON.stringify(viewDef.billMainTemplate));
    billMain_template.operatePersonId.value = user.employeeName
    await selectSource.fillDataSource(billMain_template);
    let res = {
        code: 1, message: "success",
        data: { billMain: billMain_template, billDetail: { header: header_materialList, rows: [] } },
        method: { getMaterialList: asset_material.getMaterialList_all }
    }
    return res;
}
/**
 * 查询入库单据明细
 * @param {*} billNo
 */
async function queryBillDetail(billNo) {
    // console.log("查询入库单明细", billNo);
    if (!billNo) {
        return { code: -1, message: "入库单号不能为空." };
    }
    let viewDef = cache.view_get().bill_ruku_material;
    let billType = viewDef.typeDef.type;
    let billMain_template = viewDef.billMainTemplate;
    let detailHeader = viewDef.header.detail;
    // console.log("查询单据明细",billMain_template,billMain);
    let fields_detail = fieldTool.header2Fields(detailHeader);
    let query = { billNo: billNo, billType: billType };
    //查询主表信息
    let res_billMain = await dbClient.Query(table.v_bill_ruku_material, query);
    if (res_billMain.code != 1) { return res_billMain; }
    if (!res_billMain.data || res_billMain.data.length < 1) { return { code: -1, message: "该单据不存在." }; }
    //查询明细表
    let res_billDetail = await dbClient.Query(table.v_bill_ruku_material_detail, query, fields_detail);
    if (res_billDetail.code != 1) { return res_billDetail };


    let billMain = res_billMain.data[0];//取得主表数据
    let arrDetail = res_billDetail.data;//取得明细资产数据
    await selectSource.fillDataSource(billMain_template);//填充下拉列表
    Object.keys(billMain_template).forEach((key) => {
        billMain_template[key].value = billMain[key];
    });
    return {
        code: 1, message: "success",
        data: {
            billMain: billMain_template,
            billDetail: { header: detailHeader, rows: arrDetail },
            method: { getMaterialList: asset_material.getMaterialList_all }
        }
    }
}
/**
 * 删除单据
 * @param {*} billNo
 */
async function deleteBill(billNo) {
    let res_check =await checkBeforeUpdateOrDelete(billNo);
    if (res_check.code != 1) { return res_check; }
    let viewDef = cache.view_get().bill_ruku_material;
    let billType = viewDef.typeDef.type;
    let query = { billNo: billNo, billType: billType };
    let res = await dbClient.ExecuteTrans(async (con) => {
        let res1 = await dbClient.DeleteWithCon(con, table.tenant_bill_material, query);
        if (res1.code != 1) { throw res1; }
        let res2 = await dbClient.DeleteWithCon(con, table.tenant_bill_material_detail, query);
        if (res2.code != 1) { throw res2; }
        return { code: 1, message: "success." };

    })
    return res;
}
/**
 * 保存单据
 * @param {*} billMain 单据主表对象
 * @param {*} materialList 耗材列表 [{materialId:""}]
 */
async function saveBill(billMain, materialList) {
    let useCheck = cache.tenant_config_get().useCheck;
    let user = cache.user_get();
    let viewDef = cache.view_get().bill_ruku_material;
    let fieldMap = viewDef.typeDef.fieldMap;
    let bill_status_initial = viewDef.typeDef.status.initial.value;
    let prefix = viewDef.typeDef.prefix;
    let billType = viewDef.typeDef.type;
    if (!billMain) {
        return { code: -1, message: "单据主表信息不能为空." };
    }

    if (!billMain.inDate) {
        return { code: -1, message: "领用日期不能为空" };
    }
    if (!materialList || materialList.length < 1) {
        return { code: -1, message: "耗材列表不能为空" };
    }
    let mainObj = JSON.parse(JSON.stringify(billMain));
    mainObj.billNo = prefix + Date.now(); //生成单据编号
    mainObj.billType = billType;
    mainObj.status = bill_status_initial;


    mainObj.manage_orgId = user.manage_orgId;//可以管理单据的部门
    mainObj.operatePersonId = user.employeeId;
    mainObj.materialNum = materialList.length;
    // console.log("出库对象", mainObj);
    mainObj = fieldTool.field2Ext(mainObj, fieldMap);

    // console.log("耗材入库映射转换后对象", mainObj, fieldMap);


    let materialList_t = [];
    for (let i = 0; i < materialList.length; i++) {
        let materialT = {
            materialId: materialList[i].materialId,
            billNo: mainObj.billNo,
            billType: mainObj.billType,
            qty: materialList[i].qty,
            status: mainObj.status
        };
        materialList_t.push(materialT);
    }
    return await dbClient.ExecuteTrans(async (con) => {

        let res1 = await dbClient.InsertWithCon(con, table.tenant_bill_material, mainObj);
        if (res1.code != 1) { throw res1; };
        // console.log("save main finish.");
        let res2 = await dbClient.InsertManyWithCon(con, table.tenant_bill_material_detail, materialList_t);
        if (res2.code != 1) { throw res2; }
        // console.log("save detail finish.");
        //更新库存
        if (!useCheck) {
            for (let i = 0; i < materialList.length; i++) {
                let m = materialList[i];
                let query_m = { materialId: m.materialId };
                let res_material = await dbClient.QueryWithCon(con, table.tenant_asset_material, query_m, { storageQty: 1 });
                let qty_storage = res_material.data[0].storageQty;
                let qty_remain = qty_storage + m.qty;
                let res0 = await dbClient.UpdateWithCon(con, table.tenant_asset_material, query_m, { storageQty: qty_remain });
                if (res0.code != 1) { throw res0; }
                // if(res0.)
            }
        }
        return { code: 1, message: "保存单据成功" };
    })
}
/**
 * 更新校验，是否可以更新/删除单据
 * @param {string} billNo 
 */
async function checkBeforeUpdateOrDelete(billNo) {
    let user = cache.user_get();
    let viewDef = cache.view_get().bill_ruku_material;
    let bill_status_initial = viewDef.typeDef.status.initial.value;
    let billType = viewDef.typeDef.type;
    let query = { billNo: billNo, billType: billType }
    let res_bill = await dbClient.Query(table.tenant_bill_material, query, { status: 1 });
    if (res_bill.code != 1) { return res_bill; }
    let billStatus = res_bill.data[0].status;
    if (billStatus != bill_status_initial) {
        return { code: -1, message: "已入库/已取消的单据，不能删除/编辑." }
    }
    return { code: 1, message: "success." };
}
/**
 * 更新单据
 * @param {string} billNo 单号
 * @param {object} billMain 单据主表对象
 * @param {array<object>} maerialList 耗材列表
 */
async function updateBill(billNo, billMain, materialList) {
    let res_check = await checkBeforeUpdateOrDelete(billNo);
    if (res_check.code != 1) { return res_check; }
    let viewDef = cache.view_get().bill_ruku_material;
    let billType = viewDef.typeDef.type;
    let fieldMap = viewDef.typeDef.fieldMap;
    let bill_updateContent = { inDate: billMain.inDate };
    bill_updateContent = fieldTool.field2Ext(bill_updateContent, fieldMap);
    let query_bill = { billNo: billNo, billType: billType };
    let res = await dbClient.ExecuteTrans(async (con) => {
        let res = await dbClient.UpdateWithCon(con, table.tenant_bill_material, query_bill, bill_updateContent);
        if (res.code != 1) { throw res; }
        for (let i = 0; i < materialList.length; i++) {
            let materialId = materialList[i].materialId;
            let qty = materialList[i].qty;
            let query_detail = { billNo: billNo, billType: billType, materialId: materialId };
            let detail_updateContent = { qty: qty };
            let res2 = await dbClient.UpdateWithCon(con, table.tenant_bill_material_detail, query_detail, detail_updateContent);
            if (res2.code != 1) { throw res2; }
        }
        return { code: 1, message: "success" };
    });
    return res;
}
/**
 * 审核单据
 * @param {string} billNo 
 */
async function checkBill(billNo) {
    let viewDef = cache.view_get().bill_ruku_material;
    let billType = viewDef.typeDef.type;
    let checked = viewDef.typeDef.status.final.value;
    let res_billDetail = await dbClient.Query(table.v_bill_ruku_material_detail, { billNo: billNo, billType: billType });
    if (res_billDetail.code != 1) { return res_billDetail; }
    if (res_billDetail.data.length < 1) { return { code: -1, message: "单据不存或该单据没有关联耗材." }; }

    let billStatus = res_billDetail.data[0].status;
    console.log("入库单审核", billStatus, checked);
    if (billStatus >= checked) { return { code: -1, message: "该单据已审核/取消，不能再次审核" }; }

    let materialList = res_billDetail.data;
    let res = await dbClient.ExecuteTrans(async (con) => {
        let res1 = await dbClient.UpdateWithCon(con, table.tenant_bill_material,
            { billNo: billNo, billType: billType }, { status: checked });
        // console.log(res1);
        if (res1.code != 1) { throw res1; }
        // console.log("t1 success.");
        let res2 = await dbClient.UpdateWithCon(con, table.tenant_bill_material_detail,
            { billNo: billNo, billType: billType }, { status: checked });
        if (res2.code != 1) { throw res2; }
        // console.log("t2 success.");
        for (let i = 0; i < materialList.length; i++) {
            let m = materialList[i];
            let query_m = { materialId: m.materialId };
            let res_material = await dbClient.QueryWithCon(con, table.tenant_asset_material, query_m, { storageQty: 1 });
            let qty_storage = res_material.data[0].storageQty;
            let qty_remain = qty_storage + m.qty;
            let res0 = await dbClient.UpdateWithCon(con, table.tenant_asset_material, query_m, { storageQty: qty_remain });
            if (res0.code != 1) { throw res0; }
        }
        return { code: 1, message: "审核成功." };
    });
    return res;
    return { code: 1, message: "success" };
}
/**
 * 取消入库
 * @param {string} billNo 
 */
async function cancelBill(billNo) {

    let viewDef = cache.view_get().bill_ruku_material;
    let billType = viewDef.typeDef.type;
    let canceled = viewDef.typeDef.status.canceled.value;
    let res_billDetail = await dbClient.Query(table.v_bill_ruku_material_detail, { billNo: billNo, billType: billType });
    if (res_billDetail.code != 1) { return res_billDetail; }
    if (res_billDetail.data.length < 1) { return { code: -1, message: "单据不存或该单据没有关联耗材." }; }

    let billStatus = res_billDetail.data[0].status;
    if (billStatus >= canceled) { return { code: -1, message: "该单据已取消，不能再次取消" }; }

    let materialList = res_billDetail.data;
    let res = await dbClient.ExecuteTrans(async (con) => {
        let res1 = await dbClient.UpdateWithCon(con, table.tenant_bill_material,
            { billNo: billNo, billType: billType }, { status: canceled });
        // console.log(res1);
        if (res1.code != 1) { throw res1; }
        // console.log("t1 success.");
        let res2 = await dbClient.UpdateWithCon(con, table.tenant_bill_material_detail,
            { billNo: billNo, billType: billType }, { status: canceled });
        if (res2.code != 1) { throw res2; }
        // console.log("t2 success.");
        for (let i = 0; i < materialList.length; i++) {
            let m = materialList[i];
            let query_m = { materialId: m.materialId };
            let res_material = await dbClient.QueryWithCon(con, table.tenant_asset_material, query_m, { storageQty: 1 });
            let qty_storage = res_material.data[0].storageQty;
            let qty_remain = qty_storage - m.qty;
            if (qty_remain < 0) {
                throw new Error("耗材数量不足，不能取消入库." + m.materialId + "/" + m.materialName);
            }
            let res0 = await dbClient.UpdateWithCon(con, table.tenant_asset_material, query_m, { storageQty: qty_remain });
            if (res0.code != 1) { throw res0; }
        }
        return { code: 1, message: "取消入库成功." };
    });
    return res;
    return { code: 1, message: "success" };
}
module.exports.queryBill = queryBill;
module.exports.saveBill = saveBill;
module.exports.deleteBill = deleteBill;
module.exports.queryBillDetail = queryBillDetail;
module.exports.getBillMainTemplate = getBillMainTemplate;
module.exports.updateBill = updateBill;
module.exports.checkBill = checkBill;
module.exports.cancelBill = cancelBill;
