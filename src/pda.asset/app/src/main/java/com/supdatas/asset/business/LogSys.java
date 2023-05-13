package com.supdatas.asset.business;

/**
 * Created by Administrator on 2019/6/27.
 */
import com.supdatas.asset.frame.utility.SysDirs;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.nio.charset.Charset;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class LogSys {

    /**写系统日志*/
    public static void writeSysLog(String tag, String msg) {
        writeSysLog(tag, msg, null,1);
    }

    public static void writeSysLog(String tag, Exception msg) {
        writeSysLog(tag, msg == null ? "" : msg.toString(), null, 1);
    }

    public static void writeSysLog(String tag, String msg, int iType) {
        writeSysLog(tag, msg, null, iType);
    }

    public static void writeSysLog(String tag, String msg, Object obj) {
        writeSysLog(tag, msg, obj, 1);
    }

    public static void writeSysLog(String tag, Object obj, int iType) {
        writeSysLog(tag, obj, iType);
    }

    //写系统日志，2019.6.28
    //iType为1表示默认系统出错或异常日志，为2表示系统数据日志
    public static void writeSysLog(String tag, String msg, Object obj, int iType) {
        Date nowDate = new Date();
        String logName = new SimpleDateFormat("yyyy-MM-dd").format(nowDate);
        String logDir = String.format("%s/Log", SysDirs.instance().getAppDir());

        File fileDir = new File(logDir);
        if (!fileDir.exists())
            fileDir.mkdirs();
        String filePath = String.format("%s/%s.txt", logDir, logName);
        if (iType == 2)
            filePath = String.format("%s/%s_数据.txt", logDir, logName);
        try {
            if (tag == null && msg == null)
                return;
            if (tag == null)
                tag = "";
            if (msg == null)
                msg = "";
            String encoding = "utf-8";	//gbk
            File file = new File(filePath);
            BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(file, true), Charset.forName(encoding)));
            if (obj == null)
                writer.write(String.format("Tag:\t%s\tmsg:\t%s\r\n", tag, msg));
            else
                writer.write(String.format("Tag:\t%s\tmsg:\t%s\r\n\t\tObj:\t%s\r\n", tag, msg, obj));
            writer.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 清理day天之前的日志文件
     * */
    public static void clearLogFile(final String dir, int day) {

        Date nowtime = new Date();
        Calendar now = Calendar.getInstance();
        now.setTime(nowtime);
        now.set(Calendar.DATE, now.get(Calendar.DATE) - day);

        String needDelFiel = new SimpleDateFormat("yyyy-MM-dd").format(now.getTime());
        File cacheDir = new File(dir);
        if (!cacheDir.exists()) {
            return;
        }
        // 防止listFiles()导致ANR
        File[] files = cacheDir.listFiles();
        for (int i = 0; i < files.length; i++) {

            if (files[i].getName() != null && files[i].getName().length() >= 10){
                String fileDate = files[i].getName().substring(0, 10);
                if (fileDate.compareTo(needDelFiel) < 0)
                    files[i].delete();
            }
        }
    }

    public static void clearExportFile(final String dir, int day) {

        Date nowtime = new Date();
        Calendar now = Calendar.getInstance();
        now.setTime(nowtime);
        now.set(Calendar.DATE, now.get(Calendar.DATE) - day);

        String needDelFiel = new SimpleDateFormat("yyyyMMdd").format(now.getTime());
        File cacheDir = new File(dir);
        if (!cacheDir.exists()) {
            return;
        }

        File[] files = cacheDir.listFiles();
        String fileName;
        String tmp;
        for (int i = 0; i < files.length; i++) {

            fileName = files[i].getName();
            if (files[i].getName() != null && fileName.length() >= 8){

                int iIndex = fileName.lastIndexOf('_');
                if (iIndex != -1) {

                    tmp = fileName.substring(iIndex + 1, fileName.length());
                    if (tmp != null && tmp.length() >= 8) {
                        String fileDate = fileName.substring(iIndex + 1, iIndex + 1 + 8);
                        if (fileDate.compareTo(needDelFiel) < 0) {
                            files[i].delete();
                        }
                    }
                }
            }
        }
    }
}
