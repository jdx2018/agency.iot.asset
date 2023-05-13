package com.supdatas.asset.model;

import java.util.Date;

/**
 * Created by Administrator on 2020/05/18
 */
public class UserEntity {

	public String userName;
	public String password;
	public boolean checkcode = false;
	public String code;
	public String key;

	/** 请求token（失效时间2小时） */
	public String token;
	/** token时间 */
	public Date tokenDate;
}
