package com.supdatas.asset.activity.location;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import com.blankj.utilcode.util.StringUtils;
import com.supdatas.asset.business.LogSys;
import com.supdatas.asset.business.base.Asset;
import com.supdatas.asset.frame.activity.BaseActivity;
import com.supdatas.asset.frame.sys.MainApplication;
import com.supdatas.asset.frame.utility.SysSound;
import com.supdatas.asset.frame.utility.dlgprompt.AlertUtil;
import com.supdatas.asset.model.asset.AssetEntity;
import com.supdatas.asset.model.inventory.InventoryDtlEntity;
import com.supdatas.asset.model.inventory.InventoryEntity;
import com.supdatas.asset.model.out.OutBillTypeEnum;
import com.supdatas.asset.model.out.OutDtlEntity;
import com.supdatas.asset.model.out.OutEntity;
import com.supoin.rfidservice.sdk.DataUtils;
import com.supoin.rfidservice.sdk.ModuleController;
import com.supdatas.asset.frame.utility.TextUtil;
import com.supdatas.asset.frame.utility.dlgprompt.DlgUtility;
import com.supdatas.asset.configure.ConfigConstants;
import com.supdatas.asset.configure.ConfigParams;
import com.supdatas.asset.R;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import butterknife.BindView;
import butterknife.OnClick;

public class LocateActivity extends BaseActivity implements EditText.OnEditorActionListener {

    private static final String LOCATE_DATA_SRC = "LOCATE_DATA_SRC";
    private static final String INVEN_BILL = "INVEN_BILL";
    private static final String OUT_BILL = "OUT_BILL";
    private static final String INVEN_DATA = "INVEN_DATA";
    private static final String OUT_DATA = "OUT_DATA";
    private static final String SCAN_MODE = "SCAN_MODE";

    @BindView(R.id.btn_query)
    protected Button mBtnQuery;

    @BindView(R.id.btn_reset)
    protected Button mBtnReset;

    @BindView(R.id.btn_set_power)
    protected Button mBtnSetPower;

    @BindView(R.id.btn_return)
    protected Button mBtnReturn;

    @BindView(R.id.et_serial_no)
    protected EditText mEtSeriaoNO;

    @BindView(R.id.recyclerview)
    protected RecyclerView mRecyclerview;;

    @BindView(R.id.tv_summary)
    protected TextView mTvSummary;

    @BindView(R.id.tv_msg)
    protected TextView mTvMsg;

    private LinearLayoutManager mLinearLayoutManager;

    private List<AssetEntity> mToLocateAssetList;
    private List<AssetEntity> mLocatedAssetList;

    private InventoryEntity mInvenBill;
    private ArrayList<InventoryDtlEntity> mListInvenDtl;

    private OutEntity mOutBill;
    private ArrayList<OutDtlEntity> mListOutDtl;

    private Locationadapter mAdapter;

    private ModuleController mModuleController;

    private Map<String, EpcParams> mMapEpc = new HashMap<String,EpcParams>();

    /**Rfid扫描数据数据刷新界面时间间隔，in MS*/
    private static int RFID_INTERVAL_REFRESH_QTY = 200;

    /**Rfid扫描数据数据刷新界面时间间隔，in MS*/
    private static int RFID_INTERVAL_REFRESH_LIST = 2000;
    /**用于标识是否已经启用了Rfid采集*/
    private boolean isRfidStart = false;

    /** 记录上次读取Rfid返回且显示时的时间*/
    private long mLastRefreshQtyTime = 0;

    /** 记录上次读取Rfid返回且刷新列表的时间*/
    private long mLastRefreshListTime = 0;

    private List<Map<String,String>> mListTags = new ArrayList<Map<String,String>>();
    private long lastStartRfidReadTime = 0;
    private int pressRfidCount = 0;

    private Asset mAsset;

    private int mParentScanMode;

