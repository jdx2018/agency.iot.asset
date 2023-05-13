const dbClient = require("./db/db.client").dbClient;
async function updatePage(pageList) {
    if (!pageList || pageList.length < 1) { return { code: -1, message: "页面列表不能为空." }; }
    let res = await dbClient.ExecuteTrans(async (con) => {
        for (let i = 0; i < pageList.length; i++) {
            let p = pageList[i];
            let update_where = { id: p.id };
            delete p.id;
            let res1 = await dbClient.UpdateWithCon(con, "tenant_page", update_where, p);
            if (res1.code != 1) { throw res1; }

        }
        return { code: 1, message: "success." };
    });
    return res;
}
module.exports.updatePage=updatePage;