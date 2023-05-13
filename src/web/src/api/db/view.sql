alter view v_asset
as
select 
 a.*
,a.manager as managerId
,b.className
,c.placeName
,d.orgName as ownOrgName
,e.orgName as useOrgName
,f.employeeName as useEmployeeName
,g.employeeName as managerName
from 
tenant_asset a
	left join tenant_asset_class b on a.tenantId=b.tenantId and a.classId=b.classId
    left join tenant_asset_place c on a.tenantId=c.tenantId and a.placeId=c.placeId
    left join tenant_org d on a.tenantId=d.tenantId and a.ownOrgId=d.orgId
    left join tenant_org e on a.tenantId=e.tenantId and  a.useOrgId=e.orgId
    left join tenant_employee f on a.tenantId=f.tenantId and a.useEmployeeId=f.employeeId
    left join tenant_employee g on a.tenantId=g.tenantId and a.manager=g.employeeId


alter view v_inventory_detail
as
select
b.*
,c.assetName
,c.useOrgId
,c.useOrgName
,c.useEmployeeId
,c.useEmployeeName
,c.placeId
,c.placeName
,c.classId
,c.className
,e.employeeId
,e.employeeName as checkPersonName
from 
 tenant_inventory_detail b 
	inner join v_asset c on b.tenantId=c.tenantId and b.assetId=c.assetId
    left join tenant_employee e on b.tenantId=e.tenantId and b.checkPerson=e.employeeId

alter view v_asset_monitor
as
select 
a.*
,b.assetId
,b.assetName
,c.orgName as useOrgName
,d.placeName
,e.employeeName as useEmployeeName
,f.deviceName as deviceName
,f.placeName as devicePlaceName
from tenant_iot_data_raw a 
     left join tenant_asset b on a.tenantId=b.tenantId and a.epc=b.epc
     left join tenant_org c on b.tenantId=c.tenantId and b.useOrgId=c.orgId
     left join tenant_asset_place d on b.tenantId=d.tenantId and b.placeId=d.placeId
     left join tenant_employee e on b.tenantId=e.tenantId and b.useEmployeeId=e.employeeId
   left join tenant_device f ON a.tenantId=f.tenantId and a.deviceId = f.deviceId

alter view v_inventory
as
select
  a.*
,d.employeeName as pdPersonName
,e.employeeName as checkPersonName
,f.employeeName as createPersonName
from 
tenant_inventory a 
    left join tenant_employee d on a.tenantId=d.tenantId and a.pdPerson=d.employeeId
    left join tenant_employee e on a.tenantId=e.tenantId and a.checkPerson=e.employeeId
	left join tenant_employee f on a.tenantId=f.tenantId and a.createPerson=f.employeeId


create view v_user
as
select 
a.*
,b.employeeName
,b.orgId
from tenant_user a 
	inner join tenant_employee b on a.tenantId=b.tenantId and a.employeeId=b.employeeId 


alter view v_asset_alarm
as
select 
a.*
,b.assetName
,c.orgName as useOrgName
,d.placeName
,e.employeeName as useEmployeeName
,f.deviceName as deviceName
,f.placeName as devicePlaceName
from tenant_iot_alarm a 
     left join tenant_asset b on a.tenantId=b.tenantId and a.epc=b.epc
     left join tenant_org c on b.tenantId=c.tenantId and b.useOrgId=c.orgId
     left join tenant_asset_place d on b.tenantId=d.tenantId and b.placeId=d.placeId
     left join tenant_employee e on b.tenantId=e.tenantId and b.useEmployeeId=e.employeeId
    left join tenant_device f on a.tenantId=f.tenantId and a.deviceId=f.deviceId
 

 create view v_asset_paifa
as
select
distinct
a.tenantId
,a.billNo
,a.billType
,a.status
,a.ext10 as placeId
,a.ext11 as useEmployeeId
,b.assetId 
from tenant_bill a
	inner join tenant_bill_detail b on a.tenantId=b.tenantId and a.billNo=b.billNo and a.billType=b.billType
where a.status=1 and a.billType='11'

alter view v_asset_paifa
as
select
distinct
a.tenantId
,a.billNo
,a.billType
,a.status
,a.ext10 as placeId
,a.ext11 as employeeId
,c.employeeName 
,b.assetId 
from tenant_bill a
	inner join tenant_bill_detail b on a.tenantId=b.tenantId and a.billNo=b.billNo and a.billType=b.billType
    left join tenant_employee c on a.tenantId=c.tenantId and a.ext11=c.employeeId
