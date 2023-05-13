package com.supdatas.asset.model.in;

public enum InBillStatusEnum {

	UN_FINISHED("未入库",0),
	PARTICAL_FINISHED("部分入库", 1),
	ALL_FINISHED("已入库", 2);

	private String mName;
	private int mStatusCode;

	private InBillStatusEnum(String name, int code){

		mName = name;
		mStatusCode = code;
	}

	public static String getName(int code) {
		for (InBillStatusEnum c : InBillStatusEnum.values()) {
			if (c.getStatus() == code) {
				return c.getName();
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
	public int getStatus(){
		return mStatusCode;
	}
	public void setStatus(int code){
		mStatusCode = code;
	}
}
