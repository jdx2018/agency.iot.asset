const asset = require('./asset');
// let assetMock = {
//     tenantId: "supoin", assetId: "ZC00100000002", barcode: "", epc: "", assetName: "笔记本电脑",
//     assetClassId: "C00101", className: "笔记本电脑", manager: "张治金", brand: "apple",
//     model: "X3", sn: "", ownOrgId: "supoin01", ownOrgName: "销邦科技", useOrgId: "supoin01",
//     useOrgName: "销邦科技", status: 1, useDate: "", placeId: "P001", placeName: "英龙大厦",
//     serviceLife: 12, amount: 7999, purchaseDate: "2020-06-01", purchaseType: '采购', orderNo: "",
//     unit: "台", image: null, supplier: "", linkPerson: "张治金", telNo: "13826598771",
//     expired: "2021-10-01", mContent: "", createPerson: "admin",
// }
// async function testExecute() {
//     let res = "";
//     res = await asset.getAssetList_paifa();
//     // console.log(res.data.rows.length);
//     // // res=await asset.getAssetList_tuiku();
//     // // console.log(res);
//     // res = await asset.getAssetList();
//     // console.log(res.data);
//     // res = await asset.getAsset_detail("ZC00100000001");
//     // console.log(res);
//     // res = await asset.deleteAsset("ZC00100000001");
//     // console.log(res);

//     // res = await asset.addAsset(assetMock);
//     // console.log(res);
//     // res = await asset.updateAsset("ZC00100000002", { remarks: "测试修改" });
//     // console.log(res);
//     // res = await asset.getAsset_detail("ZC00100000002");
//     // console.log(res);
//     //     res = await asset.getAssetList_all();
//     //     console.log(res.data);
//     // res = asset.addAssetList(
//     //     [
//     //         { assetId: "PECI601",epc:"1" },
//     //         { assetId: "PECI602" },
//     //         { assetId: "PECI603" }
//     //     ]
//     // );
//     // res=await asset.getTemplate();
//     // console.log(res);
//     res=await asset.getAssetList_purchase();
//     console.log(res);
//     res=await asset.getAssetList_purchase("PO1608545265515");
//     console.log(res.data.rows);
//     res=await asset.getStorageQtyByAssetName("");
//     console.log(res);
//     res=await asset.getStorageQtyByAssetName("标识牌");
//     console.log(res);
// }
// testExecute();

async function test() {
  let assetList = [
    { epc: 'PECI602', classId: 'PP', assetId: '' },
    { epc: '', classId: 'QQ' },
    { epc: 'PasdasdECI603', classId: 'TQ', assetId: '' },
    { epc: '', classId: 'TQ', assetId: '' },
  ];
  // await asset.assetsListCodeCompletion(assetList);
  console.log(await asset.assetsListCodeCompletion(assetList));
  // console.log(assetList);
}
test();