where a.status=1 and a.billType='11'



alter view v_asset
as
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
	left join tenant_asset_class b on a.tenantId=b.tenantId and a.classId=b.classId
    left join tenant_asset_place c on a.tenantId=c.tenantId and a.placeId=c.placeId
    left join tenant_org d on a.tenantId=d.tenantId and a.ownOrgId=d.orgId
    left join tenant_org e on a.tenantId=e.tenantId and  a.useOrgId=e.orgId
    left join tenant_employee f on a.tenantId=f.tenantId and a.useEmployeeId=f.employeeId
    left join tenant_employee g on a.tenantId=g.tenantId and a.manager=g.employeeId


create view v_brand 
as
select distinct tenantId,brand as brandId,brand as brandName
from tenant_asset



alter view v_bill_paifa
as
select 
a.*,
a.ext1 AS assetNum,
Date(a.ext7) as useDate,
a.ext10 as placeId,
a.ext11 as employeeId,
a.ext12 as useOrgId,
b.placeName,
c.employeeName,
d.orgName as useOrgName
from tenant_bill a
	 left join tenant_asset_place b on a.tenantId=b.tenantId and a.ext10=b.placeId
     left join tenant_employee c on a.tenantId=c.tenantId and a.ext11=c.employeeId
     left join tenant_org d on c.tenantId=d.tenantId and c.orgId=d.orgId
where a.billType=11

alter view v_bill_tuiku
as
select 
a.*,
a.ext1 as assetNum,
Date(a.ext7) as returnDate,
a.ext11 as placeId,
a.ext10 as useOrgId,
a.ext12 as employeeId,
b.placeName,
c.employeeName,
d.orgName as ownOrgName
from tenant_bill a
	 left join tenant_asset_place b on a.tenantId=b.tenantId and a.ext11=b.placeId
     left join tenant_employee c on a.tenantId=c.tenantId and a.ext12=c.employeeId
     left join tenant_org d on c.tenantId=d.tenantId and c.orgId=d.orgId
where a.billType=21


alter view v_bill_jiechu
as
select 
a.*,
a.ext1-a.ext2 as returnDiff,
a.ext1 as borrowNum,
a.ext2 as returnNum,
Date(a.ext7) as borrowDate,
Date(a.ext8) as returnDate,
datediff(a.ext8,a.ext7) as remainDay,
a.ext10 as placeId,
a.ext11 as employeeId,
a.ext12 as useOrgId,
b.placeName,
c.employeeName,
d.orgName as useOrgName
from tenant_bill a
	 left join tenant_asset_place b on a.tenantId=b.tenantId and a.ext10=b.placeId
     left join tenant_employee c on a.tenantId=c.tenantId and a.ext11=c.employeeId
     left join tenant_org d on c.tenantId=d.tenantId and c.orgId=d.orgId
where a.billType=12
order by a.createTime desc

alter view v_bill_guihuan
as
select 
a.*,
a.ext1 as assetNum,
Date(a.ext7) as returnDate,
a.ext10 as placeId,
a.ext11 as employeeId,
a.ext12 as ownOrgId,
b.placeName,
c.employeeName,
d.orgName as ownOrgName
from tenant_bill a
	 left join tenant_asset_place b on a.tenantId=b.tenantId and a.ext10=b.placeId
     left join tenant_employee c on a.tenantId=c.tenantId and a.ext11=c.employeeId
     left join tenant_org d on c.tenantId=d.tenantId and c.orgId=d.orgId
where a.billType=22
order by a.createTime desc

alter view v_bill_weixiu
as
select 
a.*,
a.ext1 as assetNum,
Date(a.ext7) as reportDate,
Date(a.ext8) as finishDate,
a.ext10 as placeId,
a.ext11 as reportPersonId,
a.ext12 as operatePersonId,
a.ext13 as content,
b.placeName,
c.employeeName as reportPersonName,
d.employeeName as operatePersonName
from tenant_bill a
	 left join tenant_asset_place b on a.tenantId=b.tenantId and a.ext10=b.placeId
     left join tenant_employee c on a.tenantId=c.tenantId and a.ext11=c.employeeId
     left join tenant_employee d on a.tenantId=d.tenantId and a.ext12=d.employeeId
where a.billType=31
order by a.createTime desc


alter view v_bill_chuzhi
as
select 
		a.*,
        a.ext1 AS assetNum,
        Date(a.ext7) AS finishDate,
        a.ext10 AS disposedType,
        a.ext11 AS employeeId,
        e.employeeName AS operatePerson,
        c.employeeName AS disposedPerson,
        d.orgName AS orgName

