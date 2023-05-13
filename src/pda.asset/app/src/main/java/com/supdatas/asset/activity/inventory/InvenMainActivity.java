package com.supdatas.asset.activity.inventory;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.View;

import com.spd.dbsk.DbClient;
import com.supdatas.asset.R;
import com.supdatas.asset.business.Inventory;
import com.supdatas.asset.configure.ConfigParams;
import com.supdatas.asset.frame.activity.BaseActivity;
import com.supdatas.asset.frame.utility.NetWorkUtil;
import com.supdatas.asset.frame.utility.OtherUtil;
import com.supdatas.asset.business.LogSys;
import com.supdatas.asset.model.BillStatusEnum;
import com.supdatas.asset.model.inventory.InventoryEntity;
import com.supdatas.asset.sqlite.TableName;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import butterknife.OnClick;

public class InvenMainActivity extends BaseActivity {

	public RecyclerView mRecyclerview;

	private int mLastClickedPosition = -1;

	private List<InventoryEntity> mBillIst = new ArrayList<>();

	private Inventory mInventory;

	private BillAdapter mAdapter;
	@Override
	protected int getLayoutContentID(){

		return R.layout.activity_inventory_bill_main;
	}

	@Override
	protected void initView(Bundle savedInstanceState) {

		initTitleBar(R.string.inventory_main_menu);

		mRecyclerview = (RecyclerView)findViewById(R.id.recyclerview);
		mRecyclerview.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.VERTICAL, false));

		mAdapter = new BillAdapter(this, mBillIst);
		mRecyclerview.setAdapter(mAdapter);

		mAdapter.setGetListener(new BillAdapter.RowClickedListener() {

			@Override
			public void onClick(int position) {

				mAdapter.setPosition(position);
				mAdapter.notifyDataSetChanged();

				if (OtherUtil.isFastDoubleClick() && position == mLastClickedPosition){
					toScan();
				}
				mLastClickedPosition = position;
			}
		});
		mInventory = new Inventory(mContext);
	}

	@Override
	public void initData(){

		syncData(false);
	}

	@OnClick({R.id.btn_download, R.id.btn_scan})
	public void onClick(View v) {

		switch (v.getId()) {

			case R.id.btn_download:
				if (!NetWorkUtil.isWifiConnected(mContext)){
					showError(R.string.wifi_network_unconnected);
					return;
				}
				syncData(true);
				break;

			case R.id.btn_scan:
				toScan();
				break;
		}
	}

	private void toScan() {
		if (mLastClickedPosition == -1) {
			showError(R.string.please_select_one_record);
			return;
		}
		startActivityForResult(
				InvenScanActivity.newInstance(mContext, mBillIst.get(mLastClickedPosition)), 1);
	}

	@Override
	public void onActivityResult(int requestCode, int resultCode, Intent data){
		if (requestCode == 1 && resultCode == RESULT_OK){
			syncData(false);
		}
	}

	private void syncData(final boolean withPrompt){

		dataAsync(mPromptDlg, new Runnable() {
			@Override
			public void run() {

				DbClient dbClient = null;
				try {
					mInventory.delNullDtlBill();
					List<InventoryEntity> listMain = new ArrayList<>();
					try {
						dbClient = new DbClient(mContext, ConfigParams.mDataUrl, ConfigParams.seriesNo,
								ConfigParams.mIsDbClientDebugMode);
						String content = dbClient.query(TableName.TENANT_INVENTORY,
								InventoryEntity.getQuery(ConfigParams.tenantId), InventoryEntity.getFields());

						listMain = mInventory.parseAndProcMainData(content);
					}
					catch (Exception ex){
						LogSys.writeSysLog(TAG, ex.toString());
						if (withPrompt) {
							showError(ex.getMessage());
						}
					}
					if (listMain == null) {
						listMain = new ArrayList<>();
					}

					List<InventoryEntity> local = mInventory.getBill(null);
					boolean exists;
					for (InventoryEntity upItem : listMain){

						exists = false;
						for (InventoryEntity localItem : local) {

							if (upItem.billNo.equalsIgnoreCase(localItem.billNo)){
								exists = true;
								break;
							}
						}
						if (!exists){
							local.add(upItem);
						}
					}
					for (int m = local.size() - 1; m >= 0; --m) {
						if (local.get(m).billStatus == BillStatusEnum.UPLOADED.getCode()){
							local.remove(m);
						}
					}

					mBillIst.clear();
					mBillIst.addAll(local);
					Collections.sort(mBillIst, (o1, o2) -> {
						return  o2.billNo.compareTo(o1.billNo);
					});

					mMsg = String.valueOf(listMain.size());
					runOnUiThread(new Runnable() {
						@Override
						public void run() {

							mAdapter.notifyDataSetChanged();
							if (mBillIst.size() > 0){
								mLastClickedPosition = 0;
								mAdapter.setPosition(0);
								mAdapter.notifyDataSetChanged();
							}
							if (withPrompt){
								showInfor(String.format("共同步成功%s条记录", mMsg));
							}
						}
					});
				}
				catch (Exception ex){

					Log.e(TAG, ex.toString());
					LogSys.writeSysLog(TAG, ex.toString());

					if (withPrompt) {
						showError(ex.getMessage());
					}
				}
				finally {
					if (dbClient != null) {
						dbClient.close();
					}
					mPromptDlg.dismiss();
				}
			}
		});
	}

	/**
	 * 实例化Activity实例
	 *
	 * @param context Context
	 * @return 自身intent实例
	 */
	public static Intent newInstance(Context context, String paramVal){

		Intent intent = new Intent(context, InvenMainActivity.class);
		return intent;
	}
}
