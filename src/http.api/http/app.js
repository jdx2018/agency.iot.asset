const http = require('http');
const action = require('./action');
const router = require('./router');
const port = 6281;

// 启动时加入额外的定时任务：
const auto = require('../../autotask/asset_device_monitor_autoTask');

action.registAction();
http.createServer((req, res) => {
    try {
        req.headers["protocol"] = "http";
        handler = router.route(req);
        handler.process(req, res);
    }
    catch (err) {
        console.log("监听异常");
        console.log(err);
    }
}).listen(port, () => {
    console.log(`app is started and listening on ${port}`);
});

process.on("uncaughtException", (err) => {
    console.log(err);
});
