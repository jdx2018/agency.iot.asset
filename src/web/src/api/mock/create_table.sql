drop table tenant;
create table tenant(
id int not null auto_increment comment '自增序列号',
tenantId varchar(20) not null comment '租户编号',
createPerson varchar(20) not null default "system" comment '创建人',
createTime dateTime not null default now() comment '创建时间',
updatePerson varchar(20) not null default "system" comment '更新人',
updateTime dateTime comment '更新时间',
remarks varchar(200) comment '备注',
tenantName varchar(50) not null comment '租户名称',
tenantAddress varchar(50) not null comment '租户地址',
linkPerson varchar(20) comment '联系人',
telNo varchar(20) comment '联系电话',
email varchar(50) comment '邮箱',
primary key (`id`),
unique (`tenantId`)
);

insert into tenant(tenantId,tenantName,tenantAddress,linkPerson,telNo) values ("supoin","销邦科技","深圳市福田区英龙大厦26层","及东兴","18810172121");
insert into tenant(tenantId,tenantName,tenantAddress,linkPerson,telNo) values ("supdatas","销邦数据","深圳市福田区英龙大厦19层","张治金","13826598771");


drop table tenant_org;
create table tenant_org(
id int not null auto_increment comment '自增序列号',
tenantId varchar(20) not null comment '租户编号',
createPerson varchar(20) not null default "system" comment '创建人',
createTime dateTime not null default now() comment '创建时间',
updatePerson varchar(20) not null default "system" comment '更新人',
updateTime dateTime comment '更新时间',
remarks varchar(200) comment '备注',
orgId varchar(20) not null comment '组织编号',
parentId varchar(20) not null comment '上级组织编号',
orgName varchar(50) not null comment '组织名称',
orgLevel int not null comment '组织级别',
primary key (`id`),
unique (`tenantId`,`orgId`)
);

insert into tenant_org(tenantId,orgId,parentId,orgName,orgLevel) values ("supoin","supoin01","0","销邦科技",0);
insert into tenant_org(tenantId,orgId,parentId,orgName,orgLevel) values ("supoin","supoin0101","supoin01","研发中心",0);
insert into tenant_org(tenantId,orgId,parentId,orgName,orgLevel) values ("supoin","supoin0102","supoin01","产品中心",0);
insert into tenant_org(tenantId,orgId,parentId,orgName,orgLevel) values ("supdatas","supdatas01","0","销邦数据",0);
insert into tenant_org(tenantId,orgId,parentId,orgName,orgLevel) values ("supdatas","supdatas0101","supdatas01","项目部",0);
insert into tenant_org(tenantId,orgId,parentId,orgName,orgLevel) values ("supdatas","supdatas0102","ssupdatas01","方案中心",0);


drop table tenant_user;
create table tenant_user(
id int not null auto_increment comment '自增序列号',
tenantId varchar(20) not null comment '租户编号',
createPerson varchar(20) not null default "system" comment '创建人',
createTime dateTime not null default now() comment '创建时间',
updatePerson varchar(20) not null default "system" comment '更新人',
updateTime dateTime comment '更新时间',
remarks varchar(200) comment '备注',
employeeId varchar(20) not null comment '员工编号',
userId varchar(20) not null comment '账号',
password varchar(50) not null comment '密码',
status int not null default 0 comment '账号状态',
primary key (`id`),
unique (`tenantId`,`userId`)
);

insert into tenant_user(tenantId,employeeId,userId,password,status) values ("supoin","em_supoin01","admin1",123456,1);
insert into tenant_user(tenantId,employeeId,userId,password,status) values ("supoin","em_supoin01","admin2",123456,1);
insert into tenant_user(tenantId,employeeId,userId,password,status) values ("supdatas","em_supoin01","admin3",123456,1);
insert into tenant_user(tenantId,employeeId,userId,password,status) values ("supdatas","em_supoin01","admin4",123456,1);


drop table tenant_employee;
create table tenant_employee(
id int not null auto_increment comment '自增序列号',
tenantId varchar(20) not null comment '租户编号',
createPerson varchar(20) not null default "system" comment '创建人',
createTime dateTime not null default now() comment '创建时间',
updatePerson varchar(20) not null default "system" comment '更新人',
updateTime dateTime comment '更新时间',
remarks varchar(200) comment '备注',
orgId varchar(20) not null comment '组织编号',
employeeId varchar(20) not null comment '员工编号',
employeeName varchar(50) not null comment '员工名称',
status int not null default 0 comment '用户状态',
telNo varchar(20) comment '电话号码',
email varchar(50) comment '邮箱',
primary key (`id`),
unique (`tenantId`,`employeeId`)
);

