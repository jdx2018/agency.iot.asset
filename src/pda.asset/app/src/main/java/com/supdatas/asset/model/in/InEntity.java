package com.supdatas.asset.model.in;

import com.supdatas.asset.configure.ConfigParams;
import com.supdatas.asset.frame.utility.DateUtil;
import com.supdatas.asset.model.BillStatusEnum;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.Serializable;

public class InEntity implements Serializable {

	public static String TABLE_NAME = "stock_in";
	public static String []TABLE_COLUMNS = new String[]{
			"tenantId","billNo","billType","status","createTime","createPerson","indate","department",
			"sourceBillNo"
	};

	public InEntity(){
		status = 0;
		uploadStatus = 0;
	}

	public String tenantId;
	public String billNo;
	public int billType;
	public String sourceBillNo;
	/** 是否扫描完成的扫描状态 */
	public int status;
	public String inDate;
	public String department;
	public String userNo;
	public String userName;

	public String ext1;
	public String ext2;
	public String ext3;
	public String ext4;
	public String ext5;

	public String createTime;
	public String createPerson;
	public String updateTime;
	public String updatePerson;
	public String remarks;

	/** 上传状态 */
	public int uploadStatus;

	public static Object getQuery(InBillTypeEnum billTypeEnum) throws Exception {

		JSONObject query = new JSONObject();
		JSONObject jsDate = new JSONObject();
		jsDate.put("$gte", DateUtil.getDateStr(0 - ConfigParams.mDaysBefore));

		/*JSONArray jsonArrayStatus = new JSONArray();
		jsonArrayStatus.put(InBillScanStatusDescEnum.UN_FINISHED.getStatus());
		jsonArrayStatus.put(InBillScanStatusDescEnum.PARTICAL_FINISHED.getStatus());*/

		JSONObject jsStatus = new JSONObject();
		jsStatus.put("$lte", InBillStatusEnum.PARTICAL_FINISHED.getStatus());
		//"createTime":{"$gte":"2020-07-29"}
		//query.put("status", 0);
		query.put("status", jsStatus);
		query.put("createTime", jsDate);

		if (billTypeEnum.getTypeCode() != InBillTypeEnum.ADD_IN.getTypeCode()){
			query.put("billType", billTypeEnum.getTypeCode());
		}
		return query;
	}

	public static Object getQuery(String billNo) throws Exception {

		JSONObject query = new JSONObject();

		query.put("billNo", billNo);
		return query;
	}

	public static Object getFields(InBillTypeEnum billTypeEnum) throws Exception {

		JSONObject jsonObject = new JSONObject();
		for (int i = 0; i < TABLE_COLUMNS.length; ++i) {
			jsonObject.put(TABLE_COLUMNS[i], 1);
		}
		return jsonObject;
	}

	public String getDataRequestJson(InBillTypeEnum billTypeEnum,String sn) throws JSONException {

		JSONObject jsonObject = new JSONObject();
		jsonObject.put("command",301);		//301是PDA
		jsonObject.put("sn", sn);
		jsonObject.put("operate", "query");

		jsonObject.put("tableName", TABLE_NAME);

		JSONObject jsDate = new JSONObject();
		jsDate.put("$gt", DateUtil.getDateStr(0 - ConfigParams.mDaysBefore));

		JSONObject query = new JSONObject();
		query.put("status", 0);
		query.put("createTime", jsDate);
		jsonObject.put("query", query);

		return jsonObject.toString();
	}

	public String getUploadStatusDesc(){

		return BillStatusEnum.getName(uploadStatus);
	}

	public String getScanStatusDesc(){

		return InBillStatusEnum.getName(status);
	}
}
