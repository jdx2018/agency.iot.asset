/**
 * 全局租户配置
 */
const tenant_config = {
    sys: {
        useCheck: true,//启用单据审核逻辑
    },
    uniontech: {
        useCheck: true,//启用单据审核
    },
    szumale: {
        useCheck: true
    }
}
module.exports.tenant_config = tenant_config;