insert into tenant_employee(tenantId,orgId,employeeId,employeeName) values ("supoin","supoin01","em_supoin01","赖东平");
insert into tenant_employee(tenantId,orgId,employeeId,employeeName) values ("supoin","supoin0101","em_supoin0101","邓业");
insert into tenant_employee(tenantId,orgId,employeeId,employeeName) values ("supdatas","supdatas01","em_supdatas01","张治金");
insert into tenant_employee(tenantId,orgId,employeeId,employeeName) values ("supdatas","supdatas0102","em_supdatas0102","龙鹏飞");


drop table tenant_page;
create table tenant_page(
id int not null auto_increment comment '自增序列号',
tenantId varchar(20) not null comment '租户编号',
createPerson varchar(20) not null default "system" comment '创建人',
createTime dateTime not null default now() comment '创建时间',
updatePerson varchar(20) not null default "system" comment '更新人',
updateTime dateTime comment '更新时间',
remarks varchar(200) comment '备注',
pageId varchar(20) not null comment '页面编号',
parentId varchar(20) not null comment '父页面编号',
pageName varchar(50) not null comment '页面名称',
pageDesc varchar(50) not null comment '页面文字描述',
showIndex int not null default 0 comment '显示顺序',
componentName varchar(80) not null comment '组件名称',
icon varchar(50) comment '图标名称',
status int not null default 1 comment '菜单状态',
primary key (`id`),
unique (`tenantId`,`pageId`)
);

insert into tenant_page(tenantId,pageId,parentId,pageName,pageDesc,showIndex,componentName,icon,status,createPerson) values ("supoin",1,0,"AssetsList","资产列表",1,"AssetsList","List",1,"admin");
insert into tenant_page(tenantId,pageId,parentId,pageName,pageDesc,showIndex,componentName,icon,status,createPerson) values ("supoin",2,0,"DestributeAndCancelStock","派发退库",2,"DestributeAndCancelStock","ExitToApp",1,"admin");
insert into tenant_page(tenantId,pageId,parentId,pageName,pageDesc,showIndex,componentName,icon,status,createPerson) values ("supoin",3,0,"LendAndReturn","借出归还",3,"LendAndReturn","PanTool",1,"admin");
insert into tenant_page(tenantId,pageId,parentId,pageName,pageDesc,showIndex,componentName,icon,status,createPerson) values ("supoin",4,0,"InventoryManager","盘点管理",5,"InventoryManager","FindInPage",1,"admin");
insert into tenant_page(tenantId,pageId,parentId,pageName,pageDesc,showIndex,componentName,icon,status,createPerson) values ("supoin",5,0,"MaintainManager","维修管理",5,"MaintainManager","Settings",1,"admin");
insert into tenant_page(tenantId,pageId,parentId,pageName,pageDesc,showIndex,componentName,icon,status,createPerson) values ("supoin",6,0,"MaintainManager","维修管理",6,"MaintainManager","Settings",1,"admin");
insert into tenant_page(tenantId,pageId,parentId,pageName,pageDesc,showIndex,componentName,icon,status,createPerson) values ("supoin",7,0,"ScrapManager","处置管理",7,"ScrapManager","RestoreFromTrash",1,"admin");
insert into tenant_page(tenantId,pageId,parentId,pageName,pageDesc,showIndex,componentName,icon,status,createPerson) values ("supoin",8,0,"Statement","报表",8,"","Assessment",1,"admin");
insert into tenant_page(tenantId,pageId,parentId,pageName,pageDesc,showIndex,componentName,icon,status,createPerson) values ("supoin",9,8,"AssetSummaryQuery","资产汇总查询",9,"AssetSummaryQuery","Search",1,"admin");
insert into tenant_page(tenantId,pageId,parentId,pageName,pageDesc,showIndex,componentName,icon,status,createPerson) values ("supoin",10,8,"AssetRecord","资产履历",10,"AssetRecord","FeaturedPlayList",1,"admin");
insert into tenant_page(tenantId,pageId,parentId,pageName,pageDesc,showIndex,componentName,icon,status,createPerson) values ("supoin",11,0,"AssetClass","资产分类",11,"AssetClass","Class",1,"admin");
insert into tenant_page(tenantId,pageId,parentId,pageName,pageDesc,showIndex,componentName,icon,status,createPerson) values ("supoin",12,0,"PlaceManager","资产位置",7,"PlaceManager","Place",1,"admin");
insert into tenant_page(tenantId,pageId,parentId,pageName,pageDesc,showIndex,componentName,icon,status,createPerson) values ("supdatas",1,0,"AssetsList","资产列表",1,"AssetsList","List",1,"admin");
insert into tenant_page(tenantId,pageId,parentId,pageName,pageDesc,showIndex,componentName,icon,status,createPerson) values ("supdatas",2,0,"DestributeAndCancelStock","派发退库",2,"DestributeAndCancelStock","ExitToApp",1,"admin");
insert into tenant_page(tenantId,pageId,parentId,pageName,pageDesc,showIndex,componentName,icon,status,createPerson) values ("supdatas",3,0,"LendAndReturn","借出归还",3,"LendAndReturn","PanTool",1,"admin");
insert into tenant_page(tenantId,pageId,parentId,pageName,pageDesc,showIndex,componentName,icon,status,createPerson) values ("supdatas",4,0,"InventoryManager","盘点管理",5,"InventoryManager","FindInPage",1,"admin");
insert into tenant_page(tenantId,pageId,parentId,pageName,pageDesc,showIndex,componentName,icon,status,createPerson) values ("supdatas",5,0,"MaintainManager","维修管理",5,"MaintainManager","Settings",1,"admin");
insert into tenant_page(tenantId,pageId,parentId,pageName,pageDesc,showIndex,componentName,icon,status,createPerson) values ("supdatas",6,0,"MaintainManager","维修管理",6,"MaintainManager","Settings",1,"admin");
insert into tenant_page(tenantId,pageId,parentId,pageName,pageDesc,showIndex,componentName,icon,status,createPerson) values ("supdatas",7,0,"ScrapManager","处置管理",7,"ScrapManager","RestoreFromTrash",1,"admin");
insert into tenant_page(tenantId,pageId,parentId,pageName,pageDesc,showIndex,componentName,icon,status,createPerson) values ("supdatas",8,0,"Statement","报表",8,"","Assessment",1,"admin");
insert into tenant_page(tenantId,pageId,parentId,pageName,pageDesc,showIndex,componentName,icon,status,createPerson) values ("supdatas",9,8,"AssetSummaryQuery","资产汇总查询",9,"AssetSummaryQuery","Search",1,"admin");
insert into tenant_page(tenantId,pageId,parentId,pageName,pageDesc,showIndex,componentName,icon,status,createPerson) values ("supdatas",10,8,"AssetRecord","资产履历",10,"AssetRecord","FeaturedPlayList",1,"admin");
insert into tenant_page(tenantId,pageId,parentId,pageName,pageDesc,showIndex,componentName,icon,status,createPerson) values ("supdatas",11,0,"AssetClass","资产分类",11,"AssetClass","Class",1,"admin");
insert into tenant_page(tenantId,pageId,parentId,pageName,pageDesc,showIndex,componentName,icon,status,createPerson) values ("supdatas",12,0,"PlaceManager","资产位置",7,"PlaceManager","Place",1,"admin");


