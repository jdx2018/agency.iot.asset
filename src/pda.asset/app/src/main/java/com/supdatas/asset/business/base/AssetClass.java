package com.supdatas.asset.business.base;

import android.content.Context;
import android.util.Log;

import com.supdatas.asset.model.asset.AssetClassEntity;
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
public class AssetClass {

    private SqliteBusiDB mSqlite = null;

    public AssetClass(Context cxt){
        if (mSqlite == null) {
            mSqlite = SqliteBusiDB.getInstance(cxt, true);
        }
    }

    public void parseAndProcData(final String content) throws Exception {
        JSONObject jsonObject = new JSONObject(content);
        int code = jsonObject.getInt("code");
        String message = jsonObject.getString("message");
        if (code == 1) {
            JSONArray array = jsonObject.getJSONArray("data");
            Log.i("", array.toString());

            List<AssetClassEntity> list = new ArrayList<>();
            for (int i = 0; i < array.length(); ++i){

                JSONObject item = array.getJSONObject(i);

                AssetClassEntity a = new AssetClassEntity();
                a.tenantId = item.has("tenantId") ? item.getString("tenantId") : "";
                a.classId = item.has("classId") ? item.getString("classId") : "";
                a.className = item.has("className") ? item.getString("className") : "";
                a.parentClassId = item.has("parentClassId") ? item.getString("parentClassId") : "";
                a.extendJson = item.has("extendJson") ? item.getString("extendJson") : "";
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

    public void insert(List<AssetClassEntity> list){

        if (list.size() < 1)
            return;
        try{
            String sqlDel = "delete from "+AssetClassEntity.TABLE_NAME;
            String sql = "insert into "+AssetClassEntity.TABLE_NAME+"(tenantId,classId,className,parentClassId," +
                    "extendJson,createPerson,createTime,updatePerson,updateTime,remarks)" +
                    " values(?,?,?,?,?,?,?,?,?,?)";

            mSqlite.beginTrans();
            mSqlite.exeSqlStr(sqlDel);
            for (AssetClassEntity a : list){
                mSqlite.exeSqlStr(sql, new Object[]{
                        a.tenantId,a.classId,a.className,a.parentClassId,a.extendJson
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