from tenant_bill a
     left join tenant_employee c on a.tenantId=c.tenantId and a.ext11=c.employeeId
     left join tenant_org d on c.tenantId=d.tenantId and c.orgId=d.orgId
	 left join tenant_employee e ON a.tenantId=e.tenantId and a.ext12=e.employeeId
where a.billType=32
order by a.createTime desc


alter view v_bill_jiechu_detail
as
select 
a.*,
a.ext1 as borrowNum,
a.ext2 as returnNum,
Date(a.ext7) as borrowDate,
Date(a.ext8) as returnDate,
datediff(a.ext8,a.ext7) as remainDay,
a.ext10 as placeId,
a.ext11 as useEmployeeId,
a.ext12 as useOrgId,
b.placeName,
c.employeeName as useEmployeeName,
d.orgName as useOrgName,
x.assetId,
x.status as billDetailStatus,
x.isReturn
from tenant_bill a
	 inner join tenant_bill_detail x on a.tenantId=x.tenantId and a.billNo=x.billNo and a.billType=x.billType
	 left join tenant_asset_place b on a.tenantId=b.tenantId and a.ext10=b.placeId
     left join tenant_employee c on a.tenantId=c.tenantId and a.ext11=c.employeeId
     left join tenant_org d on c.tenantId=d.tenantId and c.orgId=d.orgId
where a.billType=12
order by a.createTime desc


alter view v_user_permission
as
select  a.tenantId,t.userId
		,a.id,a.pageId
		,a.parentId,a.pageName
		,a.pageDesc, a.showIndex
        ,a.componentName, a.icon
        ,ifnull(c.status,1) as status
		,b.funcId 
        ,b.funcDesc
        ,ifnull(d.status,1) as funcStatus
from tenant_user t
	 inner join tenant_page a on t.tenantId=a.tenantId
     left join tenant_page_detail b on a.tenantId=b.tenantId and a.pageId=b.pageId
	 left join tenant_user_permission_page c on a.tenantId=c.tenantId and  t.userId=c.userId and a.pageId=c.pageId and c.isFunction=0
     left join tenant_user_permission_page d on a.tenantId=d.tenantId and t.userId=d.userId and  b.funcId=d.pageId and d.isFunction=1



alter view v_user_premission_tree
as
select  
t1.tenantId
,t2.userId
,t1.id as id
,t1.pageId
,t1.parentId
,t1.pageDesc
,ifnull(t3.status,t1.status) as status
,t1.isFunction from
(
	select a.id,a.tenantId,a.pageId ,a.parentId,a.pageDesc,a.status,false as isFunction
	from tenant_page a
	union all
	select b.id+1000000,b.tenantId,b.funcId ,b.pageId ,b.funcDesc ,b.status,true as isFunction
	from tenant_page_detail b 
)t1 
	inner join tenant_user t2 on t1.tenantId=t2.tenantId
	left join tenant_user_permission_page t3
		on t2.tenantId=t3.tenantId and t2.userId=t3.userId  and t1.pageId=t3.pageId and t1.isFunction=t3.isFunction

create view v_device
as
select
a.*,
b.orgName as ownOrgName
from tenant_device a 
	 inner join tenant_org b on a.tenantId=b.tenantId and a.ownOrgId=b.orgId



alter view v_user
as
select 
b.employeeName
,b.orgId
,b.telNo
,b.email
,c.orgName
,d.orgName as manage_orgName
,a.*
from tenant_user a 
	inner join tenant_employee b on a.tenantId=b.tenantId and a.employeeId=b.employeeId 
    inner join tenant_org c on a.tenantId=c.tenantId and b.orgId=c.orgId
    inner join tenant_org d on a.tenantId=d.tenantId and a.manage_orgId=d.orgId


    alter view v_asset_material
as
select a.*, 0 as useQty,b.supplierName
from tenant_asset_material a 
	 left join tenant_supplier b on a.tenantId=b.tenantId and a.supplierId=b.supplierId

create view v_asset_material_enum
as
select distinct materialClass,materialPlace,brand
from tenant_asset_material

alter view v_bill_chuku_material
as
select a.* ,
a.ext1 as materialNum,
Date(a.ext7) as useDate,
a.ext10 as useEmployeeId,
a.ext11 as useOrgId,
b.employeeName as operatePersonName,
c.employeeName as useEmployeeName,
d.orgName as useOrgName
from tenant_bill_material a
	 left join tenant_employee b on a.tenantId=b.tenantId and a.operatePersonId=b.employeeId
     left join tenant_employee c on a.tenantId=c.tenantId and a.ext10=c.employeeId
     left join tenant_org d on c.tenantId=d.tenantId and c.orgId=d.orgId
