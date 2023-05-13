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
public class AssetClassEntity implements Serializable {

    public static String TABLE_NAME = TableName.TENANT_ASSET_CLASS;
    public static String[] TABLE_COLUMNS = new String[]{
            "tenantId", "classId", "className", "parentClassId", "extendJson",
            "createPerson", "createTime", "updatePerson", "updateTime", "remarks"
    };

    public String tenantId;
    public String classId;
    public String className;
    public String parentClassId;
    public String extendJson;
    public String createPerson;
    public String createTime;
    public String updatePerson;
    public String updateTime;
    public String remarks;

    public static Object getQuery(String tenantId) throws Exception {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("tenantId", tenantId);
        return jsonObject;
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
        jsonObject.put("command", 301);        //301是PDA
        jsonObject.put("sn", sn);
        jsonObject.put("operate", "query");
        jsonObject.put("tableName", TABLE_NAME);

        return jsonObject.toString();
    }

}
