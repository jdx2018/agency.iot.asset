package com.supdatas.asset.model.in;

public enum InScanEnum {

	UN_SCANED("未入库",0),
	SCANED("已扫描", 1),
	UPLOADED("已上传", 2);

	private String mName;
	private int mStatusCode;

	private InScanEnum(String name, int code){

		mName = name;
		mStatusCode = code;
	}

	public static String getName(int code) {
		for (InScanEnum c : InScanEnum.values()) {
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
