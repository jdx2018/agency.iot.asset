const dayjs = require('dayjs')
const dbClient = require("../db").dbClient;
const table = require("../db/tableEnum").table;
const billCommon = require("./billCommon");

const cache = require("../cache");
/**
 * 新增单据时获取主表信息显示模板
 */
async function getTemplate() {
    let viewDef = cache.view_get().bill_pand;
    let objTemplate = JSON.parse(JSON.stringify(viewDef.objTemplate));
    await billCommon.fillDataSource(objTemplate);
    return { code: 1, message: "success", data: { billMain: objTemplate, header: viewDef.header.asset } };

}
/**
 * 查询盘点单据列表
 * @param{<pandPerson,checkPerson,createTime_start,createTime_end>}filter
 * @example
 * { code:"1",message:"success", data:{  header:{},  rows:{}, filter:{}  }
 */
async function queryBill(filter) {
    let viewDef = cache.view_get().bill_pand;
    let user = cache.user_get();
    let header_main = viewDef.header.main;
    let filter_template = viewDef.filter;
    let statusMap = viewDef.typeDef.statusMap;
    billCommon.fillDataSource(filter_template.items_select);
    let query = { p_orgId: user.manage_orgId };
    if (filter) {
        if (filter.createTime_start) {
            query.createTime = { $gte: filter.createTime_start };
            delete filter.createTime_start;
        }
        if (filter.createTime_end) {
            if (!query.createTime) {
                query.createTime = {};
            }
            query.createTime.$lte = filter.createTime_end;
            delete filter.createTime_end;
        }
        Object.keys(filter).forEach((key) => {
            query[key] = filter[key];
        });
    }
    let fields = billCommon.header2Fields(header_main, {});
    let sortFields = { createTime: 0 };

    // let param_proc = {
    //     tenantId: user.tenantId,
    //     userId: user.userId,
    //     query: query,
    //     fields: fields
    // }
    // let res_billList = await dbClient.executeProc(table.p_inventory_get, param_proc);//区分数据权限
    let res_billList = await dbClient.Query(table.v_inventory_org, query, fields, null, null, sortFields);



    if (res_billList.code != 1) { return res_billList; }
    let rows = res_billList.data;
    for (let i = 0; i < rows.length; i++) {
        rows[i].status = statusMap[rows[i].status];
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
 * 查询盘点单明细
 * @param {*} billNo
 * @returns 
 * @example
 * { code:"1",message:"success", data:{  header:{},  rows:{}, filter:{}  }
 */
async function queryBillDetail(billNo, filter) {
    let viewDef = cache.view_get().bill_pand;
    let header = viewDef.header.detail;
    let statusMap = viewDef.typeDef.statusMap;
    let checkStatusMap = viewDef.typeDef.checkStatusMap;
    let fields = billCommon.header2Fields(header, null);
    let sortFields = { useEmployeeId: 1 };

    let query = { billNo: billNo };
    if (filter) {
        Object.keys(filter).forEach((key) => {
            query[key] = filter[key];
        });
    }

    delete fields.rowId;
    // console.log("查询盘点单明细", query);
    let res_pandDetail = await dbClient.Query(table.v_inventory_detail
        , query
        , fields
        , null
        , null
        , sortFields);
    if (res_pandDetail.code != 1) { return res_pandDetail; }
    let rows = res_pandDetail.data;
    for (let i = 0; i < rows.length; i++) {
        rows[i].status = statusMap[rows[i].status];
        rows[i].checkStatus = checkStatusMap[rows[i].checkStatus];
        rows[i].rowId = i + 1;
    }
    let filterDetail = viewDef.filterDetail;
    billCommon.fillDataSource(filterDetail.items_select);
    // console.log("盘点单明细查询记录", rows, header);
    return { code: 1, message: "success", data: { header: header, rows: rows, filter: filterDetail } };
}
/**
 * 删除盘点单据
 * @param {*} billNo
 */
async function deleteBill(billNo) {
    return await dbClient.ExecuteTrans(async (con) => {
        let res_1 = await dbClient.DeleteWithCon(con, table.tenant_inventory, { billNo: billNo });
        if (res_1.code != 1) { throw res_1; }
        let res_2 = await dbClient.DeleteWithCon(con, table.tenant_inventory_detail, { billNo: billNo });
        if (res_2.code != 1) { throw res_2 };
        return { code: 1, message: "删除盘点单成功" };
    });

}
/**
 * 保存盘点单据
 * @param {*} billMain 单据主表对象
 */
async function saveBill(billMain) {
    try {
        let viewDef = cache.view_get().bill_pand;
        let user = cache.user_get();
        let bill_status_panding = viewDef.typeDef.status.panding.value;
        let prefix = viewDef.typeDef.prefix;
        if (!billMain) {
            return { code: -1, message: "盘点单对象不能为空" };
        }
        if (!billMain.billName) {
            return { code: -1, message: "盘点单名称不能为空." };
        }
        if (!billMain.pdPerson) {
            return { code: -1, message: "盘点人不能为空." };
        }
        if (!billMain.checkPerson) {
            return { code: -1, message: "审核人不能为空" };
        }
        let mainObj = JSON.parse(JSON.stringify(billMain));
        mainObj.orgId = user.orgId;
        mainObj.billNo = prefix + Date.now();//生成单据编号
        mainObj.status = bill_status_panding;

        let procParam = {
            tenantId: user.tenantId,
            billNo: mainObj.billNo,
            ownOrgId: billMain.ownOrgId ? billMain.ownOrgId : user.orgId,
            useOrgId: billMain.useOrgId ? billMain.useOrgId : null,
            classId: billMain.classId ? billMain.classId : null,
            placeId: billMain.placeId ? billMain.placeId : null,
            documentDate_start: billMain.documentDate_start ? billMain.documentDate_start : null,
            documentDate_end: billMain.documentDate_end ? billMain.documentDate_end : null,
            exclude_classId: billMain.exclude_classId ? billMain.exclude_classId : null,
        }
        return dbClient.ExecuteTrans(async (con) => {

            let res_1 = await dbClient.InsertWithCon(con, table.tenant_inventory, mainObj);
            if (res_1.code != 1) { throw res_1; }
            // let res_2 = await dbClient.InsertManyWithCon(con, table.tenant_inventory_detail, assetList);
            // if (res_2.code != 1) { throw res_2; }
            let res_2 = await dbClient.executeProc(table.p_bill_pand_detail_save, procParam);
            if (res_2.code != 1) { throw res_2; }
            console.log("save pand detail", res_2);

            return { code: 1, message: "success." };
        });
    }
    catch (err) {
        return { code: -101, message: "生成盘点单失败" + err.message };
    }
}
/**
 * 审核资产明细
 * @param {string} billNo 单据编号
 * @param {array} assetId 资产编号
 */
async function checkDetail(billNo, assetList) {
    let user = cache.user_get();

    if (!assetList || assetList.length < 1) {
        return { code: -1, message: "资产列表不能为空." };

    }
    return dbClient.ExecuteTrans((async (con) => {

        // await dbClient.UpdateWithCon(con, table.tenant_inventory, { tenantId: tenantId, billNo: billNo }, { status: 2 });
        for (let i = 0; i < assetList.length; i++) {
            if (assetList[i].assetId) {
                let res = await dbClient.UpdateWithCon(con
                    , table.tenant_inventory_detail
                    , { billNo: billNo, assetId: assetList[i].assetId }
                    , { checkStatus: 1, checkPerson: user.employeeId });
                if (res.code != 1) { throw res; }
            }
        }
        //没有待审核的资产明细时，需要将整单改为审核完成状态
        let res_uncheckList = await dbClient.QueryWithCon(con
            , table.tenant_inventory_detail
            , { billNo: billNo, status: { $lte: 1 } }
            , { assetId: 1 });
        if (res_uncheckList.code != 1) { throw res_uncheckList; }

        // console.log("待审核明细", res_uncheckList.data);


        if (res_uncheckList.data.length < 1) {
            let res_updateBill = await dbClient.UpdateWithCon(con
                , table.tenant_inventory
                , { billNo: billNo }
                , { status: 2 });
            if (res_updateBill.code != 1) { throw res_updateBill; }
        }
        return { code: 1, message: "审核成功." };

    }));
}
/**
 * 取消审核明细
 * @param {string} billNo 
 * @param {array} assetList 
 */
async function unCheckDetail(billNo, assetList) {
    if (!assetList || assetList.length < 1) {
        return { code: -1, message: "资产列表不能为空." };
    }
    return dbClient.ExecuteTrans((async (con) => {

        //取消审核某个资产时，需要将整单状态改编为待审核
        await dbClient.UpdateWithCon(con, table.tenant_inventory, { billNo: billNo }, { status: 0 });
        for (let i = 0; i < assetList.length; i++) {
            let res = await dbClient.UpdateWithCon(con
                , table.tenant_inventory_detail
                , { billNo: billNo, assetId: assetList[i].assetId }
                , { checkStatus: 0 });
            if (res.code != 1) { throw res; }
        }
        return { code: 1, message: "取消审核成功." };

    }));
}
/**
 * 整单审核
 * @param {string} billNo 
 */
async function checkBill(billNo) {
    let user = cache.user_get();
    return dbClient.ExecuteTrans((async (con) => {

        let res_1 = await dbClient.UpdateWithCon(con
            , table.tenant_inventory
            , { billNo: billNo }
            , { status: 2 });

        if (res_1.code != 1) { throw res_1; }

        let res_2 = await dbClient.UpdateWithCon(con
            , table.tenant_inventory_detail,
            { billNo: billNo }
            , { checkStatus: 1, checkPerson: user.employeeId });

        if (res_2.code != 1) { throw res_2; }

        return { code: 1, message: "整单审核成功." };
    }));
}
async function getTenantTopId() {
    let res_org_top = await dbClient.Query(table.v_org_top);
    if (res_org_top.code != 1) {
        res_org_top.message = "获取顶级机构失败";
        return res_org_top;
    }
    let res_asset_class_top = await dbClient.Query(table.v_asset_class_top);
    if (res_asset_class_top.code != 1) {
        res_asset_class_top.message = "获取资产分类顶级ID失败";
        return res_asset_class_top;
    }

    let res_asset_place_top = await dbClient.Query(table.v_asset_place_top);
    if (res_asset_place_top.code != 1) {
        res_asset_place_top.message = "获取资产位置顶级ID失败.";
        return res_asset_place_top;
    }
    let orgId_top = res_org_top.data[0].orgId;
    let asset_classId_top = res_asset_class_top.data[0].classId;
    let asset_placeId_top = res_asset_place_top.data[0].placeId;
    let res = { code: 1, message: "success", data: { orgId_top, asset_classId_top, asset_placeId_top } };
    return res;

}

/**
 * 自动盘点保存单据（默认全盘）；
 * @param {Array} pandDetail 盘点到的明细数据
 */
// (async () => { console.log(await saveAutoBill([{ sn: '10086', epc: '1001' }])) })()
async function saveAutoBill(pandDetail) {
    try {
        if (!pandDetail || !Array.isArray(pandDetail) || pandDetail.length === 0) throw new Error('pandDetail不能为空，且必须为数组！')
        let viewDef = cache.view_get().bill_pand;
        let user = cache.user_get();
        let bill_status_panding = viewDef.typeDef.status.panding.value;
        let bill_status_notChecked = viewDef.typeDef.status.notChecked.value;
        let prefix = viewDef.typeDef.prefix;

        let billMain = {
            billNo: prefix + Date.now(),//生成单据编号
            billName: '自动盘点',
            pdPerson: user.employeeId,
            checkPerson: user.employeeId,
            status: bill_status_notChecked,
            pdLossQty: 0,//盘亏数量
            orgId: user.orgId,
            ownOrgId: user.orgId,
            useOrgId: user.orgId,
            classId: null,
            placeId: null,
        }
        let billDetailCommonFields = {
            billNo: billMain.billNo,
            status: bill_status_notChecked,
            checkStatus: 0,
            pdPerson: user.employeeId,
            pdDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            checkPerson: user.employeeId,
        }
        // 比对盘点到的标签vs资产列表中的所有资产：
        let res_all_asset = await dbClient.Query('tenant_asset', null, { assetId: 1, epc: 1 })
        if (res_all_asset.code != 1) throw res_all_asset;
        let all_asset = res_all_asset.data;
        let pand_get_epcList = [];
        let pand_get_epcList_obj = {};
        for (let item of pandDetail) {
            pand_get_epcList.push(item.epc)
            pand_get_epcList_obj[item.epc] = item
        }
        let billDetail = [];
        for (let asset of all_asset) {
            if (pand_get_epcList.includes(asset.epc)) {
                billDetail.push({
                    ...billDetailCommonFields,
                    assetId: asset.assetId,
                    status: bill_status_notChecked,
                    pdaSn: pand_get_epcList_obj[asset.epc].sn
                })
            }
            else {
                billMain.pdLossQty += 1
                billDetail.push({
                    ...billDetailCommonFields,
                    assetId: asset.assetId,
                    status: bill_status_panding,
                    pdaSn: ''
                })
            }
        }
        return dbClient.ExecuteTrans(async (con) => {
            let res_1 = await dbClient.InsertWithCon(con, table.tenant_inventory, billMain);
            if (res_1.code != 1) { throw res_1; }
            let res_2 = await dbClient.InsertManyWithCon(con, table.tenant_inventory_detail, billDetail);
            if (res_2.code != 1) { throw res_2; }
            return { code: 1, message: "success." };
        });
    }
    catch (err) {
        return { code: -101, message: "生成盘点单失败" + err.message };
    }
}



module.exports.getTemplate = getTemplate;
module.exports.queryBill = queryBill;
module.exports.queryBillDetail = queryBillDetail;
module.exports.saveBill = saveBill;
module.exports.deleteBill = deleteBill;
module.exports.checkDetail = checkDetail;
module.exports.unCheckDetail = unCheckDetail;
module.exports.checkBill = checkBill;
module.exports.getTenantTopId = getTenantTopId;
module.exports.saveAutoBill = saveAutoBill;