drop table tenant_org_permission;
create table tenant_org_permission(
id int not null auto_increment comment '自增序列号',
tenantId varchar(20) not null comment '租户编号',
createPerson varchar(20) not null default "system" comment '创建人',
createTime dateTime not null default now() comment '创建时间',
updatePerson varchar(20) not null default "system" comment '更新人',
updateTime dateTime comment '更新时间',
remarks varchar(200) comment '备注',
orgId varchar(20) not null comment '组织编号',
pageId varchar(20) not null comment '页面编号',
canVisible bool not null default 1 comment '页面可见',
canAdd bool not null default 1 comment '增加权限',
canUpdate bool not null default 1 comment '修改权限',
canDelete bool not null default 1 comment '删除权限',
primary key (`id`),
unique (`tenantId`,`orgId`,`pageId`)
);

insert into tenant_org_permission(tenantId,orgId,pageId,canVisible,canAdd,canUpdate,canDelete,createPerson) values ("supoin","supoin01",1,1,1,1,1,"admin");
insert into tenant_org_permission(tenantId,orgId,pageId,canVisible,canAdd,canUpdate,canDelete,createPerson) values ("supoin","supoin01",2,1,1,1,1,"admin");
insert into tenant_org_permission(tenantId,orgId,pageId,canVisible,canAdd,canUpdate,canDelete,createPerson) values ("supoin","supoin01",3,1,1,1,1,"admin");
insert into tenant_org_permission(tenantId,orgId,pageId,canVisible,canAdd,canUpdate,canDelete,createPerson) values ("supoin","supoin01",4,1,1,1,1,"admin");
insert into tenant_org_permission(tenantId,orgId,pageId,canVisible,canAdd,canUpdate,canDelete,createPerson) values ("supoin","supoin01",5,1,1,1,1,"admin");
insert into tenant_org_permission(tenantId,orgId,pageId,canVisible,canAdd,canUpdate,canDelete,createPerson) values ("supoin","supoin01",6,1,1,1,1,"admin");
insert into tenant_org_permission(tenantId,orgId,pageId,canVisible,canAdd,canUpdate,canDelete,createPerson) values ("supoin","supoin01",7,1,1,1,1,"admin");
insert into tenant_org_permission(tenantId,orgId,pageId,canVisible,canAdd,canUpdate,canDelete,createPerson) values ("supoin","supoin01",8,1,1,1,1,"admin");
insert into tenant_org_permission(tenantId,orgId,pageId,canVisible,canAdd,canUpdate,canDelete,createPerson) values ("supoin","supoin01",9,1,1,1,1,"admin");
insert into tenant_org_permission(tenantId,orgId,pageId,canVisible,canAdd,canUpdate,canDelete,createPerson) values ("supoin","supoin01",10,1,1,1,1,"admin");
insert into tenant_org_permission(tenantId,orgId,pageId,canVisible,canAdd,canUpdate,canDelete,createPerson) values ("supoin","supoin01",11,1,1,1,1,"admin");
insert into tenant_org_permission(tenantId,orgId,pageId,canVisible,canAdd,canUpdate,canDelete,createPerson) values ("supoin","supoin01",12,1,1,1,1,"admin");
insert into tenant_org_permission(tenantId,orgId,pageId,canVisible,canAdd,canUpdate,canDelete,createPerson) values ("supdatas","supdatas01",1,1,1,1,1,"admin");
insert into tenant_org_permission(tenantId,orgId,pageId,canVisible,canAdd,canUpdate,canDelete,createPerson) values ("supdatas","supdatas01",2,1,1,1,1,"admin");
insert into tenant_org_permission(tenantId,orgId,pageId,canVisible,canAdd,canUpdate,canDelete,createPerson) values ("supdatas","supdatas01",3,1,1,1,1,"admin");
insert into tenant_org_permission(tenantId,orgId,pageId,canVisible,canAdd,canUpdate,canDelete,createPerson) values ("supdatas","supdatas01",4,1,1,1,1,"admin");
insert into tenant_org_permission(tenantId,orgId,pageId,canVisible,canAdd,canUpdate,canDelete,createPerson) values ("supdatas","supdatas01",5,1,1,1,1,"admin");
insert into tenant_org_permission(tenantId,orgId,pageId,canVisible,canAdd,canUpdate,canDelete,createPerson) values ("supdatas","supdatas01",6,1,1,1,1,"admin");
insert into tenant_org_permission(tenantId,orgId,pageId,canVisible,canAdd,canUpdate,canDelete,createPerson) values ("supdatas","supdatas01",7,1,1,1,1,"admin");
insert into tenant_org_permission(tenantId,orgId,pageId,canVisible,canAdd,canUpdate,canDelete,createPerson) values ("supdatas","supdatas01",8,1,1,1,1,"admin");
insert into tenant_org_permission(tenantId,orgId,pageId,canVisible,canAdd,canUpdate,canDelete,createPerson) values ("supdatas","supdatas01",9,1,1,1,1,"admin");
insert into tenant_org_permission(tenantId,orgId,pageId,canVisible,canAdd,canUpdate,canDelete,createPerson) values ("supdatas","supdatas01",10,1,1,1,1,"admin");
insert into tenant_org_permission(tenantId,orgId,pageId,canVisible,canAdd,canUpdate,canDelete,createPerson) values ("supdatas","supdatas01",11,1,1,1,1,"admin");
insert into tenant_org_permission(tenantId,orgId,pageId,canVisible,canAdd,canUpdate,canDelete,createPerson) values ("supdatas","supdatas01",12,1,1,1,1,"admin");


