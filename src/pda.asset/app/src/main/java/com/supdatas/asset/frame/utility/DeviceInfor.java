package com.supdatas.asset.frame.utility;

import android.app.Activity;
import android.telephony.TelephonyManager;
import android.content.Context;
import android.app.Service;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.SystemClock;
import android.util.DisplayMetrics;
import android.view.WindowManager;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.LineNumberReader;
import java.lang.reflect.Method;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * Created by Administrator on 2017/7/13.
 */

public class DeviceInfor {

    private static DeviceInfor _instance;
    public final String PROPERTY_SERIALNO = "ro.serialno";
    public final String PROPERTY_MANUFACTURER = "ro.product.manufacturer";
    /**#设备型号*/
    public final String PROPERTY_MODEL = "ro.product.model";
    /**#设备品牌*/
    public final String PROPERTY_PRODUCT_BRAND = "ro.product.brand";
    /**#产品名*/
    public final String PROPERTY_NAME = "ro.product.name";
    /**#CPU版本*/
    public final String PROPERTY_CPU = "ro.product.cpu.abi";
    /**#CPU品牌*/
    public final String PROPERTY_CPU_BRAND = "ro.product.cpu.abi2";
    /**主板平台*/
    public final String PROPERTY_PLATFORM = "ro.board.platform";
    /**版本ID*/
    public final String PROPERTY_BUILD_ID = "ro.build.id";

    public static DeviceInfor instance(){

        if (_instance == null)
            _instance = new DeviceInfor();
        return _instance;
    }

    ///获取设备的imei
    public String GetIMEIDeviceID(Activity activity){

        TelephonyManager tm = (TelephonyManager)(activity.getSystemService(Context.TELEPHONY_SERVICE));
        String imei = tm.getDeviceId();
        return imei;
    }

    /**
     * 获取系统变量方法
     * ro.serialno  获取序列号SN码
     * ro.product.brand 获取品牌SUPOIN
     * ro.product.manufacturer  获取制造商SUPOIN
     * **/
    public String getProperty(String key, String defaultValue) {
        String value = defaultValue;
        try {
            Class<?> c = Class.forName("android.os.SystemProperties");
            Method get = c.getMethod("get", String.class, String.class);
            value = (String)(get.invoke(c, key, "unknown" ));
        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            return value;
        }
    }

    //获取Mac地址，Wifi没有打开会获取到空的
    public String getMacAddress() {
        String macSerial = "";
        String str = "";
        try {
            Process pp = Runtime.getRuntime().exec("cat /sys/class/net/wlan0/address ");
            InputStreamReader ir = new InputStreamReader(pp.getInputStream());
            LineNumberReader input = new LineNumberReader(ir);
            for (; null != str;) {
                str = input.readLine();
                if (str != null) {
                    macSerial = str.trim();
                    break;
                }
            }
        } catch (IOException ex) {
            ex.printStackTrace();
        }
        return macSerial;
    }

    //打开或关闭Wifi
    public void EnabledWifi(Activity activity, boolean bEnabled)
    {
        final WifiManager wm = (WifiManager)activity.getApplicationContext().getSystemService(Service.WIFI_SERVICE);
        // 尝试打开WIFI，并获取mac地址
        if (!wm.isWifiEnabled()) {
            wm.setWifiEnabled(bEnabled);
        }
    }

    /**
     * 获取设备的mac地址,若Wifi没有打开，则打开Wifi
     *
     * @param ac
     * @param callback  成功获取到mac地址之后会回调此方法
     */
    public void getMacAddress(final Activity ac, final SimpleCallback1 callback) {
        final WifiManager wm = (WifiManager)ac.getApplicationContext().getSystemService(Service.WIFI_SERVICE);
        // 如果本次开机后打开过WIFI，则能够直接获取到mac信息。立刻返回数据。
        WifiInfo info = wm.getConnectionInfo();
        if (info != null && info.getMacAddress() != null) {
            if (callback != null) {
                callback.onComplete(info.getMacAddress());
            }
            return;
        }
        // 尝试打开WIFI，并获取mac地址
        if (!wm.isWifiEnabled()) {
            wm.setWifiEnabled(true);
        }
        new Thread(new Runnable() {
            @Override
            public void run() {
                int tryCount = 0;
                final int MAX_COUNT = 10;
                while (tryCount < MAX_COUNT) {
                    final WifiInfo info = wm.getConnectionInfo();
                    if (info != null && info.getMacAddress() != null) {
                        if (callback != null) {
                            ac.runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    callback.onComplete(info.getMacAddress());
                                }
                            });
                        }
                        return;
                    }
                    SystemClock.sleep(300);
                    tryCount++;
                }
                // 未获取到mac地址
                if (callback != null) {
                    callback.onComplete(null);
                }
            }
        }).start();
    }
    public interface SimpleCallback1 {
        void onComplete(String result);
    }

    /**
     * 获取屏幕宽度
     * @param context 上下文对象
     * @return 屏幕宽度
     */
    public DisplayMetrics getScreenWidth(Context context){
        WindowManager wm = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
        DisplayMetrics dm = new DisplayMetrics();
        wm.getDefaultDisplay().getMetrics(dm);
        return dm;
    }

    /**
     * @return 获取内核版本的日期，主要针对使用扫描JAR包ReaderManager.jar的内核版本过老时会崩溃的问题，使用扫描JAR包内核版本日期必须大于2018年1月
     */
    public String getCoreDate() throws Exception {
        try {
            Process process = Runtime.getRuntime().exec("cat /proc/version");

            // get the output line
            InputStream outs = process.getInputStream();
            InputStreamReader isrout = new InputStreamReader(outs);
            BufferedReader brout = new BufferedReader(isrout, 8 * 1024);

            StringBuilder result = new StringBuilder();
            String line;

            while ((line = brout.readLine()) != null) {
                result.append(line);
            }

            if (!result.toString().equals("")) {
                String Keyword = "SMP PREEMPT ";
                int index = result.indexOf(Keyword);
                line = result.substring(index + Keyword.length());

                SimpleDateFormat sdf = new SimpleDateFormat("EEE MMM dd HH:mm:ss zzz yyyy", Locale.US);
                //java.util.Date对象
                Date date = sdf.parse(line);
                if (date != null) {
                    //2009-09-16
                    return new SimpleDateFormat("yyyy-MM", Locale.CHINA).format(date);
                }
                else {
                    return "";
                }
            }
        } catch (Exception e) {
            throw e;
        }
        return "";
    }
}
