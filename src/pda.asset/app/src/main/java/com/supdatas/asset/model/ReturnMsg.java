package com.supdatas.asset.model;

public class ReturnMsg {

	/**
	 * 状态；1表示成功，0表示失败
	 * */
	public int status;
	public String message;
	public String content;

	public ReturnMsg(){
		status = 1;
		message = "";
		content = "";
	}

	public ReturnMsg(int status1, String msg){

		status = status1;
		message = msg;
	}

	public ReturnMsg(int status1, String msg, String cnt){

		status = status1;
		message = msg;
		content = cnt;
	}

	@Override
	public String toString(){

		return String.format("{\"status\":%d,\"message\":\"%s\"," +
						"\"content\":\"%s\"}",
				status, message, content);
	}
}
