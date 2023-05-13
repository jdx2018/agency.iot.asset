const t_sys = require("./template_sys");
const t_tenant_szumale = require("./template_szumale");
const t_tenant_uniontech = require("./template_uniontech");
const t_tenant_zyhy = require("./template_zyhy");
const cache = require("../../cache");
const templateDef = {
  sys: t_sys.templateDef,
  szumale: t_tenant_szumale.templateDef,
  uniontech: t_tenant_uniontech.templateDef,
  zyhy: t_tenant_zyhy.templateDef,
};
function getTemplateDef() {
  let tenantId = cache.user_get().tenantId;
  let template = templateDef.sys;
  if (templateDef[tenantId]) {
    template = templateDef[tenantId];
  }
  return template;
}
module.exports.getTemplateDef = getTemplateDef;
