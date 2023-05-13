package com.supdatas.asset.sqlite.base;

import android.database.sqlite.SQLiteDatabase;
import android.util.Log;

/**
 * Created by zhaoxinglin on 2019/6/19.
 */
class DbSql {

    private SQLiteDatabase mSqlite = null;

    public static String mDbBaseName = "base.db";

    public DbSql(SQLiteDatabase db){
        mSqlite = db;
    }

    private final String CREATE_TABLE_TMP_RFID =
            "create table if not exists rfidTmp (idno integer primary key not null, billNO varchar(32), rfid varchar(128),cnt int,rssi varchar(32),qty integer default(0),writeTime varchar(32),scanMode integer default(0),flag int default(0))";
    private final String CREATE_TABLE_SCANED_RFID =
            "create table if not exists rfidData (idno integer primary key not null, billNO varchar(32), rfid varchar(128),cnt int,rssi varchar(32),qty integer default(0),writeTime varchar(32),scanMode integer default(0),flag int default(0))";
    private final String CREATE_TABLE_GDINFO =
            "create table if not exists GdInfo(idno integer primary key not null,gdBarcode varchar(32), gdCode " +
                    "varchar(32)," +
                    "gdName varchar(128), gdColorName varchar(32), gdSizeName varchar(32), gDPrice varchar(32))";

    private final String CREATE_INDEX_1 = "CREATE INDEX if not exists [index01] ON [rfidTmp] ([rfid])";
    private final String CREATE_INDEX_2 = "CREATE INDEX if not exists [index02] ON [rfidData] ([billNO])";
    private final String CREATE_INDEX_3 = "CREATE INDEX if not exists [index03] ON [rfidData] ([rfid])";
    private final String CREATE_INDEX_GDINFO1 = "CREATE INDEX if not exists [index04] ON [GdInfo] ([GdBarcode])";
    private final String CREATE_INDEX_GDINFO2 = "CREATE INDEX if not exists [index05] ON [GdInfo] ([gdCode])";

    public void CreateDB() {

        /*mSqlite.beginTransaction();

        mSqlite.execSQL(CREATE_TABLE_TMP_RFID);
        mSqlite.execSQL(CREATE_TABLE_SCANED_RFID);
        mSqlite.execSQL(CREATE_INDEX_1);
        mSqlite.execSQL(CREATE_INDEX_2);
        mSqlite.execSQL(CREATE_INDEX_3);

        mSqlite.setTransactionSuccessful();
        mSqlite.endTransaction();*/
    }

    public void UpgradeDB(int oldVersion, int newVersion) {

        switch (oldVersion + 1) {
            case 1:
                Log.w("sqlite", "upgrade 1, version 1");
                //db.execSQL();
                //db.execSQL(CREATE_TABLE);
            case 2:
                Log.w("sqlite", "upgrade 2, version 2");
                //mSqlite.execSQL(alter_table_TempTable);
            case 3:
                Log.w("sqlite", "upgrade 3, version 3");
                ;
            case 4:
                Log.w("sqlite", "upgrade 4, version 4");
                ;
            default:
                break;
        }
    }
}
