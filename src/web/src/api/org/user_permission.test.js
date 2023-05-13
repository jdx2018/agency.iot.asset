const user_permission = require("./user_permission");

async function test() {
    let res = await user_permission.getPermission_page("admin");
    // console.log(res);
    // let pList = [
    //     { pageId: "jiechu_add", parentId: 3, isFunction: 1, status: 1 },
    //     { pageId: "1", parentId: 26, isFunction: 0, status: 1 },
    // ]
    // res = await user_permission.savePermission("admin", pList);
    // console.log(res);


}
test();