where a.billType=11
     
create view v_bill_tuiku_material_detail
as
select 
a.tenantId,
a.billNo,
a.billType,
a.qty,
b.materialId,
b.materialName,
b.materialClass,
b.materialPlace,
b.brand,
b.spec,
b.unit,
b.storageQty,
b.supplierId,
b.supplierName

from tenant_bill_material_detail a
	 left join v_asset_material b on a.tenantId=b.tenantId and a.materialId=b.materialId
where a.billType=21

create view v_bill_tuiku_material
as
select a.* ,
a.ext1 as materialNum,
Date(a.ext7) as returnDate,
a.ext10 as returnEmployeeId,
a.ext11 as returnOrgId,
b.employeeName as operatePersonName,
c.employeeName as returnEmployeeName,
d.orgName as returnOrgName
from tenant_bill_material a
	 left join tenant_employee b on a.tenantId=b.tenantId and a.operatePersonId=b.employeeId
     left join tenant_employee c on a.tenantId=c.tenantId and a.ext10=c.employeeId
     left join tenant_org d on c.tenantId=d.tenantId and c.orgId=d.orgId
where a.billType=21

alter view v_bill_ruku_material
as
select a.* ,
a.ext1 as materialNum,
Date(a.ext7) as inDate,
b.employeeName as operatePersonName
from tenant_bill_material a
	 left join tenant_employee b on a.tenantId=b.tenantId and a.operatePersonId=b.employeeId
     left join tenant_employee c on a.tenantId=c.tenantId and a.ext10=c.employeeId
where a.billType=10

create view v_bill_ruku_material_detail
as
select 
a.tenantId,
a.billNo,
a.billType,
a.qty,
b.materialId,
b.materialName,
b.materialClass,
b.materialPlace,
b.brand,
b.spec,
b.unit,
b.storageQty,
b.supplierId,
b.supplierName

from tenant_bill_material_detail a
	 left join v_asset_material b on a.tenantId=b.tenantId and a.materialId=b.materialId
where a.billType=10

    create view v_employee
as
select a.*,
b.orgName
from tenant_employee a inner join tenant_org b on a.tenantId=b.tenantId and a.orgId=b.orgId

create view v_bill_purchase
as
select a.*,
b.employeeName as operatePersonName,
c.employeeName as checkPersonName,
d.employeeName as reqEmployeeName,
e.orgName as reqOrgName,
f.placeName as placeName
from tenant_bill_purchase a 
	 left join tenant_employee b on a.tenantId=b.tenantId and a.operatePersonId=b.employeeId
     left join tenant_employee c on a.tenantId=c.tenantId and a.checkPersonId=b.employeeId
     left join tenant_employee d on a.tenantId=d.tenantId and a.reqEmployeeId=d.employeeId
     left join tenant_org e on a.tenantId=e.tenantId and a.reqOrgId=e.orgId
     left join tenant_asset_place f on a.tenantId=f.tenantId and a.placeId=f.placeId

create view v_bill_purchase_paifa
as
select a.*,
b.employeeName as operatePersonName,
c.employeeName as checkPersonName,
d.employeeName as reqEmployeeName,
e.orgName as reqOrgName,
f.placeName as placeName
from tenant_bill_purchase a 
	inner join tenant_bill_purchase_asset_flow x1 on a.tenantId=x1.tenantId and a.billNo=x1.billNo and a.billType=x1.billType
     inner join tenant_asset x2 on x1.tenantId=x2.tenantId and x1.assetId=x2.assetId and x2.status=0
	 left join tenant_employee b on a.tenantId=b.tenantId and a.operatePersonId=b.employeeId
     left join tenant_employee c on a.tenantId=c.tenantId and a.checkPersonId=b.employeeId
     left join tenant_employee d on a.tenantId=d.tenantId and a.reqEmployeeId=d.employeeId
     left join tenant_org e on a.tenantId=e.tenantId and a.reqOrgId=e.orgId
     left join tenant_asset_place f on a.tenantId=f.tenantId and a.placeId=f.placeId
group by a.tenantId,a.billNo,a.billType


alter view v_bill_purchase_detail_asset
as
select a.*,
		b.className,
        c.supplierName,
        c.linkPerson,
        c.email,
        c.telNo