drop table tenant_asset;
create table tenant_asset(
id int not null auto_increment comment '自增序列号',
tenantId varchar(20) not null comment '租户编号',
createPerson varchar(20) not null default "system" comment '创建人',
createTime dateTime not null default now() comment '创建时间',
updatePerson varchar(20) not null default "system" comment '更新人',
updateTime dateTime comment '更新时间',
remarks varchar(200) comment '备注',
assetId varchar(100) not null comment '资产编号',
barcode varchar(100) comment '资产条码',
epc varchar(100) comment 'RFID标签ID',
assetName varchar(100) not null comment '资产名称',
classId varchar(20) not null comment '资产类别编号',
className varchar(20) not null comment '类别名称',
manager varchar(20) comment '资产管理员',
brand varchar(20) comment '品牌',
model varchar(20) comment '型号',
sn varchar(50) comment '序列号',
ownOrgId varchar(20) comment '所属组织Id',
ownOrgName varchar(20) comment '所属组织名称',
useOrgId varchar(20) comment '使用组织Id',
useOrgName varchar(20) comment '使用组织名称',
useDate dateTime comment '借用/领用日期',
status int not null default 0 comment '资产状态',
useStatus int not null comment '使用状态',
placeId varchar(20) comment '位置编号',
placeName varchar(50) comment '位置名称',
serviceLife int not null default 0 comment '可使用期限(月)',
amount float comment '金额',
purchaseDate dateTime comment '购置日期',
purchaseType varchar(20) comment '购置方式',
orderNo varchar(50) comment '采购订单号',
unit varchar(20) comment '计量单位',
image varchar(2000) comment '资产图片',
supplier varchar(20) comment '供应商',
linkPerson varchar(20) comment '联系人',
telNo varchar(20) comment '联系电话',
expired dateTime comment '过保时间',
mContent varchar(200) comment '维保内容',
primary key (`id`),
unique (`tenantId`,`assetId`)
);

