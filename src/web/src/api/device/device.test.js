const device = require("./device");
async function test() {
    try {
        let deviceObj = {
            deviceId: "1001", deviceType: 10
        };
        let res = null;
        res = await device.getTemplate();
        console.log(res);
        res = await device.getDeviceList();
        console.log(res);
        res = await device.addDevice(deviceObj);
        console.log(res);
        res = await device.updateDevice("1001", { remarks: "test" });
        console.log(res);
        res =await device.deleteDevice("1001");
        console.log(res);

    }
    catch (err) {
        console.log(err);
    }
}
test();