    package com.supdatas.asset.sqlite.busi;

    import android.content.Context;
    import android.content.ContextWrapper;
    import android.database.DatabaseErrorHandler;
    import android.database.sqlite.SQLiteDatabase;
    import android.database.sqlite.SQLiteDatabase.CursorFactory;
    import android.util.Log;

    import com.supdatas.asset.frame.utility.SysDirs;

    import java.io.File;
    import java.io.IOException;

    /**
     * 用于支持对存储在SD卡上的数据库的访问
     **/
    class DatabaseContext extends ContextWrapper {

        /**
         * 构造函数
         * @param    base 上下文环境
         */
        public DatabaseContext(Context base){
            super(base);
        }

        /**
         * 获得数据库路径，如果不存在，则创建对象对象
         */
        @Override
        public File getDatabasePath(String name) {
            //判断是否存在sd卡
            boolean sdExist = SysDirs.instance().isSdCardAvailable();
            if(!sdExist){//如果不存在,
                Log.e("SD卡管理：", "SD卡不存在，请加载SD卡");
                return null;
            }
            else{
                //获取sd卡路径
                String dbDir= SysDirs.instance().getDatabaseDir();
                File dirFile = new File(dbDir);
                if(!dirFile.exists())
                    dirFile.mkdirs();

                //数据库文件是否创建成功
                boolean isFileCreateSuccess = false;
                String dbPath = SysDirs.instance().getBusiDatabaseFilePath();
                //判断文件是否存在，不存在则创建该文件
                File dbFile = new File(dbPath);
                if(!dbFile.exists()){
                    try {
                        isFileCreateSuccess = dbFile.createNewFile();//创建文件
                    } catch (IOException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                }
                else
                    isFileCreateSuccess = true;
                if(isFileCreateSuccess)
                    return dbFile;
                else
                    return null;
            }
        }

        /**
         * 重载这个方法，是用来打开SD卡上的数据库的，android 2.3及以下会调用这个方法。
         */
        @Override
        public SQLiteDatabase openOrCreateDatabase(String name, int mode, CursorFactory factory) {
            try
            {
                SQLiteDatabase result = SQLiteDatabase.openOrCreateDatabase(getDatabasePath(name), null);
                return result;
            }
            catch (Exception e)
            {
                e.printStackTrace();
            }
            return null;
        }

        /**
         * Android 4.0会调用此方法获取数据库。
         *
         * @see ContextWrapper#openOrCreateDatabase(String, int,
         *              CursorFactory,
         *              DatabaseErrorHandler)
         * @param    name p1
         * @param    mode p2
         * @param    factory p3
         * @param     errorHandler p4
         */
        @Override
        public SQLiteDatabase openOrCreateDatabase(String name, int mode, CursorFactory factory, DatabaseErrorHandler errorHandler)  {
            try
            {
                SQLiteDatabase result = SQLiteDatabase.openOrCreateDatabase(getDatabasePath(name), null);
                return result;
            }
            catch (Exception e)
            {
                e.printStackTrace();
            }
            return null;
        }
    }