insert into tenant_asset(tenantId,assetId,barcode,epc,assetName,classId,className,manager,brand,model,sn,ownOrgId,ownOrgName,useOrgId,useOrgName,status,useStatus,useDate,placeId,placeName,serviceLife,amount,purchaseDate,purchaseType,orderNo,unit,image,supplier,linkPerson,telNo,expired,mContent,createPerson) values ("supoin","ZC00100000001","","","笔记本电脑","C00101","笔记本电脑","张治金","apple","X3","","supoin01","销邦科技","supoin01","销邦科技",0,0,null,"P001","英龙大厦",12,7999,"2020-06-01","采购","","台",null,"","张治金","13826598771","2021-10-01","","admin");
insert into tenant_asset(tenantId,assetId,barcode,epc,assetName,classId,className,manager,brand,model,sn,ownOrgId,ownOrgName,useOrgId,useOrgName,status,useStatus,useDate,placeId,placeName,serviceLife,amount,purchaseDate,purchaseType,orderNo,unit,image,supplier,linkPerson,telNo,expired,mContent,createPerson) values ("supoin","ZC00200000001","","","台式电脑","C00102","台式电脑","张治金","apple","X3","","supoin01","销邦科技","supoin0101","研发中心",0,0,null,"P001","英龙大厦",12,7999,"2020-06-01","采购","","台",null,"","张治金","13826598771","2021-10-01","","admin");
insert into tenant_asset(tenantId,assetId,barcode,epc,assetName,classId,className,manager,brand,model,sn,ownOrgId,ownOrgName,useOrgId,useOrgName,status,useStatus,useDate,placeId,placeName,serviceLife,amount,purchaseDate,purchaseType,orderNo,unit,image,supplier,linkPerson,telNo,expired,mContent,createPerson) values ("supoin","ZC00300000001","","","投影仪","C002","投影仪","张治金","apple","X3","","supoin01","销邦科技","supoin0101","研发中心",0,0,null,"P001","英龙大厦",12,7999,"2020-06-01","采购","","台",null,"","张治金","13826598771","2021-10-01","","admin");
insert into tenant_asset(tenantId,assetId,barcode,epc,assetName,classId,className,manager,brand,model,sn,ownOrgId,ownOrgName,useOrgId,useOrgName,status,useStatus,useDate,placeId,placeName,serviceLife,amount,purchaseDate,purchaseType,orderNo,unit,image,supplier,linkPerson,telNo,expired,mContent,createPerson) values ("supoin","ZC00100000002","","","投影仪","C002","投影仪","张治金","apple","X3","","supoin01","销邦科技","supoin0101","研发中心",0,1,null,"P001","英龙大厦",12,7999,"2020-06-01","采购","","台",null,"","张治金","13826598771","2021-10-01","","admin");


drop table tenant_asset_place;
create table tenant_asset_place(
id int not null auto_increment comment '自增序列号',
tenantId varchar(20) not null comment '租户编号',
createPerson varchar(20) not null default "system" comment '创建人',
createTime dateTime not null default now() comment '创建时间',
updatePerson varchar(20) not null default "system" comment '更新人',
updateTime dateTime comment '更新时间',
remarks varchar(200) comment '备注',
placeId varchar(50) not null comment '位置编号',
placeName varchar(50) not null comment '位置名称',
parentId varchar(50) not null default 0 comment '父级位置编号',
primary key (`id`),
unique (`tenantId`,`placeId`)
);

insert into tenant_asset_place(tenantId,placeId,placeName,parentId,createPerson) values ("supoin","P001","英龙大厦","0","admin");
insert into tenant_asset_place(tenantId,placeId,placeName,parentId,createPerson) values ("supoin","P00101","A会议室","P001","admin");
insert into tenant_asset_place(tenantId,placeId,placeName,parentId,createPerson) values ("supoin","P00102","B会议室","P001","admin");


drop table tenant_asset_class;
create table tenant_asset_class(
id int not null auto_increment comment '自增序列号',
tenantId varchar(20) not null comment '租户编号',
createPerson varchar(20) not null default "system" comment '创建人',
createTime dateTime not null default now() comment '创建时间',
updatePerson varchar(20) not null default "system" comment '更新人',
updateTime dateTime comment '更新时间',
remarks varchar(200) comment '备注',
classId varchar(50) not null comment '分类编号',
className varchar(50) not null comment '分类名称',
parentId varchar(50) not null default 0 comment '父级分类编号',
primary key (`id`),
unique (`tenantId`,`classId`)
);

