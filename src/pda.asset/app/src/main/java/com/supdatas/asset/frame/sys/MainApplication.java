package com.supdatas.asset.frame.sys;

import android.app.Application;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;

import com.supdatas.asset.frame.utility.SysSharedPreference;

import com.blankj.utilcode.util.Utils;

/**
 * Created by Administrator on 2017/7/9.
 */

public class MainApplication extends Application
{
    public static Context mAppContext = null;
    private BatteryScanListener mBatteryListener;
    private static MainApplication singleton;
    public static SysSharedPreference mConfigSys;

    @Override
    public void onCreate() {
        super.onCreate();

        try {

            mAppContext = getApplicationContext();
            singleton = this;
            Utils.init(singleton);
            registerBatteryRec();
        }catch (Exception e){
            e.printStackTrace();
        }
    }


    public static MainApplication instance() {
        return singleton;
    }

    //------Start-Battery-----
    public void registerBatteryRec() {
        registerReceiver(batteryChangedReceiver,  new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
    }

    public void unregisterBatteryRec() {
        unregisterReceiver(batteryChangedReceiver);
    }

    // 接受广播
    private BroadcastReceiver batteryChangedReceiver = new BroadcastReceiver() {

        public void onReceive(Context context, Intent intent) {

            if (Intent.ACTION_BATTERY_CHANGED.equals(intent.getAction())) {
                int level = intent.getIntExtra("level", 0);
                int scale = intent.getIntExtra("scale", 100);
                int power = level * 100 / scale;
                //Log.e("BATTERY", "电池电量：:" + power);

                if (mBatteryListener != null){
                    mBatteryListener.levelChanged(power);
                }
            }
        }
    };

    public void setBatteryChangeListener(BatteryScanListener listener) {
        this.mBatteryListener = listener;
    }

    public interface BatteryScanListener {
        void levelChanged(int scale);
    }
    //------End-Battery----
}
