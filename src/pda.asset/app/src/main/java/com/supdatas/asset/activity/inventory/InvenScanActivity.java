package com.supdatas.asset.activity.inventory;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Handler;
import android.os.Message;
import android.os.Bundle;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.blankj.utilcode.util.StringUtils;
import com.spd.dbsk.DbClient;
import com.supdatas.asset.R;
import com.supdatas.asset.activity.location.LocateActivity;
import com.supdatas.asset.business.Inventory;
import com.supdatas.asset.business.LogSys;
import com.supdatas.asset.business.WebBusiMethod;
import com.supdatas.asset.frame.activity.BaseActivity;
import com.supdatas.asset.frame.sys.MainApplication;
import com.supdatas.asset.frame.utility.NetWorkUtil;
import com.supdatas.asset.frame.utility.OtherUtil;
import com.supdatas.asset.frame.utility.SysSound;
import com.supdatas.asset.frame.utility.TextUtil;
import com.supdatas.asset.frame.utility.dlgprompt.AlertUtil;
import com.supdatas.asset.frame.utility.dlgprompt.DlgUtility;
import com.supdatas.asset.configure.ConfigConstants;
import com.supdatas.asset.configure.ConfigParams;
import com.supdatas.asset.frame.utility.widget.Loading;
import com.supdatas.asset.model.ScanEnum;
import com.supdatas.asset.model.BillStatusEnum;
import com.supdatas.asset.model.inventory.InventoryDtlEntity;
import com.supdatas.asset.model.inventory.InventoryEntity;
import com.supoin.rfidservice.sdk.DataUtils;
import com.supoin.rfidservice.sdk.ModuleController;

import junit.framework.Assert;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import butterknife.BindView;
import butterknife.OnClick;

public class InvenScanActivity extends BaseActivity {

	@BindView(R.id.btn_upload)
	Button mBtnUpload;

	@BindView(R.id.btn_reset)
	Button mBtnReset;

	@BindView(R.id.btn_previsous)
	Button mBtnPrevious;

	@BindView(R.id.btn_next)
	Button mBtnNext;

	@BindView(R.id.btn_locate)
	Button mBtnLocate;

	@BindView(R.id.et_product)
	EditText mEtProduct;

	@BindView(R.id.tv_message)
	TextView mTvMsg;

	@BindView(R.id.tv_bill_no)
	TextView mTvBillNo;

	@BindView(R.id.tv_summary)
	TextView mTvSummary;

	@BindView(R.id.recyclerview)
	public RecyclerView mRecyclerview;

	@BindView(R.id.cb_just_differ)
	CheckBox mCbJustDiffer;

	@BindView(R.id.lnr_bar_scan)
	LinearLayout mLnrBarScan;

	private ModuleController mModuleController;

	private List<Map<String,String>> mListTags = new ArrayList<Map<String,String>>();

	/**是否是第一次初始化*/
	private boolean bIsInit = true;

	/** 记录上次读取Rfid返回且显示时的时间*/
	private long mLastRefreshQtyTime = 0;

	/** 记录上次读取Rfid返回且刷新列表的时间*/
	private long mLastRefreshListTime = 0;

	/**Rfid扫描数据数据刷新界面时间间隔，in MS*/
	private static int RFID_INTERVAL_REFRESH_QTY = 200;

	/**Rfid扫描数据数据刷新界面时间间隔，in MS*/
	private static int RFID_INTERVAL_REFRESH_LIST = 3000;

	private boolean mIsRFID = true;

	/**用于标识是否已经启用了Rfid采集*/
	private boolean mIsRfidWorking = false;

	//private int mPressRfidCount = 0;

	private long mLastStartRfidReadTime = 0;

	private List<InventoryDtlEntity> mDataLst = new ArrayList<>();
	private List<InventoryDtlEntity> mDataFullLst = new ArrayList<>();
	private List<InventoryDtlEntity> mDataPageLst = new ArrayList<>();

	private BillDtlAdapter mAdapter;

	private int mLastClickedPosition = -1;

	private InventoryEntity mMainBill;

	private Inventory mInventory;

	private final int DISPLAY_ROWS = 30;

	private int mCurPage = 1;

	private int mTotalQty = 0;

	/** 应盘数量 */
	private int mScheduleQty = 0;

