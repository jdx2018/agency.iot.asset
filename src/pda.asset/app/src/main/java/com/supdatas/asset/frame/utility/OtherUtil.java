package com.supdatas.asset.frame.utility;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.util.Log;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Random;

/**
 * Created by Administrator on 2019/7/12.
 */

public class OtherUtil {

    public static String getVersion(Activity act) {

        PackageManager pm = act.getPackageManager();
        PackageInfo pi;
        try {
            pi = pm.getPackageInfo(act.getPackageName(), 0);
            //int versionCode = pi.versionCode;
            return pi.versionName;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
            throw new IllegalArgumentException(e.getMessage());
        }
    }

    public void HomeProhibit(Context cxt) {
        Intent intent2 = new Intent("com.geenk.action.HOMEKEY_SWITCH_STATE");
        intent2.putExtra("enable", true);
        cxt.getApplicationContext().sendBroadcast(intent2);
    }

    public static int randomNext(int iMinClosed, int iMaxOpend) {
        Random random = new Random(System.currentTimeMillis());
        int iTmp = random.nextInt(iMaxOpend);
        if (iTmp >= iMinClosed) {
            return iTmp;
        }
        else {
            return (iTmp + iMinClosed) % iMaxOpend;
        }
    }

    /**
     * List去掉重复数据
     */
    public static List<String> removeDuplicateList(List<String> list){

        List<String> newList = new ArrayList<String>();//新建一个中间集合
        for(Iterator<String> it = list.iterator(); it.hasNext();)//集合循环
        {
            String obj = it.next();
            if(!newList.contains(obj)) {//不包含重复的输出
                newList.add(obj);
            }
        }
        return newList;
    }

    private static long mLastClickTime = 0;
    //防止重复点击 事件间隔，在这里我定义的是1000毫秒
    public static boolean isFastDoubleClick() {

        long time = System.currentTimeMillis();
        long timeD = time - mLastClickTime;
        if (timeD >= 100 && timeD <= 1250) {
            mLastClickTime = 0;
            return true;
        } else {
            mLastClickTime = time;
            return false;
        }
    }

    /**
     * 获取当前语文，英语en，中文简体zh
     * */
    private String getLanaugae(Context cxt){
        Locale locale;
		/*if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
			locale = getResources().getConfiguration().getLocales().get(0);
		} else {
			locale = getResources().getConfiguration().locale;
		}*/
        locale = Locale.getDefault();
        String country = cxt.getResources().getConfiguration().locale.getCountry();
        String lan = locale.getLanguage();
        Log.i("", country + lan);

        return lan;
    }
}
