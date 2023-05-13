package com.supdatas.asset.model.out;

import java.io.Serializable;

public enum OutBillTypeEnum implements Serializable {

	BORROW_OUT("借阅出库", 11),
	TRANSFER_OUT("移库出库", 12),
	DESTROY_OUT("销户出库", 13);

	private String mName;
	private int mTypeCode;

	private OutBillTypeEnum(String name, int code){

		mName = name;
		mTypeCode = code;
	}

	public static String getName(int code) {
		for (OutBillTypeEnum c : OutBillTypeEnum.values()) {
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