    /**
     * 查找来源，0表示无来源，1表示来自于盘点，2，3，4分别表示来自于借阅出库，移库出库，销户出库
     * */
    private int mDataSrc = 0;
    @Override
    protected int getLayoutContentID(){

        return R.layout.activity_archive_location;
    }

    @Override
    protected void initView(Bundle savedInstanceState) {

        mDataSrc = (int) getIntent().getExtras().getInt(LOCATE_DATA_SRC, 0);
        String title = "资产查找";
        if (mDataSrc == 1){
            mInvenBill = (InventoryEntity)getIntent().getExtras().getSerializable(INVEN_BILL);
            mListInvenDtl = (ArrayList<InventoryDtlEntity>)getIntent().getExtras().getSerializable(INVEN_DATA);
            mParentScanMode = getIntent().getExtras().getInt(SCAN_MODE);

            mEtSeriaoNO.setBackgroundColor(getResources().getColor(R.color.light_grey5));
            mEtSeriaoNO.setFocusable(false);
            mEtSeriaoNO.setText("盘点单号:" + mInvenBill.billNo);
            title = "盘点查找";
            mBtnQuery.setVisibility(View.GONE);
        }
        else{
            //mEtSeriaoNO.setText("");
        }
        //设置菜单栏
        initTitleBar(title);
        setGearVisibility(View.VISIBLE);

        mEtSeriaoNO.setOnEditorActionListener(this);
        mLocatedAssetList = new ArrayList<AssetEntity>();

        mLinearLayoutManager = new LinearLayoutManager(this, LinearLayoutManager.VERTICAL, false);
        mRecyclerview.setLayoutManager(mLinearLayoutManager);
        mAdapter = new Locationadapter(mContext, mLocatedAssetList, mDataSrc);
        mRecyclerview.setAdapter(mAdapter);

        mAdapter.setGetListener(new Locationadapter.RowClickedListener() {

            @Override
            public void onClick(int position) {

                mAdapter.setPosition(position);
                mAdapter.notifyDataSetChanged();
            }
        });
        mAsset = new Asset(mContext);
        setFocus();

        myHandlerUI.sendEmptyMessage(3);
    }

    private void transferInven(List<InventoryDtlEntity> listDtl){

        mToLocateAssetList.clear();
        for(InventoryDtlEntity item : listDtl){

        }
    }

    private void transferOut(List<OutDtlEntity> listDtl){

    }

    private void setFocus(){
        myHandlerUI.postDelayed(new Runnable() {
            @Override
            public void run() {
                mEtSeriaoNO.setEnabled(true);
                mEtSeriaoNO.requestFocus();
            }
        },200);
    }

    /**
     * RecyclerView 移动到当前位置，
     *
     * @param manager   设置RecyclerView对应的manager
     * @param mRecyclerView  当前的RecyclerView
     * @param n  要跳转的位置
     */
    public static void moveToPosition(LinearLayoutManager manager, RecyclerView mRecyclerView, int n) {
        int firstItem = manager.findFirstVisibleItemPosition();
        int lastItem = manager.findLastVisibleItemPosition();
        if (n <= firstItem) {
            mRecyclerView.scrollToPosition(n);
        } else if (n <= lastItem) {
            int top = mRecyclerView.getChildAt(n - firstItem).getTop();
            mRecyclerView.scrollBy(0, top);
        } else {
            mRecyclerView.scrollToPosition(n);
        }
    }

    @OnClick({R.id.btn_query, R.id.btn_reset, R.id.btn_set_power, R.id.btn_return})
    public void onClick(View view) {

        switch (view.getId()) {
            case R.id.btn_query:

                if (isRfidStart)
                    return;
                onQuery();
                break;

            case R.id.btn_reset:
                resetLocate();
                break;

            case R.id.btn_return:

                if (isRfidStart)
                    return;
                finish();
                break;
            case R.id.btn_set_power:
                break;
        }
    }

