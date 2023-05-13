/**
 * 耗材相关数据操作
 */
// const dbClient = require("../db/db.local").db_local_client;
const dbClient = require('../db').dbClient
const table = require('../db/tableEnum').table
const cache = require('../cache')
const fieldTool = require('../tool/fieldTool')
const selectSource = require('../tool/selectSource');

async function fillDataSource(objTemplate) {
  let res = await dbClient.Query(table.v_asset_material_enum, null, { materialClass: 1, materialPlace: 1, brand: 1 })
  // console.log("asset.material.fill", res);
  if (res.code == 1) {
    let rows = res.data
    let m_class = {}
    let classList = []
    let m_place = {}
    let placeList = []
    let m_brand = {}
    let brandList = []
    for (let i = 0; i < rows.length; i++) {
      let tclass = rows[i].materialClass
      let tplace = rows[i].materialPlace
      let tbrand = rows[i].brand

      if (tclass && !m_class[tclass]) {
        m_class[tclass] = 1
      }
      if (tplace && !m_place[tplace]) {
        m_place[tplace] = 1
      }
      if (tbrand && !m_brand[tbrand]) {
        m_brand[tbrand] = 1
      }
    }
    Object.keys(m_class).forEach((key) => {
      classList.push({ value: key, text: key })
    })
    Object.keys(m_place).forEach((key) => {
      placeList.push({ value: key, text: key })
    })
    Object.keys(m_brand).forEach((key) => {
      brandList.push({ value: key, text: key })
    })
    // console.log("fll list", classList, placeList,brandList);
    if (objTemplate.materialClass) {
      objTemplate.materialClass.dataSource = classList
    }
    if (objTemplate.materialPlace) {
      objTemplate.materialPlace.dataSource = placeList
    }
    if (objTemplate.brand) {
      objTemplate.brand.dataSource = brandList
      // console.log("brand", objTemplate.brand.dataSource, brandList);
    }
  }

  return objTemplate
}
/**
 * 获取新增耗材模板
 */
async function getTemplate() {
  let objTemplate = cache.view_get().asset_material.objTemplate
  await selectSource.fillDataSource(objTemplate)
  // console.log("template.fill", objTemplate);
  await fillDataSource(objTemplate)

  return { code: 1, message: 'success', data: objTemplate }
}
/**
 * 获取耗材列表
 * @param {object} filter
 */
async function getMaterialList(filter) {
  let view_material = cache.view_get().asset_material
  let statusMap = view_material.typeDef.statusMap
  let header_main = view_material.header.main
  let filter_template = view_material.filter
  let query = {}
  if (filter) {
    Object.keys(filter).forEach((key) => {
      query[key] = filter[key]
    })
  }
  await selectSource.fillDataSource(filter_template.items_select)
  // console.log("material.filter", filter_template);
  await fillDataSource(filter_template.items_select)

  let fields = fieldTool.header2Fields(header_main, null)
  let res = await dbClient.Query(table.v_asset_material, query, fields)
  if (res.code != 1) {
    return res
  }
  let rows = res.data
  for (let i = 0; i < rows.length; i++) {
    rows[i].status = statusMap[rows[i].status]
  }
  return {
    code: 1,
    message: 'success',
    data: { header: header_main, rows: rows, filter: filter_template },
  }
}
async function getMaterialList_bill(query) {
  let header_detail = cache.view_get().asset_material.header.detail
  let fields = fieldTool.header2Fields(header_detail)

  let res = await dbClient.Query(table.v_asset_material, query, fields)
  if (res.code != 1) {
    return res
  }
  let rows = res.data
  return {
    code: 1,
    message: 'success',
    data: { header: header_detail, rows: rows },
  }
}

/**
 * 根据采购单获取资产列表
 * @param {string} billNo
 */
async function getMaterialList_purchase(billNo) {
  if (!billNo) {
    return { code: -1, message: '采购单号不能为空.' }
  }

  let viewDef = cache.view_get().bill_chuku_material
  let billType = cache.view_get().bill_purchase.typeDef.type
  let query = { billNo: billNo, billType: billType }
  let header_detail = viewDef.header.detail

  let fields = fieldTool.header2Fields(header_detail)
  let res_asset = await dbClient.Query(table.v_bill_purchase_material_detail_chuku, query, fields)
  if (res_asset.code != 1) {
    return res_asset
  }
  let rows = res_asset.data
  return { code: 1, message: 'success', data: { rows: rows } }
}
/**
 * 获取可出库耗材
 */
async function getMaterialList_chuku() {
  return getMaterialList_bill({ status: 1 })
}
/**
 * 获取可退库耗材
 */
async function getMaterialList_all() {
  return getMaterialList_bill()
}
/**
 * 获取耗材明细
 */
async function getMaterialDetail(materialId) {
  let objTemplate = cache.view_get().asset_material.objTemplate
  await fillDataSource(objTemplate)
  let query = { materialId: materialId }

  let res = await dbClient.Query(table.v_asset_material, query)
  if (res.code != 1) {
    return res
  }
  let obj = res.data[0]
  Object.keys(objTemplate).forEach((key) => {
    objTemplate[key].value = obj[key]
  })
  return { code: 1, message: 'success', data: objTemplate }
}
/**
 * 增加耗材
 * @param {object} mobj
 */
async function addMaterial(mobj) {
  if (!mobj) {
    return { code: -1, message: '耗材对象不能为空.' }
  }
  if (!mobj.materialId) {
    mobj.materialId = 'HC' + Date.now()
  }
  return addMaterialList([mobj])
}
/**
 * 批量增加耗材
 * @param {array<object>} mobjList
 */
async function addMaterialList(mobjList) {
  let res = await dbClient.InsertMany(table.tenant_asset_material, mobjList);
  if (res.code == -1 && res.message.indexOf("ER_DUP_ENTRY") > -1) {
    return { code: -1, message: "重复的耗材编号：" + mobjList[0].materialId }
}
  return res
}
/**
 * 更新耗材信息
 * @param {string} materialId
 * @param {object} dataContent
 */
async function updateMaterial(materialId, dataContent) {
  delete dataContent.tenantId
  delete dataContent.materialId
  let query = { materialId: materialId }
  let res = await dbClient.Update(table.tenant_asset_material, query, dataContent)
  return res
}
/**
 * 删除耗材信息
 * @param {string} materialId
 */
async function delteMaterial(materialId) {
  let query = { materialId: materialId }
  let res = await dbClient.Delete(table.tenant_asset_material, query)
  return res
}
/**
 * 获取耗材库存
 * @param {string} materialName
 */
async function getStorageQtyByMaterialName(materialName) {
  if (!materialName) {
    return { code: -1, message: '耗材名称不能为空.' }
  }
  let storageQty = 0
  let query = { materialName: materialName }
  let res = await dbClient.Query(table.v_asset_material_storage_materialName, query)
  // if (res.code != 1) { return res; }
  if (res.data && res.data.length > 0) {
    storageQty = res.data[0].storageQty
  }
  return { code: 1, message: 'success', data: storageQty }
}
module.exports.getTemplate = getTemplate
module.exports.getMaterialList = getMaterialList
module.exports.getMaterialList_chuku = getMaterialList_chuku
module.exports.getMaterialList_all = getMaterialList_all
module.exports.getMaterialDetail = getMaterialDetail
module.exports.addMaterial = addMaterial
module.exports.addMaterialList = addMaterialList
module.exports.updateMaterial = updateMaterial
module.exports.delteMaterial = delteMaterial
module.exports.getStorageQtyByMaterialName = getStorageQtyByMaterialName
module.exports.getMaterialList_purchase = getMaterialList_purchase
