package com.supdatas.asset.frame.utility;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.text.ParseException;
import java.util.Date;
import java.util.Calendar;

public class DateUtil {

    //字符串转日期
    public static Date getDate(String dateStr) {
        DateFormat fmt =new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date = null;
        try {
            date = fmt.parse(dateStr);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return date;
    }

    public static String getDateStr(int daysBeforeOrAfter){
        SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd");
        Calendar c = Calendar.getInstance();
        c.add(Calendar.DAY_OF_MONTH, daysBeforeOrAfter);
        return sf.format(c.getTime());
    }

    public static int getDayOfYear(){
        Date date = new Date();
        Calendar cd = Calendar.getInstance();
        cd.setTime(date);
        int dayOfYear = cd.get(Calendar.DAY_OF_YEAR);

        return dayOfYear;
    }

    public static String getDateStr() {
        Date now_date = new Date();
        DateFormat fmt = new SimpleDateFormat("yyyy-MM-dd");
        String curTime = fmt.format(now_date);
        return curTime;
    }

    // string转换为DATE
    public static Date parseStr2Date(String string) {
        Date date = null;
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            date = (Date) sdf.parse(string);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return date;
    }

    // string转换为DATE-Time
    public static Date parstr2DateTime(String string) {
        Date date = null;
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            date = (Date) sdf.parse(string);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return date;
    }

    /**
     * 获取当前时间串（yyyy-MM-dd HH:mm:ss）
     * */
    public static String getDateTimeStr() {
        Date now_date = new Date();
        DateFormat fmt = new SimpleDateFormat("yyyyMMddHHmmss");
        String curTime = fmt.format(now_date);
        return curTime;
    }

    /**
     * 获取当前时间串（yyyy-MM-dd HH:mm:ss）
     * */
    public static String getDateTimeStr1() {
        Date now_date = new Date();
        DateFormat fmt = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String curTime = fmt.format(now_date);
        return curTime;
    }

    /**
     * 获取当前时间串（yyyy-MM-dd HH:mm:ss）
     * */
    public static String getDateTimeStr1(Date date) {

        DateFormat fmt = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String curTime = fmt.format(date);
        return curTime;
    }

    /**
     * 获取当前时间串（yyyy-MM-dd HH:mm:ss.SSS）
     * */
    public static String getDateTimeStr2() {
        Date now_date = new Date();
        DateFormat fmt = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
        String curTime = fmt.format(now_date);
        return curTime;
    }

    /**
     * 获取当前时间串（yyyy-MM-dd HH:mm:ss.SSS）
     * */
    public static String getDateTimeStr2(Date date) {
        DateFormat fmt = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
        String curTime = fmt.format(date);
        return curTime;
    }

    /**
     * 获取当前时间串（yyyyMMddHHmmssSSS）
     * */
    public static String getDateTimeStr3() {
        Date now_date = new Date();
        DateFormat fmt = new SimpleDateFormat("yyyyMMddHHmmssSSS");
        String curTime = fmt.format(now_date);
        return curTime;
    }

    /**
     * 获取当前时间串（yyyyMMddHHmmssSSS）
     * */
    public static String getDateTimeStr3(Date date) {

        DateFormat fmt = new SimpleDateFormat("yyyyMMddHHmmssSSS");
        String curTime = fmt.format(date);
        return curTime;
    }

    /**
     * 获取当前时间串（yyMMddHHmmssSSS）
     * */
    public static String getDateTimeStr4() {
        Date now_date = new Date();
        DateFormat fmt = new SimpleDateFormat("yyMMddHHmmssSSS");
        String curTime = fmt.format(now_date);
        return curTime;
    }

    /**
     * 获取当前时间串（yyMMddHHmmssSSS）
     * */
    public static String getDateTimeStr4(Date date) {
        DateFormat fmt = new SimpleDateFormat("yyMMddHHmmssSSS");
        String curTime = fmt.format(date);
        return curTime;
    }

    /**
     * 得到现在时间前的几天日期
     * */
    public static Date getDateBefore(int day) {
        Date nowtime = new Date();
        Calendar now = Calendar.getInstance();
        now.setTime(nowtime);
        now.set(Calendar.DATE, now.get(Calendar.DATE)  - day);
        return now.getTime();
    }
}