insert into tenant_asset_class(tenantId,classId,className,parentId,createPerson) values ("supoin","C01","固定资产","0","admin");
insert into tenant_asset_class(tenantId,classId,className,parentId,createPerson) values ("supoin","C00101","笔记本电脑","C01","admin");
insert into tenant_asset_class(tenantId,classId,className,parentId,createPerson) values ("supoin","C00102","台式电脑","C01","admin");
insert into tenant_asset_class(tenantId,classId,className,parentId,createPerson) values ("supoin","C002","投影仪","C01","admin");


drop table tenant_meta_billfields;
create table tenant_meta_billfields(
id int not null auto_increment comment '自增序列号',
tenantId varchar(20) not null comment '租户编号',
createPerson varchar(20) not null default "system" comment '创建人',
createTime dateTime not null default now() comment '创建时间',
updatePerson varchar(20) not null default "system" comment '更新人',
updateTime dateTime comment '更新时间',
remarks varchar(200) comment '备注',
billType int not null comment '单据类型值',
billTypeDesc varchar(20) not null comment '单据类型描述',
fieldName varchar(20) not null comment '字段名称',
fieldDesc varchar(20) not null comment '字段描述',
dataType varchar(20) comment '字段值类型',
primary key (`id`),
unique (`tenantId`,`billType`,`fieldName`)
);

insert into tenant_meta_billfields(tenantId,billType,billTypeDesc,fieldName,fieldDesc,dataType) values ("supoin",11,"派发","ext7","领用日期","dateTime");
insert into tenant_meta_billfields(tenantId,billType,billTypeDesc,fieldName,fieldDesc,dataType) values ("supoin",11,"派发","ext10","领用后位置","string");
insert into tenant_meta_billfields(tenantId,billType,billTypeDesc,fieldName,fieldDesc,dataType) values ("supoin",11,"派发","ext11","处理人","string");
insert into tenant_meta_billfields(tenantId,billType,billTypeDesc,fieldName,fieldDesc,dataType) values ("supoin",11,"派发","ext12","领用人","string");
insert into tenant_meta_billfields(tenantId,billType,billTypeDesc,fieldName,fieldDesc,dataType) values ("supoin",21,"退库","ext7","退库日期","dateTime");
insert into tenant_meta_billfields(tenantId,billType,billTypeDesc,fieldName,fieldDesc,dataType) values ("supoin",21,"退库","ext10","退库后位置","string");
insert into tenant_meta_billfields(tenantId,billType,billTypeDesc,fieldName,fieldDesc,dataType) values ("supoin",21,"退库","ext11","退库后部门","string");
insert into tenant_meta_billfields(tenantId,billType,billTypeDesc,fieldName,fieldDesc,dataType) values ("supoin",21,"退库","ext12","管理员","string");
insert into tenant_meta_billfields(tenantId,billType,billTypeDesc,fieldName,fieldDesc,dataType) values ("supoin",12,"借出","ext7","借用时间","dateTime");
insert into tenant_meta_billfields(tenantId,billType,billTypeDesc,fieldName,fieldDesc,dataType) values ("supoin",12,"借出","ext8","预计归还时间","dateTime");
insert into tenant_meta_billfields(tenantId,billType,billTypeDesc,fieldName,fieldDesc,dataType) values ("supoin",12,"借出","ext10","借用处理人","string");
insert into tenant_meta_billfields(tenantId,billType,billTypeDesc,fieldName,fieldDesc,dataType) values ("supoin",12,"借出","ext11","借用后位置","string");
insert into tenant_meta_billfields(tenantId,billType,billTypeDesc,fieldName,fieldDesc,dataType) values ("supoin",22,"归还","ext7","归还日期","dateTime");
insert into tenant_meta_billfields(tenantId,billType,billTypeDesc,fieldName,fieldDesc,dataType) values ("supoin",22,"归还","ext10","归还后位置","string");
insert into tenant_meta_billfields(tenantId,billType,billTypeDesc,fieldName,fieldDesc,dataType) values ("supoin",22,"归还","ext11","归还后处理人","string");
insert into tenant_meta_billfields(tenantId,billType,billTypeDesc,fieldName,fieldDesc,dataType) values ("supoin",30,"调拨","ext10","调出管理人员","string");
insert into tenant_meta_billfields(tenantId,billType,billTypeDesc,fieldName,fieldDesc,dataType) values ("supoin",30,"调拨","ext11","调拨后所属公司","string");
insert into tenant_meta_billfields(tenantId,billType,billTypeDesc,fieldName,fieldDesc,dataType) values ("supoin",30,"调拨","ext12","调入管理员","string");
insert into tenant_meta_billfields(tenantId,billType,billTypeDesc,fieldName,fieldDesc,dataType) values ("supoin",30,"调拨","ext13","调入公司","string");
insert into tenant_meta_billfields(tenantId,billType,billTypeDesc,fieldName,fieldDesc,dataType) values ("supoin",30,"调拨","ext14","调入部门","string");
insert into tenant_meta_billfields(tenantId,billType,billTypeDesc,fieldName,fieldDesc,dataType) values ("supoin",30,"调拨","ext15","调入位置","string");
insert into tenant_meta_billfields(tenantId,billType,billTypeDesc,fieldName,fieldDesc,dataType) values ("supoin",31,"维修","ext4","维修费用","float");
insert into tenant_meta_billfields(tenantId,billType,billTypeDesc,fieldName,fieldDesc,dataType) values ("supoin",31,"维修","ext7","报修日期","dateTime");
insert into tenant_meta_billfields(tenantId,billType,billTypeDesc,fieldName,fieldDesc,dataType) values ("supoin",31,"维修","ext8","完成日期","dateTime");
insert into tenant_meta_billfields(tenantId,billType,billTypeDesc,fieldName,fieldDesc,dataType) values ("supoin",31,"维修","ext10","报修人员","string");
insert into tenant_meta_billfields(tenantId,billType,billTypeDesc,fieldName,fieldDesc,dataType) values ("supoin",31,"维修","ext11","送修位置","string");
insert into tenant_meta_billfields(tenantId,billType,billTypeDesc,fieldName,fieldDesc,dataType) values ("supoin",31,"维修","ext12","报修内容","string");
insert into tenant_meta_billfields(tenantId,billType,billTypeDesc,fieldName,fieldDesc,dataType) values ("supoin",32,"处置","ext4","处置费用","float");
insert into tenant_meta_billfields(tenantId,billType,billTypeDesc,fieldName,fieldDesc,dataType) values ("supoin",32,"处置","ext7","完成日期","dateTime");
insert into tenant_meta_billfields(tenantId,billType,billTypeDesc,fieldName,fieldDesc,dataType) values ("supoin",32,"处置","ext10","处置类型","string");


