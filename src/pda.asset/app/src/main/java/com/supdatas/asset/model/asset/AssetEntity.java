package com.supdatas.asset.model.asset;

import com.supdatas.asset.sqlite.TableName;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.Serializable;

/**
 * Author: 安仔夏天勤奋
 * Date: 2020/9/4
 * Desc:
 */
public class AssetEntity implements Serializable {

    public static String TABLE_NAME = TableName.TENANT_ASSET;
    public static String[] TABLE_COLUMNS = new String[]{
            "tenantId", "assetId", "barcode", "epc", "assetName", "classId", "manager", "brand",
            "model", "ownOrgId", "useOrgId", "status", "usePerson", "useDate", "useStatus",
            "placeId", "serviceLife", "amount", "purchaseDate", "purchaseType", "orderNo",
            "unit", "image", "supplier", "linkPerson", "telNo", "expired", "mContent",
            "createPerson", "createTime", "updatePerson", "updateTime", "remarks"
    };

    public AssetEntity(){
        hasFound = false;
    }

    public String tenantId;
    public String assetId;
    public String barcode;
    public String epc;
    public String assetName;
    public String classId;
    public String manager;
    public String brand;
    public String model;
    public String ownOrgId;
    public String useOrgId;
    public int status;
    public String usePerson;
    public String useDate;
    public int useStatus;
    public String placeId;
    public int serviceLife;
    public String amount;
    public String purchaseDate;
    public String purchaseType;
    public String orderNo;
    public String unit;
    public String image;
    public String supplier;
    public String linkPerson;
    public String telNo;
    public String expired;
    public String mContent;
    public String createPerson;
    public String  createTime;
    public String  updatePerson;
    public String  updateTime;
    public String remarks;

    /**非数据库属性*/
    public String placeName;
    public int cnt;
    public String rssi;
    public boolean hasFound;

    public String getDataRequestJson(String sn) throws JSONException {

        JSONObject jsonObject = new JSONObject();
        jsonObject.put("command", 301);        //301是PDA
        jsonObject.put("sn", sn);
        jsonObject.put("operate", "query");
        jsonObject.put("tableName", TABLE_NAME);

        return jsonObject.toString();
    }

    public static Object getQuery(String tenantId) throws Exception {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("tenantId", tenantId);
        return jsonObject;
    }

    public static Object getQuery(String tenantId, String assetId) throws Exception {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("tenantId", tenantId);
        jsonObject.put("assetId", assetId);
        return jsonObject;
    }

    public static Object getStatusField() throws Exception {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("status", 1);
        return jsonObject;
    }

    public static Object getFields() throws Exception {
        JSONObject jsonObject = new JSONObject();
        for (int i = 0; i < TABLE_COLUMNS.length; ++i) {
            jsonObject.put(TABLE_COLUMNS[i], 1);
        }
        return jsonObject;
    }


}