    private void resetLocate(){

        if (isRfidStart)
            return;

        if (mDataSrc > 0) {

            SysSound.getIntance().playSound(2, 3);
            if (!AlertUtil.showAlertConfirm(mContext, "系统提示", "请确认，要重新查找所有待找资产吗？")) {
                return;
            }
        }
        if (mDataSrc == 0) {
            mEtSeriaoNO.setText("");
            mLocatedAssetList.clear();
            myHandlerUI.sendEmptyMessage(3);
            mListTags.clear();
            mToLocateAssetList.clear();
            mMapEpc.clear();
            mEtSeriaoNO.setEnabled(true);
            setFocus();
        }
        else if (mDataSrc == 1){
            mLocatedAssetList.clear();
            myHandlerUI.sendEmptyMessage(3);
            mListTags.clear();
            mMapEpc.clear();
        }
        else if (mDataSrc >= 2){
            mLocatedAssetList.clear();
            myHandlerUI.sendEmptyMessage(3);
            mListTags.clear();
            mMapEpc.clear();
        }
        AlertUtil.showToast(mContext, "重置成功！");
    }

    @Override
    public void onClickGear(View v){

        int gravity = Gravity.CENTER_VERTICAL;
        popupInputWindow(LocateActivity.this, v, "设置查找功率", "功率",
                String.valueOf(ConfigParams.mLocatePower),
                false, true, 1, 33, gravity, 0, 100,
                new OnInputListener() {
                    @Override
                    public void onInput(String v) {

                        ConfigParams.mLocatePower = Integer.parseInt(v);
                        MainApplication.mConfigSys.setItemIntValue(
                                ConfigConstants.getInstance().RFID_LOCATE_POWER, ConfigParams.mLocatePower);

                        AlertUtil.showToast(mContext, R.string.module_power_set_succeed);
                        SysSound.getIntance().playSound(2, 3);
                    }
                },true);
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        // TODO Auto-generated method stub

        if (event.getScanCode() == 261) {
            if (pressRfidCount >= 2) {

                pressRfidCount = 0;
                if (isRfidStart) {
                    stopRfid(false);
                    myHandlerUI.sendEmptyMessage(4);
                }
            }
        }
        return super.onKeyUp(keyCode, event);
    };

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {

        if (keyCode == KeyEvent.KEYCODE_BACK && event.getAction() == KeyEvent.ACTION_DOWN) {
            if (isRfidStart){
                return true;
            }
            finish();
        }
        int scanCode = event.getScanCode();
        if (event.getRepeatCount() == 0 && scanCode == 261) {

            if (System.currentTimeMillis() - lastStartRfidReadTime < 1200) {
                try {
                    Thread.sleep(10);
                }
                catch (Exception e) {
                    e.printStackTrace();
                }
            }
            else {
                pressRfidCount++;
                if (!isRfidStart) {

                    lastStartRfidReadTime = System.currentTimeMillis();
                    startRfid();
                }
            }
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    private void startRfid() {

        if (mDataSrc == 0) {
            if (mToLocateAssetList == null || mToLocateAssetList.size() < 1) {
                showToast("待查找资产为空.");
                return;
            }
        }
        else if (mDataSrc == 1 && mListInvenDtl.size() < 1) {
            showToast("待查找资产为空.");
            return ;
        }
        else if (mDataSrc >= 2 && mListOutDtl.size() < 1){

            if (mDataSrc == 2) {
                mMsg = "待查找的借阅资产为空.";
            }
            else if (mDataSrc == 3) {
                mMsg = "待查找的移库资产为空.";
            }
            else {
                mMsg = "待查找的销户资产为空.";
            }
            showToast(mMsg);
            return ;
        }
        isRfidStart = true;
        mBtnQuery.setEnabled(false);
        mBtnSetPower.setEnabled(false);
        mBtnReset.setEnabled(false);
        mBtnReturn.setEnabled(false);
        mEtSeriaoNO.setEnabled(false);
        setGearEnabled(false);
        setBackEnabled(false);
        //doTagInventory();
        mListTags.clear();
        mModuleController.tagList.clear();
        mModuleController.moduleInventoryTag();
    }

    private void stopRfid(boolean stopOnFound){

        pressRfidCount = 0;
        isRfidStart = false;
        mBtnQuery.setEnabled(true);
        mBtnSetPower.setEnabled(true);
        mBtnReset.setEnabled(true);
        mBtnReturn.setEnabled(true);
        setGearEnabled(true);
        setBackEnabled(true);
        //mEtSeriaoNO.setEnabled(true);

        myHandlerUI.removeCallbacks(procRunnable);
        mModuleController.moduleStopInventoryTag();

        mMapEpc.clear();
        mListTags.clear();

        if (!stopOnFound) {
            mListTags.addAll(mModuleController.tagList);
            myHandlerUI.sendEmptyMessage(14);
        }
        else{
            showToast("找到新资产，自动停止!!");
        }
    }

    @Override
    protected void onResume() {
        // TODO Auto-generated method stub
        super.onResume();
    }

    @Override
    protected void onScan(String barcode){

        if (TextUtil.isNullOrEmpty(barcode)){
            return;
        }
        mEtSeriaoNO.setText(barcode);
        onQuery();
    }

    @Override public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
        // TODO Auto-generated method stub
        if (actionId == EditorInfo.IME_ACTION_DONE || (event != null
                && event.getKeyCode() == KeyEvent.KEYCODE_ENTER && event.getAction() == KeyEvent.ACTION_DOWN)) {

            InputMethodManager imm = (InputMethodManager) getSystemService(Activity.INPUT_METHOD_SERVICE);
            if(imm.isActive()) {
                imm.hideSoftInputFromWindow(v.getWindowToken(), 0);
            }
            if (!mEtSeriaoNO.isEnabled()){
                return false;
            }
			String bar = mEtSeriaoNO.getText().toString().toUpperCase().trim();
			if (TextUtil.isNullOrEmpty(bar))
				return true;
			mEtSeriaoNO.setText(bar);
			onQuery();
            return true;
        }
        return false;
    }

    private boolean onQuery() {

        try {
            String serialNO = mEtSeriaoNO.getText().toString().trim().toUpperCase();
            if (StringUtils.isEmpty(serialNO)) {

                showToast("查询时资产编号不能为空.");
                return false;
            }
            mToLocateAssetList = mAsset.getSpeAssetItems(serialNO, false);
            if (mToLocateAssetList.size() < 1) {

                showToast("不存在该信息的资产记录.");
                return false;
            }
            showToast("资产查询成功，请按扫描按键开启资产查找！");

            mListTags.clear();
            mModuleController.tagList.clear();
            mEtSeriaoNO.setEnabled(false);
            return true;
        }
        catch (Exception ex){
            ex.printStackTrace();
            showError(ex.getMessage());
        }
        finally {
        }
        return false;
    }

    private Runnable procRunnable = new Runnable() {
        @Override
        public void run() {

            try {

                if (System.currentTimeMillis() - mLastRefreshQtyTime > RFID_INTERVAL_REFRESH_QTY) {

                    mLastRefreshQtyTime = System.currentTimeMillis();
                    Message msg = myHandlerUI.obtainMessage(2);
                    msg.obj = mModuleController.tagList.size();
                    msg.arg1 = 1;
                    myHandlerUI.sendMessage(msg);
                }

                if (System.currentTimeMillis() - mLastRefreshListTime > RFID_INTERVAL_REFRESH_LIST) {

                    mLastRefreshListTime = System.currentTimeMillis();
                    mListTags.clear();
                    mListTags.addAll(mModuleController.tagList);

                    boolean bFound = procRfidData();

                    if (bFound) {
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                mAdapter.notifyDataSetChanged();
                                moveToPosition(mLinearLayoutManager, mRecyclerview, mLocatedAssetList.size() - 1);
                                mAdapter.setPosition(mLocatedAssetList.size() - 1);
                            }
                        });
                    }
                }
                return;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    };

