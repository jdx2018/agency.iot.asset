package com.supdatas.asset.model.inventory;

import com.supdatas.asset.configure.ConfigParams;
import com.supdatas.asset.frame.utility.DateUtil;
import com.supdatas.asset.model.ScanEnum;
import com.supdatas.asset.model.asset.AssetEntity;
import com.supdatas.asset.sqlite.TableName;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.Serializable;
import java.util.List;

/**
 * 盘点明细表
 * @author zxl 2020.7.7
 * */
public class InventoryDtlEntity implements Serializable {

	public static String TABLE_NAME = TableName.TENANT_INVENTORY_DETAIL;
	public static String []TABLE_COLUMNS = new String[]{

			"tenantId","billNo","assetId","status","pdPerson","pdDate","modify","image","pdaSN",
			"createPerson","createTime","updatePerson","updateTime"
	};
	public InventoryDtlEntity() {

		status = 0;
		qty = 1;
		assetEntity = new AssetEntity();
		hasFound = false;
	}

	public String tenantId;
	public String billNo;
	public String assetId;
	public int status;
	public String pdPerson;
	public String pdDate;
	public String modify;
	public String image;
	public String pdaSN;
	public String createPerson;
	public String createTime;
	public String updatePerson;
	public String updateTime;

	/**非数据库域*/
	public AssetEntity assetEntity;
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
		for (int i = 0; i < TABLE_COLUMNS.length; ++i){
			jsonObject.put(TABLE_COLUMNS[i], 1);
		}
		return jsonObject;
	}

	public String getDataPostJson(String billNo, String sn,
								  List<InventoryDtlEntity> list) throws JSONException {

		JSONObject jsonMain = new JSONObject();
		jsonMain.put("command",301);		//301是PDA
		jsonMain.put("sn", sn);
		jsonMain.put("operate", "batch");
//		jsonObject.put("tableName", "inventory_detail");

		JSONArray updateList = new JSONArray();
		JSONObject updateItem = null;
		JSONObject query = null;
		JSONObject dataContent = null;

		for (InventoryDtlEntity item : list) {

			if (item.status == 1) {
				updateItem = new JSONObject();
				query = new JSONObject();
				dataContent = new JSONObject();

				updateItem.put("operate","update");
				updateItem.put("tableName", AssetEntity.TABLE_NAME);

				query.put("billNo", billNo);
				query.put("assetId", item.assetId);

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

	public String getDataRequestJson(String billNo, String sn) throws JSONException {

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

		return ScanEnum.getName(status);
	}
}
