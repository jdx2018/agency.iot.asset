package com.supdatas.asset;

import com.supdatas.asset.frame.utility.TextUtil;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Author: 安仔夏天勤奋
 * Date: 2020/9/4
 * Desc:
 */
public class DateUtils {

    public static String getCurrentDate() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        return sdf.format(new Date());
    }

    public static String getCurrentTime() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return sdf.format(new Date());
    }

    //2019-05-14T13:49:23.000Z  to yyyy-MM-dd HH:mm:ss
    public static String getDateTimeByDelZone(String dateTime){
        try {
            if(TextUtil.isNullOrEmpty(dateTime)){
                return "";
            }
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.S'Z'");
            Date date = sdf.parse(dateTime);
            SimpleDateFormat sdf1=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            return sdf1.format(date);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return "";
    }


}
