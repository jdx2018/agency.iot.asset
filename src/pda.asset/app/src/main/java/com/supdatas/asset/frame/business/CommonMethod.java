package com.supdatas.asset.frame.business;

import com.supdatas.asset.frame.utility.DateUtil;
import com.supdatas.asset.frame.utility.EncryptMethod;
import com.supdatas.asset.frame.utility.encryptAlgorithm.AESCBC128;
import com.supdatas.asset.configure.ConfigParams;

public class CommonMethod {

	public static String getMd5(String content){

		String encrypted = AESCBC128.getAESEncode(content);
		String str = encrypted + ConfigParams.salt + DateUtil.getDateStr();
		String md5 = EncryptMethod.get32MD5(str);

		return md5;
	}
}
