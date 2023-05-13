package com.supdatas.asset.model.out;

public enum OutScanEnum {

	UN_SCANED("未出库",0),
	SCANED("已扫描", 1),
	UPLOADED("已上传", 2);


	private String mName;
	private int mStatusCode;

	private OutScanEnum(String name, int code){

		mName = name;
		mStatusCode = code;
	}

	public static String getName(int code) {
		for (OutScanEnum c : OutScanEnum.values()) {
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
