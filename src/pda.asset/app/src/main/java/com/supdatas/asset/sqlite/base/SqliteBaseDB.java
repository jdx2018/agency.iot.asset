package com.supdatas.asset.sqlite.base;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;

import com.supdatas.asset.configure.SysConstants;

/**
 * Created by zhaoxinglin on 2018/7/9
 */
public class SqliteBaseDB {
    public static Context context;

    private static int dbVersion = 1;
    private SQliteCusOpenHelper helper = null;
    private SQLiteDatabase dbToWrite = null;
    private SQLiteDatabase dbToRead = null;
    private SQLiteDatabase db = null;
    private Cursor cursor = null;

    private static SqliteBaseDB _instance = null;

    //
    public static SQLiteDatabase getDb(boolean isWritable) throws NullPointerException
    {
        if (_instance == null) {
            _instance = new SqliteBaseDB(context, isWritable, dbVersion);
        }
        if (isWritable)
            _instance.db = _instance.dbToWrite;
        else
            _instance.db = _instance.dbToRead;
        return _instance.db;
    }

    //获取实例
    public static SqliteBaseDB getInstance(Context cxt, boolean isWritable)
    {
        if (_instance == null) {
            _instance = new SqliteBaseDB(cxt, isWritable, dbVersion);
        }
        return _instance;
    }

    public static int getDbVersion(){
        return dbVersion;
    }
    public static void setDbVersion(int version){
        dbVersion = version;
    }

    private SqliteBaseDB(Context context1, boolean isWrite, int dbVersion) {

        DbSql.mDbBaseName = SysConstants.dbBaseName;
        context = context1;
        helper = SQliteCusOpenHelper.getInstance(context1, DbSql.mDbBaseName, dbVersion);
        if(dbToWrite == null || !dbToWrite.isOpen())
        {
            dbToWrite = helper.getWritableDatabase();
            db = dbToWrite;
        }
        if(dbToRead == null || !dbToRead.isOpen())
        {
            dbToRead = helper.getReadableDatabase();
            db = dbToRead;
        }
    }

    public void resetSQLiteOpenHelper() {

        helper = helper.resetInstance(context, DbSql.mDbBaseName, dbVersion);
    }

    public void closeSqlite() {
        closeDB();
        helper.closeOpenHelper();
    }

    public void closeDB() {
        if (dbToWrite != null) {
            dbToWrite.close();
            dbToWrite = null;
        }
        if (dbToRead != null){
            dbToRead.close();
            dbToRead = null;
        }
    }

    public String[] getColumns(String tableName){
        return helper.getColumnNames(db, tableName);
    }

	/*
	public static List<ParamEntity> loadPDColumnConfig() {
		List<ParamEntity> list = new ArrayList<ParamEntity>();
		String sqlCommand = "SELECT ParamId,ParamName,ParamValue,ParamDescription,IsValid from TPosParam where ParamId = 'PD' ";
		Cursor cursor = null;
		db.beginTransaction();
		try {
			cursor = db.rawQuery(sqlCommand, null);
			while (cursor.moveToNext()) {
				ParamEntity paramEntity = new ParamEntity();
				paramEntity.Paramid = cursor.getString(cursor
						.getColumnIndex("ParamId"));
				paramEntity.ParamName = cursor.getString(cursor
						.getColumnIndex("ParamName"));
				paramEntity.ParamValue = cursor.getString(cursor
						.getColumnIndex("ParamValue"));
				paramEntity.ParamDes = cursor.getString(cursor
						.getColumnIndex("ParamDescription"));
				paramEntity.Isvalid = Boolean.valueOf(cursor.getString(cursor
						.getColumnIndex("IsValid")));
				list.add(paramEntity);
			}
			db.setTransactionSuccessful();
		} catch (Exception e) {

		} finally {
			db.endTransaction();
			if (cursor != null)
				cursor.close();
		}
		return list;
	}
	*/

    public void beginTrans(){

        db.beginTransaction();
    }

    public void setTransSuccessful(){

        db.setTransactionSuccessful();
    }

    public void endTrans(){

        db.endTransaction();
    }

    public void exeSqlStr(String strSql, boolean withTrans) {
        if (withTrans){
            db.beginTransaction();
            try {
                db.execSQL(strSql);
                db.setTransactionSuccessful();
            } catch (Exception e) {
                e.printStackTrace();
                throw e;
            } finally {
                db.endTransaction();
            }
        }
        else
        {
            try {
                db.execSQL(strSql);
            }
            catch (Exception e) {
                e.printStackTrace();
                throw e;
            }
            finally {
            }
        }
    }

    /*执行Sql语句
    * @strSql
    * @values
    * @withTrans
     */
    public void exeSqlStr(String strSql, Object[] values, boolean withTrans) {
        if (withTrans){
            db.beginTransaction();
            try {
                db.execSQL(strSql, values);
                db.setTransactionSuccessful();
            } catch (Exception e) {
                e.printStackTrace();
                throw e;
            } finally {
                db.endTransaction();
            }
        }
        else {
            try {
                db.execSQL(strSql, values);
            } catch (Exception e) {
                e.printStackTrace();
                throw e;
            } finally {
            }
        }
    }

    public Cursor exeRawQuery(String strSql, String[] selectionArgs) {
        Cursor cursor = null;
        try {
            cursor = db.rawQuery(strSql, selectionArgs);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
        }
        return cursor;
    }

    public int getDBVersion(){
        return db.getVersion();
    }
}
