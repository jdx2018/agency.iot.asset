const NodeRSA = require('node-rsa');

const CryptoJS = require('crypto-js');
const fs = require('fs');
//定义待加密的数据

//定义 AES 密钥和 IV
const aesKey = CryptoJS.enc.Utf8.parse('SecretPassphrase');
const iv = CryptoJS.enc.Utf8.parse('1234567890123456');

//创建RSA实例
// const RSA = new NodeRSA();


function getLic(ctx){
    const registerID = ctx.request.body.registerID
    const timestamp = 4070880000
    let lic = "";
    try{
        const aesData = encrypt(aesKey,timestamp+registerID,iv);
        const aesDataLength = aesData.length.toString(16);
        //const sign = RSA.sign(aesData, 'base64', 'utf8'); // 通过私钥对数据进行签名
        const aesKeyBase64 = CryptoJS.enc.Base64.stringify(aesKey);
        const ivBase64 = CryptoJS.enc.Base64.stringify(iv);

        lic = aesKeyBase64 + ivBase64 + aesDataLength + aesData;
        
        let res = {
            code:1,
            msg:'success',
            data:{
                license:lic
            }
        }
        return res;
    }catch(e){
        console.error(e);
        return e;
    }
}

// AES 加密
function encrypt(key, data,IV) {
    const cipher = CryptoJS.AES.encrypt(data, key,
        {iv:IV,mode: CryptoJS.mode.CBC,padding: CryptoJS.pad.Pkcs7});
    return cipher.toString();
}

function getTimeStampbyCompany(){
    //去数据库查询
    let res = null;
    return res
}




module.exports = {getLic}