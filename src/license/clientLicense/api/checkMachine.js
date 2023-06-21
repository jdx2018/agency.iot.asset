const util = require('util');
const crypto = require('crypto');
const fs = require('fs');
const readFile = util.promisify(fs.readFile);

async function checkMachine() {
  try {
    const data = await readFile('license.txt', 'utf8');
    const head = data.slice(16, 32);
    const tail = data.slice(32);
    const hash = crypto.createHash('md5');
    hash.update(head);
    const digest = hash.digest('hex');
    const check = digest === tail ? true : false;
    const res = {
      code: 1,
      msg: "success",
      data: {
        checkstatus: check
      }
    };
    console.log("read");
    return res;
  } catch (err) {
    const res = {
      code: -1,
      msg: "该机器未授权",
      data: {
        checkstatus: false
      }
    };
    return res;
  }
}




module.exports = {checkMachine}