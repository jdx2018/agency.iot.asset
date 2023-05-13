const assetPlace = require("./assetPlace.js");
async function test() {
    try {
        let res = null;
        res = assetPlace.getTemplate();

        let assetPlaceList = [{}]
        res = await assetPlace.check(assetPlaceList);
        // console.log(res);
        assetPlaceList = [
            { placeId: "Z0000001", placeName: "t001-name", parentId: "J01001" },
            { placeId: "Z0000002", placeName: "t001-name", parentId: "办公室" },]
        res = await assetPlace.check(assetPlaceList);
        console.log(JSON.stringify(res));
    }
    catch (err) {
        console.log(err);
    }
}
test();