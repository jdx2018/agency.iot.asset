const tree_sub = require("./tree_sub");
function test() {
    try {
        let rows = [
            { orgId: "A", parentId: 0 },
            { orgId: "A1", parentId: "A" },
            { orgId: "A2", parentId: "A" },
            { orgId: "A3", parentId: "A1" },
            { orgId: "A4", parentId: "A3" },

        ];
        let res = null;
        res = tree_sub.treeToSubList(rows, "orgId", "parentId", "orgId_sub");
        res.sort((a, b) => {
            return a.orgId.localeCompare(b.orgId);
            // if (a.orgId >= b.orgId) {
            //     return 1;
            // }
            // return -1;
        })
        console.log(res);
    }
    catch (err) {
        console.log(err);
    }
}
test();