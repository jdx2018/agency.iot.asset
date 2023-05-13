package com.supdatas.asset.business.base;

import android.content.Context;
import android.util.Log;

import com.supdatas.asset.model.asset.AssetPlaceEntity;
import com.supdatas.asset.sqlite.busi.SqliteBusiDB;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * Author: 安仔夏天勤奋
 * Date: 2020/9/4
 * Desc:
 */
public class AssetPlace {

    private SqliteBusiDB mSqlite = null;

    public AssetPlace(Context cxt){
        if (mSqlite == null) {
            mSqlite = SqliteBusiDB.getInstance(cxt, true);
        }
    }

    public void parseAndProcData(final String content) throws Exception {

        JSONObject jsonObject = new JSONObject(content);
        int code = jsonObject.getInt("code");
        String message = jsonObject.getString("message");

        if (code == 1){
            JSONArray array = jsonObject.getJSONArray("data");
            Log.i("", array.toString());

            List<AssetPlaceEntity> list = new ArrayList<>();
            for (int i = 0; i < array.length(); ++i){

                JSONObject item = array.getJSONObject(i);

                AssetPlaceEntity a = new AssetPlaceEntity();
                a.tenantId = item.has("tenantId") ? item.getString("tenantId") : "";
                a.placeId = item.has("placeId") ? item.getString("placeId") : "";
                a.placeName = item.has("placeName") ? item.getString("placeName") : "";
                a.parentPlaceId = item.has("parentPlaceId") ? item.getString("parentPlaceId") : "";
                a.createPerson = item.has("createPerson") ? item.getString("createPerson") : "";
                a.createTime = item.has("createTime") ? item.getString("createTime") : "";
                a.updatePerson = item.has("updatePerson") ? item.getString("updatePerson") : "";
                a.updateTime = item.has("updateTime") ? item.getString("updateTime") : "";
                a.remarks = item.has("remarks") ? item.getString("remarks") : "";

                list.add(a);
            }
            insert(list);
        }
        else{
            throw new Exception(message);
        }
    }

    public void insert(List<AssetPlaceEntity> list){

        if (list.size() < 1)
            return;
        try{
            String sqlDel = "delete from "+AssetPlaceEntity.TABLE_NAME;
            String sql = "insert into "+AssetPlaceEntity.TABLE_NAME+"(tenantId,placeId,placeName,parentPlaceId," +
                    "createPerson,createTime,updatePerson,updateTime,remarks) " +
                    "values(?,?,?,?,?,?,?,?,?)";

            mSqlite.beginTrans();
            mSqlite.exeSqlStr(sqlDel);
            for (AssetPlaceEntity a : list){
                mSqlite.exeSqlStr(sql, new Object[]{a.tenantId,a.placeId,a.placeName,a.parentPlaceId
                        ,a.createPerson,a.createTime,a.updatePerson,a.updateTime,a.remarks});
            }
            mSqlite.setTransSuccessful();
        }
        catch (Exception ex){
            throw ex;
        }
        finally {
            mSqlite.endTrans();
        }
    }

}
