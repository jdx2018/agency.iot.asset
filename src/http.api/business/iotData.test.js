const iotData = require('./iotData');

test();
async function test(){
    let parameters = {
        "body": {
            "tenantId": "supoin",
            "userId": "yusi",
            "funcId": "21",
            "deviceId": "364WLsGXFK2101XXIXX890H3616837",
            "deviceType": "11",
            "deviceStatus": "0",
            "direction": 2,
            "epc": "AA0103000000000000091827",
            "collectTime": "2021-01-04 14:22:23",
            "createTime": "2021-01-04 14:22:23",
            "createPerson": "system",
            // "updateTime": "",
            // "updatePerson": "",
            "remarks": ""
        }
    }
    let res = await iotData.iotData_put(JSON.stringify(parameters));
    console.log(res)
}