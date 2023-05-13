package com.supdatas.asset.model.in;

import java.io.Serializable;

public enum InBillTypeEnum implements Serializable {

	ADD_IN("新增入库",0),
	RETURN_IN("归还入库", 1),
	TRANSFER_IN("移库入库", 2),
	DESTROY_IN("销户入库", 3);

	private String mName;
	private int mTypeCode;

	private InBillTypeEnum(String name, int code){

		mName = name;
		mTypeCode = code;
	}

	public static String getName(int code) {
		for (InBillTypeEnum c : InBillTypeEnum.values()) {
			if (c.getTypeCode() == code) {
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
	public int getTypeCode(){
		return mTypeCode;
	}
	public void setmTypeCode(int code){
		mTypeCode = code;
	}
}
