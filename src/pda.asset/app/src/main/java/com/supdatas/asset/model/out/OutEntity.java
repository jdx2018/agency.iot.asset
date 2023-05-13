package com.supdatas.asset.model.out;

import com.supdatas.asset.configure.ConfigParams;
import com.supdatas.asset.frame.utility.DateUtil;
import com.supdatas.asset.model.BillStatusEnum;
import com.supdatas.asset.model.in.InBillStatusEnum;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.Serializable;

public class OutEntity implements Serializable {

	public static String TABLE_NAME = "stock_out";
	public static String []TABLE_COLUMNS = new String[]{
			"tenantId","billNo","billType","roomId","status","outDate","department","userNo","userName",
			"returnDate", "createTime","createPerson"
	};

	public OutEntity(){
		status = 0;
		uploadStatus = 0;
	}

	public String tenantId;
	public String billNo;
	public int billType;
	public String roomId;
	/** 是否扫描完成的扫描状态 */
	public int status;
	public String outDate;
	public String department;
	public String userNo;
	public String userName;
	public String returnDate;

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

	public static Object getQuery(OutBillTypeEnum billTypeEnum) throws Exception {

		JSONObject query = new JSONObject();
		JSONObject jsDate = new JSONObject();
		jsDate.put("$gte", DateUtil.getDateStr(0 - ConfigParams.mDaysBefore));

		JSONObject jsStatus = new JSONObject();
		jsStatus.put("$lte", InBillStatusEnum.PARTICAL_FINISHED);
		query.put("status", jsStatus);
		//query.put("status", 0);
		query.put("createTime", jsDate);
		query.put("billType", billTypeEnum.getTypeCode());

		return query;
	}

	public static Object getQuery(String billNo) throws Exception {

		JSONObject query = new JSONObject();

		query.put("billNo", billNo);
		return query;
	}

	public static Object getFields() throws Exception {

		JSONObject jsonObject = new JSONObject();
		for (int i = 0; i < TABLE_COLUMNS.length; ++i) {
			jsonObject.put(TABLE_COLUMNS[i], 1);
		}
		return jsonObject;
	}

	public String getDataRequestJson(String sn) throws JSONException {

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

		return OutBillStatusEnum.getName(status);
	}
}