from tenant_bill_purchase_detail_asset a 
	 left join tenant_asset_class b on a.tenantId=b.tenantId and a.classId=b.classId
     left join tenant_supplier c on a.tenantId=c.tenantId and a.supplierId=c.supplierId

alter view v_bill_purchase_detail_material
as
select a.*,
		-- b.materialName,
        c.supplierName,
        c.linkPerson,
        c.email,
        c.telNo
from tenant_bill_purchase_detail_material a 
	 left join tenant_asset_material b on a.tenantId=b.tenantId and a.materialId=b.materialId
     left join tenant_supplier c on a.tenantId=c.tenantId and a.supplierId=c.supplierId


alter view v_bill_paifa_detail
as
select 
a.*,
a.ext1 as assetNum,
Date(a.ext7) as useDate,
a.ext10 as placeId,
a.ext11 as useEmployeeId,
a.ext12 as useOrgId,
b.placeName,
c.employeeName as useEmployeeName,
d.orgName as useOrgName,
x.assetId,
x.status as billDetailStatus
from tenant_bill a
	 inner join tenant_bill_detail x on a.tenantId=x.tenantId and a.billNo=x.billNo and a.billType=x.billType
	 left join tenant_asset_place b on a.tenantId=b.tenantId and a.ext10=b.placeId
     left join tenant_employee c on a.tenantId=c.tenantId and a.ext11=c.employeeId
     left join tenant_org d on c.tenantId=d.tenantId and c.orgId=d.orgId
where a.billType=11
order by a.createTime desc


alter view v_bill_guihuan_detail
as
select 
a.*,
a.ext1 as assetNum,
Date(a.ext7) as returnDate,
a.ext10 as placeId,
a.ext11 as returnEmployeeId,
a.ext12 as ownOrgId,
b.placeName,
c.employeeName as returnEmployeeName,
d.orgName as ownOrgName,
x.assetId,
x.status as billDetailStatus,
x.isReturn
from tenant_bill a
	 inner join tenant_bill_detail x on a.tenantId=x.tenantId and a.billNo=x.billNo and a.billType=x.billType
	 left join tenant_asset_place b on a.tenantId=b.tenantId and a.ext10=b.placeId
     left join tenant_employee c on a.tenantId=c.tenantId and a.ext11=c.employeeId
     left join tenant_org d on c.tenantId=d.tenantId and c.orgId=d.orgId
where a.billType=22
order by a.createTime desc

create view v_bill_tuiku_detail
as
select 
a.*,
a.ext1 as assetNum,
Date(a.ext7) as returnDate,
a.ext10 as placeId,
a.ext11 as managerId,
a.ext12 as ownOrgId,
b.placeName,
c.employeeName as managerName,
d.orgName as ownOrgName,
x.assetId,
x.status as billDetailStatus
from tenant_bill a
	 inner join tenant_bill_detail x on a.tenantId=x.tenantId and a.billNo=x.billNo and a.billType=x.billType
	 left join tenant_asset_place b on a.tenantId=b.tenantId and a.ext10=b.placeId
     left join tenant_employee c on a.tenantId=c.tenantId and a.ext11=c.employeeId
     left join tenant_org d on c.tenantId=d.tenantId and c.orgId=d.orgId
where a.billType=21
order by a.createTime desc


create view v_bill_weixiu_detail
as
select 
a.*,
a.ext1 as assetNum,
Date(a.ext7) as reportDate,
Date(a.ext7) as finishDate,
a.ext10 as placeId,
a.ext11 as reportPersonId,
a.ext13 as content,
b.placeName,
c.employeeName as reportPersonName,
d.orgName as ownOrgName,
x.assetId,
x.status as billDetailStatus
from tenant_bill a
	 inner join tenant_bill_detail x on a.tenantId=x.tenantId and a.billNo=x.billNo and a.billType=x.billType
	 left join tenant_asset_place b on a.tenantId=b.tenantId and a.ext10=b.placeId
     left join tenant_employee c on a.tenantId=c.tenantId and a.ext11=c.employeeId
     left join tenant_org d on c.tenantId=d.tenantId and c.orgId=d.orgId
where a.billType=31
order by a.createTime desc


create view v_bill_pay
as
select a.*,
b.supplierName,
c.payableAmount

from tenant_bill_pay a
	 left join tenant_supplier b on a.tenantId=b.tenantId and a.supplierId=b.supplierId
     left join tenant_supplier_payable c on a.tenantId=c.tenantId and a.supplierId=c.supplierId


     alter view v_bill_pay
