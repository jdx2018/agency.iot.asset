const employee = require("./employee.js");
async function test() {
    try {
        let res = null;
        res = employee.getTemplate();

        let employeeList = [{}]
        res = await employee.check(employeeList);
        // console.log(res);
        employeeList = [
            { employeeId: "Z0000001", employeeName: "t001-name", orgId: "J01001" },
            { employeeId: "Z0000002", employeeName: "t001-name", orgId: "办公室" },]
        res = await employee.check(employeeList);
        console.log(JSON.stringify(res));
    }
    catch (err) {
        console.log(err);
    }
}
test();