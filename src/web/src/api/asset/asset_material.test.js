const asset_material = require("./asset_material");
async function test() {
    try {
        let mObj = {
            materialId: "m01",
            materialName: "打印纸",
            materialClass: "纸张",
            materialPlace: "库房1",
            brand: "得力"
        };
        let res = "";

        // res = await asset_material.addMaterial(mObj);
        // console.log(res);
        // res = await asset_material.updateMaterial("m01", { remarks: "test" });
        // console.log(res);
        // res = await asset_material.getMaterialDetail("m01");
        // console.log(res);
        // res = await asset_material.getTemplate();
        // console.log(res);
        // res = await asset_material.getMaterialList();
        // console.log(res);
        // res = await asset_material.getMaterialList_chuku();
        // console.log(res);
        // res = await asset_material.getMaterialList_tuiku();
        // console.log(res);
        // res = await asset_material.delteMaterial("m01");
        // console.log(res);
        // res = await asset_material.getStorageQtyByMaterialName();
        // console.log(res);
        // res = await asset_material.getStorageQtyByMaterialName("打印纸");
        // console.log(res);
    }
    catch (err) {
        console.log(err);
    }
}
test();