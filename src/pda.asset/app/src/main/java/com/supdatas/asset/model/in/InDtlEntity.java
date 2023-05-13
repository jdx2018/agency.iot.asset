package com.supdatas.asset.model.in;

import com.supdatas.asset.configure.ConfigParams;
import com.supdatas.asset.frame.utility.DateUtil;
import com.supdatas.asset.model.inventory.InventoryDtlEntity;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

public class InDtlEntity {

	public static String TABLE_NAME = "stock_in_detail";
	public static String []TABLE_COLUMNS = new String[]{
			"billNo","archiveNo","roomId","status","stockInDate","createTime","createPerson"
	};

	public InDtlEntity(){

		status = 0;
		qty = 1;
	}

	public String tenantId;
	public String billNo;
	public String archiveNo;

	public String epc;
	public String archiveDepartment;
	public String archiveType;
	public String archiveStatus;
	public int roomId;
	public String accountBank;
	public String accountOrgName;
	public String accountstatus;
	public String openDate;
	public String destructDate;
	public String customerNo;
	public String customerName;

	public int status;
	public String stockInDate;
	public String createTime;
	public String createPerson;
	public String updateTime;
	public String updatePerson;
	public String remarks;

	/**不为数据库中的域*/
	public int qty;

	public static Object getQuery(String billNo) throws Exception {

		JSONObject query = new JSONObject();

		query.put("billNo", billNo);
		//query.put("status", status);
		return query;
	}

	public static Object getFields(InBillTypeEnum billTypeEnum) throws Exception {

		JSONObject jsonObject = new JSONObject();

		for (int i = 0; i < TABLE_COLUMNS.length; ++i) {
			jsonObject.put(TABLE_COLUMNS[i], 1);
		}
		return jsonObject;
	}

	public String getDataPostJson(InBillTypeEnum billTypeEnum, String billNo, String sn,
								  List<InventoryDtlEntity> list) throws JSONException {

		JSONObject jsonMain = new JSONObject();
		jsonMain.put("command",301);		//301是PDA
		jsonMain.put("sn", sn);
		jsonMain.put("operate", "batch");
		//jsonObject.put("tableName", "inventory_detail");

		JSONArray updateList = new JSONArray();
		JSONObject updateItem = null;
		JSONObject query = null;
		JSONObject dataContent = null;
//
//		for (InventoryDtlEntity item : list) {
//
//			if (item.status == 1) {
//
//				updateItem = new JSONObject();
//				query = new JSONObject();
//				dataContent = new JSONObject();
//
//				updateItem.put("operate","update");
//				updateItem.put("tableName", TABLE_NAME);
//
//				query.put("billNo", billNo);
//				query.put("archiveNo", item.archiveNo);
//
//				dataContent.put("status", item.status);
//				dataContent.put("updateTime", DateUtil.getDateTimeStr1());
//				dataContent.put("updatePerson", ConfigParams.userNo);
//
//				updateItem.put("query", query);
//				updateItem.put("dataContent", dataContent);
//
//				updateList.put(updateItem);
//			}
//		}
//		jsonMain.put("operateList", updateList);
		return jsonMain.toString();
	}

	public String getDataRequestJson(InBillTypeEnum billTypeEnum, String billNo, String sn) throws JSONException {

		JSONObject jsonObject = new JSONObject();
		jsonObject.put("command",301);		//301是PDA
		jsonObject.put("sn", sn);
		jsonObject.put("operate", "query");
		jsonObject.put("tableName", TABLE_NAME);

		JSONObject query = new JSONObject();
		query.put("billNo", billNo);
		jsonObject.put("query", query);

		return jsonObject.toString();
	}

	public String getStatusDesc(){

		return InScanEnum.getName(status);
	}
}
