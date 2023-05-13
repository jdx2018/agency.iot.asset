// const login = require('./login').login;
const login = require('./login').login;

test_login();
async function test_login() {
    let res = await login("uniontech", "admin", "123456");
     console.log(res.data)
}