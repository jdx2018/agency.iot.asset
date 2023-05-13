package com.supdatas.asset.business;

import android.content.Context;
import android.database.Cursor;

import com.supdatas.asset.sqlite.busi.SqliteBusiDB;

/**
 * Created by administrator on 2020/06/11
 */
public class BillNOBusi {

    private SqliteBusiDB sqlite = null;
    private static BillNOBusi _instance = null;

    private final String DATE_FORMAT = "yyyyMMdd";
    public static BillNOBusi getInstance(Context cxt){

        if (_instance == null)
            _instance = new BillNOBusi(cxt);
        return _instance;
    }

    private BillNOBusi(Context cxt){
        if (sqlite == null)
            sqlite = SqliteBusiDB.getInstance(cxt, true);
    }

    public String getNewBillNO(){

        java.util.Date now_date = new java.util.Date();
        String curDate = new java.text.SimpleDateFormat("yyyyMMddHHmmss").format(now_date);  //.SSS
        return curDate;
    }

    public String getNewBillNO(final String prefix, String tableName, int glideLength, boolean withIncre){

        java.util.Date now_date = new java.util.Date();
        String curDate = new java.text.SimpleDateFormat(DATE_FORMAT).format(now_date);  //.SSS

        String sql = "select glide from billGlideNO where tableName=? and glideDate=?";
        Cursor cursor = null;

        try {
            cursor = sqlite.exeRawQuery(sql, new String[]{ tableName,curDate });
            if (cursor.moveToFirst()) {

                int iGlide = cursor.getInt(0);
                iGlide = iGlide + 1;
                if (withIncre) {
                    sql = "update billGlideNO set glide=? where tableName=? and glideDate=?";
                    sqlite.exeSqlStr(sql, new String[]{String.valueOf(iGlide), tableName, curDate}, false);
                }
                String format = String.format("%%s%%s%%0%dd", glideLength);
                return String.format(format, prefix, curDate, iGlide);
            }
            else{

                int iGlide = 1;
                if (withIncre) {
                    sql = "insert into billGlideNO(tableName, glideDate, glide) values(?,?,?)";
                    sqlite.exeSqlStr(sql, new String[]{tableName, curDate, String.valueOf(iGlide)}, false);
                }
                String format = String.format("%%s%%s%%0%dd", glideLength);
                return String.format(format, prefix, curDate, iGlide);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (cursor != null)
                cursor.close();
        }
        return "";
    }

    public void increBillGlideID(String tableName){

        java.util.Date now_date = new java.util.Date();
        String curDate = new java.text.SimpleDateFormat(DATE_FORMAT).format(now_date);  //.SSS
        String sql = "select glide from billGlideNO where tableName=? and glideDate=?";
        Cursor cursor = null;
        try {
            cursor = sqlite.exeRawQuery(sql, new String[]{ tableName,curDate });
            if (cursor.moveToFirst()) {

                int iGlide = cursor.getInt(0);
                iGlide = iGlide + 1;
                sql = "update billGlideNO set glide=? where tableName=? and glideDate=?";
                sqlite.exeSqlStr(sql, new String[] { String.valueOf(iGlide), tableName,curDate }, false);
            }
            else{
                int iGlide = 1;
                sql = "insert into billGlideNO(tableName, glideDate, glide) values(?,?,?)";
                sqlite.exeSqlStr(sql, new String[] { tableName,curDate, String.valueOf(iGlide) }, false);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (cursor != null)
                cursor.close();
        }
        return ;
    }
}
