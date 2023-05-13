create table tenant_user_permission
(id int auto_increment not null primary key,
tenantId varchar(20) not null,
userId varchar(20) not null,
pageId varchar(20) not null,
funcId varchar(20) not null,
createPerson varchar(20) not null,
createTime DateTime not null default now(),
updatePerson varchar(20) not null,
updateTime DateTime null
)
