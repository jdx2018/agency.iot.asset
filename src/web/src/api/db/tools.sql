-- delete from tenant_page
-- where tenantId='supoin';
insert into tenant_page
(tenantId,pageId,parentId,pageName,pageDesc,showIndex,componentName,icon,status,createPerson)
select 
'szumale',pageId,parentId,pageName,pageDesc,showIndex,componentName,icon,status,'system'
from system_meta_page
where pageId not in(select pageId from tenant_page where tenantId='szumale')
-- select * from tenant_page
-- where tenantId='supoin';

insert into tenant_page_detail
(tenantId,pageId,funcId,funcDesc,status,createPerson)
select
'szumale',pageId,funcId,funcDesc,status,'system'
from system_meta_page_detail where funcId not in(select funcId from tenant_page_detail where tenantId='szumale')


select * from system_meta_page;
select * 
from tenant_page
where tenantId='uniontech';
-- insert into system_meta_page
-- (tenantId,pageId,parentId,pageName,pageDesc,showIndex,componentName,icon,status,createPerson)
-- select 'system',pageId,parentId,pageName,pageDesc,showIndex,componentName,icon,status,'system'
-- from tenant_page
-- where tenantId='uniontech';
-- create table system_meta_page_detail
-- (select * from tenant_page_detail where tenantId='uniontech');
select * from system_meta_page_detail;
update system_meta_page_detail
set tenantId='system';


select * from tenant where tenantId='szumale';
insert into tenant
(tenantId,tenantName,createPerson)
values
('szumale','深圳市福田城管局','system');
select * from tenant_org where tenantId='szumale';
-- insert into tenant_org
-- (tenantId,orgId,parentId,orgName,createPerson)
-- values
-- ('szumale','1','0','福田城管局','system')
select * from tenant_employee where tenantId='szumale';
-- insert into tenant_employee
-- (tenantId,orgId,employeeId,employeeName,createPerson)
-- values
-- ('szumale','1','em_001','资产管理员','system');
select * from tenant_user where tenantId='szumale';
-- insert into tenant_user
-- (tenantId,employeeId,userId,password,manage_orgId,createPerson)
-- values
-- ('szumale','em_001','admin','123456','1','system');
select * from tenant_page where tenantId='szumale';
