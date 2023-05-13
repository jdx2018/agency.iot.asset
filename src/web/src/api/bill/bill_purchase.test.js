const bill_purchase = require('./bill_purchase.js')

test()
async function test(){
    let res = null;
    // res = await bill_purchase.updateAssetPrice('PO1608644526373');
    res = await bill_purchase.getMaterialList_forPriceUpdate("PO1608718347318")
    console.log(res.data)
}