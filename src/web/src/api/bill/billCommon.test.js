const billCommon = require("./billCommon");
async function test() {
    let res = billCommon.field2Ext({ placeId: "P001", org: "002" }, {
        useDate: "ext7",
        placeId: "ext10",
        employeeId: "ext11",
        useOrgId: "ext12"
    });
    console.log(res);
    res = await billCommon.fillDataSource({ placeId: {} });
    console.log(res);
}
test();