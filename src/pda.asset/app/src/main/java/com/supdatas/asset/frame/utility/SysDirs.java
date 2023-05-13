package com.supdatas.asset.frame.utility;

import android.content.Context;
import android.os.Environment;
import android.os.StatFs;
import android.util.Log;

import com.supdatas.asset.configure.SysConstants;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

/**
 * Created by Administrator on 2017/7/10.
 */
public class SysDirs
{
    private SysDirs()   {    }
    private static SysDirs sysDir = null;
    private static String [] arrConfigFiles;
    public static SysDirs instance() {
        if (sysDir == null)
        {
            sysDir = new SysDirs();
        }
        return sysDir;
    }

    public boolean isSdCardAvailable() {
        if (Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED))
            return true;
        else
            return false;
    }

    public String getSdCardPath() {
        if (isSdCardAvailable())
            return Environment.getExternalStorageDirectory().getAbsolutePath();
        else
            return "";
    }

    public String getAppDir() {
        return String.format("%s%s%s", getSdCardPath(), File.separator, SysConstants.AppDirName);
    }

    public String getDatabaseDir() {
        return String.format("%s%s%s%s%s%s",
                getSdCardPath(), File.separator, SysConstants.AppDirName,
                File.separator,SysConstants.dBDirName,File.separator);
    }

    public String getCrashDir() {
        return String.format("%s%s%s", getSdCardPath(), File.separator, SysConstants.crashDirName);
    }

    public String getBaseDatabaseFilePath() {
        return String.format("%s%s%s", getDatabaseDir(), File.separator, SysConstants.dbBaseName);
    }

    public String getBusiDatabaseFilePath() {
        return String.format("%s%s%s", getDatabaseDir(), File.separator, SysConstants.dbBusiName);
    }

    public String getConfigClientSKPathFile() {
        return String.format("%s%s%s%s%s%s%s",
                getSdCardPath(), File.separator, SysConstants.AppDirName,
                File.separator,SysConstants.configDirName,
                File.separator, SysConstants.clientSKCfg);
    }

    public String getConfigDir() {
        return String.format("%s%s%s%s%s",
                getSdCardPath(), File.separator, SysConstants.AppDirName,
                File.separator,SysConstants.configDirName);
    }

    public String getLogDir() {
        return String.format("%s%s%s%s%s",
                getSdCardPath(), File.separator, SysConstants.AppDirName,
                File.separator,SysConstants.logDirName);
    }

    public String getDownloadDir() {
        return String.format("%s%s%s%s%s",
                getSdCardPath(), File.separator, SysConstants.AppDirName,
                File.separator, SysConstants.downloadDir);
    }

    public boolean isAvaiableSpace(int sizeMb) {

        boolean ishasSpace = false;
        if (Environment.getExternalStorageState().equals(
                Environment.MEDIA_MOUNTED)) {
            String sdcard = Environment.getExternalStorageDirectory().getPath();
            StatFs statFs = new StatFs(sdcard);
            long blockSize = statFs.getBlockSizeLong();
            long blocks = statFs.getAvailableBlocksLong();
            long availableSpare = (blocks * blockSize) / (1024 * 1024);
            if (availableSpare > sizeMb) {
                ishasSpace = true;
            }
        }
        return ishasSpace;
    }

    public boolean CopyAssets(Context context, String assetDir, String dirDest, String fileName) {

        File mWorkingPath = new File(dirDest);
        // if this directory does not exists, make one.
        if (!mWorkingPath.exists()) {
            if (!mWorkingPath.mkdirs()) {
                Log.e("--CopyAssets--", "cannot create directory.");
                return false;
            }
        }

        try {
            File outFile = new File(mWorkingPath, fileName);
            if (outFile.exists())
                return true;
            InputStream in = null;
            if (0 != assetDir.length())
                in = context.getAssets().open(assetDir + "/" + fileName);
            else
                in = context.getAssets().open(fileName);
            OutputStream out = new FileOutputStream(outFile);
            // Transfer bytes from in to out
            byte[] buf = new byte[1024];
            int len;
            while ((len = in.read(buf)) > 0) {
                out.write(buf, 0, len);
            }
            in.close();
            out.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            return false;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }
}
