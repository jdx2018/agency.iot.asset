package com.supdatas.asset.model;

public enum BillStatusEnum {

	UN_UPLOADED("未上传",0),
	SCANING("扫描中", 1),
	UPLOADED("已上传", 2);

	private String mName;
	private int mStatusCode;

	private BillStatusEnum(String name, int code){

		mName = name;
		mStatusCode = code;
	}

	public static String getName(int code) {
		for (BillStatusEnum c : BillStatusEnum.values()) {
			if (c.getCode() == code) {
				return c.getName();		//c.name()为枚举变量本身的值，UN_UPLOADED
			}
		}
		return null;
	}


	public String getName(){
		return mName;
	}
	public void setName(String name){
		mName = name;
	}
	public int getCode(){
		return mStatusCode;
	}
	public void setStatus(int code){
		mStatusCode = code;
	}
}
