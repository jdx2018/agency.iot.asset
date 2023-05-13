package com.supdatas.asset.model.out;

public enum OutBillStatusEnum {

	UN_FINISHED("未完成",0),
	PARTICAL_FINISHED("部分出库", 1),
	ALL_FINISHED("已出库", 2);

	private String mName;
	private int mStatusCode;

	private OutBillStatusEnum(String name, int code){

		mName = name;
		mStatusCode = code;
	}

	public static String getName(int code) {
		for (OutBillStatusEnum c : OutBillStatusEnum.values()) {
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
