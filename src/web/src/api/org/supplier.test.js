const supplier = require("./supplier");
async function test() {
    try {
        let res = "";
        res = await supplier.getTemplate();
        console.log(res);
        res = await supplier.addSupplier({ supplierId: "s001", supplierName: "联想笔记本供应商", supplierType: "厂家" });
        console.log(res);
        res = await supplier.getSupplierList();
        console.log(res);
        res = await supplier.getSupplierList({ "supplierId": "s002" });
        console.log(res);
        res = await supplier.getSupplierDetail("s001");
        console.log(res);
        res = await supplier.updateSupplier("s001", { remarks: "re" });
        console.log(res);
        res = await supplier.deleteSupplier("s001");
        console.log(res);
    }
    catch (err) {
        console.log(err);
    }
}
test();