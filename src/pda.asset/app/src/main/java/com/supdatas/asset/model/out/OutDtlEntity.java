package com.supdatas.asset.model.out;

import com.supdatas.asset.configure.ConfigParams;
import com.supdatas.asset.frame.utility.DateUtil;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.Serializable;
import java.util.List;

public class OutDtlEntity implements Serializable {

	public static String TABLE_NAME = "stock_out_detail";
	public static String []TABLE_COLUMNS = new String[]{
			"billNo","archiveNo","status","roomId","stockOutDate","createTime","createPerson"
	};

	public OutDtlEntity(){

		status = 0;
		qty = 1;
		hasFound = false;
	}

	public String tenantId;
	public String billNo;
	public String archiveNo;
	public String roomId;
	public int status;
	public String stockOutDate;

	public String createTime;
	public String createPerson;
	public String updateTime;
	public String updatePerson;
	public String remarks;

	public String customerName;
	public String accountOrgName;
	public String openDate;

	/**不为数据库中的域*/
	public String epc;
	public int qty;
	public boolean hasFound;

	public static Object getQuery(String billNo, int status ) throws Exception {

		JSONObject query = new JSONObject();

		query.put("billNo", billNo);
		query.put("status", status);
		return query;
	}

	public static Object getFields() throws Exception {

		JSONObject jsonObject = new JSONObject();
		for (int i = 0; i < TABLE_COLUMNS.length; ++i) {
			jsonObject.put(TABLE_COLUMNS[i], 1);
		}
		return jsonObject;
	}

	public String getDataPostJson(String billNo, String sn,
								  List<OutDtlEntity> list) throws JSONException {

		JSONObject jsonMain = new JSONObject();
		jsonMain.put("command",301);
		jsonMain.put("sn", sn);
		jsonMain.put("operate", "batch");

		JSONArray updateList = new JSONArray();
		JSONObject updateItem = null;
		JSONObject query = null;
		JSONObject dataContent = null;

		for (OutDtlEntity item : list) {

			if (item.status == 1) {

				updateItem = new JSONObject();
				query = new JSONObject();
				dataContent = new JSONObject();

				updateItem.put("operate","update");
				updateItem.put("tableName", TABLE_NAME);

				query.put("billNo", billNo);
				query.put("archiveNo", item.archiveNo);

				dataContent.put("status", item.status);
				dataContent.put("updateTime", DateUtil.getDateTimeStr1());
				dataContent.put("updatePerson", ConfigParams.userNo);

				updateItem.put("query", query);
				updateItem.put("dataContent", dataContent);

				updateList.put(updateItem);
			}
		}
		jsonMain.put("operateList", updateList);
		return jsonMain.toString();
	}

	public String getDataRequestJson(OutBillTypeEnum billTypeEnum, String billNo, String sn) throws JSONException {

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

		return OutScanEnum.getName(status);
	}
}
