package com.supdatas.asset.model.inventory;

import com.supdatas.asset.configure.ConfigParams;
import com.supdatas.asset.frame.utility.DateUtil;
import com.supdatas.asset.model.BillStatusEnum;
import com.supdatas.asset.sqlite.TableName;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.Serializable;

/**
 * 盘点主表
 * @author zxl 2020.7.7
 * */
public class InventoryEntity implements Serializable {

//	public static String TABLE_NAME = "inventory";
	public static String []TABLE_COLUMNS = new String[]{

		"tenantId","billNo","billType","billStatus","pdBillName","pdPerson","startDate","endDate","useOrgId",
		"useOrgName","classId","placeId","ownOrgId","ownOrgName",
		"createPerson","createTime","updatePerson","updateTime","remarks"
	};

	public InventoryEntity(){
		billStatus = 0;
	}

	public String tenantId;
	public String billNo;
	public String billType;
	public int billStatus;
	public String pdBillName;
	public String pdPerson;
	public String startDate;
	public String endDate;
	public String useOrgId;
	public String useOrgName;
	public String classId;
	public String placeId;
	public String ownOrgId;
	public String ownOrgName;
	public String createPerson;
	public String createTime;
	public String updatePerson;
	public String updateTime;
	public String remarks;

	public static Object getQuery(String tenantId) throws Exception {

		JSONObject query = new JSONObject();
		query.put("tenantId", tenantId);
		JSONObject jsDate = new JSONObject();
		jsDate.put("$gte", DateUtil.getDateStr(0 - ConfigParams.mDaysBefore));

		JSONObject jsStatus = new JSONObject();
		jsStatus.put("$lte", BillStatusEnum.UN_UPLOADED.getCode());
		query.put("billStatus", jsStatus);
		query.put("createTime", jsDate);
		return query;
	}

	public static Object getQuery(String tenantId, String billNo) throws Exception {

		JSONObject query = new JSONObject();
		query.put("tenantId", tenantId);
		query.put("billNo", billNo);
		return query;
	}

	public static Object getFields() throws Exception {

		JSONObject jsonObject = new JSONObject();

		for (int i = 0; i < TABLE_COLUMNS.length; ++i){
			jsonObject.put(TABLE_COLUMNS[i], 1);
		}
		return jsonObject;
	}


	//盘点主表 请求参数
	public String getDataRequestJson(String sn) throws JSONException {

		JSONObject jsonObject = new JSONObject();
		jsonObject.put("command",301);		//301是PDA
		jsonObject.put("sn", sn);
		jsonObject.put("operate", "query");
		jsonObject.put("tableName", TableName.TENANT_INVENTORY);

		JSONObject jsDate = new JSONObject();
		jsDate.put("$gt", DateUtil.getDateStr(0 - ConfigParams.mDaysBefore));

		JSONObject query = new JSONObject();
		query.put("billStatus", 0);
		query.put("createTime", jsDate);
		jsonObject.put("query", query);

		return jsonObject.toString();
	}

	public String getUploadStatusDesc(){

		return BillStatusEnum.getName(billStatus);
	}
}
