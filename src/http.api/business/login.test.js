const login = require('./login');

test()
async function test(){
    let res = await login.authUser('supoin','yusi','123456');
    console.log(res)
}