    private boolean procRfidData() throws Exception {

        try {
            int i = 0;
            int listIndex = 0;
            List<AssetEntity> listDtl = new ArrayList<AssetEntity>();
            String epcStr;
            String cnt;
            String rssi;
            boolean alreadyFound = false;
            boolean hasRecord = false;

            for (listIndex = 0; listIndex < mListTags.size(); ++listIndex) {

                epcStr = mListTags.get(listIndex).get(DataUtils.KEY_EPC);
                if (TextUtil.isNullOrEmpty(epcStr)) {
                    epcStr = mListTags.get(listIndex).get(DataUtils.KEY_EPC_TID);
                }
                epcStr = epcStr.toUpperCase();

                cnt = mListTags.get(listIndex).get(DataUtils.KEY_COUNT);
                rssi = mListTags.get(listIndex).get(DataUtils.KEY_RSSI);

                Log.e("", cnt);
                Log.e("", rssi);
                if (StringUtils.isEmpty(cnt)){
                    cnt = "0";
                }
                if (mDataSrc == 0) {
                    for (AssetEntity e : mToLocateAssetList) {

                        if (e.epc.equalsIgnoreCase(epcStr)) {

                            hasRecord = true;
                            alreadyFound = false;
                            for (i = 0; i < mLocatedAssetList.size(); ++i) {

                                if (mLocatedAssetList.get(i).epc.equalsIgnoreCase(e.epc)) {
                                    alreadyFound = true;
                                    break;
                                }
                            }
                            if (!alreadyFound) {

                                e.cnt = Integer.parseInt(cnt);
                                e.rssi = rssi;
                                mLocatedAssetList.add(e);
                            }
                            break;
                        }
                    }
                }
                else if (mDataSrc == 1) {

                    for (InventoryDtlEntity e : mListInvenDtl) {

                        if (e.assetEntity.epc.equalsIgnoreCase(epcStr)) {

                            hasRecord = true;
                            alreadyFound = false;
                            for (i = 0; i < mLocatedAssetList.size(); ++i) {

                                if (mLocatedAssetList.get(i).epc.equalsIgnoreCase(e.assetEntity.epc)) {
                                    alreadyFound = true;
                                    mLocatedAssetList.get(i).hasFound = true;
                                    break;
                                }
                            }
                            if (!alreadyFound) {
                                e.hasFound = true;

                                List<AssetEntity> list = mAsset.getSpeAssetItems(e.assetId, true);
                                if (list.size() > 0) {
                                    AssetEntity assetEntity = list.get(0);
                                    assetEntity.cnt = Integer.parseInt(cnt);
                                    assetEntity.rssi = rssi;
                                    assetEntity.hasFound = true;
                                    mLocatedAssetList.add(assetEntity);
                                }
                            }
                            break;
                        }
                    }
                }
                else {
                    for (OutDtlEntity e : mListOutDtl) {

                        if (e.epc.equalsIgnoreCase(epcStr)) {

                            hasRecord = true;
                            alreadyFound = false;
                            for (i = 0; i < mLocatedAssetList.size(); ++i) {

                                if (mLocatedAssetList.get(i).epc.equalsIgnoreCase(e.epc)) {
                                    alreadyFound = true;
                                    mLocatedAssetList.get(i).hasFound = true;
                                    break;
                                }
                            }
                            if (!alreadyFound) {
                                e.hasFound = true;

                                List<AssetEntity> list = mAsset.getSpeAssetItems(e.archiveNo, true);
                                if (list.size() > 0) {
                                    AssetEntity assetEntity = list.get(0);
                                    assetEntity.cnt = Integer.parseInt(cnt);
                                    assetEntity.rssi = rssi;
                                    assetEntity.hasFound = true;
                                    mLocatedAssetList.add(assetEntity);
                                }
                            }
                            break;
                        }
                    }
                }
                if (hasRecord && !alreadyFound && mDataSrc >= 1){
                    break;
                }
            }
            for (i = 0; i < mLocatedAssetList.size(); ++i) {

                if (mMapEpc.containsKey(mLocatedAssetList.get(i).epc)) {
                    mLocatedAssetList.get(i).cnt = mMapEpc.get(mLocatedAssetList.get(i).epc).cnt;
                    mLocatedAssetList.get(i).rssi = mMapEpc.get(mLocatedAssetList.get(i).epc).rssi;
                }
            }
            if (hasRecord && !alreadyFound) {
                myHandlerUI.sendEmptyMessage(3);
                SysSound.getIntance().playSound(2, 3);

                pressRfidCount++;
                stopRfid(true);

                return true;
            }
            else{
                return false;
            }
        }
        catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public void onClickTitleBack(View v){

        if (isRfidStart)
            return;
        finish();
    }

    @Override
    protected void onStart() {
        // TODO Auto-generated method stub
        super.onStart();
        mModuleController = ModuleController.getInstance(mContext, new
                ModuleController.DataListener() {
                    @Override
                    public void onConnect(boolean isSuccess) {
                        //super.onConnect(isSuccess);
                    }
                    @Override
                    public void onServiceStarted() {
                        super.onServiceStarted();
                        //Toast.makeText(MainActivity.this, "服务启动成功", Toast.LENGTH_SHORT).show();
                        Log.e("module", "服务启动成功");

                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                mTvMsg.setText("模块打开成功！");
                            }
                        });
                        mModuleController.moduleSetParameters(DataUtils.PARA_ENABLE_TID, 0);
                        mModuleController.moduleSetParameters(DataUtils.PARA_POWER, ConfigParams.mLocatePower);
                        mModuleController.moduleSetParameters(DataUtils.PARA_SESSION, 1);
                    }

                    @Override
                    public void onError() {
                        Log.e("module", "模块不存在");
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                mTvMsg.setText("启动失败：请检查模块是否正确安装等！");
                            }
                        });
                    }

                    @Override
                    public void onRefreshModule() {

                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                mTvMsg.setText("模块连接成功！");
                            }
                        });
                    }

                    @Override
                    public void onDisConnect(boolean isSuccess) {
                        //tv_op.setText("断开连接");
                        Log.e("module", "断开连接");
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                mTvMsg.setText("模块断开连接！");
                            }
                        });
                    }

                    @Override
                    public void onInventoryTag(byte[] epcTid, byte[] epc, byte[] tid, byte[] pc,
                                               byte count, float rssi, float freq){
                        super.onInventoryTag(epcTid, epc, tid, pc, count, rssi, freq);

                        myHandlerUI.postDelayed(procRunnable, 200);
                        String epcStr = DataUtils.byteToHexStr(epcTid).toUpperCase();

                        if (!mMapEpc.containsKey(epcStr)){
                            if (count <= 0) {
                                count = 1;
                            }
                            mMapEpc.put(epcStr, new EpcParams(String.valueOf(rssi), (int)count));
                        }
                        else{
                            mMapEpc.put(epcStr, new EpcParams(String.valueOf(rssi),
                                    (int)(count + mMapEpc.get(epcStr).cnt)));
                        }
                    }

                    @Override
                    public void onInventoryNewTag(byte[] epcTid, byte[] epc, byte[] tid, byte[] pc,
                                                  byte count, float rssi, float freq){
                        super.onInventoryNewTag(epcTid, epc, tid, pc, count, rssi, freq);

                        myHandlerUI.postDelayed(procRunnable, 100);
                    }
                });
    }

    @Override
    public void onStop() {
        super.onStop();
        mModuleController.moduleStopInventoryTag();
        myHandlerUI.removeCallbacks(procRunnable);
        if (mDataSrc == 0) {
            mModuleController.close();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        myHandlerUI.removeCallbacks(procRunnable);
        if (mDataSrc == 0 || mParentScanMode == 1) {
            mModuleController.close();
        }
    }

    private Handler myHandlerUI = new Handler() {
        public void handleMessage(Message msg) {
            switch (msg.what){
                case 1:
                    AlertDialog.Builder dlg = DlgUtility.showAlertDlg(mContext,
                            R.mipmap.ic_launcher, getString(R.string.sys_prompt),
                            msg.obj.toString(), getString(R.string.confirm), false, null);
                    dlg.show();
                    break;
                case 2:
                    try {
                        if (isRfidStart) {

                            mTvMsg.setText(String.format("正在查找，当前标签数量：%s", msg.obj.toString()));
                        }
                    }
                    catch(Exception ex) {
                        Log.e(TAG, ex.getMessage());
                    }
                    break;
                case 3:
                    int differ = 1;
                    mAdapter.notifyDataSetChanged();
                    if (mDataSrc == 0) {
                        mTvSummary.setText("已查找记录数：" + mLocatedAssetList.size());
                    }
                    else if (mDataSrc == 1) {
                        differ = mListInvenDtl.size() - mLocatedAssetList.size();
                        mTvSummary.setText(String.format("待查找:%d  已找到:%d  剩余:%d",
                                mListInvenDtl.size(), mLocatedAssetList.size(),
                                differ));
                    }
                    else {
                        differ = mListOutDtl.size() - mLocatedAssetList.size();
                        mTvSummary.setText(String.format("待查找:%d  已找到:%d  剩余:%d",
                                mListOutDtl.size(), mLocatedAssetList.size(),
                                differ));
                    }
                    if (differ == 0){
                        SysSound.getIntance().playSound(2, 3);
                        showToast("所有资产已查找完成.");
                    }
                    break;
                case 4:
                    mTvMsg.setText(String.format("已停止读取，本次读取:%d", mListTags.size()));
                    break;
                case 14:
                    if (mModuleController.tagList.size() > 0) {

                        dataAsync(mPromptDlg, new Runnable() {
                            @Override
                            public void run() {

                                try {
                                    boolean bFound = procRfidData();
                                    if (bFound) {
                                        runOnUiThread(new Runnable() {
                                            @Override
                                            public void run() {
                                                mAdapter.notifyDataSetChanged();
                                                moveToPosition(mLinearLayoutManager, mRecyclerview, mLocatedAssetList.size() - 1);
                                                mAdapter.setPosition(mLocatedAssetList.size() - 1);
                                            }
                                        });
                                    }
                                }
                                catch (Exception e){
                                    LogSys.writeSysLog(TAG, e.toString());
                                    showError(e.getMessage());
                                }
                                finally {
                                    mPromptDlg.dismiss();
                                }
                            }
                        });
                    }
                    break;
                default:
                    break;
            }
        }
    };

    /**
     * 实例化Activity实例
     *
     * @param context Context
     * @param dataSrc 查找数据来源，0表示无数据来源，1表示来源于盘点
     * @return 自身intent实例
     */
    public static Intent newInstance(Context context, int dataSrc, InventoryEntity invenBill,
                                     ArrayList<InventoryDtlEntity> listInvenDtl,
                                     OutEntity outBill,
                                     ArrayList<OutDtlEntity> listOutDtl,
                                     int scanMode){

        Intent intent = new Intent(context, LocateActivity.class);
        intent.putExtra(LOCATE_DATA_SRC, dataSrc);
        intent.putExtra(INVEN_BILL, invenBill);
        intent.putExtra(OUT_BILL, outBill);
        intent.putExtra(INVEN_DATA, listInvenDtl);
        intent.putExtra(OUT_DATA, listOutDtl);
        intent.putExtra(SCAN_MODE, scanMode);
        return intent;
    }

    class EpcParams {

        public EpcParams(String _rssi, int _cnt){
            rssi = _rssi;
            cnt = _cnt;
        }
        String rssi;
        int cnt;
    }
}
