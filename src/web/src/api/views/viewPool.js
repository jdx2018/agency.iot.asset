const v_sys = require("./system_meta/index.js");
const v_tenant_szumale = require("./tenant_szumale/index.js");
const v_tenant_supoin = require("./tenant_supoin/index.js");
const viewDef = {
    sys: v_sys.viewDef,
    szumale: v_tenant_szumale.viewDef,
    supoin: v_tenant_supoin.viewDef,
}
module.exports.viewDef = viewDef;