as
select a.*,
b.supplierName,
c.payableAmount

from tenant_bill_pay a
	 left join tenant_supplier b on a.tenantId=b.tenantId and a.supplierId=b.supplierId
     left join tenant_supplier_payable c on a.tenantId=c.tenantId and a.supplierId=c.supplierId

-- 供应商应付款汇总列表
alter view v_supplier_payable
as
select 
a.tenantId,
a.supplierId,
sum(a.payableAmount) as payableAmount,
b.supplierName,
b.linkPerson
from tenant_supplier_payable a
	 left join tenant_supplier b on a.tenantId=b.tenantId and a.supplierId=b.supplierId
where a.status=0
group by a.tenantId,a.supplierId

--供应商应付款明细，每个采购单号+供应商一条记录

     alter view v_supplier_payable_detail
as
select 
a.tenantId,
a.supplierId,
a.billNo,
a.billType,
a.status,
a.payableAmount,
b.supplierName,
b.linkPerson
from tenant_supplier_payable a
	 left join tenant_supplier b on a.tenantId=b.tenantId and a.supplierId=b.supplierId
     left join tenant_bill_purchase c on a.tenantId=c.tenantId and a.billNo=c.billNo and a.billType=c.billType
where a.status=0

-- create view v_bill_purchase_supplier
-- as
-- select 
-- a.tenantId, a.billNo,a.reqDate,
-- t.supplierId,t.supplierName,sum(t.orderQty*orderPrice)as payableAmount
-- from tenant_bill_purchase a 
-- 	 inner join 
--      (
--      select tenantId,billNo,billType,supplierId,supplierName,orderQty,orderPrice
--      from   v_bill_purchase_detail_asset 
--      union all
--       select tenantId,billNo,billType,supplierId,supplierName,orderQty,orderPrice
--       from    v_bill_purchase_detail_material 
--      )t on a.tenantId=t.tenantId and a.billNo=t.billNo and a.billType=t.billType
-- group by a.tenantId,a.billNo,t.supplierId


create view v_asset_purchase_flow
as
select 
 a.*
,t.billNo
,t.billType
,b.className
,c.placeName
,d.orgName as ownOrgName
,e.orgName as useOrgName
,f.employeeName as useEmployeeName
,g.employeeName as managerName
from 
tenant_asset a
	inner join tenant_bill_purchase_asset_flow t on a.tenantId=t.tenantId and a.assetId=t.assetId
	left join tenant_asset_class b on a.tenantId=b.tenantId and a.classId=b.classId
    left join tenant_asset_place c on a.tenantId=c.tenantId and a.placeId=c.placeId
    left join tenant_org d on a.tenantId=d.tenantId and a.ownOrgId=d.orgId
    left join tenant_org e on a.tenantId=e.tenantId and  a.useOrgId=e.orgId
    left join tenant_employee f on a.tenantId=f.tenantId and a.useEmployeeId=f.employeeId
    left join tenant_employee g on a.tenantId=g.tenantId and a.manager=g.employeeId


create view v_asset_storage_assetName
as
select tenantId,assetName,count(*) as storageQty
from tenant_asset
where status=0
group by tenantId,assetName

alter view v_material_storage_materialName
as
select tenantId,materialName,sum(storageQty) as storageQty
from tenant_asset_material
group by tenantId,materialName

alter view v_bill_pay_flow
as
select a.*,
b.supplierName,
b.linkPerson
from tenant_bill_pay_flow a
	 left join tenant_supplier b on a.tenantId=b.tenantId and a.supplierId=b.supplierId



alter view v_asset_org
as
select 
	a.*
	,x.orgId as p_orgId
	,b.className
	,c.placeName
	,d.orgName as ownOrgName
	,e.orgName as useOrgName
	,f.employeeName as useEmployeeName
	,g.employeeName as managerName
	from tenant_asset a
		inner join tenant_org_sub x on a.tenantId=x.tenantId and a.ownorgId=x.orgId_sub 
		left join tenant_asset_class b on a.tenantId=b.tenantId and a.classId=b.classId
		left join tenant_asset_place c on a.tenantId=c.tenantId and a.placeId=c.placeId
		left join tenant_org d on a.tenantId=d.tenantId and a.ownOrgId=d.orgId
		left join tenant_org e on a.tenantId=e.tenantId and  a.useOrgId=e.orgId
		left join tenant_employee f on a.tenantId=f.tenantId and a.useEmployeeId=f.employeeId
		left join tenant_employee g on a.tenantId=g.tenantId and a.manager=g.employeeId

