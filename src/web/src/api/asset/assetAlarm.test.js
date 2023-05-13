const bll = require("./assetAlarm");
async function test() {
    try {
        let res = await bll.getAlaramList();
        console.log(res);
        let alarm = res.data.rows[0];
        console.log(alarm);
        res = await bll.updateAlarm(alarm.id, alarm.assetId, "报警已处理");
        console.log(res);
        res=bll.getTemplate();
        console.log(res);
    }
    catch (err) {
        console.log(err);
    }
}
test();