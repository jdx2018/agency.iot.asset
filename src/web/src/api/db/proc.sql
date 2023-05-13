CREATE DEFINER=`supoin`@`%` PROCEDURE `p_asset_get`(param_tenantId varchar(20),param_orgId varchar(20))
WITH RECURSIVE tmp (tenantId,orgId,parentId,orgName,isTopLevel) AS
	(
	  SELECT tenantId,orgId,parentId,orgName,1 as isTopLevel
		FROM tenant_org
		WHERE tenantId=param_tenantId and orgId=param_orgId
	  UNION ALL
	  SELECT t1.tenantId, t1.orgId,t1.parentId,t1.orgName,0 as isTopLevel
		FROM tenant_org t1 
		inner JOIN tmp t2
		  ON t1.tenantId=t2.tenantId and t1.parentId = t2.orgId
	)
select 
 a.*
,b.className
,c.placeName
,d.orgName as ownOrgName
,e.orgName as useOrgName
,f.employeeName as useEmployeeName
,g.employeeName as managerName
from 
tenant_asset a
	inner join tmp t on a.tenantId=t.tenantId and a.ownorgId=t.orgId
	left join tenant_asset_class b on a.tenantId=b.tenantId and a.classId=b.classId
    left join tenant_asset_place c on a.tenantId=c.tenantId and a.placeId=c.placeId
    left join tenant_org d on a.tenantId=d.tenantId and a.ownOrgId=d.orgId
    left join tenant_org e on a.tenantId=e.tenantId and  a.useOrgId=e.orgId
    left join tenant_employee f on a.tenantId=f.tenantId and a.useEmployeeId=f.employeeId
    left join tenant_employee g on a.tenantId=g.tenantId and a.manager=g.employeeId



CREATE DEFINER=`supoin`@`%` PROCEDURE `p_org_delete`(p_orgId int)
begin 
	declare child_orgId int;
	declare has_org boolean default 1;
	declare org_cursor cursor for select orgId from `a_org` where pId = p_orgId;

	-- 当出现02000错误时把局部变量的值设为true
  declare continue handler for sqlstate '02000' set has_org=0;	
	set @@max_sp_recursion_depth = 10;
		
	open org_cursor;
	    fetch next from org_cursor into child_orgId;
	    while has_org 
			do 
					call p_org_delete(child_orgId);
					fetch next from org_cursor into child_orgId;
		  end while;
  close org_cursor;
	
	delete from tenant_org where orgId = p_orgId;
end