/**
按机构权限获取借出单
*/        
alter view v_bill_jiechu_org
as
select 
	a.*,
	a.ext1-a.ext2 as returnDiff,
	a.ext1 as borrowNum,
	a.ext2 as returnNum,
	Date(a.ext7) as borrowDate,
	Date(a.ext8) as returnDate,
	datediff(a.ext8,a.ext7) as remainDay,
	a.ext10 as placeId,
	a.ext11 as employeeId,
	a.ext12 as useOrgId,
    x.orgId as p_orgId,
	b.placeName,
	c.employeeName,
	d.orgName as useOrgName
	from  tenant_bill a
			inner join tenant_org_sub x on a.tenantId=x.tenantId and a.manage_orgId=x.orgId_sub
			left join tenant_asset_place b on a.tenantId=b.tenantId and a.ext10=b.placeId
			left join tenant_employee c on a.tenantId=c.tenantId and a.ext11=c.employeeId
			left join tenant_org d on c.tenantId=d.tenantId and c.orgId=d.orgId
	where a.billType=12

alter view v_bill_guihuan_org
as
select 
	a.*,
	a.ext1 as assetNum,
	Date(a.ext7) as returnDate,
	a.ext10 as placeId,
	a.ext11 as employeeId,
	a.ext12 as ownOrgId,
    x.orgId as p_orgId,
	b.placeName,
	c.employeeName,
	d.orgName as ownOrgName
from tenant_bill a
		inner join tenant_org_sub x on a.tenantId=x.tenantId and a.manage_orgId=x.orgId_sub
		left join tenant_asset_place b on a.tenantId=b.tenantId and a.ext10=b.placeId
		left join tenant_employee c on a.tenantId=c.tenantId and a.ext11=c.employeeId
		left join tenant_org d on c.tenantId=d.tenantId and c.orgId=d.orgId
where a.billType=22
/**
派发按权限获取单据列表
*/
alter view v_bill_paifa_org
as
select 
	a.*,
	a.ext1 AS assetNum,
	Date(a.ext7) as useDate,
	a.ext10 as placeId,
	a.ext11 as employeeId,
	a.ext12 as useOrgId,
    x.orgId as p_orgId,
	b.placeName,
	c.employeeName,
	d.orgName as useOrgName
from tenant_bill a
		inner join tenant_org_sub x on a.tenantId=x.tenantId and a.manage_orgId=x.orgId_sub
		left join tenant_asset_place b on a.tenantId=b.tenantId and a.ext10=b.placeId
		left join tenant_employee c on a.tenantId=c.tenantId and a.ext11=c.employeeId
		left join tenant_org d on c.tenantId=d.tenantId and c.orgId=d.orgId
where a.billType=11 

/**
派发按权限获取单据列表
*/
alter view v_bill_tuiku_org
as
select 
	a.*,
	a.ext1 as assetNum,
	Date(a.ext7) as returnDate,
	a.ext10 as placeId,
	a.ext11 as employeeId,
	a.ext12 as useOrgId,
	x.orgId as p_orgId,
	b.placeName,
	c.employeeName,
	d.orgName as ownOrgName
from tenant_bill a 
		inner join tenant_org_sub x on a.tenantId=x.tenantId and a.manage_orgId=x.orgId_sub
		left join tenant_asset_place b on a.tenantId=b.tenantId and a.ext10=b.placeId
		left join tenant_employee c on a.tenantId=c.tenantId and a.ext11=c.employeeId
		left join tenant_org d on c.tenantId=d.tenantId and c.orgId=d.orgId
where a.billType=21

/**
维修按权限获取单据列表
*/
alter view v_bill_weixiu_org
as
select 
	a.*,
	a.ext1 as assetNum,
	Date(a.ext7) as reportDate,
	Date(a.ext8) as finishDate,
	a.ext10 as placeId,
	a.ext11 as reportPersonId,
	a.ext13 as content,
    x.orgId as p_orgId,
	b.placeName,
	c.employeeName as reportPersonName,
	d.employeeName as operatePersonName
from tenant_bill a
		inner join tenant_org_sub x on a.tenantId=x.tenantId and a.manage_orgId=x.orgId_sub
		left join tenant_asset_place b on a.tenantId=b.tenantId and a.ext10=b.placeId
		left join tenant_employee c on a.tenantId=c.tenantId and a.ext11=c.employeeId
		left join tenant_employee d on a.tenantId=d.tenantId and a.ext12=d.employeeId
		where a.billType=31
