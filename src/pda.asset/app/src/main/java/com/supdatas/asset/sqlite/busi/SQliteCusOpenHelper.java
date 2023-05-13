package com.supdatas.asset.sqlite.busi;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;

/**
 * Created by Administrator on 2017/7/9
 * 1.如果数据库文件不存在，SQLiteOpenHelper在自动创建数据库后会调用onCreate()方法，在该方法中一般需要创建表、视图等组件。
 *  在创建前数据库一般是空的，因此不需要先删除数据库中相关的组件。
 * 2.如果数据库文件存在，并且当前版本号高于上次创建或升级的版本号，SQLiteOpenHelper会调用onUpgrade()方法，调用该方法后会更新数据库的版本号。
 *  在onUpgrade()方法中除了创建表、视图等组件外，还需要先删除这些相关的组件，因此，在调用onUpgrade()方法前，数据库是存在的，里面还原许多数据库组建。

   如果数据库文件不存在，只有onCreate()被调用（该方法在创建数据库时被调用一次）。如果数据库文件存在，会调用onUpgrade()方法升级数据库，并更新版本号。
   更新数据版本号后，Sqlite本身会更新其版本号，再以该版本号来调用初始化Sqlite数据库连接时，即不会再以该版本来执行升级了
 * */

class SQliteCusOpenHelper extends SQLiteOpenHelper {
    public static int dbVersion = 1;
    private static SQliteCusOpenHelper mInstance = null;

    /*public synchronized static SQliteCusOpenHelper getInstance(Context context1, String dbName) {
        if (mInstance == null) {
            DatabaseContext dbContext = new DatabaseContext(context1);
            *//*version表示数据库的版本号。如果当前传入的数据库版本号比上次创建或升级的版本号高，SQLiteOpenHelper就会调用onUpdate()方法*//*
            mInstance = new SQliteCusOpenHelper(dbContext, dbName, dbVersion);
        }
        return mInstance;
    };*/

    //不能这样用，07.10
    public synchronized static SQliteCusOpenHelper getInstance(Context context1, String dbName, int version) {
        if (mInstance == null) {
            DatabaseContext dbContext = new DatabaseContext(context1);
            /*version表示数据库的版本号。如果当前传入的数据库版本号比上次创建或升级的版本号高，SQLiteOpenHelper就会调用onUpdate()方法*/
            if (version == -1)
                version = dbVersion;
            mInstance = new SQliteCusOpenHelper(dbContext, dbName, version);
        }
        return mInstance;
    };

    public SQliteCusOpenHelper resetInstance(Context context, String dbName, int version) {
        DatabaseContext dbContext = new DatabaseContext(context);
        mInstance = new SQliteCusOpenHelper(dbContext, dbName, version);
        return mInstance;
    }

    public void closeOpenHelper() {
        if (mInstance != null) {
            mInstance.close();
            mInstance = null;
        }
    }

    /*public SQliteCusOpenHelper(Context context, String dbName) {
        this(context, dbName, dbVersion);
        // TODO Auto-generated constructor stub
    }*/

    public SQliteCusOpenHelper(Context context, String name, int version) {
        this(context, name, null, version);
        // TODO Auto-generated constructor stub
    }

    public SQliteCusOpenHelper(Context context, String name, SQLiteDatabase.CursorFactory factory, int version) {
        super(context, name, factory, version);
        // TODO Auto-generated constructor stub
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        // TODO Auto-generated method stub
        DbSql dbSql = new DbSql(db);
        dbSql.CreateDB();
        Log.w("sqlite", "sqlite db was created!");
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        // TODO Auto-generated method stub
        Log.w("sqlite", "sqlite db upgrade just executed!");
        DbSql dbSql = new DbSql(db);
        dbSql.UpgradeDB(oldVersion, newVersion);
    }

    protected String[] getColumnNames(SQLiteDatabase db, String tableName) {
        String[] columnNames = null;
        Cursor c = null;
        try {
            c = db.rawQuery("PRAGMA table_info(" + tableName + ")", null);
            if (null != c) {
                int columnIndex = c.getColumnIndex("name");
                if (-1 == columnIndex) {
                    return null;
                }
                int index = 0;
                columnNames = new String[c.getCount()];
                for (c.moveToFirst(); !c.isAfterLast(); c.moveToNext()) {
                    columnNames[index] = c.getString(columnIndex);
                    index++;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (c != null) {
                c.close();
                c = null;
            }
        }
        return columnNames;
    }
}
