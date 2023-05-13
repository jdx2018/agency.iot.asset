package com.supdatas.asset.model;

public enum ScanEnum {

	UNSCANED("未扫描",0),
	SCANED("已扫描", 1);

	private String mName;
	private int mCode;

	private ScanEnum(String name, int code){

		mName = name;
		mCode = code;
	}

	public static String getName(int code) {
		for (ScanEnum c : ScanEnum.values()) {
			if (c.getCode() == code) {
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
	public int getCode(){
		return mCode;
	}
	public void setStatus(int code){
		mCode = code;
	}
}