drop table tenant_meta_billtype;
create table tenant_meta_billtype(
id int not null auto_increment comment '自增序列号',
tenantId varchar(20) not null comment '租户编号',
createPerson varchar(20) not null default "system" comment '创建人',
createTime dateTime not null default now() comment '创建时间',
updatePerson varchar(20) not null default "system" comment '更新人',
updateTime dateTime comment '更新时间',
remarks varchar(200) comment '备注',
billType int not null comment '单据类型值',
billTypeDesc varchar(20) not null comment '单据类型描述',
primary key (`id`),
unique (`tenantId`,`billType`)
);

insert into tenant_meta_billtype(tenantId,billType,billTypeDesc,createPerson) values ("supoin",11,"派发","admin");
insert into tenant_meta_billtype(tenantId,billType,billTypeDesc,createPerson) values ("supoin",21,"退库","admin");
insert into tenant_meta_billtype(tenantId,billType,billTypeDesc,createPerson) values ("supoin",12,"借出","admin");
insert into tenant_meta_billtype(tenantId,billType,billTypeDesc,createPerson) values ("supoin",22,"归还","admin");
insert into tenant_meta_billtype(tenantId,billType,billTypeDesc,createPerson) values ("supoin",30,"调拨","admin");
insert into tenant_meta_billtype(tenantId,billType,billTypeDesc,createPerson) values ("supoin",31,"维修","admin");
insert into tenant_meta_billtype(tenantId,billType,billTypeDesc,createPerson) values ("supoin",32,"处置","admin");


drop table tenant_bill;
create table tenant_bill(
id int not null auto_increment comment '自增序列号',
tenantId varchar(20) not null comment '租户编号',
createPerson varchar(20) not null default "system" comment '创建人',
createTime dateTime not null default now() comment '创建时间',
updatePerson varchar(20) not null default "system" comment '更新人',
updateTime dateTime comment '更新时间',
remarks varchar(200) comment '备注',
billNo varchar(50) not null comment '单据编号',
billType int not null comment '单据类型',
sourceBillNo varchar(50) comment '上游单据号',
status int not null comment '单据状态',
ext1 int comment '扩展字段1',
ext2 int comment '扩展字段2',
ext3 int comment '扩展字段3',
ext4 float comment '扩展字段4',
ext5 float comment '扩展字段5',
ext6 float comment '扩展字段6',
ext7 dateTime comment '扩展字段7',
ext8 dateTime comment '扩展字段8',
ext9 dateTime comment '扩展字段9',
ext10 varchar(200) comment '扩展字段10',
ext11 varchar(200) comment '扩展字段11',
ext12 varchar(200) comment '扩展字段12',
ext13 varchar(200) comment '扩展字段13',
ext14 varchar(200) comment '扩展字段14',
ext15 varchar(200) comment '扩展字段15',
ext16 varchar(200) comment '扩展字段16',
ext17 varchar(200) comment '扩展字段17',
ext18 varchar(200) comment '扩展字段18',
ext19 varchar(200) comment '扩展字段19',
ext20 varchar(200) comment '扩展字段20',
primary key (`id`),
unique (`tenantId`,`billNo`,`billType`)
);



