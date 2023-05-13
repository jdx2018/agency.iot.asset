package com.supdatas.asset.activity;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.widget.Toast;

import com.blankj.utilcode.util.FileUtils;
import com.blankj.utilcode.util.StringUtils;

import java.io.File;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import com.supdatas.asset.frame.sys.CrashHandler;
import com.supdatas.asset.frame.sys.MainApplication;
import com.supdatas.asset.frame.utility.dlgprompt.AlertUtil;
import com.supdatas.asset.configure.ConfigConstants;
import com.supdatas.asset.configure.ConfigParams;
import com.supdatas.asset.configure.SysConstants;
import com.supdatas.asset.R;
import com.supdatas.asset.frame.utility.*;

public class MainActivity extends Activity {

    private ProgressDialog mProgressDialog;
    private Context mContext;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        this.requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.activity_main);
        mContext = MainActivity.this;

        /*checkPermission();
        if (Build.VERSION.SDK_INT >= 23) {
            if (checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED) {

                sysInit();
            }
        } else if (Build.VERSION.SDK_INT < 23) {

            sysInit();
        }*/
        sysInit();
    }

    public void sysInit() {

		//MainApplication.mConfigSys = new SysSharedPreference(getApplicationContext());
        MainApplication.mConfigSys = new SysSharedPreference(MainApplication.mAppContext);
        SysSound.getIntance().playSound(999, 0);

        initDirs();
        initConfig();
        initData();
    }

    private void initDirs(){

        CrashHandler crashHandler = CrashHandler.getInstance();
        crashHandler.init(getApplicationContext());

        if (!SysDirs.instance().isSdCardAvailable())
            return;

        String clientDir = SysDirs.instance().getAppDir();
        File fileDir = new File(clientDir);
        if (!fileDir.exists())
            fileDir.mkdirs();
        File fileDBDir = new File(SysDirs.instance().getDatabaseDir());
        if (!fileDBDir.exists())
            fileDBDir.mkdirs();

        File configDir = new File(SysDirs.instance().getConfigDir());
        if (!configDir.exists())
            configDir.mkdirs();

        File logDir = new File(SysDirs.instance().getLogDir());
        if (!logDir.exists())
            logDir.mkdirs();

        File crashPath = new File(SysDirs.instance().getCrashDir());
        if (!crashPath.exists())
            crashPath.mkdirs();

        //前一个月的时间
        Calendar c = Calendar.getInstance();
        c.setTime(new Date());
        c.add(Calendar.MONTH, -1);
        Date m = c.getTime();
        //获取日志目录下的文件列表，遍历比较时间，删除一个月前的日志文件
        List<File> fileList = FileUtils.listFilesInDir(SysDirs.instance().getLogDir());
        if (fileList != null) {

            for (File file : fileList) {
                String fileName = FileUtils.getFileName(file);
                Date date = DateUtil.parseStr2Date(fileName.substring(0, fileName.length() - 4));
                if (date != null) {
                    if (date.before(m)) {
                        FileUtils.deleteFile(file);
                    }
                }
            }
        }
    }

    private void initConfig(){

        final String UNKNOWN = "unknow";
        //获取
        ConfigParams.mDataUrl = MainApplication.mConfigSys.getItemStrValue(ConfigConstants.KEY_WEB_DATA_URL, ConfigParams.mDataUrl);
        ConfigParams.mDeviceAuthUrl = MainApplication.mConfigSys.getItemStrValue(ConfigConstants.KEY_WEB_AUTH_URL, ConfigParams.mDeviceAuthUrl);
        ConfigParams.mUpgradeUrl = MainApplication.mConfigSys.getItemStrValue(ConfigConstants.KEY_WEB_UPGRADE_URL, ConfigParams.mUpgradeUrl);
        ConfigParams.languageIndex = MainApplication.mConfigSys.getItemIntValue(ConfigConstants.KEY_LANGUAGE, ConfigParams.languageIndex);

        /*if (!ConfigParams.mDataUrl.endsWith("/")){
            ConfigParams.mDataUrl += "/";
        }*/
        if (!ConfigParams.mDeviceAuthUrl.endsWith("/")){
            ConfigParams.mDeviceAuthUrl += "/";
        }
        if (!ConfigParams.mUpgradeUrl.endsWith("/")){
            ConfigParams.mUpgradeUrl += "/";
        }

        ConfigParams.imei = MainApplication.mConfigSys.getItemStrValue(ConfigConstants.KEY_IMEI, ConfigParams.imei);
        ConfigParams.seriesNo = MainApplication.mConfigSys.getItemStrValue(ConfigConstants.KEY_DEVICE_SNO, ConfigParams.seriesNo);
        ConfigParams.Device_brand = MainApplication.mConfigSys.getItemStrValue(ConfigConstants.KEY_DEVICE_BRAND, ConfigParams.Device_brand);
        ConfigParams.Device_manufacturer = MainApplication.mConfigSys.getItemStrValue(ConfigConstants.KEY_DEVICE_MANUFACTURER, ConfigParams.Device_manufacturer);
        ConfigParams.Device_model = MainApplication.mConfigSys.getItemStrValue(ConfigConstants.KEY_DEVICE_MODEL, ConfigParams.Device_model);

        if (!TextUtil.isNullOrEmpty(ConfigParams.seriesNo) && ConfigParams.seriesNo.equalsIgnoreCase(UNKNOWN)){
            ConfigParams.seriesNo = "";
        }
        if (StringUtils.isEmpty(ConfigParams.imei)){
            ConfigParams.imei = DeviceInfor.instance().GetIMEIDeviceID(MainActivity.this);
            MainApplication.mConfigSys.setItemStrValue(ConfigConstants.KEY_IMEI, ConfigParams.imei);
        }
        if (StringUtils.isEmpty(ConfigParams.seriesNo)) {

            ConfigParams.seriesNo = DeviceInfor.instance().getProperty(DeviceInfor.instance().PROPERTY_SERIALNO, "");
            if (!TextUtil.isNullOrEmpty(ConfigParams.seriesNo) && ConfigParams.seriesNo.equalsIgnoreCase(UNKNOWN)){
                ConfigParams.seriesNo = "";
            }
            if (TextUtil.isNullOrEmpty(ConfigParams.seriesNo)){
                ConfigParams.seriesNo = ConfigParams.imei;
            }
            if (TextUtil.isNullOrEmpty(ConfigParams.seriesNo)){
                ConfigParams.seriesNo = DeviceInfor.instance().getMacAddress();
            }
            if (TextUtil.isNullOrEmpty(ConfigParams.seriesNo)){
                ConfigParams.seriesNo = String.valueOf(System.currentTimeMillis());
            }
            MainApplication.mConfigSys.setItemStrValue(ConfigConstants.KEY_DEVICE_SNO, ConfigParams.seriesNo);
        }
        if (StringUtils.isEmpty(ConfigParams.Device_brand)){
            ConfigParams.Device_brand = DeviceInfor.instance().getProperty(DeviceInfor.instance().PROPERTY_PRODUCT_BRAND, "");
            MainApplication.mConfigSys.setItemStrValue(ConfigConstants.KEY_DEVICE_BRAND, ConfigParams.Device_brand);
        }
        if (StringUtils.isEmpty(ConfigParams.Device_manufacturer)){
            ConfigParams.Device_manufacturer = DeviceInfor.instance().getProperty(DeviceInfor.instance().PROPERTY_MANUFACTURER, "");
            MainApplication.mConfigSys.setItemStrValue(ConfigConstants.KEY_DEVICE_MANUFACTURER, ConfigParams.Device_manufacturer);
        }
        if (StringUtils.isEmpty(ConfigParams.Device_model)){
            ConfigParams.Device_model = DeviceInfor.instance().getProperty(DeviceInfor.instance().PROPERTY_MODEL, "");
            MainApplication.mConfigSys.setItemStrValue(ConfigConstants.KEY_DEVICE_MODEL, ConfigParams.Device_model);
        }
    }

    private void initData() {

        setLangue();
        try {

			SysDirs.instance().CopyAssets(this, "",
					SysDirs.instance().getDatabaseDir(), SysConstants.dbBusiName);
			SysDirs.instance().CopyAssets(this, "",
					SysDirs.instance().getDatabaseDir(), SysConstants.dbBaseName);

            if (!SysDirs.instance().isSdCardAvailable()) {
                AlertUtil.showAlert(MainActivity.this,  getString(R.string.warning), getString(R.string.no_stcard), getString(R.string.ok),
                        new View.OnClickListener() {

                            @Override
                            public void onClick(View v) {
                                // TODO Auto-generated method stub
                                AlertUtil.dismissDialog();
                                finish();
                            }
                        });
                return;
            }

            if (!SysDirs.instance().isAvaiableSpace(SysConstants.maxSpace)) {
                AlertUtil.showAlert(MainActivity.this,  getString(R.string.warning), getString(R.string.no_enough_space), getString(R.string.ok),
                        new View.OnClickListener() {

                            @Override
                            public void onClick(View v) {
                                // TODO Auto-generated method stub
                                AlertUtil.dismissDialog();
                                finish();
                            }
                        });
                return;
            }

            new SysAsync().execute();
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
    }

    private class SysAsync extends AsyncTask<Void, String, Boolean>{

        private final Context mContext = MainActivity.this;
        private Thread myThread=null;
        private boolean isComplect=false;
        private final int maxProgress=100;
        private int progress=0;

        @Override
        protected void onPreExecute() {
            try {
                mProgressDialog = AlertUtil.showNoButtonProgressDialog(mContext, "正在初始化数据...");
                    myThread=new Thread()
                    {
                        @Override
                        public void run() {
                            try {
                                while (true) {
                                    Thread.sleep(1000);
                                    if(isComplect)
                                        progress=maxProgress;
                                    if (progress < maxProgress) {
                                        if ((double) progress / maxProgress >= 0.7)
                                            progress += 1;
                                        else
                                            progress += 1;
                                    }
                                    if(progress>maxProgress)
                                        progress=maxProgress;
                                    AlertUtil.setNoButtonMessage(String.format("%s", progress));

                                    if(isComplect)
                                        return;
                                }
                            }catch (Exception e){}
                        }
                    };
                    myThread.start();
            }
            catch (Exception e)
            {
                e.printStackTrace();
            }
            super.onPreExecute();
        }

        @Override
        protected void onProgressUpdate(String... values) {
            AlertUtil.setNoButtonMessage(values[0]);
        }

        @Override
        protected Boolean doInBackground(Void... params) {
            try {
                // 处理耗时操作
                //...
            }
            catch (Exception e)
            {
                e.printStackTrace();
            }
            return true;
        }

        @Override
        protected void onPostExecute(Boolean result) {
            super.onPostExecute(result);
            isComplect=true;
            mProgressDialog.dismiss();

            startLogoTimer();
        }
    }

    private void checkPermission(){

        if (Build.VERSION.SDK_INT >= 23 && (checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE)
                != PackageManager.PERMISSION_GRANTED ||
                checkSelfPermission(Manifest.permission.READ_EXTERNAL_STORAGE)
                        != PackageManager.PERMISSION_GRANTED ||
                checkSelfPermission(Manifest.permission.READ_PHONE_STATE)
                        != PackageManager.PERMISSION_GRANTED ||
                checkSelfPermission(Manifest.permission.SYSTEM_ALERT_WINDOW)
                        != PackageManager.PERMISSION_GRANTED)) {

            requestPermissions(new String[]{
                    Manifest.permission.WRITE_EXTERNAL_STORAGE,
                    Manifest.permission.READ_EXTERNAL_STORAGE,
                    Manifest.permission.READ_PHONE_STATE,
                    Manifest.permission.SYSTEM_ALERT_WINDOW}, 1);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {

        switch (requestCode) {
            case 1:
                if (grantResults.length >= 4 &&
                        grantResults[0] == PackageManager.PERMISSION_GRANTED &&
                        grantResults[1] == PackageManager.PERMISSION_GRANTED &&
                        grantResults[2] == PackageManager.PERMISSION_GRANTED &&
                        grantResults[3] == PackageManager.PERMISSION_GRANTED) {
                    // Permission Granted 授予权限
                    //处理授权之后逻辑
                    sysInit();
                } else {
                    // Permission Denied 权限被拒绝
                    Toast.makeText(MainActivity.this, "未授予权限！请重新打开并进行授权！", Toast.LENGTH_SHORT).show();
                    mHandler.postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            finish();
                        }
                    },200);
                }
                break;
            default:
                break;
        }
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

    private void startLogoTimer()
    {
        Runnable runnable = new Runnable() {

            @Override
            public void run() {
                // TODO Auto-generated method stub
                try {
                    Thread.sleep(1500);
                } catch (InterruptedException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
                Message msg = new Message();
                msg.what = 99;
                mHandler.sendMessage(msg);
            }
        };
        new Thread(runnable).start();
    }

    @SuppressLint("HandlerLeak")
    private Handler mHandler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case 7:
                    finish();
                    break;
                case 99:
					startActivity(LoginActivity.newInstance(mContext, ""));
                    finish();
            }
            super.handleMessage(msg);
        }
    };

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {

        // TODO Auto-generated method stub
        if (event.getAction() == KeyEvent.ACTION_DOWN
                && KeyEvent.KEYCODE_BACK == keyCode) {
            finish();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    protected void onDestroy() {

        super.onDestroy();
    }

    private String getLanaugae(){
        Locale locale;
		/*if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
			locale = getResources().getConfiguration().getLocales().get(0);
		} else {
			locale = getResources().getConfiguration().locale;
		}*/
        locale = Locale.getDefault();
        String country =getResources().getConfiguration().locale.getCountry();
        String lan = locale.getLanguage();
        Log.i("", country + lan);

        return lan;
    }

    private void setLangue() {

        try
        {
            Resources resources=getResources();
            Configuration configuration=resources.getConfiguration();
            DisplayMetrics displayMetrics=resources.getDisplayMetrics();

            /*if(ConfigParams.languageIndex == 0) {
                configuration.setLocale(new Locale(""));
            }
            else{
                configuration.setLocale(new Locale("en","US"));
            }*/
            String lan = getLanaugae();
            if(lan.toUpperCase().indexOf("EN") >= 0){
                configuration.setLocale(new Locale("en","US"));
            }
            else{
                configuration.setLocale(new Locale(""));
            }
            resources.updateConfiguration(configuration,displayMetrics);
        } catch (Exception ex) {
            AlertUtil.showErrorAlert(this, ex.getMessage());
        }
    }
}
