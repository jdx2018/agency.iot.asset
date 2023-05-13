const employee = require("./employee");
const dbClient = require("../db/db.local").db_local_client;
async function getEmployees() {
    let res = await employee.getEmployeeList_all();
    console.log(res);
    // res = await employee.getTemplate();
    // console.log(res);
    // res = await employee.updateEmployee({ employeeId: "em_supoin01", remarks: "test" });
    // console.log(res);
    // res =await dbClient.Query("tenant_employee");
    // console.log(res);
    // res=await employee.deleteEmployee("em_supoin01");
    // console.log(res);
    // res =await dbClient.Query("tenant_employee");
    // console.log(res);

}
getEmployees();