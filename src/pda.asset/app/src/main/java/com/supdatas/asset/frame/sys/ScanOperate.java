package com.supdatas.asset.frame.sys;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;

import com.android.scanner.impl.ReaderManager;
import com.supdatas.asset.frame.utility.DeviceInfor;
import com.supdatas.asset.business.LogSys;

/**
 * Created by zwei on 2018/06/20.
 * 简化扫描类
 */

public class ScanOperate {

    private ScanResultListerner mScanListener;

    private static final String SCN_CUST_ACTION_SCODE = "com.android.server.scannerservice.broadcast";
    private static final String SCN_CUST_EX_SCODE = "scannerdata";
    private Context mContext;
    public static ReaderManager mReaderManager;
    private int outPutMode;
    private int endCharMode;
    private int scanMode;

    public ScanOperate(Context context) {

        mContext = context;

        IntentFilter intentFilter = new IntentFilter(SCN_CUST_ACTION_SCODE);
        mContext.registerReceiver(scanReceiver, intentFilter);

        try {
            String coreDate = DeviceInfor.instance().getCoreDate();
            if (coreDate.compareTo("2018-01") >= 0) {

                mReaderManager = ReaderManager.getInstance();
                initScanConfig();
            }
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    public void onDestroy(Context context) {

        if(scanReceiver!=null){
            context.unregisterReceiver(scanReceiver);
            scanReceiver = null;
        }
        releaseScanConfig();
    }

    private BroadcastReceiver scanReceiver  = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {

            if (mScanListener != null &&
                    intent.getAction().equals(SCN_CUST_ACTION_SCODE)) {
                // 第一代需要这样改m.obj = message.substring(0, message.length()-1);
                // 因为获取到的条码后会加个\n的缘故第二代的不需要，字符串trim方法即可取消空白字符
                String message = intent.getStringExtra(SCN_CUST_EX_SCODE).trim().toUpperCase();
                try {
                    if (message == null){
                        message = "";
                    }
                    mScanListener.scanResult(message);
                } catch (Exception ex) {

                    LogSys.writeSysLog("ScanOperate-BroadcastReceiver", ex.toString());
                    mScanListener.scanResult("");
                }
            }
        }
    };

    /**
     * 初始化扫描枪的设置
     */
    private void initScanConfig() {
        try {
            if (mReaderManager != null){
                if (!mReaderManager.GetActive())
                    mReaderManager.SetActive(true);

                if (!mReaderManager.isEnableScankey())
                    mReaderManager.setEnableScankey(true);

                scanMode = mReaderManager.getScanMode();
                if (scanMode != 0)
                    mReaderManager.setScanMode(0);

                outPutMode = mReaderManager.getOutPutMode();
                if (outPutMode != 2)
                    mReaderManager.setOutPutMode(2);//2 不是api模式设置为api模式

                endCharMode = mReaderManager.getEndCharMode();
                if (endCharMode != 3)
                    mReaderManager.setEndCharMode(3); //结尾设置为null
            }
        }catch (Exception e) {

            e.printStackTrace();
            //ConfirmDialog.showComfirmDialog2(context, context.getResources().getString(R.string.prompt),
            //        context.getResources().getString(R.string.prompt_update_base_msg));
        }
    }

    public void enableScanner(){
        if (mReaderManager != null && !mReaderManager.GetActive()) {
            mReaderManager.SetActive(true);
        }
    }

    public void disableScanner(){
        if (mReaderManager != null && mReaderManager.GetActive()) {
            mReaderManager.SetActive(false);
        }
    }
    /**
     * 释放扫描设置
     */
    public void releaseScanConfig()
    {
        if (mReaderManager != null) {

            mReaderManager.setOutPutMode(outPutMode);//扫描模式设置回去
            mReaderManager.setEndCharMode(endCharMode);//结束字符设置回去

            mReaderManager.Release();
            mReaderManager = null;
        }
    }


    public void setmScanListener(ScanResultListerner mListener) {
        this.mScanListener = mListener;
    }

    public interface ScanResultListerner {
        void scanResult(String result);
    }

    /**
     * 需要自定义的广播接收器
     */
    /*BroadcastReceiver receiverDongDa = new BroadcastReceiver() {

        @Override
        public void onReceive(Context context, Intent intent) {
            String barcode = intent.getStringExtra("scannerdata");
            etScan.setText(barcode);
            Log.i("tag", "barcode:"+barcode);
        }
    };*/
}


