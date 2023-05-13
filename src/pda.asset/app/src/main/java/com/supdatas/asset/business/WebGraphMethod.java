package com.supdatas.asset.business;

import com.supdatas.asset.frame.business.CommonMethod;
import com.supdatas.asset.frame.sys.MainApplication;
import com.supdatas.asset.frame.utility.DateUtil;
import com.supdatas.asset.frame.utility.HttpUtility;
import com.supdatas.asset.frame.utility.TextUtil;
import com.supdatas.asset.configure.ConfigConstants;
import com.supdatas.asset.configure.ConfigParams;
import com.supdatas.asset.model.ReturnMsg;

import org.json.JSONObject;

import java.util.HashMap;

public class WebGraphMethod {

	public ReturnMsg getTokenWithHttp() {

		ReturnMsg returnMsg = new ReturnMsg();
		try {
			JSONObject jsonMain = new JSONObject();
			jsonMain.put("command", 101);
			jsonMain.put("sn", ConfigParams.seriesNo);
			String sign = CommonMethod.getMd5(jsonMain.toString());

			HashMap<String, String> headers = new HashMap<>();
			headers.put("signature", sign);

			returnMsg = HttpUtility.httpPost(ConfigParams.mDataHttpUrl, headers,
					jsonMain.toString());

			//{"code":1,"message":"success.","data":{"access_token":"0a3b2af2cf1626e9d0f17099b287cf3c"}}
			//{"status":true,"message":"","content":"{"code":-102,"message":"该设备没有注册信息."}"}
			if (returnMsg.status == 1) {

				JSONObject js = new JSONObject(returnMsg.content);
				int code = js.getInt("code");
				String message = js.getString("message");

				returnMsg.message = message;
				if (code == 1) {

					JSONObject jsonData = js.getJSONObject("data");
					if (jsonData != null) {

						//JSONObject jsonData = new JSONObject(data);
						String token = jsonData.getString("access_token");
						ConfigParams.accessToken = token;
						MainApplication.mConfigSys.setItemStrValue(ConfigConstants.KEY_ACCESS_TOKEN, ConfigParams.accessToken);

						ConfigParams.accessTokenDate = DateUtil.getDateStr();
						MainApplication.mConfigSys.setItemStrValue(ConfigConstants.KEY_ACCESS_TOKEN_DATE,
								ConfigParams.accessTokenDate);

						returnMsg.status = 1;
					}
					else{
						returnMsg.status = 0;
					}
				}
				else{
					returnMsg.status = 0;
				}
			}
		}
		catch (Exception ex){
			ex.printStackTrace();
			returnMsg.status = 0;
			returnMsg.message = ex.getMessage();
		}
		finally {

		}
		return returnMsg;
	}

	public ReturnMsg getGraphData(String requestUrl, String signature, String jsonStr) {

		ReturnMsg returnMsg = new ReturnMsg();
		try {
			HashMap<String, String> mapHeaders = new HashMap<>();
			if (!TextUtil.isNullOrEmpty(signature))
				mapHeaders.put("signature", signature);
			if (!TextUtil.isNullOrEmpty(ConfigParams.accessToken))
				mapHeaders.put("access_token", ConfigParams.accessToken);

			returnMsg = HttpUtility.httpPost(requestUrl, mapHeaders, jsonStr);
			if (returnMsg.status == 1) {

				//{"code":1,"message":"success.","data":{"access_token":"0a3b2af2cf1626e9d0f17099b287cf3c"}}
				//{"code":1,"message":"success","data":[]}
				JSONObject jsonObject = new JSONObject(returnMsg.content);
				int code = jsonObject.getInt("code");

				if (code <= -21 && code >= -29) {

					returnMsg = getTokenWithHttp();
					if (returnMsg.status != 1){
						returnMsg = getTokenWithHttp();
					}
					if (returnMsg.status == 1){

						returnMsg = HttpUtility.httpPost(requestUrl, mapHeaders, jsonStr);
					}
				}
			}
			return returnMsg;
		}
		catch (Exception ex){
			LogSys.writeSysLog("", ex.toString());
			returnMsg.status = 0;
			returnMsg.message = ex.getMessage();
		}
		finally {

		}
		return returnMsg;
	}
}
