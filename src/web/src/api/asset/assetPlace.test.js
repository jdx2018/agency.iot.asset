const assetPlace = require("./assetPlace");
async function getPlaces() {
    let res = await assetPlace.getPlaceList_all();
    // console.log(res);
    res = await assetPlace.initial_subList();
    console.log(res);

    // res = await assetPlace.getTemplate();
    // console.log(res.data.placeId.dataSource);
    // // res = await assetPlace.addPlace("p00103", "测试位置", "P001");
    // // console.log(res);
    // res = await assetPlace.getPlaceList_all();
    // console.log(res.data.rows);
}
getPlaces();