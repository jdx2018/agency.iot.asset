package com.supdatas.asset.business.base;

import android.content.Context;
import android.database.Cursor;
import android.util.Log;

import com.supdatas.asset.frame.utility.TextUtil;
import com.supdatas.asset.model.asset.AssetEntity;
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
public class Asset {

    private SqliteBusiDB mSqlite = null;
    public Asset(Context cxt){
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

            List<AssetEntity> list = new ArrayList<>();
            for (int i = 0; i < array.length(); ++i){

                JSONObject item = array.getJSONObject(i);
                
                AssetEntity a = new AssetEntity();
                a.tenantId= item.has("tenantId") ? item.getString("tenantId") : "";
                a.assetId= item.has("assetId") ? item.getString("assetId") : "";
                a.barcode= item.has("barcode") ? item.getString("barcode") : "";
                a.epc= item.has("epc") ? item.getString("epc") : "";
                a.assetName= item.has("assetName") ? item.getString("assetName") : "";

                a.classId= item.has("classId") ? item.getString("classId") : "";
                a.manager= item.has("manager") ? item.getString("manager") : "";
                a.brand= item.has("brand") ? item.getString("brand") : "";
                a.model= item.has("model") ? item.getString("model") : "";
                a.ownOrgId= item.has("ownOrgId") ? item.getString("ownOrgId") : "";

                a.useOrgId= item.has("useOrgId") ? item.getString("useOrgId") : "";
                a.status= item.has("status") ? item.getInt("status") : 0;
                a.usePerson= item.has("usePerson") ? item.getString("usePerson") : "";
                a.usePerson= item.has("usePerson") ? item.getString("usePerson") : "";
                a.useDate= item.has("useDate") ? item.getString("useDate") : "";

                a.useStatus= item.has("useStatus") ? item.getInt("useStatus") : 0;
                a.placeId= item.has("placeId") ? item.getString("placeId") : "";
                a.serviceLife= item.has("serviceLife") ? item.getInt("serviceLife") : 0;
                a.amount= item.has("amount") ? item.getString("amount") : "";
                a.purchaseDate= item.has("purchaseDate") ? item.getString("purchaseDate") : "";

                a.purchaseType= item.has("purchaseType") ? item.getString("purchaseType") : "";
                a.orderNo= item.has("orderNo") ? item.getString("orderNo") : "";
                a.unit= item.has("unit") ? item.getString("unit") : "";
                a.image= item.has("image") ? item.getString("image") : "";
                a.supplier= item.has("supplier") ? item.getString("supplier") : "";

                a.linkPerson= item.has("linkPerson") ? item.getString("linkPerson") : "";
                a.telNo= item.has("telNo") ? item.getString("telNo") : "";
                a.expired= item.has("expired") ? item.getString("expired") : "";
                a.mContent= item.has("mContent") ? item.getString("mContent") : "";
                a.createPerson= item.has("createPerson") ? item.getString("createPerson") : "";

                a.createTime= item.has("createTime") ? item.getString("createTime") : "";
                a.updatePerson= item.has("updatePerson") ? item.getString("updatePerson") : "";
                a.updateTime= item.has("updateTime") ? item.getString("updateTime") : "";
                a.remarks= item.has("remarks") ? item.getString("remarks") : "";

                list.add(a);
            }
            insert(list);
        }
        else{
            throw new Exception(message);
        }
    }

    public void insert(List<AssetEntity> list){

        if (list.size() < 1)
            return;
        try{
            String sqlDel = "delete from "+AssetEntity.TABLE_NAME;
            String sql = "insert into "+AssetEntity.TABLE_NAME+"(tenantId,assetId,barcode,epc,assetName,classId,manager,brand,model,ownOrgId,useOrgId,status,usePerson,useDate,useStatus,placeId," +
                    "serviceLife,amount,purchaseDate,purchaseType,orderNo,unit,image,supplier,linkPerson,telNo,expired,mContent,createPerson, createTime, updatePerson, updateTime,remarks) " +
                    "values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

            mSqlite.beginTrans();
            mSqlite.exeSqlStr(sqlDel);
            for (AssetEntity a : list){

                mSqlite.exeSqlStr(sql, new Object[]{
                        a.tenantId,a.assetId,a.barcode,a.epc,a.assetName,a.classId,a.manager,a.brand,a.model,a.ownOrgId,a.useOrgId,a.status,a.usePerson,a.useDate,a.useStatus,a.placeId
                        ,a.serviceLife,a.amount,a.purchaseDate,a.purchaseType,a.orderNo,a.unit,a.image,a.supplier,a.linkPerson,a.telNo,a.expired,a.mContent,a.createPerson,a. createTime,a. updatePerson,a. updateTime,a.remarks
                });
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

    public static String getAssetStatus(int status){
        String statusValue;
        if(status == 0){
            statusValue = "空闲";
        }else if(status == 1){
            statusValue = "领用";
        }
        else if(status == 2){
            statusValue = "借用";
        }
        else if(status == 10){
            statusValue = "处置待确认";
        }
        else if(status == 11){
            statusValue = "处置完成";
        }else{
            statusValue = "未知";
        }
        return statusValue;
    }

    public static String getUseStatus(int status){
        String statusValue;
        if(status == 0){
            statusValue = "正常";
        }else if(status == 1){
            statusValue = "故障";
        }
        else if(status == 2){
            statusValue = "维修中";
        }else{
            statusValue = "未知";
        }
        return statusValue;
    }

    public List<AssetEntity> getSpeAssetItems(String condition, boolean full) throws Exception {

        StringBuilder sql = new StringBuilder();
        String select  = String.format("select tenantId,assetId,barcode,epc,assetName,classId,manager,brand,model,ownOrgId,useOrgId,status,usePerson,useDate,useStatus,placeId," +
                        "serviceLife,amount,purchaseDate,purchaseType,orderNo,unit,image,supplier,linkPerson,telNo,expired,mContent,createPerson, createTime, updatePerson, updateTime,remarks" +
                        " from %s ", AssetEntity.TABLE_NAME);
        sql.append(select);
        if (full && !TextUtil.isNullOrEmpty(condition)){
            sql.append(String.format("where assetId ='%s'", condition));
        }
        else  if (!TextUtil.isNullOrEmpty(condition)){
            sql.append(String.format("where assetId like '%%%s%%'",condition));
        }

        Cursor cursor = null;
        List<AssetEntity> list = new ArrayList<>();
        try {

            cursor = mSqlite.exeRawQuery(sql.toString(), new Object[0]);
            if (cursor == null || cursor.getCount() < 1){
                if (cursor != null) {
                    cursor.close();
                }

                sql.delete(0, sql.length());
                sql.append(select);
                if (full && !TextUtil.isNullOrEmpty(condition)){
                    sql.append(String.format("where barcode ='%s'", condition));
                }
                else  if (!TextUtil.isNullOrEmpty(condition)){
                    sql.append(String.format("where barcode like '%%%s%%'",condition));
                }
                cursor = mSqlite.exeRawQuery(sql.toString(), new Object[0]);
            }
            while (cursor!=null && cursor.moveToNext()){

                //tenantId,assetId,barcode,epc,assetName,classId,manager,brand,model,ownOrgId,useOrgId,status,usePerson,useDate,useStatus,placeId,
                //serviceLife,amount,purchaseDate,purchaseType,orderNo,unit,
                AssetEntity item  = new AssetEntity();
                item.tenantId = cursor.getString(0);
                item.assetId = cursor.getString(1);
                item.barcode = cursor.getString(2);
                item.epc = cursor.getString(3);
                item.assetName = cursor.getString(4);
                item.classId = cursor.getString(5);
                item.manager = cursor.getString(6);
                item.brand = cursor.getString(7);
                item.model = cursor.getString(8);
                item.ownOrgId = cursor.getString(9);

                item.useOrgId = cursor.getString(10);
                item.status = cursor.getInt(11);
                item.usePerson = cursor.getString(12);
                item.useDate = cursor.getString(13);
                item.useStatus = cursor.getInt(14);
                item.placeId = cursor.getString(15);
                item.serviceLife = cursor.getInt(16);
                item.amount = cursor.getString(17);
                item.purchaseDate = cursor.getString(18);
                item.purchaseType = cursor.getString(19);
                item.orderNo = cursor.getString(20);

                item.unit = cursor.getString(21);
                //image,supplier,linkPerson,telNo,expired,mContent,createPerson, createTime, updatePerson, updateTime,remarks
                item.image = cursor.getString(22);
                item.supplier = cursor.getString(23);
                item.linkPerson = cursor.getString(24);
                item.telNo = cursor.getString(25);

                item.expired = cursor.getString(26);
                item.mContent = cursor.getString(27);
                item.createPerson = cursor.getString(28);
                item.createTime = cursor.getString(29);
                item.updatePerson = cursor.getString(30);
                item.updateTime = cursor.getString(31);
                item.remarks = cursor.getString(32);

                if (!TextUtil.isNullOrEmpty(item.purchaseDate) && item.purchaseDate.length() > 10){
                    item.purchaseDate = item.purchaseDate.substring(0, item.purchaseDate.length() - 10);
                }

                list.add(item);
            }
        }
        catch (Exception ex){
            throw ex;
        }
        finally {
            if (cursor != null)
                cursor.close();
        }
        return list;
    }
}