drop table tenant_bill_detail;
create table tenant_bill_detail(
id int not null auto_increment comment '自增序列号',
tenantId varchar(20) not null comment '租户编号',
createPerson varchar(20) not null default "system" comment '创建人',
createTime dateTime not null default now() comment '创建时间',
updatePerson varchar(20) not null default "system" comment '更新人',
updateTime dateTime comment '更新时间',
remarks varchar(200) comment '备注',
billNo varchar(50) not null comment '单据编号',
billType int not null comment '单据类型',
assetId varchar(100) not null comment '资产编号',
status int not null comment '单据状态',
primary key (`id`),
unique (`tenantId`,`billNo`,`billType`,`assetId`)
);



drop table tenant_inventory;
create table tenant_inventory(
id int not null auto_increment comment '自增序列号',
tenantId varchar(20) not null comment '租户编号',
createPerson varchar(20) not null default "system" comment '创建人',
createTime dateTime not null default now() comment '创建时间',
updatePerson varchar(20) not null default "system" comment '更新人',
updateTime dateTime comment '更新时间',
remarks varchar(200) comment '备注',
billNo varchar(50) not null comment '单据编号',
status int not null comment '单据状态',
billName varchar(50) not null comment '盘点单据名称',
panddPerson varchar(50) not null comment '盘点人',
checkPerson varchar(50) not null comment '审核人',
startDate date not null comment '盘点开始日期',
endDate date not null comment '盘点结束日期',
useOrgId varchar(50) not null comment '使用组织编号',
userOrgName varchar(50) not null comment '使用组织名称',
classId varchar(50) comment '资产类别编号',
placeId varchar(50) comment '位置编号',
ownOrgId varchar(50) not null comment '所属组织编号',
ownOrgName varchar(50) not null comment '所属组织名称',
primary key (`id`),
unique (`tenantId`,`billNo`)
);



drop table tenant_inventory_detail;
create table tenant_inventory_detail(
id int not null auto_increment comment '自增序列号',
tenantId varchar(20) not null comment '租户编号',
createPerson varchar(20) not null default "system" comment '创建人',
createTime dateTime not null default now() comment '创建时间',
updatePerson varchar(20) not null default "system" comment '更新人',
updateTime dateTime comment '更新时间',
remarks varchar(200) comment '备注',
billNo varchar(50) not null comment '单据编号',
assetId varchar(100) not null comment '资产编号',
status int not null comment '单据状态',
pdPerson varchar(50) not null comment '盘点人',
pdDate datetime not null comment '盘点日期',
modify varchar(100) comment '盘点资产变更情况',
image varchar(2000) comment '盘点相关图片',
pdaSn varchar(50) not null comment 'pda编码',
primary key (`id`),
unique (`tenantId`,`billNo`,`assetId`)
);



drop table tenant_param;
create table tenant_param(
id int not null auto_increment comment '自增序列号',
tenantId varchar(20) not null comment '租户编号',
createPerson varchar(20) not null default "system" comment '创建人',
createTime dateTime not null default now() comment '创建时间',
updatePerson varchar(20) not null default "system" comment '更新人',
updateTime dateTime comment '更新时间',
remarks varchar(200) comment '备注',
paramKey varchar(20) not null comment '参数key值',
paramDesc varchar(50) comment '参数描述',
paramValue varchar(4000) not null comment '参数值，可以是json字符串',
primary key (`id`),
unique (`tenantId`,`paramKey`)
);

insert into tenant_param(paramKey,paramDesc,paramValue) values ("assetStatus","资产状态",{"free":{"value":0,"desc":"空闲"},"use":{"value":1,"desc":"领用"},"borrow":{"value":2,"desc":"借用"},"disposing":{"value":10,"desc":"处置待确认"},"disposed":{"value":11,"desc":"处置完成"}});
insert into tenant_param(paramKey,paramDesc,paramValue) values ("assetUseStatus","资产使用状态",{"normal":{"value":0,"desc":"正常"},"fault":{"value":1,"desc":"故障"},"maintain":{"value":2,"desc":"维修中"}});