/**
处置按权限获取单据列表
*/
alter view v_bill_chuzhi_org
as
select 
	a.*,
	a.ext1 AS assetNum,
	Date(a.ext7) AS finishDate,
	a.ext10 AS disposedType,
	a.ext11 AS employeeId,
    x.orgId as p_orgId,
	e.employeeName AS operatePerson,
	c.employeeName AS disposedPerson,
	d.orgName AS orgName
from tenant_bill a
		inner join tenant_org_sub x on a.tenantId=x.tenantId and a.manage_orgId=x.orgId_sub
		left join tenant_employee c on a.tenantId=c.tenantId and a.ext11=c.employeeId
		left join tenant_org d on c.tenantId=d.tenantId and c.orgId=d.orgId
		left join tenant_employee e ON a.tenantId=e.tenantId and a.ext12=e.employeeId
where a.billType=32

/**
盘点按权限获取单据列表
*/
create view v_inventory_org
as
select 
	a.*
    ,x.orgId as p_orgId
	,d.employeeName as pdPersonName
	,e.employeeName as checkPersonName
	,f.employeeName as createPersonName
from tenant_inventory a 
		inner join tenant_org_sub x on a.tenantId=x.tenantId and a.orgId=x.orgId_sub
		left join tenant_employee d on a.tenantId=d.tenantId and a.pdPerson=d.employeeId
		left join tenant_employee e on a.tenantId=e.tenantId and a.checkPerson=e.employeeId
		left join tenant_employee f on a.tenantId=f.tenantId and a.createPerson=f.employeeId



alter view v_asset_org_pand
as
select 
	a.*
	,x.orgId as p_ownOrgId
    ,ox.orgId as p_useOrgId
    ,bx.classId as p_classId
    ,cx.placeId as p_placeId
	,b.className
	,c.placeName
	,d.orgName as ownOrgName
	,e.orgName as useOrgName
	,f.employeeName as useEmployeeName
	,g.employeeName as managerName
	from tenant_asset a
		inner join tenant_org_sub x on a.tenantId=x.tenantId and a.ownorgId=x.orgId_sub 
        left join tenant_org_sub ox on a.tenantId=ox.tenantId and a.useOrgId=ox.orgId_sub
		left join tenant_asset_class b on a.tenantId=b.tenantId and a.classId=b.classId
        left join tenant_asset_class_sub bx on a.tenantId=bx.tenantId and a.classId=bx.classId_sub
		left join tenant_asset_place c on a.tenantId=c.tenantId and a.placeId=c.placeId
        left join tenant_asset_place_sub cx on a.tenantId=cx.tenantId and a.placeId=cx.placeId_sub
		left join tenant_org d on a.tenantId=d.tenantId and a.ownOrgId=d.orgId
		left join tenant_org e on a.tenantId=e.tenantId and  a.useOrgId=e.orgId
		left join tenant_employee f on a.tenantId=f.tenantId and a.useEmployeeId=f.employeeId
		left join tenant_employee g on a.tenantId=g.tenantId and a.manager=g.employeeId
-- 	where   a.tenantId='uniontech'
-- 			and bx.classId='1' 
-- 			and cx.placeId='1'
-- 			and ox.orgId='TC001004'
-- 			and x.orgId='TC001'


create view v_report_asset_chuzhi_todo
as
SELECT tenantId, 
count(*) as assetNum
FROM tenant_asset
where serviceLife>0  and date_add(purchaseDate,interval serviceLife year)<now()group by tenantId;


/**
设备状态监测，视图获取设备状态：
*/
create view v_device_connectstatus as 
select a.tenantId,a.deviceId,d.deviceName,b.deviceStatus, a.lastHeart,c.lastDateUpdate from 
(SELECT
	tenantId,
	deviceId,
	max( collectTime ) AS lastHeart 
FROM
	tenant_iot_data_raw 
WHERE
	funcId = '00' 
	AND deviceId != '' 
GROUP BY
	tenantId,
	deviceId
) a

join tenant_iot_data_raw b on a.tenantId=b.tenantId and a.deviceId=b.deviceId and a.lastHeart=b.collectTime

join 
(SELECT
	tenantId,
	deviceId,
	max( collectTime ) AS lastDateUpdate 
FROM
	tenant_iot_data_raw 
WHERE
	funcId = '21' 
	AND deviceId != '' 
GROUP BY
	tenantId,
	deviceId
) c on b.tenantId=c.tenantId and b.deviceId=c.deviceId

join tenant_device d on a.tenantId=d.tenantId and a.deviceId=d.deviceId