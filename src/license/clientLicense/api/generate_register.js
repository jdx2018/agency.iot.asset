const { Worker, threadId } = require('worker_threads');
const si = require('systeminformation');
const CryptoJS = require('crypto-js');
const util = require('util');

const macaddress = require('macaddress');
const serialNumber = require('serial-number');
const oneAsync = util.promisify(macaddress.one);
const { exec } = require('child_process');



async function generateRegCode() {
  try {
    async function getMachineInfo() {
      const macAddress = await oneAsync().catch(error => console.error(error));
      const diskSerialNumber = await getDiskSerialNumber().catch(error => console.error(error));
  

  
      return {macAddress, diskSerialNumber};
    }
  
    function getDiskSerialNumber() {
      return new Promise((resolve, reject) => {
        exec('wmic DISKDRIVE GET SerialNumber', (error, stdout, stderr) => {
          if (error) {
            reject(error);
          } else {
            parseResult(stdout, (parseError, serialNumber) => {
              if (parseError) {
                reject(parseError);
              } else {
                resolve(serialNumber);
              }
            });
          }
        });
      });
    }
  
    function parseResult(result, cb) {
      const lines = result.trim().split('\n').slice(1);
      if (lines.length === 0) {
        cb(new Error('Unable to parse result'));
      } else {
        cb(null, lines[0].trim());
      }
    }

    const {macAddress, diskSerialNumber} = await getMachineInfo();
    const regInfo = `${macAddress}-${diskSerialNumber}`; // 将 CPU、内存、磁盘等信息拼接

    const hash = CryptoJS.MD5(regInfo).toString(); // 对加密后的信息进行哈希处理
  
    const regCode = `${hash.substr(0, 4)}-${hash.substr(4, 4)}-${hash.substr(8, 4)}-${hash.substr(12, 4)}`; // 将哈希值格式化为注册码
    let res = {
      code:1,
      msg:"success",
      data:{
        "regCode": regCode
      }
    }
    return res;
  } catch (err) {
    let res = {
      code:0,
      msg:"fail",
      data:{
        "regCode": '生成注册码失败'
      }
    }
    return res;  }
}


module.exports = {generateRegCode} 
