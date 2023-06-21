const fs = require('fs');
const crypto = require('crypto');
const CryptoJS = require('crypto-js');




async function licenseFile(ctx){
    let license = ctx.request.body.license
    let registerID = ctx.request.body.registerID

    const aesKeyBase64 = license.substring(0, 24);
    const ivBase64 = license.substring(24,48)
    const aesDataLength = parseInt(license.substring(48, 50), 16);
    const aesData = license.substring(50, 50 + aesDataLength);
    const code = decryptAES(aesData,aesKeyBase64,ivBase64)
    const timestamp = code.slice(0,10)
    const aesRegisterID = code.slice(10)
    if(registerID === aesRegisterID){
        const filePath = 'license.txt';
        const fileData = {
            license,
            registerID,
            writetime:Date.now()
        };
        let jsonStr = JSON.stringify(fileData);
        const hash = crypto.createHash('md5');
        hash.update(jsonStr);
        const digest = hash.digest('hex');
        const hashend = crypto.createHash('md5');
        hashend.update(digest.slice(16))
        const digestend = hashend.digest('hex')
    
        let writeStr = digest+digestend
        fs.writeFile(filePath, writeStr, (err) => {
            if (err) throw err;
        });
        let res = {
            code:1,
            msg:"File has been saved",
        }
        return res;
    }else{
        let res = {
            code:0,
            msg:"license is wrong",
        }
        return res;
    }
}   


function decryptAES(aesData,keyBase64,ivBase64) {
    const key = CryptoJS.enc.Base64.parse(keyBase64);
    const iv = CryptoJS.enc.Base64.parse(ivBase64);

    const aesDataParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(aesData),
      });
    const bytes = CryptoJS.AES.decrypt(aesDataParams,key,{iv:iv,mode: CryptoJS.mode.CBC,padding: CryptoJS.pad.Pkcs7});
    return CryptoJS.enc.Utf8.stringify(bytes)
  }

module.exports = {licenseFile}