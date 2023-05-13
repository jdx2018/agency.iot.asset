const brand = require("./assetBrand");
async function testExecute() {
    let res = await brand.getBrand();
    console.log(res);
}
testExecute();