	private static String MAIN_BILL = "MAIN_BILL";

	@Override
	protected int getLayoutContentID(){

		return R.layout.activity_inventory_scan;
	}

	@Override
	protected void initView(Bundle savedInstanceState) {

		initTitleBar(R.string.inventory_scan_menu);
		mIsRFID = ConfigParams.scanMode == 0;

		if (mIsRFID){
			mLnrBarScan.setVisibility(View.GONE);
			mTvMsg.setVisibility(View.VISIBLE);
			mEtProduct.setFocusable(false);
			setGearVisibility(View.VISIBLE);
		}
		else{
			setGearVisibility(View.GONE);
		}

		DlgUtility.showSoftInputFromWindow(this, mEtProduct);
		mMainBill = (InventoryEntity) getIntent().getExtras().getSerializable(MAIN_BILL);

		mRecyclerview.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.VERTICAL, false));
		mAdapter = new BillDtlAdapter(mContext, mDataPageLst);
		mRecyclerview.setAdapter(mAdapter);

		mAdapter.setGetListener(new BillDtlAdapter.RowClickedListener() {
			@Override
			public void onClick(int position) {
				mAdapter.setPosition(position);
				mAdapter.notifyDataSetChanged();

				if (OtherUtil.isFastDoubleClick() && position == mLastClickedPosition){

				}
				mLastClickedPosition = position;
			}
		});
		mInventory = new Inventory(mContext);
	}

	@Override
	protected void initData(){
		mTvBillNo.setText(mMainBill.billNo);
		syncData(true, false);
	}

	private void syncData(final boolean isInit, final boolean withPrompt){

		dataAsync(mPromptDlg, new Runnable() {
			@Override
			public void run() {

				DbClient dbClient = null;
				try {
					if (isInit && !mInventory.hasSpeDtl(mMainBill.billNo, 1)) {

						dbClient = new DbClient(mContext, ConfigParams.mDataUrl, ConfigParams.seriesNo,
								ConfigParams.mIsDbClientDebugMode);
						String content = dbClient.query(InventoryDtlEntity.TABLE_NAME,
								InventoryDtlEntity.getQuery(mMainBill.billNo, BillStatusEnum.UN_UPLOADED.getCode()),
								InventoryDtlEntity.getFields());

						List<InventoryDtlEntity> listDtl = mInventory.parseAndProcDtlData(content);
						if (listDtl.size() < 1){
							mPromptDlg.dismiss();
							showToast("该单据不存在待盘点明细.");
							finish();
							return;
						}
						List<InventoryEntity> listMain = new ArrayList<>();
						listMain.add(mMainBill);
						mInventory.insert(listMain, listDtl);
					}
					getData();
					if (isInit){
						mDataFullLst.clear();
						mDataFullLst.addAll(mDataLst);
					}

					if (mCbJustDiffer.isChecked()){
						filterData();
					}
					runOnUiThread(new Runnable() {
						@Override
						public void run() {
							onPreviousPage(true, false);
						}
					});
				}
				catch (Exception ex){

					ex.printStackTrace();
					LogSys.writeSysLog(TAG, ex.toString());
					showError(ex.getMessage());
				}
				finally {
					mPromptDlg.dismiss();
					if (dbClient != null){
						dbClient.close();
					}
				}
			}
		});
	}

	private void getData(){
		mDataLst.clear();
		mDataLst.addAll(mInventory.getBillData(mMainBill.billNo, ""));
		mScheduleQty = mDataLst.size();
		getCollectedQty();
	}

	@OnClick({R.id.btn_upload,R.id.btn_reset,R.id.cb_just_differ,
		R.id.btn_previsous,R.id.btn_next,R.id.btn_locate})
	public void onClick(View v) {

		switch (v.getId()) {

			case R.id.btn_upload:

				upload();
				break;
			case R.id.btn_reset:

				resetBill();
				break;

			case R.id.cb_just_differ:

				onDifferSwitch();
				break;

			case R.id.btn_previsous:

				onPreviousPage(false, false);
				break;

			case R.id.btn_next:

				onNextPage(false);
				break;

			case R.id.btn_locate:

				toLocate();
				break;
		}
	}

	private void toLocate(){

		if (mScheduleQty == mTotalQty){

			SysSound.getIntance().playSound(2, 3);
			AlertUtil.showToastShort(mContext, R.string.inven_scan_finished_no_differ);
			return;
		}
		SysSound.getIntance().playSound(2, 3);
		if (AlertUtil.showAlertConfirm(mContext, R.string.sys_prompt, R.string.sure_to_locate_inven_differ)){

			ArrayList<InventoryDtlEntity> toLocated = new ArrayList<>();
			for (InventoryDtlEntity item : mDataLst){
				if (item.status == 0){
					toLocated.add(item);
				}
			}
			startActivity(LocateActivity.newInstance(mContext,
					1, mMainBill, toLocated, null,null, ConfigParams.scanMode));
		}
	}

	private void resetBill(){

		if (mMainBill.billStatus == BillStatusEnum.UPLOADED.getCode() &&
				mTotalQty == mScheduleQty){

			showError(R.string.bill_uploaded);
			return ;
		}
		SysSound.getIntance().playSound(2, 3);
		if (AlertUtil.showAlertConfirm(mContext, R.string.sys_prompt, R.string.sure_to_reset_inven)){

			mInventory.resetBillStatus(mMainBill.billNo);
			syncData(false, true);
		}
	}

	private boolean scanJudge(final String barcode){

		if (ConfigParams.scanMode == 0){
			return false;
		}
		if (AlertUtil.isAlertShowing() || (mPromptDlg != null && mPromptDlg.isShowing())){
			SysSound.getIntance().playSound(3, 3);
			return false;
		}
		if(mMainBill.billStatus == BillStatusEnum.UPLOADED.getCode()){
			showError(String.format("盘点单[%s]已上传，不能再操作。",mMainBill.billNo));
			return false;
		}
		if (StringUtils.isEmpty(barcode)) {
			return false;
		}
		return true;
	}

	@Override
	protected void onScan(String barcode){

		if (!scanJudge(barcode)){
			return;
		}
		mEtProduct.setText(barcode);
		mMsg = "";
		int index = -1;
		int i;
		for (i = 0; i < mDataFullLst.size(); i++) {
			InventoryDtlEntity item = mDataFullLst.get(i);
			if (barcode.equalsIgnoreCase(item.assetEntity.barcode)) {    //item.status==0 &&
				index = i;
				break;
			}
		}
		if (index == -1) {
			mMsg = String.format("当前盘点计划内资产[%s]不存在", barcode);
		}
		if (!TextUtil.isNullOrEmpty(mMsg)) {
			showError(mMsg);
			return;
		}
		index = -1;
		mMsg = "";
		for (i = 0; i < mDataLst.size(); i++) {
			InventoryDtlEntity item = mDataLst.get(i);
			if (barcode.equalsIgnoreCase(item.assetEntity.barcode)) {    //item.status==0 &&
				index = i;
				break;
			}
		}
		if (index != -1){
			if (mDataLst.get(index).status == ScanEnum.SCANED.getCode()) {
				mMsg = String.format("资产[%s]已扫描", barcode);
			}
		}
		else{
			mMsg = String.format("资产[%s]已扫描", barcode);
		}
		if (!TextUtil.isNullOrEmpty(mMsg)) {
			showError(mMsg);
			SysSound.getIntance().playSound(2, 3);
			return;
		}
		Assert.assertTrue(index >= 0);
		//更新盘点的数据
		mDataLst.get(index).updatePerson = ConfigParams.userNo;
		mDataLst.get(index).status = ScanEnum.SCANED.getCode();
		mDataLst.get(index).qty = 1;

		//更新数据库的数据
		mInventory.updateDetailFlag(mMainBill.billNo, mDataLst.get(index).assetId,
				ConfigParams.seriesNo, mDataLst.get(index).qty, ConfigParams.userNo, 1);
		onRefreshData();
	}

	private void upload(){
		if (mTotalQty < 1){
			showError(R.string.no_scaned_data);
			return;
		}
		if (!NetWorkUtil.isWifiConnected(mContext)){
			showError(R.string.wifi_network_unconnected);
			return;
		}
		SysSound.getIntance().playSound(2, 3);
		if (!AlertUtil.showAlertConfirm(mContext, R.string.sys_prompt, R.string.sure_to_upload)){
			return;
		}
		if (mCbJustDiffer.isChecked()){
			getData();
		}

		dataAsync(mProgressDlg, R.string.uploading, new Runnable() {
			@Override
			public void run() {
				try {

					if (mInventory.hasSpeDtl(mMainBill.billNo, 1)) {
						WebBusiMethod webMethod = new WebBusiMethod(mContext);
						boolean bVal = webMethod.uploadInventoryDtl(mMainBill, mDataLst);
						if (!bVal){

							showError(R.string.upload_failure);
							return;
						}
						else{
							mInventory.updateMainUploadStatus(mMainBill.billNo,
									ConfigParams.userNo, BillStatusEnum.UPLOADED.getCode());
							mMainBill.billStatus = BillStatusEnum.UPLOADED.getCode();
							showInfor(R.string.bill_upload_success);
							mHandlerUI.postDelayed(new Runnable() {
								@Override
								public void run() {
									exit();
								}
							},100);
						}
					}
					else{		//redundant
						showError(R.string.no_scaned_data);
						return;
					}
				}
				catch (Exception ex){

					ex.printStackTrace();
					LogSys.writeSysLog(TAG, ex.toString());
					showError(ex.getMessage());
				}
				finally {
					mProgressDlg.dismiss();
				}
			}
		});
	}

	private void filterData(){
		for (int i = mDataLst.size() - 1; i >= 0; i--) {
			if (mDataLst.get(i).status == 1){
				mDataLst.remove(i);
			}
		}
	}
	/**
	 * 处理差异过滤
	 * */
	private void onDifferSwitch(){

		if (mCbJustDiffer.isChecked()){

			filterData();
			onPreviousPage(true, false);
		}
		else {
			getData();
			onPreviousPage(true, false);
		}
	}

	/**
	 *
	 * */
	private void onRefreshData(){

		if (mCbJustDiffer.isChecked()){
			filterData();
		}
		getCollectedQty();
		onPreviousPage(true, false);
	}

	@Override
	protected void onStart() {
		super.onStart();

		if (mIsRFID) {
			setScannerOff();
			mModuleController = ModuleController.getInstance(mContext, new
					ModuleController.DataListener() {
						@Override
						public void onConnect(boolean isSuccess) {
							//super.onConnect(isSuccess);

							if (bIsInit) {

								bIsInit = false;
								mTvMsg.setText(getString(R.string.module_success));
							}
						}

						@Override
						public void onServiceStarted() {

							super.onServiceStarted();
							Log.e("module", getString(R.string.service_success));
							mTvMsg.setText(getString(R.string.service_success));

							mModuleController.moduleSetParameters(DataUtils.PARA_POWER, ConfigParams.mInvenPower);
							mModuleController.moduleSetParameters(DataUtils.PARA_SESSION, 1);
							mModuleController.moduleSetParameters(DataUtils.PARA_ENABLE_TID, 0);
						}

						@Override
						public void onError() {

							Log.e("module", "模块不存在");
							runOnUiThread(new Runnable() {
								@Override
								public void run() {
									mTvMsg.setText(getString(R.string.module_unexists));
								}
							});
						}

						@Override
						public void onRefreshModule() {
						}

						@Override
						public void onDisConnect(boolean isSuccess) {

							Log.e("module", "");
							runOnUiThread(new Runnable() {
								@Override
								public void run() {
									mTvMsg.setText(getString(R.string.module_disconnected));
								}
							});
						}

						@Override
						public void onInventoryTag(byte[] epcTid, byte[] epc, byte[] tid, byte[] pc,
												   byte count, float rssi, float freq) {
							super.onInventoryTag(epcTid, epc, tid, pc, count, rssi, freq);
							//myHandlerUI.postDelayed(procRunnable, 200);
						}

						@Override
						public void onInventoryNewTag(byte[] epcTid, byte[] epc, byte[] tid, byte[] pc, byte count, float rssi,
													  float freq) {

							super.onInventoryNewTag(epcTid, epc, tid, pc, count, rssi, freq);
							mHandlerUI.postDelayed(mProcRunnable, 200);
						}
					});
		}
		else{
			setScannerOn();
		}
	}

	private Runnable mProcRunnable = new Runnable() {
		@Override
		public void run() {
			try {
				if (mModuleController.tagList.size() > 0) {

					if (System.currentTimeMillis() - mLastRefreshQtyTime > RFID_INTERVAL_REFRESH_QTY) {

						mLastRefreshQtyTime = System.currentTimeMillis();
						Message msg = mHandlerUI.obtainMessage(1);
						msg.obj = mModuleController.tagList.size();
						mHandlerUI.sendMessage(msg);
					}

					if (System.currentTimeMillis() - mLastRefreshListTime > RFID_INTERVAL_REFRESH_LIST) {

						mLastRefreshListTime = System.currentTimeMillis();
						if (mModuleController.tagList.size() < 20) {
							RFID_INTERVAL_REFRESH_LIST = 3000;
						}
						else if (mModuleController.tagList.size() < 100) {
							RFID_INTERVAL_REFRESH_LIST = 5000;
						}
						else if (mModuleController.tagList.size() < 200) {
							RFID_INTERVAL_REFRESH_LIST = 10000;
						}
						else {
							RFID_INTERVAL_REFRESH_LIST = 60000;
						}
						mListTags.clear();
						mListTags.addAll(mModuleController.tagList);

						procRfidData();
						onRefreshData();
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	};

	private void startRfid(){

		if (mMainBill.billStatus == BillStatusEnum.UPLOADED.getCode() &&
				mTotalQty == mScheduleQty){

			showError(R.string.bill_uploaded);
			return ;
		}
		mIsRfidWorking = true;
		mModuleController.tagList.clear();
		mModuleController.moduleInventoryTag();

		setStartViewState();
	}

	private void setStartViewState(){

		mEtProduct.setEnabled(false);
		setGearEnabled(false);
		setBackEnabled(false);
		mBtnUpload.setEnabled(false);
		mBtnReset.setEnabled(false);
		mBtnPrevious.setEnabled(false);
		mBtnNext.setEnabled(false);
		mCbJustDiffer.setEnabled(false);
		mBtnLocate.setEnabled(false);

		mHandlerUI.sendEmptyMessage(3);
	}

	private void stopRfid(){

		mLastRefreshListTime  = 0;
		mLastRefreshQtyTime = 0;
		mIsRfidWorking = false;

		mModuleController.moduleStopInventoryTag();
		mHandlerUI.removeCallbacks(mProcRunnable);

		mHandlerUI.sendEmptyMessage(5);
	}

	private void setStopViewState(){

		mEtProduct.setEnabled(true);
		setGearEnabled(true);
		setBackEnabled(true);

		mBtnUpload.setEnabled(true);
		mBtnReset.setEnabled(true);
		mBtnPrevious.setEnabled(true);
		mBtnNext.setEnabled(true);
		mCbJustDiffer.setEnabled(true);
		mBtnLocate.setEnabled(true);

		mHandlerUI.sendEmptyMessage(4);
	}

	@Override
	public boolean onKeyUp(int keyCode, KeyEvent event) {

		/*if (event.getRepeatCount() == 0 && event.getScanCode() == 261) {

			if (mIsRFID) {

				if (mPressRfidCount >= 2) {
					mPressRfidCount = 0;
					if (mIsRfidStart) {
						stopRfid();
						setStopViewState();

						mHandlerUI.sendEmptyMessage(3);
						mHandlerUI.sendEmptyMessage(4);
					}
				}
			}
		}*/
		return super.onKeyUp(keyCode, event);
	};

	private void exit(){

		if (mIsRfidWorking){
			return;
		}
		setResult(RESULT_OK);
		finish();
	}

	@Override
	public void onClickGear(View v){
		int gravity = Gravity.CENTER_VERTICAL;

		popupInputWindow(InvenScanActivity.this, v, "设置盘点功率", "功率",
				String.valueOf(ConfigParams.mInvenPower),
				false, true, 1, 33, gravity, 0, 100,
				new OnInputListener() {
					@Override
					public void onInput(String v) {

						ConfigParams.mInvenPower = Integer.parseInt(v);
						MainApplication.mConfigSys.setItemIntValue(
								ConfigConstants.getInstance().RFID_INVEN_POWER, ConfigParams.mInvenPower);

						AlertUtil.showToast(mContext, R.string.module_power_set_succeed);
						SysSound.getIntance().playSound(2, 3);
					}
				},true);
	}

	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {

		switch (keyCode) {
			case KeyEvent.KEYCODE_BACK:
				if (event.getRepeatCount() == 0 && event.getAction() == KeyEvent.ACTION_DOWN) {
					exit();
				}
				break;
			case KeyEvent.KEYCODE_ENTER:
				break;
		}
		int scanCode = event.getScanCode();
		if (event.getRepeatCount() == 0 && scanCode == 261) {
			if (mIsRFID) {
				if (mIsRfidWorking && System.currentTimeMillis() - mLastStartRfidReadTime < 1500) {
					try {
						Thread.sleep(0);
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
				else {
					if (!mIsRfidWorking) {

						mLastStartRfidReadTime = System.currentTimeMillis();
						startRfid();
					}
					else{
						mLastStartRfidReadTime = System.currentTimeMillis();
						stopRfid();
						setStopViewState();
					}
				}
			}
		}
		return super.onKeyDown(keyCode,event);
	}

	private int procRfidData() {

		int matchedQty = 0;
		try {
			String epcstr = "";     //epc

			int listIndex = 0;
			for (listIndex = 0; listIndex < mListTags.size(); ++listIndex) {

				epcstr = mListTags.get(listIndex).get(DataUtils.KEY_EPC_TID).toUpperCase();
				/*
				if (epcstr != null && epcstr.length() > ConfigParams.EPC_LENGTH)
					epcstr = epcstr.substring(0, ConfigParams.EPC_LENGTH);
				epcstr = hexStr2Str(epcstr);          //正式时去掉该行注释
				*/
				for(InventoryDtlEntity item : mDataLst) {
					if (epcstr.equalsIgnoreCase(item.assetEntity.epc)){

						item.status = ScanEnum.SCANED.getCode();
						//更新数据库
						mInventory.updateDetailFlag(mMainBill.billNo, item.assetId,
								ConfigParams.seriesNo, 1,
								ConfigParams.userNo, item.status);
						matchedQty += 1;
					}
				}
			}
		}
		catch (Exception e) {
			e.printStackTrace();
			Log.e(TAG, e.toString());
		}
		return matchedQty;
	}

	@Override
	protected void onDestroy() {
		super.onDestroy();

		if (mIsRFID) {
			mHandlerUI.removeCallbacks(mProcRunnable);
			mModuleController.close();
			setScannerOn();
		}
	}

	@Override
	public void onStop() {
		super.onStop();
		Log.e("Rfid", "onStop");

		if (mIsRFID) {
			mModuleController.moduleStopInventoryTag();
			mHandlerUI.removeCallbacks(mProcRunnable);
		}
	}

	@SuppressLint("HandlerLeak")
	private Handler mHandlerUI = new Handler() {

		public void handleMessage(Message msg) {

			switch (msg.what){
				case 0:

					break;
				case 1:
					try {
						String prompt = mContext.getResources().getString(R.string.reading); //getResources().getString(R.string.module_cur_reading);
						if (msg.obj != null){
							mTvMsg.setText(prompt + msg.obj.toString());
						}
					}
					catch(Exception ex)
					{
						Log.e(TAG, ex.getMessage());
					}
					break;

				case 3:
					mTvMsg.setText(R.string.module_start_reading);
					break;
				case 4:
					String prompt = getResources().getString(R.string.module_stop_reading);
					mTvMsg.setText(prompt);
					break;

				case 5:
					if (mModuleController.tagList.size() > 0) {
						mListTags.clear();
						mListTags.addAll(mModuleController.tagList);

						mTvMsg.setText(mContext.getResources().getString(R.string.reading) +
								mModuleController.tagList.size());

						//new RfidDataAsync().execute();
						finishOnceCollect();
					}
					break;
				default:
					break;
			}
		}
	};

	/**
	 * 向前加页数据，若isFirstPage为true，则不考虑后一个选项isCurPage的值
	 * */
	private void onPreviousPage(boolean isFirstPage, boolean isCurPage) {

		if (isFirstPage)
			mCurPage = 1;
		else if (isCurPage)
			mCurPage = mCurPage;
		else
			mCurPage = mCurPage - 1;
		if (mCurPage < 1)
			mCurPage = 1;

		int fromIndex = 0;
		int toIndex = 0;
		int rows = mDataLst.size();
		int totalPages = (rows / DISPLAY_ROWS) + (rows % DISPLAY_ROWS > 0 ? 1: 0);
		if (mCurPage > totalPages)
			mCurPage = 1;

		fromIndex = (mCurPage - 1) * DISPLAY_ROWS;
		toIndex = mCurPage *  DISPLAY_ROWS;
		if (mCurPage == totalPages)
			toIndex = rows;

		if (rows > 0) {

			mDataPageLst.clear();
			mDataPageLst.addAll(mDataLst.subList(fromIndex, toIndex));
		}
		else{
			mDataPageLst.clear();
		}
		mAdapter.notifyDataSetChanged();
		setSummary(rows, totalPages);
	}

	private void onNextPage(boolean isLastPage){

		int rows = mDataLst.size();
		int totalPages = (rows / DISPLAY_ROWS) + (rows % DISPLAY_ROWS > 0 ? 1: 0);
		mCurPage = mCurPage + 1;
		if (mCurPage >= totalPages)
			mCurPage = totalPages;

		if (isLastPage){
			mCurPage = totalPages;
		}

		int fromIndex = 0;
		int toIndex = 0;

		fromIndex = (mCurPage - 1) * DISPLAY_ROWS;
		toIndex = mCurPage *  DISPLAY_ROWS;
		if (mCurPage == totalPages)
			toIndex = rows;

		if (rows > 0) {
			mDataPageLst.clear();
			mDataPageLst.addAll(mDataLst.subList(fromIndex, toIndex));
		}
		else{
			mDataPageLst.clear();
		}
		mAdapter.notifyDataSetChanged();
		setSummary(rows, totalPages);
	}

	private void setSummary(int rows, int totalPages){

		getCollectedQty();
		mTvSummary.setText(String.format("第%d/%d页, 应盘:%d, 已盘:%d",
				rows < 1 ? 0 : mCurPage, totalPages, mScheduleQty, mTotalQty));

		if (mScheduleQty == mTotalQty){

			SysSound.getIntance().playSound(2, 3);
			AlertUtil.showToastShort(mContext, R.string.inven_scan_finished);
		}
	}

	private void getCollectedQty(){

		if (mDataLst.size() != mScheduleQty){
			mTotalQty = mScheduleQty - mDataLst.size();
		}
		else {
			int i = 0;
			mTotalQty = 0;
			for (i = 0; i < mDataLst.size(); ++i) {
				if (mDataLst.get(i).status == 1) {
					mTotalQty += mDataLst.get(i).qty;
				}
			}
		}
	}

	@Override
	public void onClickTitleBack(View v){
		exit();
	}

	private void finishOnceCollect(){

		dataAsync(mPromptDlg, new Runnable() {
			@Override
			public void run() {

				try {
					int qty = procRfidData();

					runOnUiThread(new Runnable() {
						@Override
						public void run() {
							mInventory.setBillScanStatus(mMainBill.billNo);
							onRefreshData();
						}
					});
				}
				catch (Exception ex){
					ex.printStackTrace();
					showError(ex.getMessage());
				}
				finally {
					mPromptDlg.dismiss();
				}
			}
		});
	}

	private class RfidDataAsync extends AsyncTask<Void, Void, Integer>{
		@Override
		protected void onPreExecute() {
			super.onPreExecute();

			mPromptDlg = Loading.show(mContext);
			mPromptDlg.show();
		}

		@Override
		protected Integer doInBackground(Void... params) {

			try	{

				Thread.sleep(0);
				int qty = procRfidData();
				mInventory.setBillScanStatus(mMainBill.billNo);
				return qty;
			}
			catch (Exception w)	{
				w.printStackTrace();
			}
			return null;
		}

		@Override
		protected void onPostExecute(Integer result) {
			super.onPostExecute(result);
			mPromptDlg.dismiss();
			onRefreshData();
		}
	}

	/**
	 * 实例化Activity实例
	 * @param context Context
	 * @return 自身intent实例
	 */
	public static Intent newInstance(Context context, InventoryEntity paramVal){
		Intent intent = new Intent(context, InvenScanActivity.class);
		intent.putExtra(MAIN_BILL, paramVal);
		return intent;
	}
}
