const org = require("./org.js");
async function test() {
    try {
        let res = null;
        res = org.getTemplate();

        let orgList = [{}]
        res = await org.check(orgList);
        // console.log(res);
        orgList = [
            { orgId: "Z0000001", orgName: "t001-name", parentId: "0" },
            { orgId: "Z0000001", orgName: "t001-name", parentId: "0" },]
        res = await org.check(orgList);
        console.log(JSON.stringify(res));
    }
    catch (err) {
        console.log(err);
    }
}
test();